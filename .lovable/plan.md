

## Plan: Thay thế native `<input>` bằng shadcn `<Input />` component

### Phân tích
Chuỗi Tailwind `"w-full rounded-lg border border-border bg-secondary/30 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"` lặp lại ở **5 file**, bao gồm cả `<input>`, `<textarea>`, và `<select>`.

Project đã có sẵn shadcn `<Input />` và `<Textarea />` component nhưng chưa được sử dụng ở các file này.

### Giải pháp
Thay đổi style mặc định của shadcn `<Input />` và `<Textarea />` cho khớp với design hiện tại, sau đó thay thế tất cả native elements.

### Thay đổi

**1. Sửa `src/components/ui/input.tsx`**
- Cập nhật className mặc định: `rounded-lg border-border bg-secondary/30 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0`

**2. Sửa `src/components/ui/textarea.tsx`**
- Cập nhật className mặc định tương tự Input

**3. Sửa 4 file — thay native `<input>`/`<textarea>` bằng `<Input />`/`<Textarea />`:**
- `src/pages/Booking.tsx` — 4 input + 1 textarea
- `src/pages/Account.tsx` — 3 input
- `src/pages/AdminPosts.tsx` — 4 input + 2 textarea + 1 select (giữ nguyên select)
- `src/components/success/DepositSection.tsx` — 1 input

### Lưu ý
- `<select>` trong AdminPosts giữ nguyên native vì shadcn Select có API khác (Radix-based), thay đổi sẽ phức tạp hơn
- Một số input có thêm class `font-mono` — truyền qua prop `className` của Input
- Preview div trong AdminPosts (dùng `dangerouslySetInnerHTML`) giữ nguyên, không phải input

### Tóm tắt
- **6 file sửa**: 2 UI component + 4 page/component
- Không thay đổi logic, chỉ DRY refactor

