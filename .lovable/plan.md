

## Thêm icon mạng xã hội vào Footer

### Thông tin link:
- Facebook: `https://www.facebook.com/profile.php?id=61556145616091`
- YouTube: `https://www.youtube.com/@rowenatattomiennam`
- Instagram: `https://www.instagram.com/rowena_tattoo/`
- TikTok: `https://www.tiktok.com/@rosaigontattoo?lang=vi-VN`

### Kế hoạch:

**Chỉnh sửa `src/components/Footer.tsx`:**
- Import icon `Facebook`, `Instagram`, `Youtube` từ `lucide-react`
- Tạo custom SVG icon cho TikTok (lucide-react không có icon TikTok)
- Thêm một hàng icon mạng xã hội giữa phần nav links và copyright, mỗi icon là `<a>` với `target="_blank"` và `rel="noopener noreferrer"`
- Style: icon size 20px, màu `muted-foreground`, hover chuyển sang `primary`

### Layout Footer sau khi thêm:
```text
[ Logo ROWENA ]   [ Mẫu xăm | Đặt lịch ]   [ FB  YT  IG  TT ]   [ © 2025 ... ]
```

Trên mobile sẽ stack dọc, icon mạng xã hội nằm giữa.

