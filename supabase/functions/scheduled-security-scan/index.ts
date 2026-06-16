// Scheduled security scan. Runs daily via pg_cron.
// Detects new findings via the security_findings table and emails the owner.
import { createClient } from 'npm:@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const ALERT_RECIPIENT = 'ezeoradennis20@gmail.com'

type Finding = {
  check_id: string
  subject: string
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info'
  title: string
  description: string
  remediation: string
}

function fp(check_id: string, subject: string) {
  return `${check_id}::${subject}`
}

async function runScan(supabase: ReturnType<typeof createClient>): Promise<Finding[]> {
  const findings: Finding[] = []

  // Scan via the SQL helper that returns a normalized json array
  const { data: scanRows, error } = await supabase.rpc('run_security_scan_checks')
  if (error) {
    console.error('run_security_scan_checks failed', error)
    throw error
  }
  if (Array.isArray(scanRows)) {
    for (const r of scanRows as Finding[]) findings.push(r)
  }

  return findings
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
  const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  try {
    const findings = await runScan(supabase)
    const now = new Date().toISOString()

    const newFindings: Finding[] = []
    for (const f of findings) {
      const fingerprint = fp(f.check_id, f.subject)
      const { data: existing } = await supabase
        .from('security_findings')
        .select('id, resolved_at')
        .eq('fingerprint', fingerprint)
        .maybeSingle()

      if (!existing || existing.resolved_at) {
        newFindings.push(f)
        if (existing) {
          await supabase
            .from('security_findings')
            .update({ resolved_at: null, last_seen_at: now, severity: f.severity, title: f.title, description: f.description, remediation: f.remediation })
            .eq('id', existing.id)
        } else {
          await supabase.from('security_findings').insert({
            fingerprint,
            check_id: f.check_id,
            subject: f.subject,
            severity: f.severity,
            title: f.title,
            description: f.description,
            remediation: f.remediation,
            first_seen_at: now,
            last_seen_at: now,
          })
        }
      } else {
        await supabase
          .from('security_findings')
          .update({ last_seen_at: now })
          .eq('id', existing.id)
      }
    }

    // Auto-resolve findings no longer present
    const activeFingerprints = findings.map((f) => fp(f.check_id, f.subject))
    const { data: stale } = await supabase
      .from('security_findings')
      .select('id, fingerprint')
      .is('resolved_at', null)
    if (stale) {
      const toResolve = stale.filter((s: any) => !activeFingerprints.includes(s.fingerprint))
      if (toResolve.length) {
        await supabase
          .from('security_findings')
          .update({ resolved_at: now })
          .in('id', toResolve.map((s: any) => s.id))
      }
    }

    if (newFindings.length > 0) {
      const { error: emailErr } = await supabase.functions.invoke('send-transactional-email', {
        body: {
          templateName: 'security-alert',
          recipientEmail: ALERT_RECIPIENT,
          idempotencyKey: `security-alert-${now.slice(0, 10)}`,
          templateData: { scannedAt: now, findings: newFindings },
        },
      })
      if (emailErr) console.error('email send failed', emailErr)
    }

    return new Response(
      JSON.stringify({
        ok: true,
        total: findings.length,
        new: newFindings.length,
        emailed: newFindings.length > 0,
        scannedAt: now,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (e) {
    console.error('scan failed', e)
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
