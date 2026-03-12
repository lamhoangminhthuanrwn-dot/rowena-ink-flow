

## Plan: Thêm validation đầu vào cho Booking

### Thay đổi

#### 1. Tạo schema validation với Zod — `src/lib/bookingValidation.ts`
- **Phone**: regex `^0\d{9,10}$` (số VN)
- **Email**: `z.string().email()` (optional, validate nếu có nhập)
- **File**: max 5MB/file, max 5 files, chỉ chấp nhận image/*
- **Date**: không cho chọn ngày quá khứ (bổ sung validation ngoài `min` attribute)
- Export helper `validateInfoStep()`, `validateScheduleStep()`

#### 2. Sửa `src/pages/Booking.tsx`
- Import validation schema
- Thêm state `errors: Record<string, string>` để hiển thị lỗi inline dưới mỗi field
- `canNext()` gọi Zod `.safeParse()` thay vì check rỗng
- `handleFileChange()` — check file size (max 5MB) và type (image only), toast lỗi nếu không hợp lệ, giới hạn tổng 5 files
- Hiển thị error message màu đỏ dưới mỗi input khi validation fail

#### 3. Bổ sung validation trong Edge Function `create-booking`
- Thêm regex check phone server-side: `^0\d{9,10}$`
- Thêm email format check nếu có giá trị
- Return lỗi cụ thể (field nào sai) thay vì generic "missing fields"

### Tóm tắt
- **1 file mới**: `src/lib/bookingValidation.ts`
- **2 file sửa**: `Booking.tsx`, `create-booking/index.ts`
- Validation cả client-side (UX) lẫn server-side (security)

