
-- Update posts policy to allow both admin and moderator
DROP POLICY IF EXISTS "Admins can manage all posts" ON public.posts;
DROP POLICY IF EXISTS "Admins and moderators can manage posts" ON public.posts;
CREATE POLICY "Admins and moderators can manage posts"
ON public.posts FOR ALL
USING (
  has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'moderator')
);

-- Allow admins to manage user_roles (assign moderator role)
CREATE POLICY "Admins can insert roles"
ON public.user_roles FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
ON public.user_roles FOR DELETE
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
USING (has_role(auth.uid(), 'admin'));
