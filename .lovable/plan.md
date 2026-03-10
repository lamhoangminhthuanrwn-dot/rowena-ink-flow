

## Fix referral không cộng hoa hồng

### Nguyên nhân gốc

Có **3 vấn đề** khiến hoa hồng không được cộng:

1. **`referral_code` luôn null trên tất cả bookings**: Fix trước đó (lưu `ref_code` từ localStorage vào `savedRefCode` ref) đã đúng nhưng chưa được test với booking thực. Cần xác nhận code hiện tại đã đúng.

2. **`total_price` luôn null**: Edge function `process-referral-reward` yêu cầu `total_price > 0` để tính 10% hoa hồng. Nhưng nhiều booking có `total_price = null` vì giá chỉ được admin cập nhật sau. Khi admin nhấn "Xác nhận thanh toán" (`markPaid`), `total_price` vẫn null → function return sớm, không cộng thưởng.

3. **Timing sai**: `process-referral-reward` chỉ được gọi 1 lần duy nhất tại `markPaid`. Nếu admin cập nhật giá SAU khi đã mark paid, sẽ không có cơ hội gọi lại.

### Giải pháp

**`supabase/functions/process-referral-reward/index.ts`**:
- Khi `total_price` null/0, dùng giá trị mặc định (ví dụ 300,000 VNĐ như hoa hồng cố định cũ) thay vì return sớm. Hoặc tốt hơn: bỏ yêu cầu `total_price > 0`, quay lại thưởng cố định 300K khi không có giá.

**`src/pages/Ketoan.tsx`**:
- Thêm gọi `process-referral-reward` khi admin cập nhật giá (`admin_update_booking_price`) nếu booking đã paid, để xử lý trường hợp giá được set sau.
- Thêm gọi `process-referral-reward` khi `markCompleted` (đánh dấu hoàn thành) như fallback.

### Chi tiết kỹ thuật

**Edge function**: Thay đổi logic xử lý khi `total_price` null:
```
// Trước: return sớm nếu total_price <= 0
// Sau: fallback sang 300K nếu total_price null/0
const bookingAmount = booking.total_price || 0;
const rewardAmount = bookingAmount > 0 
  ? Math.floor(bookingAmount * 10 / 100) 
  : 300000; // fallback cố định
```

Hoặc đơn giản hơn: bỏ check `bookingAmount <= 0`, truyền thẳng `_booking_amount` vào RPC và để RPC xử lý (dùng default 300K nếu amount = 0).

**Ketoan.tsx**: 
- Trong `markCompleted`: thêm `supabase.functions.invoke("process-referral-reward", { body: { booking_id: id } })` 
- Trong hàm submit price update: thêm trigger tương tự nếu booking đã paid

### Thay đổi files
- `supabase/functions/process-referral-reward/index.ts` - bỏ early return khi total_price null, dùng fallback
- `src/pages/Ketoan.tsx` - gọi process-referral-reward thêm ở markCompleted và sau update price

