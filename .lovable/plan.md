

## Plan: Ẩn dòng giới thiệu & Ref link hoạt động khi đặt lịch không đăng ký

### Vấn đề hiện tại
1. Trang Auth hiển thị "Bạn được giới thiệu bởi {code}" — cần ẩn
2. Link giới thiệu (`/inv/{code}`, `/r/{code}`) chỉ redirect về `/auth?ref=...` → chỉ hoạt động khi đăng ký tài khoản. Nếu user đặt lịch trực tiếp (không đăng ký), mã giới thiệu bị mất

### Giải pháp

**1. Ẩn banner giới thiệu** (`src/pages/Auth.tsx`)
- Xóa block hiển thị "Bạn được giới thiệu bởi..." (dòng 72-76)

**2. Lưu ref code vào localStorage** (`src/App.tsx`)
- `ReferralRedirect` lưu mã ref vào `localStorage` key `ref_code` trước khi redirect
- Redirect về trang chủ `/` thay vì `/auth` để user có thể đặt lịch hoặc đăng ký tùy ý

**3. Đọc ref code từ localStorage khi đặt lịch** (`src/pages/Booking.tsx` / `src/pages/Success.tsx`)
- Khi tạo booking trong `Success.tsx`, đọc `localStorage.getItem("ref_code")` và gửi kèm vào booking

**4. Thêm cột `referral_code` vào bảng `bookings`** (migration)
- Cột nullable kiểu text để lưu mã giới thiệu cho cả user đã đăng ký và chưa đăng ký

**5. Cập nhật `process-referral-reward`** (`supabase/functions/process-referral-reward/index.ts`)
- Ngoài việc check `profile.referred_by_user_id`, cũng check `booking.referral_code`
- Tra cứu referrer qua `profiles.referral_code` để tìm `referred_by_user_id`
- Xử lý reward cho cả trường hợp user không đăng ký

**6. Auth.tsx vẫn đọc ref từ localStorage** 
- Khi signup, đọc `localStorage.getItem("ref_code")` thay vì chỉ từ URL param, để ref code không bị mất nếu user browse qua các trang khác trước khi đăng ký

### Flow mới
```text
User click link /inv/{code}
  → localStorage lưu ref_code
  → Redirect về /
  → User có thể:
     A) Đăng ký → ref_code từ localStorage đính vào signup metadata
     B) Đặt lịch → ref_code từ localStorage đính vào booking record
```

