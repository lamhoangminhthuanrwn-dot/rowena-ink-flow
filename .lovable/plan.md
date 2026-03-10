

## Chuyển sang mô hình Affiliate kiểu Shopee (Last-click wins)

### Vấn đề hiện tại

Trong `process-referral-reward`, logic tìm người giới thiệu ưu tiên **Path 1** (profile's `referred_by_user_id`) trước **Path 2** (booking's `referral_code`). Điều này có nghĩa:

- Nếu user A giới thiệu user B đăng ký → `referred_by_user_id` = A (cố định mãi mãi)
- Sau đó user C gửi link ref cho B, B click vào và đặt lịch → `referral_code` trên booking = C
- Nhưng hệ thống vẫn cộng hoa hồng cho A (vì Path 1 ưu tiên hơn)

**Mô hình Shopee**: Chỉ quan tâm link ref gần nhất được click → hoa hồng thuộc về người sở hữu link đó, bất kể ai giới thiệu đăng ký.

### Giải pháp

**`supabase/functions/process-referral-reward/index.ts`**:
- Đảo ngược thứ tự ưu tiên: **Path 2 trước** (booking's `referral_code` - last click) → **Path 1 sau** (profile's `referred_by_user_id` - chỉ dùng làm fallback nếu booking không có ref code)
- Đây là thay đổi duy nhất cần thiết

### Chi tiết

```typescript
// TRƯỚC (ưu tiên profile - first referrer wins):
// Path 1: Check profile's referred_by_user_id
// Path 2: Check booking's referral_code (chỉ khi Path 1 không có)

// SAU (ưu tiên booking - last click wins):
// Path 1: Check booking's referral_code (last click)
// Path 2: Fallback check profile's referred_by_user_id
```

### Files thay đổi
- `supabase/functions/process-referral-reward/index.ts` - đảo thứ tự ưu tiên Path 1 ↔ Path 2

