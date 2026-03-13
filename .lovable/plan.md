

## Cập nhật tất cả Edge Functions dùng email Resend sang domain `notify.thuanlam.id.vn`

Domain `notify.thuanlam.id.vn` đã được thêm trên Resend. Cần cập nhật 5 edge functions đang dùng `onboarding@resend.dev` sang địa chỉ chuyên nghiệp.

### Thay đổi

Cập nhật địa chỉ `from` trong **5 files**:

| File | Cũ | Mới |
|------|-----|-----|
| `send-change-payment-email/index.ts` | `onboarding@resend.dev` | `no-reply@notify.thuanlam.id.vn` |
| `send-price-update-email/index.ts` | `onboarding@resend.dev` | `no-reply@notify.thuanlam.id.vn` |
| `send-booking-email/index.ts` | `onboarding@resend.dev` | `no-reply@notify.thuanlam.id.vn` |
| `create-booking/index.ts` | `onboarding@resend.dev` | `no-reply@notify.thuanlam.id.vn` |
| `send-withdrawal-email/index.ts` | `onboarding@resend.dev` | `no-reply@notify.thuanlam.id.vn` |

Tên hiển thị giữ nguyên `ROWENA Tattoo` (hoặc `Rowena Tattoo` tùy file gốc).

Sau khi cập nhật code, deploy lại tất cả 5 functions.

