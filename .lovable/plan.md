## Thêm banner "Giới thiệu bạn mới" trên trang Success

### Mục tiêu

Sau khi đặt lịch thành công, hiển thị một section giới thiệu chương trình referral với thông điệp: giới thiệu bạn mới sẽ được hoa hồng 10% trên giá trị đơn. Kèm nút copy link giới thiệu (nếu user đã đăng nhập và có referral_code). đăng ký tài khoản để có link giới thiệu (nếu user chưa có tài khoản)

### Thay đổi

`**src/pages/Success.tsx**`:

- Thêm import `Share2` icon từ lucide-react
- Fetch `referral_code` từ profile nếu user đã đăng nhập (`state.userId`)
- Thêm một `motion.div` section mới **sau booking summary, trước deposit/skip section** với nội dung:
  - Tiêu đề: "Giới thiệu bạn mới — nhận hoa hồng 10%"
  - Mô tả: Chia sẻ link giới thiệu, khi bạn bè đặt lịch và hoàn thành, bạn nhận 10% giá trị đơn
  - Nếu đã đăng nhập và có referral_code: hiển thị link + nút copy
  - Nếu chưa đăng nhập: hiển thị CTA "Đăng ký tài khoản để nhận link giới thiệu" với link đến `/auth`
- Section này hiển thị ở cả hai trạng thái (trước và sau khi skip/submit deposit)

### UI Design

- Card với border gradient nhẹ, icon Share2, style nhất quán với các card hiện tại
- Nút copy link tương tự Account.tsx (copy to clipboard + feedback "Đã sao chép")