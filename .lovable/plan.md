

## Plan: Tùy chỉnh tiến độ cho Xăm full ngực hoặc full bụng

### Yêu cầu
- **Trắng đen**: Ẩn bước chọn tiến độ, hiển thị giá 3.500.000đ ngay khi chọn thể loại
- **Màu**: Ẩn tùy chọn "Xong trong ngày", chỉ còn "Trả hết 1 lần" và "Trả theo buổi"

### Changes

#### 1. `src/data/tattooDesigns.ts` — Thay đổi data design "4"

Không dùng `makeFullBodyVariants` cho design "4" nữa. Định nghĩa variants thủ công:

- **Trắng đen** (5 styles): Chỉ có 1 scheduleOption duy nhất ("Trả hết 1 lần", 3.500.000đ, 1 buổi) → component sẽ tự động chọn
- **Màu** (5 styles): Đặt `sameDayPrice: 0` → "Xong trong ngày" bị ẩn (logic filter đã có), còn lại 2 options: "Trả hết 1 lần" (5.200.000đ) và "Trả theo buổi" (3.500.000đ/buổi)

#### 2. `src/components/BookingOptionStep.tsx` — Auto-select khi chỉ có 1 schedule option

Thêm `useEffect`: khi `selectedVariant` có `scheduleOptions` với đúng 1 entry, tự động set `selectedScheduleIdx = 0` và ẩn bước chọn tiến độ trong UI (thêm điều kiện `scheduleOptions.length > 1` để render phần tiến độ).

```text
Flow hiện tại (BW):
  Chọn thể loại → Chọn tiến độ (3 options) → Hiện giá

Flow mới (BW):  
  Chọn thể loại → Hiện giá ngay (3.500.000đ)

Flow mới (Màu):
  Chọn thể loại → Chọn tiến độ (2 options: Trả hết / Trả theo buổi) → Hiện giá
```

