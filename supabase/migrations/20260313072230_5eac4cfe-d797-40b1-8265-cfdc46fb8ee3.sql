
-- Allow service role to delete payment_accounts (for confirm-change-payment)
-- Also add admin delete policy
CREATE POLICY "Admins can delete payment accounts" ON public.payment_accounts
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));
