// Server-side entry point for all booking interactions from the public site.
// Holds the service-role key, so no privileged data or email-sending capability
// is exposed to the browser.
//
// Ownership model: callers must prove they control the email address before any
// PII is returned or any booking is mutated. Flow is:
//   1) request_otp  -> we email a 6-digit code
//   2) lookup       -> caller submits otp; on success we return PII + a short-lived
//                      session_token tied to that email
//   3) reschedule/cancel -> caller submits session_token (no need to re-enter code)
//
// `book` does NOT require an OTP — it is for new bookings keyed to the email the
// caller is actively typing in. The confirmation email serves as ownership proof
// for any later mutation.

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
const isIso = (s: unknown) => typeof s === 'string' && !isNaN(Date.parse(s))
const isFutureIso = (s: unknown) => isIso(s) && Date.parse(s as string) > Date.now()
const isOtp = (s: unknown) => typeof s === 'string' && /^\d{6}$/.test(s)
const isSessionToken = (s: unknown) =>
  typeof s === 'string' && s.length >= 32 && s.length <= 128 && /^[A-Za-z0-9_-]+$/.test(s)

const OTP_TTL_MIN = 10
const SESSION_TTL_MIN = 15
const MAX_OTP_ATTEMPTS = 5

function prettyWhen(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  })
}

async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input))
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function generateOtp(): string {
  const arr = new Uint32Array(1)
  crypto.getRandomValues(arr)
  return String(arr[0] % 1_000_000).padStart(6, '0')
}

function generateSessionToken(): string {
  const arr = new Uint8Array(32)
  crypto.getRandomValues(arr)
  // base64url
  return btoa(String.fromCharCode(...arr)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405)

  const url = Deno.env.get('SUPABASE_URL')
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!url || !key) return json({ error: 'server_misconfigured' }, 500)
  const supabase = createClient(url, key)

  const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim()
    || req.headers.get('cf-connecting-ip')
    || 'unknown'

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

  const sendEmail = async (
    templateName:
      | 'booking-confirmation'
      | 'booking-reschedule'
      | 'booking-cancellation'
      | 'booking-otp',
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

  // Verify a session token issued by a successful lookup. Returns the email
  // it was issued for, or null if invalid/expired.
  const verifySession = async (token: string): Promise<string | null> => {
    const { data, error } = await supabase
      .from('booking_otps')
      .select('email, session_expires_at')
      .eq('session_token', token)
      .maybeSingle()
    if (error || !data) return null
    if (!data.session_expires_at) return null
    if (new Date(data.session_expires_at).getTime() < Date.now()) return null
    return (data.email as string).toLowerCase().trim()
  }

  let body: any
  try { body = await req.json() } catch { return json({ error: 'invalid_json' }, 400) }
  const action = body?.action

  try {
    // ---------- REQUEST OTP ----------
    // Always returns success regardless of whether the email belongs to a
    // patient — prevents email enumeration.
    if (action === 'request_otp') {
      if (!isEmail(body.email)) return json({ error: 'invalid_email' }, 400)
      const email = (body.email as string).toLowerCase().trim()

      const limited = await rateLimit([
        { bucket: `pa:otp:ip:${ip}`, max: 5, windowSec: 60 },
        { bucket: `pa:otp:ip:${ip}:hr`, max: 20, windowSec: 3600 },
        { bucket: `pa:otp:email:${email}`, max: 5, windowSec: 600 },
      ])
      if (limited) return limited

      const code = generateOtp()
      const codeHash = await sha256Hex(code)
      const expiresAt = new Date(Date.now() + OTP_TTL_MIN * 60_000).toISOString()

      // Invalidate any prior unconsumed codes for this email.
      await supabase
        .from('booking_otps')
        .update({ consumed_at: new Date().toISOString() })
        .eq('email', email)
        .is('consumed_at', null)

      const { error: insErr } = await supabase
        .from('booking_otps')
        .insert({ email, code_hash: codeHash, expires_at: expiresAt })
      if (insErr) {
        console.error('otp_insert_failed', insErr)
        return json({ error: 'otp_failed' }, 500)
      }

      await sendEmail('booking-otp', email, `otp-${email}-${Date.now()}`, {
        code,
        expiresMinutes: OTP_TTL_MIN,
      })

      return json({ success: true, expires_in_seconds: OTP_TTL_MIN * 60 })
    }

    // ---------- LOOKUP ----------
    // Requires a valid OTP. On success, issues a session token usable for
    // reschedule/cancel within SESSION_TTL_MIN.
    if (action === 'lookup') {
      if (!isEmail(body.email)) return json({ error: 'invalid_email' }, 400)
      if (!isOtp(body.otp)) return json({ error: 'invalid_otp' }, 400)
      const email = (body.email as string).toLowerCase().trim()

      const limited = await rateLimit([
        { bucket: `pa:lookup:ip:${ip}`, max: 10, windowSec: 60 },
        { bucket: `pa:lookup:email:${email}`, max: 10, windowSec: 600 },
      ])
      if (limited) return limited

      // Find the most recent unconsumed, unexpired OTP row for this email.
      const { data: otpRow, error: otpErr } = await supabase
        .from('booking_otps')
        .select('id, code_hash, attempts, expires_at')
        .eq('email', email)
        .is('consumed_at', null)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (otpErr) return json({ error: 'verify_failed' }, 500)
      if (!otpRow) return json({ error: 'invalid_otp' }, 401)

      if (otpRow.attempts >= MAX_OTP_ATTEMPTS) {
        await supabase
          .from('booking_otps')
          .update({ consumed_at: new Date().toISOString() })
          .eq('id', otpRow.id)
        return json({ error: 'otp_locked' }, 429)
      }

      const submittedHash = await sha256Hex(body.otp as string)
      if (submittedHash !== otpRow.code_hash) {
        await supabase
          .from('booking_otps')
          .update({ attempts: otpRow.attempts + 1 })
          .eq('id', otpRow.id)
        return json({ error: 'invalid_otp' }, 401)
      }

      // OTP correct — consume it and issue a session token.
      const sessionToken = generateSessionToken()
      const sessionExpiresAt = new Date(Date.now() + SESSION_TTL_MIN * 60_000).toISOString()
      const { error: upErr } = await supabase
        .from('booking_otps')
        .update({
          consumed_at: new Date().toISOString(),
          session_token: sessionToken,
          session_expires_at: sessionExpiresAt,
        })
        .eq('id', otpRow.id)
      if (upErr) return json({ error: 'verify_failed' }, 500)

      const { data: patient, error: pErr } = await supabase
        .from('patients')
        .select('name')
        .eq('email', email)
        .maybeSingle()
      if (pErr) return json({ error: 'lookup_failed' }, 500)
      if (!patient) {
        return json({
          found: false,
          session_token: sessionToken,
          session_expires_in_seconds: SESSION_TTL_MIN * 60,
        })
      }

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
        session_token: sessionToken,
        session_expires_in_seconds: SESSION_TTL_MIN * 60,
      })
    }

    // ---------- BOOK ----------
    // No OTP — this is for new appointments. The confirmation email is the
    // ownership credential for any later mutation.
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
    if (action === 'reschedule') {
      if (!isSessionToken(body.sessionToken)) return json({ error: 'unauthorized' }, 401)
      if (!isFutureIso(body.newDatetime)) return json({ error: 'invalid_datetime' }, 400)

      const email = await verifySession(body.sessionToken)
      if (!email) return json({ error: 'unauthorized' }, 401)

      const limited = await rateLimit([
        { bucket: `pa:reschedule:ip:${ip}`, max: 3, windowSec: 60 },
        { bucket: `pa:write:ip:${ip}`, max: 10, windowSec: 3600 },
        { bucket: `pa:write:email:${email}`, max: 5, windowSec: 3600 },
      ])
      if (limited) return limited

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
      if (!isSessionToken(body.sessionToken)) return json({ error: 'unauthorized' }, 401)

      const email = await verifySession(body.sessionToken)
      if (!email) return json({ error: 'unauthorized' }, 401)

      const limited = await rateLimit([
        { bucket: `pa:cancel:ip:${ip}`, max: 3, windowSec: 60 },
        { bucket: `pa:write:ip:${ip}`, max: 10, windowSec: 3600 },
        { bucket: `pa:write:email:${email}`, max: 5, windowSec: 3600 },
      ])
      if (limited) return limited

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
