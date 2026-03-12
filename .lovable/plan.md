

## Vấn đề phát hiện

### 1. Trang Success không hiển thị thông tin booking
**Nguyên nhân**: RLS trên bảng `bookings` chỉ cho phép SELECT khi `auth.uid() = user_id` hoặc user là admin. Khi khách đặt lịch không đăng nhập (hoặc `user_id` bị null do lỗi auth), trang Success query trực tiếp từ client sẽ bị RLS chặn, trả về null.

Thêm vào đó, edge function `create-booking` dùng `anonClient.auth.getClaims()` - method này không tồn tại trong supabase-js v2, dẫn đến `user_id` luôn bị null ngay cả khi user đã đăng nhập.

### 2. Không nhận hoa hồng từ link giới thiệu
**Nguyên nhân**: Do `user_id` trên booking bị null (lỗi `getClaims` ở trên), khi admin gọi `process-referral-reward`, field `referred_id` fallback thành `booking.id` (UUID của booking) thay vì user thật. Điều này khiến logic reward bị sai.

## Kế hoạch sửa

### A. Fix edge function `create-booking` - sửa lỗi auth
- Thay `anonClient.auth.getClaims(token)` bằng `anonClient.auth.getUser()` để lấy đúng `user_id` từ JWT token
- Đây là fix quan trọng nhất, giải quyết cả 2 vấn đề gốc

### B. Fix trang Success - thêm RLS policy cho booking_code lookup
- Thêm RLS policy mới cho phép SELECT booking theo `booking_code` (cho phép anon đọc booking bằng mã code)
- Policy: `SELECT` cho role `anon` và `authenticated` với điều kiện `true` (vì booking_code đã là secret đủ mạnh - 8 ký tự ngẫu nhiên)
- Hoặc tốt hơn: tạo edge function `get-booking` để fetch booking bằng service role, tránh expose RLS quá rộng

**Phương án chọn**: Tạo edge function `get-booking` vì an toàn hơn - chỉ trả về các field cần thiết cho trang Success, không cần mở RLS rộng.

### C. Cập nhật Success.tsx
- Gọi edge function `get-booking` thay vì query trực tiếp từ client
- Truyền `booking_code` qua body request

### Tóm tắt thay đổi
1. **`supabase/functions/create-booking/index.ts`**: Sửa `getClaims()` → `getUser()`
2. **`supabase/functions/get-booking/index.ts`**: Tạo mới - fetch booking bằng service role theo booking_code
3. **`src/pages/Success.tsx`**: Gọi edge function thay vì query trực tiếp
4. **`supabase/config.toml`**: Thêm config cho function `get-booking` với `verify_jwt = false`

