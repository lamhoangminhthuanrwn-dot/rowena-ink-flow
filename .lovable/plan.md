

## Plan: Show thank-you view after skipping deposit

### Problem
Currently clicking "Bỏ qua, không cọc" only shows a toast and disables the button. The user wants it to transition to a clear thank-you screen with booking summary and a phone notification reminder.

### Changes

**`src/pages/Success.tsx`**

1. Add a `skipped` boolean state
2. In `handleSkip`, after `insertBooking()`, set `skipped = true` instead of just showing a toast
3. When `skipped` is true, hide the deposit instruction section, deposit upload section, and skip button. Instead show:
   - A thank-you card with check icon and "Cảm ơn bạn đã đặt lịch!" heading
   - The booking summary (reuse existing summary block — booking code, name, phone, branch, design, appointment date/time)
   - A highlighted notice card with a Phone icon: "Vui lòng chú ý điện thoại, nhân viên sẽ gọi hoặc nhắn tin để xác nhận lịch hẹn của bạn trong thời gian sớm nhất."
   - "Về trang chủ" button

No database or backend changes needed.

