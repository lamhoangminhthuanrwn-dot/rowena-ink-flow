

## Plan: Kiểm tra lịch thợ xăm trước khi gán

### Vấn đề
Hiện tại artist được gán ngẫu nhiên từ danh sách thợ của chi nhánh mà không kiểm tra xem thợ đó đã có booking vào cùng ngày/giờ chưa. Điều này có thể dẫn đến trùng slot.

### Giải pháp
Chuyển logic chọn artist sang server-side (edge function `create-booking`) — nơi có service role để query chính xác.

### Thay đổi

**1. Sửa `supabase/functions/create-booking/index.ts`**
- Nếu client gửi `branch_id` và `preferred_date` nhưng không gửi `artist_id` cụ thể:
  - Query tất cả artists active của branch đó
  - Query bookings đã tồn tại cùng `preferred_date` + `preferred_time` để lấy danh sách artist_id đã bận
  - Lọc ra artists còn trống, chọn ngẫu nhiên từ danh sách đó
  - Nếu tất cả đều bận, vẫn gán ngẫu nhiên (fallback) nhưng ghi log cảnh báo

**2. Sửa `src/pages/Booking.tsx`**
- Bỏ logic chọn random artist ở client (dòng 135-138)
- Gửi `branch_id` cho edge function, không gửi `artist_id` nữa (để server tự chọn)

### Tóm tắt
- **2 file sửa**: `create-booking/index.ts`, `Booking.tsx`
- Artist assignment chuyển hoàn toàn sang server, có kiểm tra slot trống trước khi gán

