-- Fix 1: Remove overly permissive anon read policy on booking-uploads
DROP POLICY IF EXISTS "Anon can read booking-uploads" ON storage.objects;

-- Fix 3: Create atomic referral reward function to prevent race conditions
CREATE OR REPLACE FUNCTION public.add_referral_reward(
  _referrer_id UUID,
  _referred_id UUID,
  _booking_code TEXT
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _amount INTEGER := 300000;
BEGIN
  -- Atomic insert with conflict check (referred_id should be unique)
  INSERT INTO referral_rewards (referrer_id, referred_id, amount_vnd)
  VALUES (_referrer_id, _referred_id, _amount)
  ON CONFLICT (referred_id) DO NOTHING;

  IF NOT FOUND THEN
    RETURN false; -- reward already granted
  END IF;

  -- Atomic increment (no read-then-write)
  -- Upsert wallet
  INSERT INTO wallet (user_id, balance_vnd, reserved_vnd)
  VALUES (_referrer_id, _amount, 0)
  ON CONFLICT (user_id) DO UPDATE
    SET balance_vnd = wallet.balance_vnd + _amount,
        updated_at = now();

  -- Record transaction
  INSERT INTO wallet_transactions (user_id, amount_vnd, type, description)
  VALUES (_referrer_id, _amount, 'referral_reward', 'Thưởng giới thiệu từ booking ' || _booking_code);

  RETURN true;
END;
$$;