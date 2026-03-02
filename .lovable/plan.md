

## Đổi giá "tr" thành VND và thêm bước chọn option trước khi đặt lịch

### 1. Cập nhật dữ liệu giá (`src/data/tattooDesigns.ts`)

**Chuyển tất cả giá từ string "tr" sang số VND thực:**
- `TattooVariant` sẽ lưu giá dạng number: `priceSimple: number`, `priceSameDay?: number`, `priceDifficult: number`
- Thêm field `sessionsCount` (số buổi/giờ dạng string) và `priceDifficultSessions?: string` (ví dụ "3 buổi" cho "10tr/3 buổi")
- Bảng quy đổi: `1tr = 1,000,000`, `6tr6 = 6,600,000`, `3tr5 = 3,500,000`, v.v.
- `priceText` sẽ dùng `formatVND` thay vì string thủ công
- Thêm helper `formatVNDShort(amount)` hiển thị gọn: `6.600.000đ`

**Cập nhật giá cho mini:**
- Mini trắng đen: đơn giản 1tr (2 giờ), khó 1tr5 (3 giờ)
- Mini màu: đơn giản 1tr5 (3 giờ), khó 2tr (4 giờ)
- A5 trắng đen: 1tr5 (3 giờ), khó 2tr (4 giờ)
- A5 màu: 2tr (4 giờ), khó 3tr (6 giờ)
- A4 trắng đen: 2tr (4 giờ), khó 3tr (6 giờ)
- A4 màu: 3tr5 (6 giờ), khó 3tr5 (1 buổi)

### 2. Thêm bước chọn option vào Booking (`src/pages/Booking.tsx`)

**Thay đổi flow từ 3 bước thành 4 bước:**

```text
Bước 1: Chọn mẫu xăm (giữ nguyên)
Bước 2: Chọn option (MỚI) — chỉ hiển thị nếu design có variants
  → Chọn vị trí: Trắng đen / Màu
  → Chọn thể loại: Á nét, Á tổ, Âu, Nhạt, Linework
  → Chọn tiến độ: Đơn giản (nhiều buổi) / Xong trong ngày
  → Chọn thanh toán: Trả hết / Trả theo buổi
  → Hiển thị giá tính được ở cuối
Bước 3: Thông tin cá nhân (giữ nguyên)
Bước 4: Lịch hẹn (giữ nguyên)
```

**Logic chọn option:**
- Sau khi chọn vị trí → lọc variants theo position → hiển thị style options
- Sau khi chọn style → xác định variant cụ thể
- Chọn "Đơn giản" → giá = `priceSimple`, số buổi = `sessionsCount`
- Chọn "Xong trong ngày" → giá = `priceSameDay` (nếu có)
- Chọn "Trả hết" → hiển thị tổng giá
- Chọn "Trả theo buổi" → hiển thị giá/buổi (tổng ÷ số buổi)
- Với "Hình khó" → sẽ hiển thị thêm giá tham khảo bên cạnh

**Nếu design không có variants** (Cover, Che sẹo, Theo yêu cầu) → bỏ qua bước 2, đi thẳng sang thông tin.

**Với mini** (không có style á nét/á tổ): flow là Chọn kích thước (Mini/A5/A4) → Trắng đen/Màu → Hình đơn giản/Hình khó.

### 3. Cập nhật hiển thị giá

- **CatalogCard**: hiển thị khoảng giá VND (ví dụ "6.600.000đ – 10.000.000đ")
- **ProductDetail bảng giá**: đổi từ string "6tr6" thành "6.600.000đ"
- **Booking summary (bước 4)**: hiển thị giá đã chọn cụ thể thay vì khoảng giá

### 4. Truyền option đã chọn vào Success page

Thêm các field vào `navigate("/success", { state: { ... } })`:
- `selectedPosition`, `selectedStyle`, `selectedScheduleType` (đơn giản/trong ngày)
- `selectedPaymentType` (trả hết/theo buổi)
- `selectedPrice` (giá cuối cùng)

