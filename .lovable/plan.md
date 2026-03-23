

## Phân tích

Các link mạng xã hội trong Footer đã được code đúng (`<a href="..." target="_blank">`). Lý do click không mở được trang web có thể là:

1. **Trong preview Lovable**: iframe sandbox chặn popup/tab mới — đây là giới hạn môi trường preview, không phải lỗi code
2. **Trên trang thật**: nếu vẫn không mở được, có thể do trình duyệt chặn popup

### Giải pháp

Thêm `rel="noopener noreferrer"` (đã có) và thêm fallback `window.open` qua `onClick` handler để đảm bảo link luôn mở được:

**File: `src/components/Footer.tsx`**
- Thêm `onClick` handler cho mỗi social link: nếu `window.open` bị chặn, fallback sang `window.location.href`
- Giữ nguyên `href` và `target="_blank"` cho accessibility và SEO

### Chi tiết kỹ thuật

Cập nhật phần render social links để thêm onClick handler:
```tsx
onClick={(e) => {
  e.preventDefault();
  window.open(href, '_blank', 'noopener,noreferrer');
}}
```

Thay đổi nhỏ, chỉ ảnh hưởng 1 file.

