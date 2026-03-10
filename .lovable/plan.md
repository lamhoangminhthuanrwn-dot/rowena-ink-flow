

## Fix: Referral reward không được cộng vì lỗi auth context

### Nguyên nhân gốc

Trong `process-referral-reward` edge function, `supabase` client được tạo với **service role key** (dòng 19-21). Khi gọi `supabase.rpc('add_referral_reward', ...)`, hàm DB `add_referral_reward` kiểm tra `has_role(auth.uid(), 'admin')` ở đầu hàm. Nhưng với service role client, `auth.uid()` trả về **null** → `has_role(null, 'admin')` = false → hàm raise exception "Unauthorized: admin only" → reward không bao giờ được cộng.

Edge function logs trống vì lỗi xảy ra ở tầng DB (exception) và response trả về 500 với "Failed to process reward", nhưng Ketoan.tsx bắt lỗi bằng `try/catch` và chỉ `console.warn`.

### Giải pháp

**`supabase/functions/process-referral-reward/index.ts`**:
- Thay vì dùng service role client để gọi `add_referral_reward` RPC, sử dụng `anonClient` (đã có auth context của admin) để gọi RPC. Vì admin đã được xác thực ở đầu function, `auth.uid()` trong DB function sẽ trả về đúng admin user ID.

Cụ thể: đổi dòng 80 từ `supabase.rpc(...)` thành `anonClient.rpc(...)`.

### Files thay đổi
- `supabase/functions/process-referral-reward/index.ts` - dùng anonClient thay vì service role client khi gọi `add_referral_reward` RPC

