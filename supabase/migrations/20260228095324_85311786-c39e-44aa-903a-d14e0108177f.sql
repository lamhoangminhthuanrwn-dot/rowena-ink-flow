
-- Create branches table
CREATE TABLE public.branches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Branches viewable by everyone" ON public.branches FOR SELECT USING (true);
CREATE POLICY "Admins can manage branches" ON public.branches FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert 4 branches
INSERT INTO public.branches (name, slug) VALUES
  ('Rowena Gò Vấp', 'go-vap'),
  ('Rowena Hà Nội', 'ha-noi'),
  ('Rowena Daklak', 'daklak'),
  ('Rowena Malaysia', 'malaysia');

-- Create artists table
CREATE TABLE public.artists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  branch_id UUID NOT NULL REFERENCES public.branches(id),
  name TEXT NOT NULL,
  work_start TEXT NOT NULL DEFAULT '08:00',
  work_end TEXT NOT NULL DEFAULT '18:00',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Artists viewable by everyone" ON public.artists FOR SELECT USING (true);
CREATE POLICY "Admins can manage artists" ON public.artists FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert 10 artists per branch (40 total)
INSERT INTO public.artists (branch_id, name)
SELECT b.id, a.name FROM public.branches b
CROSS JOIN (VALUES
  ('Minh Tú'), ('Hoàng Anh'), ('Thanh Hằng'), ('Đức Trí'), ('Phương Linh'),
  ('Quốc Bảo'), ('Ngọc Lan'), ('Tuấn Kiệt'), ('Hải Yến'), ('Văn Hùng')
) AS a(name);

-- Add columns to bookings
ALTER TABLE public.bookings
  ADD COLUMN branch_id UUID REFERENCES public.branches(id),
  ADD COLUMN artist_id UUID REFERENCES public.artists(id),
  ADD COLUMN branch_name TEXT;
