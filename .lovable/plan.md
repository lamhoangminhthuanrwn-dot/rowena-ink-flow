

## Plan: Lưu storage path thay vì signed URL

### Vấn đề
Client tạo signed URL (30 ngày) rồi lưu vào DB. Sau 30 ngày, ảnh tham khảo thành broken link. Upload-deposit cũng có vấn đề tương tự (1 năm).

### Giải pháp
Lưu storage path (e.g. `references/user-id/TMP123_0.jpg`) vào DB thay vì signed URL. Tạo signed URL on-demand khi hiển thị.

### Thay đổi

**1. Sửa `src/pages/Booking.tsx`** (dòng 140-153)
- Sau khi upload thành công, push storage path vào mảng thay vì tạo signed URL
- Bỏ `createSignedUrl` call

**2. Sửa `src/components/ketoan/BookingTable.tsx`** (dòng 282-288)
- Khi render `reference_images`, kiểm tra nếu URL bắt đầu bằng `references/` (path) thì gọi `createSignedUrl` on-demand
- Nếu là URL đầy đủ (legacy data) thì dùng trực tiếp
- Tạo hook/helper `useSignedUrl` hoặc inline logic để tạo signed URL khi component mount

**3. Tạo helper `src/lib/storageUtils.ts`**
- Function `getSignedUrls(bucket: string, paths: string[]): Promise<string[]>` — batch tạo signed URL với thời hạn ngắn (1 giờ)
- Phân biệt path vs legacy signed URL (nếu bắt đầu bằng `http` thì trả về nguyên)

### Xử lý dữ liệu cũ
- Không cần migration — helper tự phân biệt path mới vs signed URL cũ
- Signed URL cũ vẫn hoạt động cho đến khi hết hạn, sau đó sẽ broken (chấp nhận được)

### Tóm tắt
- **3 file sửa/tạo**: `Booking.tsx`, `BookingTable.tsx`, `storageUtils.ts`
- Ảnh tham khảo không bao giờ hết hạn vì signed URL được tạo on-demand

