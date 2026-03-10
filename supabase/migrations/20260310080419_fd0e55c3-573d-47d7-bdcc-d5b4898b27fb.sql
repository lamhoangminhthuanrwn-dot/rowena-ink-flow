
-- Fix 1: Drop anon read policy on booking-uploads (STORAGE_EXPOSURE)
DROP POLICY IF EXISTS "Anon can read booking-uploads" ON storage.objects;

-- Fix 2: Fix bookings INSERT policy to prevent user impersonation (PUBLIC_DATA_EXPOSURE)
DROP POLICY IF EXISTS "Authenticated users can insert bookings" ON public.bookings;
CREATE POLICY "Authenticated users can insert own bookings"
ON public.bookings FOR INSERT TO authenticated
WITH CHECK (user_id IS NULL OR user_id = auth.uid());

-- Fix 3: Convert all RESTRICTIVE policies to PERMISSIVE (RESTRICTIVE_ONLY_POLICY_MISCONFIGURATION)

-- artists
DROP POLICY IF EXISTS "Artists viewable by everyone" ON public.artists;
CREATE POLICY "Artists viewable by everyone" ON public.artists FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Admins can insert artists" ON public.artists;
CREATE POLICY "Admins can insert artists" ON public.artists FOR INSERT TO public WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can update artists" ON public.artists;
CREATE POLICY "Admins can update artists" ON public.artists FOR UPDATE TO public USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can delete artists" ON public.artists;
CREATE POLICY "Admins can delete artists" ON public.artists FOR DELETE TO public USING (has_role(auth.uid(), 'admin'::app_role));

-- booking_price_history
DROP POLICY IF EXISTS "Admins can view price history" ON public.booking_price_history;
CREATE POLICY "Admins can view price history" ON public.booking_price_history FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- bookings
DROP POLICY IF EXISTS "Admins can view all bookings" ON public.bookings;
CREATE POLICY "Admins can view all bookings" ON public.bookings FOR SELECT TO public USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT TO public USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can update all bookings" ON public.bookings;
CREATE POLICY "Admins can update all bookings" ON public.bookings FOR UPDATE TO public USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Users can update own bookings" ON public.bookings;
CREATE POLICY "Users can update own bookings" ON public.bookings FOR UPDATE TO public USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anon can insert bookings" ON public.bookings;
CREATE POLICY "Anon can insert bookings" ON public.bookings FOR INSERT TO anon WITH CHECK (true);

-- branches
DROP POLICY IF EXISTS "Branches viewable by everyone" ON public.branches;
CREATE POLICY "Branches viewable by everyone" ON public.branches FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Admins can insert branches" ON public.branches;
CREATE POLICY "Admins can insert branches" ON public.branches FOR INSERT TO public WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can update branches" ON public.branches;
CREATE POLICY "Admins can update branches" ON public.branches FOR UPDATE TO public USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can delete branches" ON public.branches;
CREATE POLICY "Admins can delete branches" ON public.branches FOR DELETE TO public USING (has_role(auth.uid(), 'admin'::app_role));

-- posts
DROP POLICY IF EXISTS "Published posts viewable by everyone" ON public.posts;
CREATE POLICY "Published posts viewable by everyone" ON public.posts FOR SELECT TO public USING (is_published = true);

DROP POLICY IF EXISTS "Admins and moderators can manage posts" ON public.posts;
CREATE POLICY "Admins and moderators can manage posts" ON public.posts FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role));

-- products
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
CREATE POLICY "Admins can manage products" ON public.products FOR ALL TO public USING (has_role(auth.uid(), 'admin'::app_role));

-- profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO public USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT TO public USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO public WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO public USING (auth.uid() = id);

-- referral_rewards
DROP POLICY IF EXISTS "Users can view own rewards" ON public.referral_rewards;
CREATE POLICY "Users can view own rewards" ON public.referral_rewards FOR SELECT TO public USING (auth.uid() = referrer_id);

DROP POLICY IF EXISTS "Admins can view all rewards" ON public.referral_rewards;
CREATE POLICY "Admins can view all rewards" ON public.referral_rewards FOR SELECT TO public USING (has_role(auth.uid(), 'admin'::app_role));

-- user_roles
DROP POLICY IF EXISTS "Users can read own roles" ON public.user_roles;
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO public USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT TO public USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;
CREATE POLICY "Admins can insert roles" ON public.user_roles FOR INSERT TO public WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;
CREATE POLICY "Admins can delete roles" ON public.user_roles FOR DELETE TO public USING (has_role(auth.uid(), 'admin'::app_role));

-- wallet
DROP POLICY IF EXISTS "Users can view own wallet" ON public.wallet;
CREATE POLICY "Users can view own wallet" ON public.wallet FOR SELECT TO public USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all wallets" ON public.wallet;
CREATE POLICY "Admins can view all wallets" ON public.wallet FOR SELECT TO public USING (has_role(auth.uid(), 'admin'::app_role));

-- wallet_transactions
DROP POLICY IF EXISTS "Users can view own transactions" ON public.wallet_transactions;
CREATE POLICY "Users can view own transactions" ON public.wallet_transactions FOR SELECT TO public USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all transactions" ON public.wallet_transactions;
CREATE POLICY "Admins can view all transactions" ON public.wallet_transactions FOR SELECT TO public USING (has_role(auth.uid(), 'admin'::app_role));

-- withdrawals
DROP POLICY IF EXISTS "Users can view own withdrawals" ON public.withdrawals;
CREATE POLICY "Users can view own withdrawals" ON public.withdrawals FOR SELECT TO public USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all withdrawals" ON public.withdrawals;
CREATE POLICY "Admins can view all withdrawals" ON public.withdrawals FOR SELECT TO public USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can update withdrawals" ON public.withdrawals;
CREATE POLICY "Admins can update withdrawals" ON public.withdrawals FOR UPDATE TO public USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Users can insert own withdrawals" ON public.withdrawals;
CREATE POLICY "Users can insert own withdrawals" ON public.withdrawals FOR INSERT TO public WITH CHECK (auth.uid() = user_id);
