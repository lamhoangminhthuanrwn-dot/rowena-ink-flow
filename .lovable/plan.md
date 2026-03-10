

## Sửa robots.txt

Hiện tại dòng Sitemap đang trỏ trực tiếp đến URL nội bộ của backend. Cần đổi sang domain chính để phù hợp chuẩn SEO:

**`public/robots.txt`** — Đổi dòng Sitemap:
```
Sitemap: https://thuanlam.id.vn/sitemap.xml
```

Đồng thời giữ file `public/sitemap.xml` làm fallback tĩnh, và có thể cấu hình redirect/rewrite từ domain chính đến edge function nếu cần sau này. Hoặc nếu muốn trỏ thẳng đến edge function động, giữ nguyên URL hiện tại nhưng dùng domain chính làm proxy.

Cách đơn giản nhất: trỏ Sitemap về `/sitemap.xml` trên domain chính (file tĩnh đã được cập nhật đúng routes).

Chỉ sửa 1 file.

