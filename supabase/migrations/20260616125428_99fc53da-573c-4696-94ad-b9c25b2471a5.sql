
-- 1. security_findings table
CREATE TABLE IF NOT EXISTS public.security_findings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fingerprint TEXT NOT NULL UNIQUE,
  check_id TEXT NOT NULL,
  subject TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('critical','high','medium','low','info')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  remediation TEXT NOT NULL,
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS security_findings_active_idx ON public.security_findings(resolved_at) WHERE resolved_at IS NULL;
CREATE INDEX IF NOT EXISTS security_findings_check_idx ON public.security_findings(check_id);

-- service-role only; no public access
GRANT ALL ON public.security_findings TO service_role;
ALTER TABLE public.security_findings ENABLE ROW LEVEL SECURITY;
-- No policies: with RLS enabled and no policies, only the service_role (which bypasses RLS) can access.

-- 2. Scan helper function
CREATE OR REPLACE FUNCTION public.run_security_scan_checks()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb := '[]'::jsonb;
  r record;
BEGIN
  -- Check A: tables in public without RLS enabled
  FOR r IN
    SELECT c.relname AS tbl
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relkind = 'r'
      AND c.relrowsecurity = false
      AND c.relname NOT LIKE 'pg_%'
  LOOP
    result := result || jsonb_build_object(
      'check_id', 'rls_disabled',
      'subject', 'public.' || r.tbl,
      'severity', 'critical',
      'title', 'Row-Level Security disabled on table ' || r.tbl,
      'description', 'The table public.' || r.tbl || ' has RLS disabled, which exposes every row through the Data API.',
      'remediation', 'Run: ALTER TABLE public.' || r.tbl || ' ENABLE ROW LEVEL SECURITY; and add appropriate policies.'
    );
  END LOOP;

  -- Check B: permissive policies granting access to anon or authenticated (USING qual = 'true')
  FOR r IN
    SELECT schemaname, tablename, policyname, roles::text AS roles
    FROM pg_policies
    WHERE schemaname = 'public'
      AND (qual = 'true' OR qual IS NULL)
      AND (roles::text LIKE '%anon%' OR roles::text LIKE '%authenticated%')
      AND cmd IN ('SELECT','ALL')
  LOOP
    result := result || jsonb_build_object(
      'check_id', 'permissive_policy',
      'subject', r.schemaname || '.' || r.tablename || '::' || r.policyname,
      'severity', 'high',
      'title', 'Permissive policy on ' || r.tablename,
      'description', 'Policy ' || r.policyname || ' on ' || r.schemaname || '.' || r.tablename || ' allows broad access to roles ' || r.roles || '.',
      'remediation', 'Scope the policy with auth.uid() or drop it: DROP POLICY "' || r.policyname || '" ON ' || r.schemaname || '.' || r.tablename || ';'
    );
  END LOOP;

  -- Check C: SELECT granted to anon/authenticated on tables containing sensitive columns
  FOR r IN
    SELECT DISTINCT g.table_name, g.grantee
    FROM information_schema.role_table_grants g
    JOIN information_schema.columns c
      ON c.table_schema = g.table_schema AND c.table_name = g.table_name
    WHERE g.table_schema = 'public'
      AND g.privilege_type = 'SELECT'
      AND g.grantee IN ('anon','authenticated')
      AND (
        c.column_name IN ('email','phone','code_hash','token','token_hash','password','password_hash')
        OR c.column_name LIKE '%_token'
        OR c.column_name LIKE '%_hash'
      )
  LOOP
    result := result || jsonb_build_object(
      'check_id', 'sensitive_column_exposed',
      'subject', 'public.' || r.table_name || '::' || r.grantee,
      'severity', 'high',
      'title', 'Sensitive columns readable by ' || r.grantee,
      'description', 'Role ' || r.grantee || ' has SELECT on public.' || r.table_name || ', which contains sensitive columns (email/phone/token/hash).',
      'remediation', 'REVOKE SELECT ON public.' || r.table_name || ' FROM ' || r.grantee || '; and route access through a service-role edge function.'
    );
  END LOOP;

  -- Check D: rate-limit activity (proxy: any rate_limit_hits in the last 24h means the limiter is wired in)
  IF NOT EXISTS (SELECT 1 FROM public.rate_limit_hits WHERE hit_at > now() - INTERVAL '24 hours') THEN
    -- only flag if there has ever been a hit (otherwise probably a quiet day on a young project)
    IF EXISTS (SELECT 1 FROM public.rate_limit_hits) THEN
      result := result || jsonb_build_object(
        'check_id', 'rate_limiter_idle',
        'subject', 'public.rate_limit_hits',
        'severity', 'medium',
        'title', 'Rate limiter has not recorded activity in 24h',
        'description', 'No rate_limit_hits rows in the last 24 hours despite prior activity. The rate limiter may have been removed from an edge function path.',
        'remediation', 'Confirm check_rate_limit() is still called in patient-actions and send-transactional-email.'
      );
    END IF;
  END IF;

  RETURN result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.run_security_scan_checks() TO service_role;
REVOKE EXECUTE ON FUNCTION public.run_security_scan_checks() FROM PUBLIC, anon, authenticated;
