## Fix: Bỏ hiển thị link giới thiệu, chỉ hiển thị thông tin chương trình + nút đăng ký

nếu đã có tài khoản thì hiển thị link ref của tài khoản đó

### Thay đổi

`**src/pages/Success.tsx**` (dòng 331-353):

- Xóa block conditional `{referralCode ? (...link...) : (...signup...)}` 
- Thay bằng chỉ hiển thị nút "Đăng ký tài khoản để nhận link giới thiệu" (luôn luôn, không phân biệt đã đăng nhập hay chưa)
- Có thể bỏ luôn state `referralCode` và useEffect fetch referral_code vì không còn dùng