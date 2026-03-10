

## Chuyển logic referral: chỉ thưởng 1 lần cho người gửi link trực tiếp

### Thay đổi logic

Hiện tại hệ thống dùng mô hình Shopee (last-click wins) - mỗi booking có thể cộng hoa hồng cho bất kỳ ai gửi link ref. Cần chuyển sang mô hình đơn giản hơn:

- **Chỉ dùng `booking.referral_code`** để xác định người giới thiệu
- **Mỗi referrer chỉ được thưởng 1 lần duy nhất cho 1 booking** (đã có sẵn qua `referred_id` unique constraint)
- **Bỏ fallback Path 2** (không dùng `profile.referred_by_user_id` nữa) - ai gửi link trực tiếp thì chỉ người đó được thưởng

### File thay đổi

**`supabase/functions/process-referral-reward/index.ts`**:
- Giữ Path 1: lookup `booking.referral_code` → tìm referrer
- Xóa Path 2 (fallback qua `profile.referred_by_user_id`)
- Cập nhật comment cho rõ ràng

