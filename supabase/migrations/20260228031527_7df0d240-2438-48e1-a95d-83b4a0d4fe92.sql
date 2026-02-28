
-- Fix 1: Add admin-only authorization to release_reserved
CREATE OR REPLACE FUNCTION public.release_reserved(_withdrawal_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $$
DECLARE _w withdrawals%ROWTYPE;
BEGIN
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: admin only';
  END IF;
  SELECT * INTO _w FROM withdrawals WHERE id = _withdrawal_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Withdrawal not found';
  END IF;
  UPDATE wallet SET reserved_vnd = GREATEST(reserved_vnd - _w.amount_vnd, 0), updated_at = now() WHERE user_id = _w.user_id;
END;
$$;

-- Fix 2: Add admin-only authorization to complete_withdrawal
CREATE OR REPLACE FUNCTION public.complete_withdrawal(_withdrawal_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $$
DECLARE _w withdrawals%ROWTYPE;
BEGIN
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: admin only';
  END IF;
  SELECT * INTO _w FROM withdrawals WHERE id = _withdrawal_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Withdrawal not found';
  END IF;
  UPDATE wallet SET balance_vnd = balance_vnd - _w.amount_vnd, reserved_vnd = GREATEST(reserved_vnd - _w.amount_vnd, 0), updated_at = now() WHERE user_id = _w.user_id;
  INSERT INTO wallet_transactions (user_id, type, amount_vnd, description, reference_id) VALUES (_w.user_id, 'withdrawal', -_w.amount_vnd, 'MoMo withdrawal', _withdrawal_id);
END;
$$;

-- Fix 3: Fix storage - update booking-uploads bucket to not be public, add proper RLS
UPDATE storage.buckets SET public = false WHERE id = 'booking-uploads';

-- Drop existing overly permissive storage policies for booking-uploads
DROP POLICY IF EXISTS "Anyone can upload booking files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view booking files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload booking files" ON storage.objects;

-- Create proper storage policies for booking-uploads
CREATE POLICY "Authenticated users can upload to booking-uploads"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'booking-uploads');

CREATE POLICY "Admins can view all booking uploads"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'booking-uploads' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view own booking uploads"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'booking-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow anon uploads to booking-uploads for anonymous bookings
CREATE POLICY "Anon can upload to booking-uploads"
ON storage.objects FOR INSERT TO anon
WITH CHECK (bucket_id = 'booking-uploads');
