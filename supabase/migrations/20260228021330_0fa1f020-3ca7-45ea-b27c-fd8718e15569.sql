
-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- has_role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  referral_code TEXT UNIQUE NOT NULL DEFAULT substr(replace(gen_random_uuid()::text, '-', ''), 1, 8),
  referred_by_user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  _ref_code TEXT;
  _referrer_id UUID;
BEGIN
  _ref_code := NEW.raw_user_meta_data ->> 'referred_by_code';
  IF _ref_code IS NOT NULL AND _ref_code != '' THEN
    SELECT id INTO _referrer_id FROM public.profiles WHERE referral_code = _ref_code;
  END IF;
  INSERT INTO public.profiles (id, full_name, phone, referred_by_user_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'phone', ''),
    _referrer_id
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  price_vnd INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  gallery TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admins can manage products" ON public.products FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_code TEXT UNIQUE NOT NULL DEFAULT 'RW-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 8),
  user_id UUID REFERENCES auth.users(id),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  product_id UUID REFERENCES public.products(id),
  product_name TEXT,
  placement TEXT,
  size TEXT,
  notes TEXT,
  reference_images TEXT[] DEFAULT '{}',
  preferred_date DATE,
  preferred_time TEXT,
  booking_status TEXT NOT NULL DEFAULT 'new',
  payment_status TEXT NOT NULL DEFAULT 'unpaid',
  deposit_receipts TEXT[] DEFAULT '{}',
  reject_reason TEXT,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own bookings" ON public.bookings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all bookings" ON public.bookings FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update all bookings" ON public.bookings FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Wallet table
CREATE TABLE public.wallet (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  balance_vnd INTEGER NOT NULL DEFAULT 0,
  reserved_vnd INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.wallet ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own wallet" ON public.wallet FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all wallets" ON public.wallet FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Wallet transactions
CREATE TABLE public.wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  amount_vnd INTEGER NOT NULL,
  description TEXT,
  reference_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own transactions" ON public.wallet_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all transactions" ON public.wallet_transactions FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Withdrawals table
CREATE TABLE public.withdrawals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount_vnd INTEGER NOT NULL,
  momo_phone TEXT NOT NULL,
  momo_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  decided_by UUID REFERENCES auth.users(id),
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own withdrawals" ON public.withdrawals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own withdrawals" ON public.withdrawals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all withdrawals" ON public.withdrawals FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update withdrawals" ON public.withdrawals FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Referral rewards dedupe table
CREATE TABLE public.referral_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  referred_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount_vnd INTEGER NOT NULL DEFAULT 300000,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (referred_id)
);
ALTER TABLE public.referral_rewards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own rewards" ON public.referral_rewards FOR SELECT USING (auth.uid() = referrer_id);
CREATE POLICY "Admins can view all rewards" ON public.referral_rewards FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Request withdrawal RPC
CREATE OR REPLACE FUNCTION public.request_withdrawal(_amount INTEGER, _momo_phone TEXT, _momo_name TEXT DEFAULT NULL)
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  _wallet_row wallet%ROWTYPE;
  _withdrawal_id UUID;
BEGIN
  SELECT * INTO _wallet_row FROM wallet WHERE user_id = auth.uid() FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Wallet not found'; END IF;
  IF _amount <= 0 THEN RAISE EXCEPTION 'Amount must be positive'; END IF;
  IF (_wallet_row.balance_vnd - _wallet_row.reserved_vnd) < _amount THEN RAISE EXCEPTION 'Insufficient balance'; END IF;
  UPDATE wallet SET reserved_vnd = reserved_vnd + _amount, updated_at = now() WHERE user_id = auth.uid();
  INSERT INTO withdrawals (user_id, amount_vnd, momo_phone, momo_name) VALUES (auth.uid(), _amount, _momo_phone, _momo_name) RETURNING id INTO _withdrawal_id;
  RETURN _withdrawal_id;
END;
$$;

-- Release reserved on reject
CREATE OR REPLACE FUNCTION public.release_reserved(_withdrawal_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE _w withdrawals%ROWTYPE;
BEGIN
  SELECT * INTO _w FROM withdrawals WHERE id = _withdrawal_id;
  UPDATE wallet SET reserved_vnd = GREATEST(reserved_vnd - _w.amount_vnd, 0), updated_at = now() WHERE user_id = _w.user_id;
END;
$$;

-- Complete withdrawal
CREATE OR REPLACE FUNCTION public.complete_withdrawal(_withdrawal_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE _w withdrawals%ROWTYPE;
BEGIN
  SELECT * INTO _w FROM withdrawals WHERE id = _withdrawal_id;
  UPDATE wallet SET balance_vnd = balance_vnd - _w.amount_vnd, reserved_vnd = GREATEST(reserved_vnd - _w.amount_vnd, 0), updated_at = now() WHERE user_id = _w.user_id;
  INSERT INTO wallet_transactions (user_id, type, amount_vnd, description, reference_id) VALUES (_w.user_id, 'withdrawal', -_w.amount_vnd, 'MoMo withdrawal', _withdrawal_id);
END;
$$;

-- Auto-create wallet for new profile
CREATE OR REPLACE FUNCTION public.handle_new_profile_wallet()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.wallet (user_id) VALUES (NEW.id) ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_profile_created_wallet
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_profile_wallet();

-- Storage bucket for uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('booking-uploads', 'booking-uploads', true);

CREATE POLICY "Anyone can upload booking files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'booking-uploads');
CREATE POLICY "Anyone can view booking files" ON storage.objects FOR SELECT USING (bucket_id = 'booking-uploads');
