

## Nguyên nhân lỗi

Có 2 vấn đề:

1. **Upload biên lai thất bại**: Sau khi upload file lên storage, code gọi `createSignedUrl` để lấy URL. Nhưng user chưa đăng nhập (anon) không có quyền SELECT trên storage → `createSignedUrl` fail → `uploadedUrls` rỗng → edge function `upload-deposit` nhận `receipt_urls: []` → trả lỗi 400 "Missing receipt_urls".

2. **Đơn không hiện bill trên kế toán**: Vì bước upload deposit fail nên `deposit_receipts` và `payment_status` không được cập nhật → admin không thấy biên lai.

## Kế hoạch fix

### 1. Sửa flow upload biên lai (`src/pages/Success.tsx`)
- Thay vì tạo signed URL ở client (cần quyền SELECT), chỉ gửi **file paths** (e.g. `deposits/BK123_xxx.jpg`) đến edge function
- Edge function sẽ dùng service role key để tạo signed URL

### 2. Cập nhật edge function `upload-deposit/index.ts`
- Nhận `receipt_paths` thay vì `receipt_urls`
- Dùng service role để tạo signed URL cho từng path
- Lưu signed URLs vào `deposit_receipts`

### 3. Thêm storage SELECT policy cho anon (backup)
- Thêm migration cho phép anon SELECT trên `booking-uploads` bucket để đảm bảo không có vấn đề quyền nào khác

