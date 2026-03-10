INSERT INTO storage.buckets (id, name, public)
VALUES ('tattoo-images', 'tattoo-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read tattoo-images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'tattoo-images');

CREATE POLICY "Service role full access tattoo-images"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'tattoo-images');