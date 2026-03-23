

## Vấn đề: Nhà cung cấp domain không hỗ trợ bản ghi NS

Hệ thống email của Lovable yêu cầu thêm bản ghi **NS (Name Server)** cho subdomain `notify.rowenatattoos.com` để ủy quyền DNS. Nếu nhà cung cấp domain hiện tại không cho thêm bản ghi NS, có 2 hướng giải quyết:

### Phương án 1: Chuyển DNS sang Cloudflare (miễn phí, khuyến nghị)
- Đăng ký tài khoản Cloudflare miễn phí tại cloudflare.com
- Thêm domain `rowenatattoos.com` vào Cloudflare
- Cập nhật nameserver tại nhà cung cấp domain hiện tại trỏ về Cloudflare
- Sau khi DNS chuyển xong, thêm bản ghi NS trên Cloudflare (Cloudflare hỗ trợ đầy đủ các loại bản ghi)
- Giữ nguyên tất cả bản ghi DNS hiện có

### Phương án 2: Chuyển domain sang nhà cung cấp khác
- Các nhà cung cấp hỗ trợ NS: Namecheap, GoDaddy, Google Domains, Tên Miền Việt Nam (inet.vn), MatBao...
- Quy trình transfer domain mất 5-7 ngày

### Lưu ý
- Không cần thay đổi code — chỉ cần cấu hình DNS đúng
- Sau khi thêm được bản ghi NS, email sẽ tự động hoạt động
- Bạn đang dùng nhà cung cấp domain nào? Tôi có thể hướng dẫn cụ thể hơn.

