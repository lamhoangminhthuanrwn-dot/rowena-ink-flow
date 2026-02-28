-- Insert branches
INSERT INTO branches (name, slug) VALUES
  ('Rowena Gò Vấp', 'go-vap'),
  ('Rowena Hà Nội', 'ha-noi'),
  ('Rowena Daklak', 'daklak'),
  ('Rowena Malaysia', 'malaysia')
ON CONFLICT DO NOTHING;

-- Insert 10 artists per branch
INSERT INTO artists (name, branch_id)
SELECT artist_name, b.id
FROM branches b
CROSS JOIN (VALUES ('Minh Tú'),('Hoàng Anh'),('Thanh Hằng'),('Đức Trí'),('Phương Linh'),('Quốc Bảo'),('Ngọc Lan'),('Tuấn Kiệt'),('Hải Yến'),('Văn Hùng')) AS a(artist_name)
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE artists.branch_id = b.id AND artists.name = a.artist_name
);