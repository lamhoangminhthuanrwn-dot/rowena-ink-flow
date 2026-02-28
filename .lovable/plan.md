

## Phân tích hiện trạng

Hệ thống **đã có sẵn** hầu hết những gì bạn yêu cầu:

1. **Tài khoản admin**: Đã có trigger `auto_assign_admin` tự gán role admin cho `admin@rowena.vn`. Tài khoản này chỉ cần đăng ký tại `/auth` với email `admin@rowena.vn`.

2. **Trang quản lý đơn**: Trang `/ketoan` đã hiển thị tất cả bookings cho admin với đầy đủ thông tin (mã đơn, tên khách, SĐT, mẫu tattoo, ngày hẹn, trạng thái thanh toán).

3. **Nút xác nhận/từ chối**: Đã có nút Check (xác nhận thanh toán), nút X (từ chối), và nút "Hoàn thành".

### Thiếu sót cần bổ sung

Hiện tại `booking_status` chỉ có flow: `new` → `completed`. Chưa có nút **"Xác nhận đơn" (confirmed)** và **"Hủy đơn" (cancelled)** rõ ràng tách biệt khỏi flow thanh toán.

## Kế hoạch thực hiện

### 1. Cập nhật trang `/ketoan` — Thêm nút Xác nhận & Hủy đơn

**`src/pages/Ketoan.tsx`**:
- Thêm nút **"Xác nhận"** (set `booking_status = "confirmed"`) cho đơn có `booking_status = "new"` hoặc `"pending"`
- Thêm nút **"Hủy"** (set `booking_status = "cancelled"`) cho đơn chưa hoàn thành
- Giữ nguyên nút "Hoàn thành" cho đơn đã xác nhận & đã thanh toán
- Thêm chi tiết đơn hàng mở rộng (size, vị trí, ghi chú, ảnh tham khảo) để admin kiểm tra đầy đủ thông tin

### 2. Tạo tài khoản admin

- Hướng dẫn bạn đăng ký tài khoản với email `admin@rowena.vn` tại trang `/auth` — hệ thống sẽ tự động gán quyền admin

### Technical details

Không cần thay đổi database schema — `booking_status` đã hỗ trợ các giá trị `new`, `confirmed`, `completed`, `cancelled`. Chỉ cần cập nhật UI logic trong `Ketoan.tsx` để thêm các action buttons phù hợp với từng trạng thái.

