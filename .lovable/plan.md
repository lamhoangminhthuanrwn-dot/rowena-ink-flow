

## Plan: Gom status label maps vào `lib/statusLabels.ts`

### Thay đổi

**1. Tạo `src/lib/statusLabels.ts`**
- Chứa 3 maps: `paymentStatusLabels`, `bookingStatusLabels`, `withdrawalStatusLabels`
- Export tất cả

**2. Sửa 3 file — xóa định nghĩa local, import từ file mới:**
- `src/components/ketoan/BookingTable.tsx` — xóa dòng 9-22, thêm import
- `src/components/ketoan/WithdrawalTable.tsx` — xóa dòng 5-10, thêm import
- `src/pages/Account.tsx` — xóa dòng 13-25, thêm import

### Tóm tắt
- **1 file tạo, 3 file sửa**
- Không thay đổi logic, chỉ DRY refactor

