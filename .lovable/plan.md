

## Fix lỗi link referral (giới thiệu) - không nhận hoa hồng

### Phân tích vấn đề

Có 2 lỗi chính trong luồng referral:

**1. `sendBeacon` fallback không gửi `referral_code`**
Trong `Success.tsx`, khi user đóng tab trước khi booking được insert, hàm `handleBeforeUnload` sử dụng `sendBeacon` nhưng payload **không bao gồm** `referral_code`. Dẫn đến booking được tạo mà không có mã giới thiệu.

**2. `ReferralRedirect` không redirect đến trang đặt lịch**
Trong `App.tsx`, khi user truy cập `/r/:code` hoặc `/inv/:code`, code lưu ref vào localStorage rồi redirect về trang chủ `/`. User phải tự navigate đến `/dat-lich`. Tuy nhiên, vấn đề chính là nếu user đã đăng nhập và có `referred_by_user_id` trong profile, thì Path 1 trong edge function sẽ tìm thấy referrer. Nhưng nếu user là guest hoặc user mới không đăng ký qua ref link, thì chỉ dựa vào `referral_code` trong booking (Path 2). Luồng này hoạt động đúng nếu `referral_code` được lưu vào booking.

**3. Vấn đề thực tế**: Nhìn vào dữ liệu booking trong network requests, tất cả booking đều có `referral_code: null`. Điều này cho thấy `localStorage.getItem("ref_code")` trả về null tại thời điểm insert. Nguyên nhân có thể là:
- `ref_code` bị xóa trước khi insert
- Hoặc `sendBeacon` path không gửi ref_code (đã xác nhận ở trên)

### Thay đổi

**`src/pages/Success.tsx`**:
- Thêm `referral_code: savedRefCode` vào payload của `sendBeacon` trong `handleBeforeUnload`
- Đảm bảo `ref_code` được đọc từ localStorage ngay khi component mount (lưu vào state/ref) thay vì đọc tại thời điểm insert (có thể bị race condition)

**`src/App.tsx`**:
- Không thay đổi redirect target (giữ `/` vì đây là landing page tự nhiên cho ref link)

