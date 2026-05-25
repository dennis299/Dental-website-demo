
-- Length + format constraints
ALTER TABLE public.bookings
  ADD CONSTRAINT bookings_name_length CHECK (char_length(name) BETWEEN 1 AND 100),
  ADD CONSTRAINT bookings_phone_length CHECK (char_length(phone) BETWEEN 5 AND 20),
  ADD CONSTRAINT bookings_email_length CHECK (char_length(email) BETWEEN 3 AND 255),
  ADD CONSTRAINT bookings_email_format CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  ADD CONSTRAINT bookings_treatment_length CHECK (treatment IS NULL OR char_length(treatment) <= 100),
  ADD CONSTRAINT bookings_message_length CHECK (message IS NULL OR char_length(message) <= 1000),
  ADD CONSTRAINT bookings_status_check CHECK (status IN ('new', 'confirmed', 'cancelled'));

-- Tighten public insert policy: visitors can only create bookings with status='new'
DROP POLICY IF EXISTS "Anyone can submit a booking" ON public.bookings;

CREATE POLICY "Anyone can submit a booking"
ON public.bookings
FOR INSERT
TO anon, authenticated
WITH CHECK (status = 'new');
