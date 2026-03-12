
Mình đã tìm đúng nguyên nhân: publish bị fail vì chênh lệch quyền database giữa môi trường Test và Live. Ở Test, các bảng `public.*` đang có thêm quyền cho role `sandbox_exec_qbbvnjnpbbpskhwngsrq`; ở Live role này không tồn tại, nên lúc hệ thống đồng bộ schema nó sinh ra `GRANT ... TO sandbox_exec...` và fail với lỗi `42704 role does not exist`.

### Kế hoạch xử lý
1. **Tạo 1 migration chuẩn hóa quyền (grant) trong schema `public`:**
   - Gỡ quyền của `sandbox_exec_qbbvnjnpbbpskhwngsrq` khỏi:
     - toàn bộ table trong `public`
     - toàn bộ sequence trong `public`
     - toàn bộ function trong `public`
     - quyền `USAGE` trên schema `public`

2. **Gỡ default privileges trong `public` cho role này:**
   - Tránh việc các object mới lại tự được cấp quyền cho `sandbox_exec...` và tái diễn lỗi publish.

3. **Viết migration theo kiểu an toàn, chạy được cả 2 môi trường:**
   - Dùng `DO $$ ... IF EXISTS (SELECT 1 FROM pg_roles ...) THEN ... END IF; $$`
   - Nghĩa là:
     - Test: role có tồn tại → revoke thật
     - Live: role không tồn tại → bỏ qua, không lỗi

4. **Xác minh sau khi chạy migration ở Test:**
   - Kiểm tra `relacl` của bảng `public` không còn `sandbox_exec...`
   - Kiểm tra `pg_default_acl` của `public` không còn `sandbox_exec...`

5. **Publish lại**
   - Sau khi quyền đã đồng bộ, hệ thống sẽ không còn sinh câu lệnh `GRANT ... TO sandbox_exec...`, publish sẽ chạy qua bình thường.

### Ghi chú kỹ thuật
- Đây là lỗi hạ tầng quyền DB, không phải lỗi UI/code React.
- Không thay đổi dữ liệu nghiệp vụ.
- Không đụng logic ứng dụng, chỉ chuẩn hóa ACL để bỏ “drift” giữa Test và Live.
