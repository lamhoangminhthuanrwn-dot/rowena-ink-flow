

## Plan

### 1. Create `artists` and `branches` tables

**Migration SQL:**
- Create `branches` table with columns: `id`, `name`, `slug`, `address`, `created_at`
- Insert 4 branches: Rowena Gò Vấp, Rowena Hà Nội, Rowena Daklak, Rowena Malaysia
- Create `artists` table with columns: `id`, `branch_id` (FK to branches), `name`, `work_start` (default '08:00'), `work_end` (default '18:00'), `is_active`, `created_at`
- Insert 10 artists per branch (40 total) with Vietnamese names
- RLS: public SELECT on both tables (read-only for everyone), admin ALL

### 2. Add `branch_id` and `artist_id` columns to `bookings` table

**Migration SQL:**
- `ALTER TABLE bookings ADD COLUMN branch_id uuid REFERENCES branches(id)`
- `ALTER TABLE bookings ADD COLUMN artist_id uuid REFERENCES artists(id)`
- `ALTER TABLE bookings ADD COLUMN branch_name text`

### 3. Update Booking page to include branch selection

**File: `src/pages/Booking.tsx`**
- Fetch branches from DB on mount
- Add branch selection UI in step 2 (Thông tin) or as a new field in step 3 (Lịch hẹn) — add a dropdown/select for branch
- On submit, randomly pick an active artist from the selected branch
- Pass `branch_id`, `branch_name`, and `artist_id` to the Success page state

### 4. Update Success page to show branch and artist info

**File: `src/pages/Success.tsx`**
- Add `branchName` and `artistName` to `BookingState` interface
- Display branch and artist name in the booking summary
- Include `branch_id` and `artist_id` in the booking insert

### 5. Add post-registration email notice

**File: `src/pages/Auth.tsx`**
- After successful signup (line 52), replace the simple `toast.success` with a more detailed message or show a persistent banner/alert:
  - "Đăng ký thành công! Vui lòng kiểm tra hộp thư đến để xác nhận email. Nếu không thấy, hãy kiểm tra thư mục Spam."

