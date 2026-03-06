

## Plan: Thông báo rút tiền cho admin (popup + email)

### Thay đổi

**1. Mở rộng `AdminBookingNotifier.tsx`** — thêm realtime subscription cho bảng `withdrawals`
- Lắng nghe event `INSERT` trên bảng `withdrawals`
- Khi có yêu cầu rút tiền mới → phát âm thanh + hiển thị toast với số tiền, SĐT MoMo
- Toast có nút "Xem" chuyển đến `/ketoan`

**2. Bật realtime cho bảng `withdrawals`** (migration)
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE public.withdrawals;
```

**3. Tạo edge function `send-withdrawal-email`**
- Gửi email thông báo đến `lamhoangminhthuan@gmail.com` qua Resend API
- Nội dung: số tiền, SĐT MoMo, tên MoMo, ngày tạo
- Bảo mật: yêu cầu Authorization Bearer token, sanitize input

**4. Gọi edge function từ `Account.tsx`**
- Sau khi `request_withdrawal` RPC thành công, gọi `send-withdrawal-email` để gửi email thông báo cho admin

**5. Cấu hình `config.toml`**
- Thêm `[functions.send-withdrawal-email]` với `verify_jwt = false` (xác thực trong code)

