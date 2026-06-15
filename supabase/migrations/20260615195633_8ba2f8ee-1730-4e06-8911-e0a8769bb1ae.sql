
DROP POLICY IF EXISTS "Anyone can submit a booking" ON public.bookings;
REVOKE INSERT ON public.bookings FROM anon;
