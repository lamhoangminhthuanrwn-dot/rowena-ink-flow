

## Thông báo email cho khách hàng khi giá đơn hàng được cập nhật

### Thay đổi

1. **Tạo Edge Function `send-price-update-email`** (`supabase/functions/send-price-update-email/index.ts`)
   - Nhận `booking_code`, `customer_name`, `customer_email`, `old_price`, `new_price`
   - Xác thực Bearer token (admin only)
   - Gửi email qua Resend đến `customer_email` thông báo giá mới
   - Template HTML tiếng Việt với bảng so sánh giá cũ → giá mới
   - Chỉ gửi nếu `customer_email` tồn tại

2. **Cập nhật `src/pages/Ketoan.tsx`**
   - Sau khi `savePrice` thành công, gọi Edge Function `send-price-update-email` với thông tin booking
   - Lấy `customer_email` từ booking hiện tại, nếu không có email thì bỏ qua (không báo lỗi)

### Chi tiết kỹ thuật

- Edge Function sử dụng `RESEND_API_KEY` đã có sẵn
- Gửi từ `ROWENA Tattoo <onboarding@resend.dev>` (giống pattern hiện tại)
- Sanitize tất cả input trước khi render HTML
- Gọi email là fire-and-forget: nếu gửi lỗi chỉ log warning, không block flow chính

