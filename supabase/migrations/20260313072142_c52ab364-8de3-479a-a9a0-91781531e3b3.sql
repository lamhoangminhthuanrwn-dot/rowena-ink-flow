
-- Create payment_accounts table
CREATE TABLE public.payment_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  account_type text NOT NULL DEFAULT 'momo',
  momo_phone text,
  momo_name text,
  bank_name text,
  bank_account_number text,
  bank_account_name text,
  change_token text,
  change_token_expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.payment_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payment account" ON public.payment_accounts
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payment account" ON public.payment_accounts
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payment account" ON public.payment_accounts
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Admins can view all payment accounts
CREATE POLICY "Admins can view all payment accounts" ON public.payment_accounts
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Update request_withdrawal to pull from payment_accounts
CREATE OR REPLACE FUNCTION public.request_withdrawal(_amount integer, _momo_phone text DEFAULT NULL, _momo_name text DEFAULT NULL)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $$
DECLARE
  _wallet_row wallet%ROWTYPE;
  _withdrawal_id UUID;
  _pa payment_accounts%ROWTYPE;
  _phone text;
  _name text;
BEGIN
  -- Get payment account
  SELECT * INTO _pa FROM payment_accounts WHERE user_id = auth.uid();
  IF NOT FOUND THEN
    RAISE EXCEPTION 'No linked payment account';
  END IF;

  -- Determine phone/name from payment account
  IF _pa.account_type = 'momo' THEN
    _phone := _pa.momo_phone;
    _name := _pa.momo_name;
  ELSE
    _phone := _pa.bank_account_number;
    _name := _pa.bank_account_name;
  END IF;

  SELECT * INTO _wallet_row FROM wallet WHERE user_id = auth.uid() FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Wallet not found'; END IF;
  IF _amount <= 0 THEN RAISE EXCEPTION 'Amount must be positive'; END IF;
  IF (_wallet_row.balance_vnd - _wallet_row.reserved_vnd) < _amount THEN RAISE EXCEPTION 'Insufficient balance'; END IF;
  
  UPDATE wallet SET reserved_vnd = reserved_vnd + _amount, updated_at = now() WHERE user_id = auth.uid();
  INSERT INTO withdrawals (user_id, amount_vnd, momo_phone, momo_name) 
  VALUES (auth.uid(), _amount, _phone, _name) 
  RETURNING id INTO _withdrawal_id;
  RETURN _withdrawal_id;
END;
$$;
