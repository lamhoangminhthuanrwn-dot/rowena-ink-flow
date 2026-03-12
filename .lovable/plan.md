

## Plan: Thêm pagination cho Ketoan bookings

### Vấn đề
`fetchBookings()` query toàn bộ bookings không giới hạn. Khi data lớn sẽ chậm và lag UI.

### Giải pháp
Thêm server-side pagination với page buttons. Mỗi page load 50 bookings.

### Thay đổi

**1. Sửa `src/pages/Ketoan.tsx`**
- Thêm state: `page` (number, default 0), `totalCount` (number)
- Sửa `fetchBookings`: thêm `.range(page * 50, (page + 1) * 50 - 1)` và query count via `select("*", { count: "exact", head: true })` hoặc dùng `{ count: "exact" }` option
- Truyền `page`, `totalCount`, `onPageChange` xuống BookingTable
- `useEffect` depend on `page` để refetch khi đổi trang
- Filter/search vẫn client-side trên page hiện tại (giữ đơn giản)

**2. Sửa `src/components/ketoan/BookingTable.tsx`**
- Nhận thêm props: `page`, `totalCount`, `pageSize`, `onPageChange`
- Thêm pagination controls ở cuối table: Previous / page numbers / Next
- Dùng shadcn Pagination components đã có sẵn

### Tóm tắt
- **2 file sửa**
- Server-side pagination 50 items/page
- Không thay đổi logic filter/search hiện có

