

## Plan: Thêm AlertDialog xác nhận cho tất cả destructive actions

### Vấn đề
Xóa chi nhánh, xóa thợ xăm, hủy booking — không có dialog xác nhận. `AdminPosts.tsx` dùng `confirm()` (native browser) — không nhất quán.

### Giải pháp
Tạo 1 reusable `ConfirmDialog` component dùng shadcn `AlertDialog` (đã có), áp dụng cho tất cả destructive actions.

### Thay đổi

**1. Tạo `src/components/ConfirmDialog.tsx`**
- Reusable component nhận `open`, `onConfirm`, `onCancel`, `title`, `description`
- Dùng `AlertDialog` từ shadcn/ui
- Nút xác nhận màu destructive

**2. Sửa `src/pages/AdminBranches.tsx`**
- Thêm state `deleteTarget: { type: "branch" | "artist", id: string } | null`
- Nút xóa chi nhánh/thợ xăm → set `deleteTarget` thay vì gọi delete trực tiếp
- Render `ConfirmDialog`, onConfirm gọi `deleteBranch` hoặc `deleteArtist`

**3. Sửa `src/components/ketoan/BookingTable.tsx`**
- Thêm state `cancelTargetId: string | null`
- Nút "Hủy" → set `cancelTargetId` thay vì gọi `onCancelBooking` trực tiếp
- Render `ConfirmDialog`, onConfirm gọi `onCancelBooking`

**4. Sửa `src/pages/AdminPosts.tsx`**
- Thay `confirm()` bằng `ConfirmDialog` với state `deletePostId`

### Tóm tắt
- **1 file mới**, **3 file sửa**
- Tất cả destructive actions dùng cùng 1 AlertDialog component
- Nhất quán UX toàn bộ admin pages

