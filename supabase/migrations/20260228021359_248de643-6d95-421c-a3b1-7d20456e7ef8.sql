
-- Fix overly permissive INSERT policy on bookings
DROP POLICY "Users can insert bookings" ON public.bookings;
CREATE POLICY "Authenticated users can insert bookings" ON public.bookings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Anon can insert bookings" ON public.bookings FOR INSERT TO anon WITH CHECK (true);
