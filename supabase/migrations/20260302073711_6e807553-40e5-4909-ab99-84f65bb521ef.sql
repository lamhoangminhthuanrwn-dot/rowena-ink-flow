
-- Fix: Make public SELECT policy permissive so anon users can read published posts
DROP POLICY "Published posts are viewable by everyone" ON public.posts;
CREATE POLICY "Published posts are viewable by everyone"
ON public.posts FOR SELECT
USING (is_published = true);

-- Also fix admin policy to be permissive
DROP POLICY "Admins can manage all posts" ON public.posts;
CREATE POLICY "Admins can manage all posts"
ON public.posts FOR ALL
USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);
