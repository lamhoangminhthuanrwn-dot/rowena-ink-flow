

## Sửa tất cả Edge Functions xử lý email để không block user flow khi Resend chưa sẵn sàng

### Vấn đề gốc
Domain `notify.thuanlam.id.vn` chưa verified trên Resend. Fallback `onboarding@resend.dev` cũng fail vì Resend đang ở test mode (chỉ gửi tới `lamhoangminhthuan@gmail.com`).

### Giải pháp

**1. `send-change-payment-email/index.ts`** — Sửa logic fallback:
- Khi cả primary và fallback đều fail, luôn trả `200 OK` với `confirm_url` thay vì lỗi 400
- User vẫn có thể copy link xác nhận trực tiếp

**2. `create-booking/index.ts`** — Email đã là fire-and-forget (không block), không cần sửa

**3. `send-booking-email/index.ts`**, **`send-price-update-email/index.ts`**, **`send-withdrawal-email/index.ts`** — Thêm fallback tương tự:
- Thử gửi từ `notify.thuanlam.id.vn` trước
- Nếu fail (403), thử `onboarding@resend.dev`
- Nếu vẫn fail, log warning và trả `{ success: true, email_sent: false }` thay vì lỗi 500

### Hành động cần từ bạn
- Vào Resend dashboard → Domains → `notify.thuanlam.id.vn` → kiểm tra DNS records đã đúng chưa → nhấn Verify
- Sau khi domain verified, tất cả functions sẽ tự động gửi email bình thường

