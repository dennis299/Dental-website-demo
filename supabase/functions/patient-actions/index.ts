// Server-side entry point for all booking interactions from the public site.
// Holds the service-role key, so no privileged data or email-sending capability
// is exposed to the browser.

import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

const isEmail = (s: unknown) =>
  typeof s === 'string' && s.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)
const isIso = (s: unknown) =>
  typeof s === 'string' && !isNaN(Date.parse(s))
const isFutureIso = (s: unknown) =>
  isIso(s) && Date.parse(s as string) > Date.now()

function prettyWhen(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405)

  const url = Deno.env.get('SUPABASE_URL')
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!url || !key) return json({ error: 'server_misconfigured' }, 500)
  const supabase = createClient(url, key)

  // Best-effort client IP for per-IP throttling.
  const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim()
    || req.headers.get('cf-connecting-ip')
    || 'unknown'

  // Returns a 429 Response if over any supplied limit, otherwise null.
  // Fails open on infrastructure error so legit users aren't blocked.
  const rateLimit = async (
    limits: Array<{ bucket: string; max: number; windowSec: number }>,
  ): Promise<Response | null> => {
    for (const l of limits) {
      const { data, error } = await supabase.rpc('check_rate_limit', {
        _bucket: l.bucket,
        _max_hits: l.max,
        _window_seconds: l.windowSec,
      })
      if (error) {
        console.error('rate_limit_check_failed', { bucket: l.bucket, error })
        continue
      }
      if (data && (data as any).allowed === false) {
        const retry = (data as any).retry_after ?? l.windowSec
        console.warn('rate_limited', { bucket: l.bucket, ip })
        return new Response(
          JSON.stringify({ error: 'rate_limited', retry_after: retry }),
          {
            status: 429,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
              'Retry-After': String(retry),
            },
          },
        )
      }
    }
    return null
  }

  // Helper — send a booking email via the locked-down service-role function.
  const sendEmail = async (
    templateName: 'booking-confirmation' | 'booking-reschedule' | 'booking-cancellation',
    recipient: string,
    idempotencyKey: string,
    templateData: Record<string, unknown>,
  ) => {
    try {
      await supabase.functions.invoke('send-transactional-email', {
        body: { templateName, recipientEmail: recipient, idempotencyKey, templateData },
      })
    } catch (e) {
      console.error('email_send_failed', { templateName, error: String(e) })
    }
  }

  let body: any
  try { body = await req.json() } catch { return json({ error: 'invalid_json' }, 400) }
  const action = body?.action

  try {
    // ---------- LOOKUP ----------
    // Returns only what the chat needs to greet the patient and decide
    // which menu to show. Crucially does NOT return the booking id —
    // the booking id is the credential used to reschedule/cancel, and
    // leaking it to anyone who guesses an email enables hijacking.
    if (action === 'lookup') {
      if (!isEmail(body.email)) return json({ error: 'invalid_email' }, 400)
      const email = (body.email as string).toLowerCase().trim()

      const limited = await rateLimit([
        { bucket: `pa:lookup:ip:${ip}`, max: 5, windowSec: 60 },
        { bucket: `pa:lookup:email:${email}`, max: 10, windowSec: 3600 },
      ])
      if (limited) return limited

      const { data: patient, error: pErr } = await supabase
        .from('patients')
        .select('name')
        .eq('email', email)
        .maybeSingle()
      if (pErr) return json({ error: 'lookup_failed' }, 500)
      if (!patient) return json({ found: false })

      const { data: booking, error: bErr } = await supabase
        .from('bookings')
        .select('preferred_datetime, treatment')
        .eq('email', email)
        .neq('status', 'cancelled')
        .gt('preferred_datetime', new Date().toISOString())
        .order('preferred_datetime', { ascending: true })
        .limit(1)
        .maybeSingle()
      if (bErr) return json({ error: 'lookup_failed' }, 500)

      return json({
        found: true,
        name: patient.name,
        has_active_booking: Boolean(booking),
        next_appointment_at: booking?.preferred_datetime ?? null,
        next_treatment: booking?.treatment ?? null,
      })
    }

    // ---------- BOOK ----------
    if (action === 'book') {
      const name = typeof body.name === 'string' ? body.name.trim() : ''
      const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
      const email = typeof body.email === 'string' ? body.email.trim() : ''
      const treatment = typeof body.treatment === 'string' ? body.treatment : null
      const message = typeof body.message === 'string' ? body.message : null
      if (!name || name.length > 100) return json({ error: 'invalid_name' }, 400)
      if (!phone || phone.length < 7 || phone.length > 20) return json({ error: 'invalid_phone' }, 400)
      if (!isEmail(email)) return json({ error: 'invalid_email' }, 400)
      if (!isFutureIso(body.preferredDatetime)) return json({ error: 'invalid_datetime' }, 400)

      const limited = await rateLimit([
        { bucket: `pa:book:ip:${ip}`, max: 3, windowSec: 60 },
        { bucket: `pa:write:ip:${ip}`, max: 10, windowSec: 3600 },
        { bucket: `pa:write:email:${email.toLowerCase()}`, max: 5, windowSec: 3600 },
      ])
      if (limited) return limited


      // One active booking per patient.
      const { data: existing, error: exErr } = await supabase
        .from('bookings')
        .select('id')
        .eq('email', email.toLowerCase())
        .neq('status', 'cancelled')
        .gt('preferred_datetime', new Date().toISOString())
        .limit(1)
        .maybeSingle()
      if (exErr) return json({ error: 'lookup_failed' }, 500)
      if (existing) return json({ error: 'already_booked' }, 409)

      const { data: inserted, error: insErr } = await supabase
        .from('bookings')
        .insert({
          name,
          phone,
          email,
          treatment,
          preferred_datetime: body.preferredDatetime,
          message,
        })
        .select('id')
        .single()
      if (insErr || !inserted) return json({ error: 'insert_failed' }, 500)

      await sendEmail('booking-confirmation', email, `booking-${inserted.id}`, {
        bookingId: inserted.id,
        name,
        treatment: treatment ?? 'Consultation',
        whenISO: body.preferredDatetime,
        whenPretty: prettyWhen(body.preferredDatetime),
      })

      return json({ success: true })
    }

    // ---------- RESCHEDULE ----------
    // Looks up the active booking by email server-side — never trusts a
    // client-supplied booking id, so a leaked id can't be used to hijack.
    if (action === 'reschedule') {
      if (!isEmail(body.email)) return json({ error: 'invalid_email' }, 400)
      if (!isFutureIso(body.newDatetime)) return json({ error: 'invalid_datetime' }, 400)
      const email = (body.email as string).toLowerCase().trim()

      const { data: booking, error: bErr } = await supabase
        .from('bookings')
        .select('id, name, treatment')
        .eq('email', email)
        .neq('status', 'cancelled')
        .gt('preferred_datetime', new Date().toISOString())
        .order('preferred_datetime', { ascending: true })
        .limit(1)
        .maybeSingle()
      if (bErr) return json({ error: 'reschedule_failed' }, 500)
      if (!booking) return json({ success: false, reason: 'no_active_booking' })

      const { error: upErr } = await supabase
        .from('bookings')
        .update({ preferred_datetime: body.newDatetime, status: 'rescheduled' })
        .eq('id', booking.id)
      if (upErr) return json({ error: 'reschedule_failed' }, 500)

      await sendEmail('booking-reschedule', email, `reschedule-${booking.id}-${Date.now()}`, {
        bookingId: booking.id,
        name: booking.name,
        treatment: booking.treatment ?? 'Consultation',
        whenISO: body.newDatetime,
        whenPretty: prettyWhen(body.newDatetime),
      })

      return json({ success: true })
    }

    // ---------- CANCEL ----------
    if (action === 'cancel') {
      if (!isEmail(body.email)) return json({ error: 'invalid_email' }, 400)
      const email = (body.email as string).toLowerCase().trim()

      const { data: booking, error: bErr } = await supabase
        .from('bookings')
        .select('id, name')
        .eq('email', email)
        .neq('status', 'cancelled')
        .gt('preferred_datetime', new Date().toISOString())
        .order('preferred_datetime', { ascending: true })
        .limit(1)
        .maybeSingle()
      if (bErr) return json({ error: 'cancel_failed' }, 500)
      if (!booking) return json({ success: false, reason: 'no_active_booking' })

      const { error: upErr } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', booking.id)
      if (upErr) return json({ error: 'cancel_failed' }, 500)

      await sendEmail('booking-cancellation', email, `cancel-${booking.id}`, {
        bookingId: booking.id,
        name: booking.name,
      })

      return json({ success: true })
    }

    return json({ error: 'unknown_action' }, 400)
  } catch (e) {
    console.error('patient_actions_error', String(e))
    return json({ error: 'internal_error' }, 500)
  }
})
