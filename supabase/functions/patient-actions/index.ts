// Patient actions proxy — keeps SECURITY DEFINER RPCs out of the public API.
// Anon-callable (the chat is anonymous), but service-role internally so the
// underlying RPCs are not exposed to anon/authenticated directly.

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
const isUuid = (s: unknown) =>
  typeof s === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s)
const isIso = (s: unknown) =>
  typeof s === 'string' && !isNaN(Date.parse(s))

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405)

  const url = Deno.env.get('SUPABASE_URL')
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!url || !key) return json({ error: 'server_misconfigured' }, 500)
  const supabase = createClient(url, key)

  let body: any
  try { body = await req.json() } catch { return json({ error: 'invalid_json' }, 400) }
  const action = body?.action

  try {
    if (action === 'lookup') {
      if (!isEmail(body.email)) return json({ error: 'invalid_email' }, 400)
      const { data, error } = await supabase.rpc('get_patient_by_email', { _email: body.email })
      if (error) return json({ error: 'lookup_failed' }, 500)
      // Strip phone — name + booking state only, to avoid leaking PII to anyone
      // who guesses an email.
      const safe = data as any
      if (safe && safe.found) delete safe.phone
      return json(safe)
    }

    if (action === 'reschedule') {
      if (!isEmail(body.email) || !isUuid(body.bookingId) || !isIso(body.newDatetime))
        return json({ error: 'invalid_input' }, 400)
      const { data, error } = await supabase.rpc('reschedule_booking', {
        _email: body.email,
        _booking_id: body.bookingId,
        _new_datetime: body.newDatetime,
      })
      if (error) return json({ error: 'reschedule_failed' }, 500)
      return json({ success: Boolean(data) })
    }

    if (action === 'cancel') {
      if (!isEmail(body.email) || !isUuid(body.bookingId))
        return json({ error: 'invalid_input' }, 400)
      const { data, error } = await supabase.rpc('cancel_booking', {
        _email: body.email,
        _booking_id: body.bookingId,
      })
      if (error) return json({ error: 'cancel_failed' }, 500)
      return json({ success: Boolean(data) })
    }

    return json({ error: 'unknown_action' }, 400)
  } catch {
    return json({ error: 'internal_error' }, 500)
  }
})
