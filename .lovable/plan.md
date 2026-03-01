

## Thêm slideshow ảnh cho dịch vụ "Xăm full lưng"

Thêm 10 ảnh studio vào dịch vụ "Xăm full lưng" và hiển thị dạng slideshow tự động đổi ảnh mỗi 5 giây.

### Thay đổi

1. **Copy 10 ảnh** vào `public/assets/` với tên `tattoo-back-1.jpg` đến `tattoo-back-10.jpg`

2. **`src/data/tattooDesigns.ts`**: Thêm thuộc tính `images?: string[]` vào interface `TattooDesign`. Dịch vụ "Xăm full lưng" (id: 1) sẽ có mảng `images` chứa 10 đường dẫn ảnh, `image` giữ nguyên làm ảnh đại diện.

3. **`src/components/CatalogCard.tsx`**: Nếu design có `images`, hiển thị slideshow tự động (5 giây/ảnh) thay vì ảnh tĩnh, với hiệu ứng fade chuyển ảnh và chỉ báo dot indicators.

4. **`src/pages/ProductDetail.tsx`**: Tương tự, hiển thị slideshow cho trang chi tiết sản phẩm khi có `images`.

### Thứ tự ảnh
1. `tải_xuống_1.png` (Mèo thần tài samurai)
2. `tải_xuống_2.png` (Hổ realistic)
3. `tải_xuống_3.png` (Hổ & đầu lâu)
4. `tải_xuống_4.png` (Hổ close-up)
5. `tải_xuống_5.png` (Ơn cha nghĩa mẹ)
6. `tải_xuống_6.png` (Tề Thiên)
7. `tải_xuống_7.png` (Hạc & hoa đào)
8. `tải_xuống_8.png` (Samurai Nhật)
9. `tải_xuống.png` (Quỷ Nhật)
10. `z7495959802753...jpg` (Phượng hoàng)

