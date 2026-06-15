DROP POLICY IF EXISTS "Authenticated can view bookings" ON public.bookings;
DROP POLICY IF EXISTS "Authenticated can view patients" ON public.patients;
REVOKE SELECT ON public.bookings FROM authenticated;
REVOKE SELECT ON public.patients FROM authenticated;