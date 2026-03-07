-- 1. Add total_price column to bookings
ALTER TABLE public.bookings ADD COLUMN total_price integer;

-- 2. Replace add_referral_reward function with dynamic 10% reward
CREATE OR REPLACE FUNCTION public.add_referral_reward(_referrer_id uuid, _referred_id uuid, _booking_code text, _booking_amount integer DEFAULT 0)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  _amount INTEGER;
BEGIN
  _amount := GREATEST((_booking_amount * 10 / 100), 0);
  
  IF _amount <= 0 THEN
    RETURN false;
  END IF;

  INSERT INTO referral_rewards (referrer_id, referred_id, amount_vnd)
  VALUES (_referrer_id, _referred_id, _amount)
  ON CONFLICT (referred_id) DO NOTHING;

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  INSERT INTO wallet (user_id, balance_vnd, reserved_vnd)
  VALUES (_referrer_id, _amount, 0)
  ON CONFLICT (user_id) DO UPDATE
    SET balance_vnd = wallet.balance_vnd + _amount,
        updated_at = now();

  INSERT INTO wallet_transactions (user_id, amount_vnd, type, description)
  VALUES (_referrer_id, _amount, 'referral_reward', 'Thưởng 10% từ booking ' || _booking_code);

  RETURN true;
END;
$function$;