

## Plan

### 1. Đổi link giới thiệu sang `https://thuanlam.id.vn/inv/{code}`

**Files cần sửa:**

- **`src/pages/Account.tsx`**: Thay `${window.location.origin}/auth?ref=` thành `https://thuanlam.id.vn/inv/` ở cả `handleCopyReferral` (line 92) và phần hiển thị link (line 390)

- **`src/App.tsx`**: Thêm route `/inv/:code` bên cạnh route `/r/:code` hiện tại, cả hai đều redirect về `/auth?ref={code}`

### 2. Fix lỗi email xác nhận không gửi được

Logs cho thấy auth-email-hook chạy thành công nhưng `message_id: undefined` — email có thể không thực sự được gửi đi.

**Nguyên nhân**: Trong `auth-email-hook/index.ts`, `FROM_DOMAIN = "lamthuan.codes"` (from address: `noreply@lamthuan.codes`) nhưng `SENDER_DOMAIN = "notify.lamthuan.codes"`. Domain gửi và domain trong from address không khớp, có thể gây lỗi delivery.

**Fix `supabase/functions/auth-email-hook/index.ts`**:
- Đổi `FROM_DOMAIN` thành `"notify.lamthuan.codes"` để khớp với `SENDER_DOMAIN`
- From address sẽ là `Rowena Ink Hub <noreply@notify.lamthuan.codes>`
- Re-deploy edge function

