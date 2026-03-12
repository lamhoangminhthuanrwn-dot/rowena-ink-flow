

## Plan: Chuyển insert booking sang Edge Function

### Vấn đề
Booking insert nằm ở client (Success.tsx) — dễ giả mạo dữ liệu, mất đơn nếu browser crash, có thể bỏ qua hoàn toàn.

### Giải pháp
1. **Tạo Edge Function `create-booking`** — nhận dữ liệu booking, validate, insert vào DB, gửi email notification
2. **Sửa `Booking.tsx`** — gọi Edge Function ngay khi user bấm "Đặt lịch", nhận lại `booking_code` từ server
3. **Sửa `Success.tsx`** — chỉ hiển thị kết quả, không insert nữa. Tra cứu booking từ DB bằng `booking_code` (truyền qua URL param thay vì state)

### Chi tiết kỹ thuật

#### 1. Edge Function `supabase/functions/create-booking/index.ts`
- Nhận body: customer_name, phone, email, design_name, placement, size, style, preferred_date, preferred_time, note, reference_images, branch_id, artist_id, total_price, referral_code
- Xác thực Authorization header (optional — cho phép cả anon lẫn authenticated)
- Server tạo `booking_code` (không để client tạo)
- Insert vào `bookings` table bằng service role
- Gọi send-booking-email inline (hoặc invoke)
- Return `{ booking_code, booking_id }`

#### 2. Cập nhật `supabase/config.toml`
```toml
[functions.create-booking]
verify_jwt = false
```

#### 3. Sửa `Booking.tsx` handleSubmit
- Thay vì navigate với state, gọi `supabase.functions.invoke("create-booking", { body })` 
- Nhận `booking_code` từ response
- Navigate tới `/success?code=BOOKING_CODE`

#### 4. Sửa `Success.tsx`
- Đọc `booking_code` từ URL search params
- Query `bookings` table bằng `booking_code` để lấy thông tin hiển thị
- Xoá toàn bộ logic insert
- Giữ nguyên DepositSection, ReferralBanner, BookingSummary

#### 5. Sửa `send-booking-email/index.ts`
- Bỏ validation booking_code tồn tại trong DB (vì sẽ được gọi ngay sau insert trong cùng Edge Function, hoặc gọi nội bộ)

### Lưu ý bảo mật
- Edge Function dùng service role để insert → bypass RLS
- Validate tất cả input server-side (length, format)
- Booking code sinh server-side, không tin client
- Giữ RLS policies hiện tại cho bookings table (anon insert vẫn hoạt động song song trong thời gian chuyển đổi nếu cần)

### Tổng kết
- **1 file mới**: `supabase/functions/create-booking/index.ts`
- **1 file config sửa**: `supabase/config.toml`
- **2 file sửa**: `Booking.tsx`, `Success.tsx`
- Logic an toàn hơn, booking không bị mất, không giả mạo được

