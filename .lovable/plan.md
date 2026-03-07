

## Plan: Thưởng giới thiệu 10% giá trị đơn đặt thay vì cố định 300.000đ

### Thay đổi cần thiết

**1. Thêm cột `total_price` vào bảng `bookings`** (migration)
- Cột `total_price integer nullable` để lưu giá trị đơn hàng

**2. Cập nhật `BookingState` và lưu giá vào booking** (`src/pages/Success.tsx`)
- Thêm `selectedPrice` vào `BookingState` interface
- Lưu `selectedPrice` vào cột `total_price` khi insert booking

**3. Cập nhật `Booking.tsx`** — đảm bảo `selectedPrice` được truyền sang Success page (đã có sẵn)

**4. Cập nhật DB function `add_referral_reward`** (migration)
- Thêm param `_booking_amount integer`
- Tính reward = `_booking_amount * 10 / 100` thay vì cố định 300.000đ
- Cập nhật insert vào `referral_rewards` và `wallet`/`wallet_transactions` với số tiền động

**5. Cập nhật edge function `process-referral-reward`**
- Đọc `total_price` từ booking
- Truyền `_booking_amount` vào RPC `add_referral_reward`
- Trả về reward amount thực tế thay vì hardcode 300.000

**6. Cập nhật hiển thị** (`src/pages/Account.tsx`)
- Nếu có hiển thị "300.000đ" cố định ở đâu → thay bằng giá trị thực từ DB

### Flow mới
```
Booking có total_price = 5.000.000đ
→ Admin duyệt đặt cọc
→ process-referral-reward gọi add_referral_reward với amount = 5.000.000
→ DB function tính 10% = 500.000đ
→ Cộng 500.000đ vào ví người giới thiệu
```

