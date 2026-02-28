
CREATE POLICY "Anon can read booking-uploads"
ON storage.objects FOR SELECT
TO anon
USING (bucket_id = 'booking-uploads');
