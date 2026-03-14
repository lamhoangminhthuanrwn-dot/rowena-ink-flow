

## Đổi domain gửi email từ `notify.thuanlam.id.vn` → `thuanlam.id.vn`

Cập nhật tất cả Edge Functions để dùng `no-reply@thuanlam.id.vn` thay vì `no-reply@notify.thuanlam.id.vn`.

### Files cần sửa (6 files)

| File | Thay đổi |
|------|----------|
| `send-booking-email/index.ts` | `PRIMARY_FROM` → `no-reply@thuanlam.id.vn` |
| `send-price-update-email/index.ts` | `PRIMARY_FROM` → `no-reply@thuanlam.id.vn` |
| `send-withdrawal-email/index.ts` | `PRIMARY_FROM` → `no-reply@thuanlam.id.vn` |
| `send-change-payment-email/index.ts` | `resendFrom` → `no-reply@thuanlam.id.vn` |
| `create-booking/index.ts` | `from` → `no-reply@thuanlam.id.vn` |
| `auth-email-hook/index.ts` | `SENDER_DOMAIN` và `FROM_DOMAIN` → `thuanlam.id.vn` |

Sau đó deploy lại tất cả 6 functions.

### Lưu ý
Domain `thuanlam.id.vn` cần được thêm và verify trên Resend (DNS records: MX, SPF, DKIM) để email gửi thành công. Nếu chưa verify, hệ thống fallback sẽ hoạt động bình thường.

