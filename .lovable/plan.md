

## Kế hoạch tách component

### A. Booking.tsx → tách 4 step components

Tạo các component trong `src/components/booking/`:

1. **`DesignStep.tsx`** — Step chọn mẫu xăm (lines 268-291). Props: `selectedDesign`, `onSelect`.
2. **`InfoStep.tsx`** — Step thông tin cá nhân (lines 297-371). Props: `form`, `setForm`, `infoErrors`, `setInfoErrors`, `refUpload`, `fileRef`. Kèm theo `FieldError` helper.
3. **`ScheduleStep.tsx`** — Step chọn lịch hẹn (lines 374-446). Props: `schedule`, `setSchedule`, `selectedBranch`, `setSelectedBranch`, `branches`, `artists`, `loadingData`, `scheduleErrors`, `setScheduleErrors`, `design`, `selectedOptions`. Chuyển `generateTimeSlots` và `FieldError` vào đây.
4. **`BookingProgress.tsx`** — Thanh progress stepper (lines 239-258). Props: `stepLabels`, `currentStep`.

`BookingOptionStep.tsx` giữ nguyên vì đã tách sẵn.

**Booking.tsx** giữ lại: state management, logic validate/submit, routing, layout wrapper. Import và render các step component theo `contentStep`.

### B. Account.tsx → tách 3 tab components

Tạo các component trong `src/components/account/`:

1. **`BookingsTab.tsx`** — Tab lịch hẹn (lines 200-248). Props: `bookings`, `navigate`. Chứa useQuery cho bookings.
2. **`WalletTab.tsx`** — Tab ví & rút tiền (lines 252-371). Props: `userId`, `wallet`, `transactions`, `withdrawals`. Chứa form rút tiền + lịch sử. Chuyển `handleWithdraw` vào component này.
3. **`ReferralTab.tsx`** — Tab giới thiệu (lines 375-413). Props: `profile`. Chứa `handleCopyReferral`.

**Account.tsx** giữ lại: auth guard, tab switching, layout, logout button. Truyền data queries xuống hoặc để mỗi tab tự query (giữ pattern lazy-fetch hiện tại).

### Tóm tắt file changes
- Tạo 7 file mới: `BookingProgress.tsx`, `DesignStep.tsx`, `InfoStep.tsx`, `ScheduleStep.tsx`, `BookingsTab.tsx`, `WalletTab.tsx`, `ReferralTab.tsx`
- Sửa 2 file: `Booking.tsx`, `Account.tsx` (slim down, import components)
- Không thay đổi logic hay UI, chỉ tách code

