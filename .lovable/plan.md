## Thêm bảng giá chi tiết (nhánh) vào từng mẫu xăm

### Tổng quan

Dựa trên file CSV, mỗi mẫu xăm chính có nhiều **nhánh giá** phân theo: vị trí (trắng đen / màu), thể loại (đá nét, Đá tả, Âu, nhạt, linework), và mức giá theo độ khó (đơn giản, trả hết, trong ngày, hình khó).

### Dữ liệu từ CSV

| Mẫu xăm        | Vị trí        | Thể loại | Đơn giản | Trả hết  | Trong ngày | Hình khó     |
| -------------- | ------------- | -------- | -------- | -------- | ---------- | ------------ |
| Full tay       | Trắng đen     | 5 loại   | 2 buổi   | 6tr6     | 7tr5       | 10tr/3 buổi  |
| Full tay       | Màu           | 5 loại   | 2 buổi   | 7tr      | 7tr5       | 10tr/3 buổi  |
| Full chân      | Trắng đen     | 5 loại   | 3 buổi   | 9tr9     | 11tr5      | 13tr2/4 buổi |
| Full chân      | Màu           | 5 loại   | 4 buổi   | 13tr5    | 7tr\*2     | 18tr/6 buổi  |
| Full lưng      | Trắng đen     | 5 loại   | 2 buổi   | 7tr      | 7tr5       | 10tr5/3 buổi |
| Full lưng      | Màu           | 5 loại   | 4 buổi   | 13tr2    | 7tr5\*2    | 18tr/6 buổi  |
| Full ngực/bụng | Trắng đen     | 5 loại   | 1 buổi   | 3tr5     | 5tr5/1.5   | 7tr/2 buổi   |
| Full ngực/bụng | Màu           | 5 loại   | 1.5 buổi | 5tr2     | 5tr5/1.5   | 7tr/2 buổi   |
| Mini (<10cm)   | Trắng đen/Màu | —        | 2-3 giờ  | 1tr-1tr5 | —          | 1tr5-2tr     |
| A5             | Trắng đen/Màu | —        | 3-4 giờ  | 1tr5-2tr | —          | 2tr-3tr      |
| A4             | Trắng đen/Màu | —        | 4-6 giờ  | 2tr-3tr5 | —          | 3tr-3tr5     |

### Kế hoạch thực hiện

**1. Cập nhật `TattooDesign` interface (`src/data/tattooDesigns.ts`)**

- Thêm interface `TattooVariant` với các trường: `position` (vị trí), `style` (thể loại), `sessions` (số buổi), và các mức giá: `priceSimple`, `priceFull`, `priceSameDay`, `priceDifficult`
- Thêm field `variants?: TattooVariant[]` vào `TattooDesign`
- Cập nhật `priceText` của mỗi design thành khoảng giá tổng quan (ví dụ "3tr5 – 18tr")
- Thêm dữ liệu variants cho từng mẫu xăm theo CSV

**2. Cập nhật CatalogCard (`src/components/CatalogCard.tsx`)**

- Hiển thị khoảng giá tổng quan trên card (thay vì giá cố định 12tr)
- Không thay đổi layout card, chỉ cập nhật giá hiển thị

**3. Cập nhật ProductDetail (`src/pages/ProductDetail.tsx`)**

- Thêm bảng giá chi tiết bên dưới phần mô tả
- Bảng có các cột: Vị trí, Thể loại, Số buổi, Đơn giản, Trả hết, Hình khó
- Nhóm theo vị trí (trắng đen / màu), style theo hàng
- Dùng component `Table` có sẵn từ shadcn/ui
- Hiển thị ghi chú đặc biệt nếu có (ví dụ "bán thêm 4 giờ = 2tr")

### Chi tiết kỹ thuật

```text
TattooDesign
├── id, name, image, images, category, description, size, duration
├── price (giá thấp nhất để sort)
├── priceText (khoảng giá tổng quan: "3tr5 – 18tr")
└── variants?: TattooVariant[]
    ├── position: string    ("Trắng đen" | "Màu")
    ├── style: string       ("Đá nét" | "Đá tả" | "Âu" | "Nhạt" | "Linework")
    ├── sessions: string    ("2 buổi" | "3 giờ")
    ├── priceSimple: string ("6tr6" | "1tr")
    ├── priceFull?: string  ("7tr5")
    └── priceDifficult: string ("10tr/3 buổi")
```

Giá sẽ lưu dạng string vì có format đặc biệt ("7tr\*2 buổi", "10tr/3 buổi").
