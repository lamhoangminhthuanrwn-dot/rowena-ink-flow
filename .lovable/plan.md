

## Plan: Đổi thứ tự bước — Chọn chi nhánh & giờ xăm ngay sau tùy chọn

### Thay đổi
Hiện tại: Chọn mẫu → Tùy chọn → **Thông tin** → **Lịch hẹn**
Mới: Chọn mẫu → Tùy chọn → **Lịch hẹn** → **Thông tin**

### File: `src/pages/Booking.tsx`

1. **Đổi stepLabels**: Swap "Thông tin" và "Lịch hẹn"
   - Có variants: `["Chọn mẫu", "Tùy chọn", "Lịch hẹn", "Thông tin"]`
   - Không variants: `["Chọn mẫu", "Lịch hẹn", "Thông tin"]`

2. **Đổi getContentStep mapping**: Swap thứ tự `"info"` và `"schedule"`
   - Không variants: `0=design, 1=schedule, 2=info`
   - Có variants: `0=design, 1=options, 2=schedule, 3=info`

3. **Đổi canNext validation**: Đảm bảo `"schedule"` check branch/date/time vẫn đúng, `"info"` check name/phone vẫn đúng — không cần thay đổi logic, chỉ thứ tự render đã đổi.

Không thay đổi UI hay logic nội bộ của từng bước, chỉ swap thứ tự hiển thị.

