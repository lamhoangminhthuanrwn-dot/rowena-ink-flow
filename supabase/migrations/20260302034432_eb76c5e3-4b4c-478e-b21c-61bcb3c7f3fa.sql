
-- Secure RPC for admin booking operations
CREATE OR REPLACE FUNCTION public.admin_update_booking_payment(
  _booking_id UUID,
  _payment_status TEXT,
  _reject_reason TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: admin only';
  END IF;
  IF _payment_status NOT IN ('paid', 'rejected', 'unpaid', 'pending_verify') THEN
    RAISE EXCEPTION 'Invalid payment status';
  END IF;
  UPDATE bookings
  SET payment_status = _payment_status,
      reject_reason = _reject_reason,
      updated_at = now()
  WHERE id = _booking_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_update_booking_status(
  _booking_id UUID,
  _booking_status TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: admin only';
  END IF;
  IF _booking_status NOT IN ('new', 'confirmed', 'completed', 'cancelled') THEN
    RAISE EXCEPTION 'Invalid booking status';
  END IF;
  UPDATE bookings
  SET booking_status = _booking_status,
      updated_at = now()
  WHERE id = _booking_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_update_withdrawal_status(
  _withdrawal_id UUID,
  _status TEXT,
  _note TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: admin only';
  END IF;
  IF _status NOT IN ('approved', 'rejected', 'paid') THEN
    RAISE EXCEPTION 'Invalid withdrawal status';
  END IF;

  UPDATE withdrawals
  SET status = _status,
      decided_by = auth.uid(),
      note = COALESCE(_note, note),
      updated_at = now()
  WHERE id = _withdrawal_id;

  -- If rejected, release reserved funds
  IF _status = 'rejected' THEN
    PERFORM release_reserved(_withdrawal_id);
  END IF;

  -- If paid, complete withdrawal (deduct balance)
  IF _status = 'paid' THEN
    PERFORM complete_withdrawal(_withdrawal_id);
  END IF;
END;
$$;
