CREATE TABLE public.rate_limit_hits (
  id BIGSERIAL PRIMARY KEY,
  bucket TEXT NOT NULL,
  hit_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_rate_limit_hits_bucket_time ON public.rate_limit_hits(bucket, hit_at DESC);

GRANT ALL ON public.rate_limit_hits TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.rate_limit_hits_id_seq TO service_role;
ALTER TABLE public.rate_limit_hits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service role only" ON public.rate_limit_hits FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.check_rate_limit(_bucket TEXT, _max_hits INT, _window_seconds INT)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  current_count INT;
  oldest TIMESTAMPTZ;
  retry_after INT;
BEGIN
  DELETE FROM public.rate_limit_hits WHERE hit_at < now() - INTERVAL '1 day';

  SELECT COUNT(*), MIN(hit_at) INTO current_count, oldest
  FROM public.rate_limit_hits
  WHERE bucket = _bucket AND hit_at > now() - make_interval(secs => _window_seconds);

  IF current_count >= _max_hits THEN
    retry_after := GREATEST(1, _window_seconds - EXTRACT(EPOCH FROM (now() - oldest))::INT);
    RETURN jsonb_build_object('allowed', false, 'retry_after', retry_after, 'count', current_count);
  END IF;

  INSERT INTO public.rate_limit_hits(bucket) VALUES (_bucket);
  RETURN jsonb_build_object('allowed', true, 'count', current_count + 1);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.check_rate_limit(TEXT, INT, INT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.check_rate_limit(TEXT, INT, INT) TO service_role;