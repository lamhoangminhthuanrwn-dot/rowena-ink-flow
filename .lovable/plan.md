

## Cập nhật danh sách dịch vụ xăm theo bảng giá mới

### Dữ liệu từ hình

| # | Tên dịch vụ | Giá |
|---|-------------|-----|
| 1 | Xăm full lưng | 12,000,000đ |
| 2 | Xăm full tay | 12,000,000đ |
| 3 | Xăm full chân | 12,000,000đ |
| 4 | Xăm full ngực | 12,000,000đ |
| 5 | Xăm full bụng | 12,000,000đ |
| 6 | Cover hình xăm cũ | 12,000,000đ |
| 7 | Xăm hình mini & A4 | 500K - 2Tr5 (hiển thị dạng text) |
| 8 | Xăm che sẹo | 12,000,000đ |
| 9 | Xăm theo yêu cầu khác | 12,000,000đ |

### Thay đổi

1. **Cập nhật `src/data/tattooDesigns.ts`**: Thay 6 mẫu cũ bằng 9 dịch vụ mới với tên và giá từ hình. Thêm field `priceText` cho "Xăm hình mini & A4" vì giá là khoảng (500K-2Tr5). Cập nhật danh sách categories thành `["Tất cả", "Full body", "Đặc biệt", "Mini"]`.

2. **Cập nhật `formatVND` / hiển thị giá**: Hỗ trợ `priceText` optional — nếu có thì hiển thị text thay vì format số.

3. **Cập nhật `CatalogCard.tsx`**: Hiển thị `priceText` nếu có, ngược lại format giá bình thường.

4. **Cập nhật `ProductDetail.tsx`**: Tương tự xử lý `priceText`.

5. **Giữ nguyên ảnh placeholder** từ Unsplash cho các dịch vụ mới (có thể thay sau).

