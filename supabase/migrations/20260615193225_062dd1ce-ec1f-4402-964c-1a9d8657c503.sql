
-- 1. patients table
CREATE TABLE public.patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  name text NOT NULL,
  phone text NOT NULL,
  last_booking_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.patients TO authenticated;
GRANT ALL ON public.patients TO service_role;

ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view patients"
  ON public.patients FOR SELECT TO authenticated USING (true);

-- 2. extend bookings
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS patient_id uuid REFERENCES public.patients(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS confirmation_token uuid NOT NULL DEFAULT gen_random_uuid();

CREATE INDEX IF NOT EXISTS bookings_email_idx ON public.bookings (lower(email));
CREATE INDEX IF NOT EXISTS bookings_patient_id_idx ON public.bookings (patient_id);

-- 3. public-safe lookup RPC
CREATE OR REPLACE FUNCTION public.get_patient_by_email(_email text)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH p AS (
    SELECT id, name, phone FROM public.patients
    WHERE lower(email) = lower(trim(_email))
    LIMIT 1
  ),
  active AS (
    SELECT preferred_datetime, treatment, id AS booking_id
    FROM public.bookings
    WHERE lower(email) = lower(trim(_email))
      AND status NOT IN ('cancelled')
      AND preferred_datetime > now()
    ORDER BY preferred_datetime ASC
    LIMIT 1
  )
  SELECT CASE
    WHEN NOT EXISTS (SELECT 1 FROM p) THEN jsonb_build_object('found', false)
    ELSE jsonb_build_object(
      'found', true,
      'name', (SELECT name FROM p),
      'phone', (SELECT phone FROM p),
      'has_active_booking', EXISTS (SELECT 1 FROM active),
      'next_appointment_at', (SELECT preferred_datetime FROM active),
      'next_treatment', (SELECT treatment FROM active),
      'next_booking_id', (SELECT booking_id FROM active)
    )
  END;
$$;

GRANT EXECUTE ON FUNCTION public.get_patient_by_email(text) TO anon, authenticated;

-- 4. trigger to upsert patient on booking
CREATE OR REPLACE FUNCTION public.upsert_patient_from_booking()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  pid uuid;
BEGIN
  INSERT INTO public.patients (email, name, phone, last_booking_at)
  VALUES (lower(trim(NEW.email)), NEW.name, NEW.phone, NEW.preferred_datetime)
  ON CONFLICT (email) DO UPDATE
    SET name = EXCLUDED.name,
        phone = EXCLUDED.phone,
        last_booking_at = GREATEST(public.patients.last_booking_at, EXCLUDED.last_booking_at),
        updated_at = now()
  RETURNING id INTO pid;

  NEW.patient_id := pid;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS bookings_upsert_patient ON public.bookings;
CREATE TRIGGER bookings_upsert_patient
  BEFORE INSERT ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.upsert_patient_from_booking();

-- 5. allow public to cancel/reschedule their own booking via RPC
CREATE OR REPLACE FUNCTION public.reschedule_booking(_email text, _booking_id uuid, _new_datetime timestamptz)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  rows int;
BEGIN
  UPDATE public.bookings
    SET preferred_datetime = _new_datetime, status = 'rescheduled'
    WHERE id = _booking_id
      AND lower(email) = lower(trim(_email))
      AND status NOT IN ('cancelled');
  GET DIAGNOSTICS rows = ROW_COUNT;
  RETURN rows > 0;
END;
$$;

CREATE OR REPLACE FUNCTION public.cancel_booking(_email text, _booking_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  rows int;
BEGIN
  UPDATE public.bookings
    SET status = 'cancelled'
    WHERE id = _booking_id
      AND lower(email) = lower(trim(_email))
      AND status NOT IN ('cancelled');
  GET DIAGNOSTICS rows = ROW_COUNT;
  RETURN rows > 0;
END;
$$;

GRANT EXECUTE ON FUNCTION public.reschedule_booking(text, uuid, timestamptz) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.cancel_booking(text, uuid) TO anon, authenticated;
