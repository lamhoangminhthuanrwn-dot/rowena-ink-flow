

## Tính năng: Liên kết tài khoản thanh toán trước khi rút tiền

### Mô tả
Người dùng phải liên kết tài khoản MoMo hoặc ngân hàng **một lần duy nhất** trước khi rút tiền. Sau khi đã liên kết, muốn đổi tài khoản phải xác nhận qua email.

### Thay đổi

#### 1. Database Migration
Tạo bảng `payment_accounts`:
```sql
CREATE TABLE public.payment_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  account_type text NOT NULL DEFAULT 'momo', -- 'momo' | 'bank'
  momo_phone text,
  momo_name text,
  bank_name text,
  bank_account_number text,
  bank_account_name text,
  change_token text,
  change_token_expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.payment_accounts ENABLE ROW LEVEL SECURITY;

-- Users can view/insert/update own payment account
CREATE POLICY "Users can view own payment account" ON public.payment_accounts
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payment account" ON public.payment_accounts
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payment account" ON public.payment_accounts
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
```

#### 2. Edge Function: `send-change-payment-email`
- Tạo token ngẫu nhiên, lưu vào `payment_accounts.change_token` + `change_token_expires_at` (30 phút)
- Gửi email chứa link xác nhận đổi tài khoản: `https://thuanlam.id.vn/tai-khoan?change_token=xxx`
- Dùng Resend API (đã có `RESEND_API_KEY`)

#### 3. Edge Function: `confirm-change-payment`
- Nhận token, kiểm tra hợp lệ và chưa hết hạn
- Xóa thông tin tài khoản cũ (reset các field), cho phép nhập mới
- Xóa token sau khi dùng

#### 4. UI: Cập nhật `WalletTab.tsx`
- **Chưa có tài khoản**: Hiển thị form liên kết (chọn MoMo hoặc Ngân hàng, nhập thông tin) thay vì form rút tiền
- **Đã có tài khoản**: Hiển thị thông tin đã liên kết + nút "Đổi tài khoản" (gửi email xác nhận) + form rút tiền (không cần nhập lại SĐT/tên MoMo)
- **Sau xác nhận đổi**: Reset về trạng thái chưa có, cho nhập mới

#### 5. Cập nhật `request_withdrawal` RPC
- Bỏ param `_momo_phone`, `_momo_name` — lấy từ `payment_accounts` thay vì truyền trực tiếp
- Kiểm tra user đã có payment account trước khi cho rút

#### 6. Xử lý `?change_token=` trên trang `/tai-khoan`
- `Account.tsx` đọc query param `change_token`, gọi edge function `confirm-change-payment` để xác nhận đổi

### Luồng hoạt động

```text
Lần đầu rút tiền
─────────────────
User → Thấy form "Liên kết tài khoản" → Chọn MoMo/Bank → Nhập info → Lưu
     → Form rút tiền xuất hiện (dùng info đã lưu)

Đổi tài khoản
──────────────
User → Nhấn "Đổi tài khoản" → Email xác nhận gửi đến
     → User click link trong email → Token verified → Account reset
     → User nhập tài khoản mới
```

### Tóm tắt file thay đổi
- **Migration SQL**: Tạo bảng `payment_accounts`
- **`supabase/functions/send-change-payment-email/index.ts`**: Gửi email xác nhận đổi
- **`supabase/functions/confirm-change-payment/index.ts`**: Xác nhận token, reset account
- **`src/components/account/WalletTab.tsx`**: UI liên kết + hiển thị + rút tiền
- **`src/pages/Account.tsx`**: Xử lý `change_token` query param
- **Migration SQL**: Cập nhật RPC `request_withdrawal` lấy info từ `payment_accounts`

