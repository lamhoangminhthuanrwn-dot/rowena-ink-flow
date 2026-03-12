

## Plan: Tách Ketoan.tsx và Success.tsx thành các component nhỏ + Fix build error

**3 việc cần làm:**
1. Fix build error `auth-email-hook` (thiếu dependency `@lovable.dev/webhooks-js`)
2. Tách `Ketoan.tsx` (832 dòng) → 5 component con
3. Tách `Success.tsx` (514 dòng) → 3 component con

---

### 1. Fix build error

**File:** `supabase/functions/auth-email-hook/deno.json`

Thêm `@lovable.dev/webhooks-js` vào imports:
```json
{
  "compilerOptions": { ... },
  "imports": {
    "@lovable.dev/webhooks-js": "npm:@lovable.dev/webhooks-js"
  }
}
```

---

### 2. Tách Ketoan.tsx

**Cấu trúc file mới:**

```text
src/components/ketoan/
├── BookingTable.tsx      (~180 lines) — bảng booking + filter/search/export + expanded row
├── WithdrawalTable.tsx   (~100 lines) — bảng rút tiền + filter + actions
├── ReceiptModal.tsx      (~40 lines)  — modal xem biên lai
├── PriceEditor.tsx       (~60 lines)  — inline edit giá trị đơn hàng
├── PriceHistoryDialog.tsx(~50 lines)  — dialog lịch sử chỉnh sửa giá
```

**`Ketoan.tsx` còn lại (~200 lines):** state, data fetching, action handlers (markPaid, rejectPayment, confirmBooking, cancelBooking, savePrice, approve/reject/pay withdrawal), truyền props xuống các component con.

**Props chính:**
- `BookingTable`: bookings, filter, search, callbacks (markPaid, rejectPayment, confirmBooking, cancelBooking, markCompleted, setEditPriceId, setReceiptModal, fetchPriceHistory, expandedId, setExpandedId)
- `PriceEditor`: editPriceId, editPriceValue, onSave, onCancel, onChange
- `WithdrawalTable`: withdrawals, wdFilter, callbacks (approve, reject, markPaid)
- `ReceiptModal`: urls, onClose
- `PriceHistoryDialog`: bookingId, history, loading, onClose

---

### 3. Tách Success.tsx

**Cấu trúc file mới:**

```text
src/components/success/
├── BookingSummary.tsx  (~60 lines)  — thông tin đặt lịch (mã, tên, SĐT, mẫu, ngày...)
├── DepositSection.tsx (~180 lines) — QR, bank details, upload biên lai, skip/submit
├── ReferralBanner.tsx (~60 lines)  — banner giới thiệu bạn bè + copy link
```

**`Success.tsx` còn lại (~180 lines):** state, insertBooking logic, routing, compose các component con.

**Props chính:**
- `BookingSummary`: state (BookingState)
- `ReferralBanner`: referralCode, copied, onCopy
- `DepositSection`: state (BookingState), onSubmitted, onSkipped — chứa toàn bộ logic upload/deposit bên trong

---

### Tổng kết

- **1 file sửa** (`deno.json`) — fix build error
- **8 file tạo mới** — 5 component ketoan + 3 component success
- **2 file refactor** — `Ketoan.tsx` và `Success.tsx` giảm xuống ~200 dòng mỗi file
- Không thay đổi logic hay UI, chỉ tách code

