

## Fix: Hoa hồng chỉ cộng khi đơn "Hoàn thành", tính 10% giá trị đơn

### Vấn đề hiện tại

1. `process-referral-reward` được gọi ở **3 nơi**: `markPaid`, `markCompleted`, và sau khi update giá. Điều này gây nhầm lẫn và có thể cộng thưởng sớm khi chưa có giá.
2. `referral_rewards` có `ON CONFLICT (referred_id) DO NOTHING` - nếu thưởng đã được tạo ở `markPaid` (với giá 0 → fallback 300K), thì khi `markCompleted` gọi lại sẽ bị skip, không cập nhật theo giá thực.

### Giải pháp

**`src/pages/Ketoan.tsx`**:
- Xóa gọi `process-referral-reward` khỏi `markPaid` và khỏi hàm update giá
- Chỉ giữ lại ở `markCompleted`

**`add_referral_reward` DB function** (migration):
- Đổi `ON CONFLICT (referred_id) DO NOTHING` thành `ON CONFLICT (referred_id) DO UPDATE SET amount_vnd = _amount` để khi gọi lại với giá mới, số tiền thưởng được cập nhật đúng
- Đồng thời cập nhật wallet balance (trừ số cũ, cộng số mới)

**`supabase/functions/process-referral-reward/index.ts`**:
- Không thay đổi logic (đã tính 10% đúng)

### Files thay đổi
- `src/pages/Ketoan.tsx` - xóa 2 chỗ gọi process-referral-reward (giữ lại markCompleted)
- Migration SQL - update `add_referral_reward` function với upsert logic

