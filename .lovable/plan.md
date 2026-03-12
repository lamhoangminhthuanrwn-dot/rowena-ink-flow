

## Plan: Tạo custom hook `useFileUpload`

### Phân tích
Sau khi đọc code, có **2 pattern khác nhau**:

1. **Multi-file + preview** (Booking.tsx, DepositSection.tsx): select files → readAsDataURL → preview → remove → upload to private bucket → return paths
2. **Single-file upload** (AdminPosts.tsx): select file → upload to public bucket → return public URL. Không có preview state, logic khác biệt nhiều (insert markdown at cursor, v.v.)

Hook sẽ tập trung vào pattern #1 (multi-file + preview) vì đó là phần lặp rõ ràng nhất. AdminPosts giữ nguyên vì logic quá khác biệt.

### Thay đổi

**1. Tạo `src/hooks/useFileUpload.ts`**
- State: `files`, `previews`, `uploading`
- Methods:
  - `addFiles(fileList, options?)` — validate, generate previews via readAsDataURL, append
  - `removeFile(index)` — remove file + preview at index
  - `uploadAll(bucket, pathGenerator)` — upload all files to Supabase storage, return paths
  - `reset()` — clear state
- Config: `maxFiles`, `validateFn` (optional custom validator)

**2. Sửa `src/pages/Booking.tsx`**
- Xóa state `referenceFiles`, `referencePreviews` và functions `handleFileChange`, `removeFile`
- Thay bằng `useFileUpload({ maxFiles: MAX_FILES, validateFn: validateFile })`
- Trong `handleSubmit`, gọi `uploadAll("booking-uploads", (file, i) => path)`

**3. Sửa `src/components/success/DepositSection.tsx`**
- Xóa state `depositFiles`, `depositPreviews` và functions `handleDepositFileChange`, `removeDepositFile`
- Thay bằng `useFileUpload({ maxFiles: 3 })`
- Trong `handleDepositSubmit`, gọi `uploadAll("booking-uploads", (file, i) => path)`

### Tóm tắt
- **1 file tạo, 2 file sửa**
- AdminPosts giữ nguyên (pattern khác)
- Không thay đổi logic, chỉ DRY refactor

