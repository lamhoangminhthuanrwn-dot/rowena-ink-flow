

## Plan: Thêm Google Maps embed vào Footer

Thêm một bản đồ Google Maps nhúng vào phần footer để hiển thị vị trí studio Rowena Tattoo tại TP. Hồ Chí Minh.

### Thay đổi

**File: `src/components/Footer.tsx`**
- Thêm một hàng mới phía trên `Separator` cuối footer, chứa Google Maps iframe embed
- Sử dụng `iframe` với `src` từ Google Maps Embed (không cần API key) trỏ đến khu vực TP. Hồ Chí Minh
- Iframe có `rounded-lg`, `border border-border/30`, chiều cao khoảng 200px, `w-full`
- Thêm tiêu đề "Vị trí Studio" phía trên bản đồ
- Responsive: full-width trên mọi kích thước màn hình

### Chi tiết kỹ thuật
- Sử dụng Google Maps Embed URL dạng: `https://www.google.com/maps/embed?pb=...` với tọa độ khu vực HCM
- Iframe có thuộc tính `loading="lazy"`, `allowFullScreen`, và `referrerPolicy="no-referrer-when-downgrade"` để tối ưu hiệu suất
- Không cần API key vì dùng embed URL chuẩn của Google Maps

