

## Plan: Batch fixes — UX, accessibility, code quality

### 1. ReceiptModal → dùng Dialog component
**File:** `src/components/ketoan/ReceiptModal.tsx`
- Thay custom div overlay bằng `<Dialog>` / `<DialogContent>` từ shadcn/ui (giống PriceHistoryDialog)
- Tự động có focus trap, Escape to close, accessible

### 2. Loading state cho Booking.tsx fetch
**File:** `src/pages/Booking.tsx`
- Thêm state `loadingData` cho branches/artists fetch (dòng 86-96)
- Hiển thị spinner/skeleton khi đang load
- (Account.tsx đã fix bằng react-query ở lần trước)

### 3. Time slots từ artist work_start/work_end
**File:** `src/pages/Booking.tsx`
- Tạo helper function `generateTimeSlots(start, end)` thay vì hardcode array
- Khi user chọn artist → generate slots từ `work_start`/`work_end` của artist đó
- Fallback về "08:00"-"17:00" nếu chưa chọn artist

### 4. SEO: đồng bộ SITE_URL
**File:** `src/lib/seo.ts`
- Import `SITE_DOMAIN` từ `constants.ts`, dùng làm SITE_URL thay vì fallback sang lovable.app
- Thêm `<meta name="robots" content="index, follow" />`

### 5. Rename Ketoan → AdminFinance
- Rename `src/pages/Ketoan.tsx` → `src/pages/AdminFinance.tsx`
- Update import trong `App.tsx` (route `/ketoan` giữ nguyên)

### 6. Package name
**File:** `package.json`
- Đổi `"name"` thành `"rowena-ink-hub"`

### 7. Inline Tailwind cleanup (phạm vi giới hạn)
- Refactor các className > 200 ký tự trong `Booking.tsx` dùng `cn()` utility
- Chỉ xử lý các dòng nặng nhất, không refactor toàn bộ project

---

### Tóm tắt
- **6 file sửa**, **0 file mới** (1 rename)
- Ưu tiên accessibility (ReceiptModal) và data-driven logic (time slots)
- Các fix nhỏ (SEO sync, package name, rename) gộp chung

