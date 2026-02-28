

## Problem

The production (Live) database has no data in the `branches` and `artists` tables. Database schema syncs on publish, but **data does not sync** between Test and Live environments. The branches and artists were only seeded in Test.

## Solution

Create a new database migration that inserts the 4 branches and 40 artists using `INSERT ... ON CONFLICT DO NOTHING` so it's safe to run in both environments.

**File: New migration**

```sql
-- Insert branches
INSERT INTO branches (name, slug) VALUES
  ('Rowena Gò Vấp', 'go-vap'),
  ('Rowena Hà Nội', 'ha-noi'),
  ('Rowena Daklak', 'daklak'),
  ('Rowena Malaysia', 'malaysia')
ON CONFLICT DO NOTHING;

-- Insert 10 artists per branch (using subquery to get branch IDs)
-- For each branch, insert: Minh Tú, Hoàng Anh, Thanh Hằng, Đức Trí, Phương Linh, Quốc Bảo, Ngọc Lan, Tuấn Kiệt, Hải Yến, Văn Hùng
INSERT INTO artists (name, branch_id)
SELECT artist_name, b.id
FROM branches b
CROSS JOIN (VALUES ('Minh Tú'),('Hoàng Anh'),('Thanh Hằng'),('Đức Trí'),('Phương Linh'),('Quốc Bảo'),('Ngọc Lan'),('Tuấn Kiệt'),('Hải Yến'),('Văn Hùng')) AS a(artist_name)
WHERE NOT EXISTS (
  SELECT 1 FROM artists WHERE artists.branch_id = b.id AND artists.name = a.artist_name
);
```

This migration will populate the Live database on the next publish, making branches and artists visible on the production booking page.

