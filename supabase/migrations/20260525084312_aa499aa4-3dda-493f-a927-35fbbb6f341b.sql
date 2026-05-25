
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  treatment TEXT,
  preferred_datetime TIMESTAMPTZ NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Public can submit a booking (form is open to all visitors)
CREATE POLICY "Anyone can submit a booking"
ON public.bookings
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only authenticated staff can read/manage (no public read of patient data)
CREATE POLICY "Authenticated can view bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated can update bookings"
ON public.bookings
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated can delete bookings"
ON public.bookings
FOR DELETE
TO authenticated
USING (true);

CREATE INDEX idx_bookings_created_at ON public.bookings (created_at DESC);
