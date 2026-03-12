

## Plan: Xoá file type thủ công trùng lặp

**Phát hiện:** `src/types/booking.ts` không được import ở bất kỳ file nào trong codebase. Tất cả các file đều đã dùng `src/types/database.ts` (re-export từ Supabase generated types).

**Thay đổi:**
1. **Xoá** `src/types/booking.ts` -- file chết, không ai import
2. Không cần sửa file nào khác

Chỉ 1 thao tác duy nhất: xoá 1 file.

