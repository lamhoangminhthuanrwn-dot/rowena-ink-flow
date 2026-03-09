

## Thêm email thông báo admin khi giá đơn hàng thay đổi

### Thay đổi

1. **Tạo Edge Function `send-price-update-email`** (`supabase/functions/send-price-update-email/index.ts`)
   - Theo pattern giống `send-withdrawal-email` và `send-booking-email`
   - Nhận: `booking_code`, `customer_name`, `old_price`, `new_price`
   - Gửi email đến `lamhoangminhthuan@gmail.com` qua Resend với nội dung: mã booking, tên khách, giá cũ → giá mới, thời gian thay đổi
   - Yêu cầu Authorization Bearer token
   - Sanitize tất cả input

2. **Cập nhật `supabase/config.toml`** — thêm `[functions.send-price-update-email]` với `verify_jwt = false`

3. **Cập nhật `src/pages/Ketoan.tsx`** — trong hàm `savePrice`, sau khi RPC thành công, gọi Edge Function `send-price-update-email` với thông tin booking (lấy từ danh sách bookings hiện có trong state). Không block UI nếu email thất bại.

