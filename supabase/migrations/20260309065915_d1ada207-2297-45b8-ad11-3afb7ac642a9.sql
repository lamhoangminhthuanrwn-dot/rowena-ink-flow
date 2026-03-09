
-- Create booking_price_history table
CREATE TABLE public.booking_price_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  old_price integer,
  new_price integer NOT NULL,
  changed_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.booking_price_history ENABLE ROW LEVEL SECURITY;

-- Only admins can view
CREATE POLICY "Admins can view price history"
ON public.booking_price_history
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Update admin_update_booking_price to log history
CREATE OR REPLACE FUNCTION public.admin_update_booking_price(_booking_id uuid, _total_price integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _old_price integer;
BEGIN
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: admin only';
  END IF;
  IF _total_price < 0 THEN
    RAISE EXCEPTION 'Price must be non-negative';
  END IF;
  
  -- Get old price
  SELECT total_price INTO _old_price FROM bookings WHERE id = _booking_id AND booking_status != 'completed';
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Booking not found or already completed';
  END IF;
  
  -- Log history
  INSERT INTO booking_price_history (booking_id, old_price, new_price, changed_by)
  VALUES (_booking_id, _old_price, _total_price, auth.uid());
  
  -- Update booking
  UPDATE bookings
  SET total_price = _total_price,
      updated_at = now()
  WHERE id = _booking_id
    AND booking_status != 'completed';
END;
$$;
