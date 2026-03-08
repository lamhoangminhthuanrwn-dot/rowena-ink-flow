
DROP POLICY IF EXISTS "Anyone can upload booking files" ON storage.objects;

CREATE POLICY "Scoped booking uploads" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'booking-uploads' AND
    (name LIKE 'references/%' OR name LIKE 'deposits/%')
  );

UPDATE storage.buckets SET public = false WHERE id = 'booking-uploads';
