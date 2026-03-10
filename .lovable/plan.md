

## Fix: Font serif gây lỗi hiển thị dấu tiếng Việt

Chữ "hồng" hiển thị sai dấu do dùng `font-serif` (Crimson Pro) — font này không hỗ trợ tốt dấu tiếng Việt kết hợp (đã ghi nhận trong style guide).

### Thay đổi

**`src/pages/Success.tsx`** (line 325):
- Đổi `font-serif` thành `font-sans` cho thẻ `<h3>`:
```tsx
<h3 className="font-sans text-base font-semibold text-foreground break-words">
```

