

## Plan: Sửa lỗi hình không hiển thị trong slideshow trang chi tiết

### Nguyên nhân
Container slideshow chỉ có `minHeight: 400px` nhưng không có chiều cao cố định. Các hình ảnh bên trong dùng `position: absolute` nên không đẩy chiều cao container. Kết quả: container và hình đều có `height: 0` thực tế.

### Giải pháp

**`src/pages/ProductDetail.tsx`** (dòng 121):
- Thêm `style={{ height: 500 }}` hoặc dùng `aspect-ratio` trên container slideshow để đảm bảo container có chiều cao thực
- Thay `minHeight: 400` bằng chiều cao cố định hoặc dùng `aspect-[4/5]` class để container có kích thước rõ ràng cho absolute-positioned images

Cụ thể: đổi container từ:
```tsx
<div className="relative w-full bg-secondary/30" style={{ minHeight: 400 }}>
```
thành:
```tsx
<div className="relative w-full bg-secondary/30 aspect-[3/4]">
```

Điều này cho container tỷ lệ cố định, images absolute sẽ fill đúng. Kết hợp với `objectFit="contain"` đã có, hình sẽ hiển thị trọn vẹn không bị crop.

