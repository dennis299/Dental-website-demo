
-- Lock down SECURITY DEFINER RPCs so they're not callable from the public Data API.
-- They are now invoked only by the patient-actions edge function (service_role).

REVOKE EXECUTE ON FUNCTION public.get_patient_by_email(text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.reschedule_booking(text, uuid, timestamptz) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.cancel_booking(text, uuid) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.get_patient_by_email(text) TO service_role;
GRANT EXECUTE ON FUNCTION public.reschedule_booking(text, uuid, timestamptz) TO service_role;
GRANT EXECUTE ON FUNCTION public.cancel_booking(text, uuid) TO service_role;

-- Pin search_path to empty for all project-defined functions and qualify references.
ALTER FUNCTION public.get_patient_by_email(text) SET search_path = '';
ALTER FUNCTION public.reschedule_booking(text, uuid, timestamptz) SET search_path = '';
ALTER FUNCTION public.cancel_booking(text, uuid) SET search_path = '';
ALTER FUNCTION public.upsert_patient_from_booking() SET search_path = '';

-- Rewrite bodies so they don't depend on search_path resolution.
CREATE OR REPLACE FUNCTION public.get_patient_by_email(_email text)
RETURNS jsonb
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
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

CREATE OR REPLACE FUNCTION public.reschedule_booking(_email text, _booking_id uuid, _new_datetime timestamptz)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE rows int;
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
SET search_path = ''
AS $$
DECLARE rows int;
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

-- Re-lock down the recreated functions.
REVOKE EXECUTE ON FUNCTION public.get_patient_by_email(text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.reschedule_booking(text, uuid, timestamptz) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.cancel_booking(text, uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_patient_by_email(text) TO service_role;
GRANT EXECUTE ON FUNCTION public.reschedule_booking(text, uuid, timestamptz) TO service_role;
GRANT EXECUTE ON FUNCTION public.cancel_booking(text, uuid) TO service_role;
