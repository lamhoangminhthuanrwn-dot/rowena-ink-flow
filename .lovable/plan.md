

## Fix: Text bị cắt do `min-w-0` + `truncate` ảnh hưởng đến tiêu đề

### Vấn đề
Tiêu đề "Giới thiệu bạn mới — nhận hoa hồng 10%" bị cắt/tràn vì parent div có `min-w-0` (đã thêm ở fix trước), kết hợp với layout flex khiến text bị ép quá hẹp trên mobile.

### Thay đổi

**`src/pages/Success.tsx`** (line 325):
- Thêm `break-words` vào thẻ `<h3>` để text tự xuống dòng thay vì bị cắt:
  ```tsx
  <h3 className="font-serif text-base font-semibold text-foreground break-words">
  ```

