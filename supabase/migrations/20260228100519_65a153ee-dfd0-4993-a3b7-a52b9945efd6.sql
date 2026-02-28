
-- Add DELETE policies for branches and artists (admin only)
CREATE POLICY "Admins can delete branches" ON public.branches FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete artists" ON public.artists FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));
