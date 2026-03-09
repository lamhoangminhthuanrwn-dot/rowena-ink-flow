CREATE OR REPLACE FUNCTION public.admin_update_booking_price(_booking_id uuid, _total_price integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: admin only';
  END IF;
  IF _total_price < 0 THEN
    RAISE EXCEPTION 'Price must be non-negative';
  END IF;
  UPDATE bookings
  SET total_price = _total_price,
      updated_at = now()
  WHERE id = _booking_id
    AND booking_status != 'completed';
END;
$$;