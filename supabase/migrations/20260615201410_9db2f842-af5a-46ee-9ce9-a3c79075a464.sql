CREATE TABLE public.booking_otps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  session_token TEXT,
  attempts INT NOT NULL DEFAULT 0,
  consumed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL,
  session_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX booking_otps_email_idx ON public.booking_otps (lower(email), created_at DESC);
CREATE INDEX booking_otps_session_idx ON public.booking_otps (session_token) WHERE session_token IS NOT NULL;

GRANT ALL ON public.booking_otps TO service_role;

ALTER TABLE public.booking_otps ENABLE ROW LEVEL SECURITY;

-- No anon/authenticated policies: only service_role (edge function) accesses this table.
CREATE POLICY "service_role_only" ON public.booking_otps FOR ALL TO service_role USING (true) WITH CHECK (true);