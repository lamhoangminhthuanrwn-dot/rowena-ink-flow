
-- Fix branches RLS policies
DROP POLICY IF EXISTS "Admins can manage branches" ON public.branches;
DROP POLICY IF EXISTS "Branches viewable by everyone" ON public.branches;

CREATE POLICY "Branches viewable by everyone" ON public.branches FOR SELECT USING (true);
CREATE POLICY "Admins can insert branches" ON public.branches FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update branches" ON public.branches FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix artists RLS policies
DROP POLICY IF EXISTS "Admins can manage artists" ON public.artists;
DROP POLICY IF EXISTS "Artists viewable by everyone" ON public.artists;

CREATE POLICY "Artists viewable by everyone" ON public.artists FOR SELECT USING (true);
CREATE POLICY "Admins can insert artists" ON public.artists FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update artists" ON public.artists FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
