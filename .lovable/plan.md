

## Vấn đề

Google Search Console yêu cầu sitemap phải nằm trên **cùng domain** với website. Hiện tại:
- Website: `https://rowena-ink-flow.lovable.app`  
- Sitemap: `https://qbbvnjnpbbpskhwngsrq.supabase.co/functions/v1/sitemap` ❌

## Giải pháp

Tạo file **static sitemap.xml** trong thư mục `public/` để sitemap có URL `https://rowena-ink-flow.lovable.app/sitemap.xml`

### Thay đổi

1. **Tạo `public/sitemap.xml`** - File static chứa các route chính:
   - `/` (trang chủ)
   - `/catalog` (bộ sưu tập)
   - `/booking` (đặt lịch)
   - `/tin-tuc` (tin tức)
   - `/auth` (đăng nhập)

2. **Cập nhật `public/robots.txt`** - Đổi sitemap URL thành:
   ```
   Sitemap: https://rowena-ink-flow.lovable.app/sitemap.xml
   ```

### Lưu ý
- Sitemap static sẽ không tự động cập nhật khi thêm bài viết mới
- Có thể cập nhật thủ công khi cần bằng cách thêm URL vào file `sitemap.xml`
- Edge function vẫn giữ lại để tham khảo hoặc dùng cho mục đích khác

