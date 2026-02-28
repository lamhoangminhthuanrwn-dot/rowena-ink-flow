

## Plan: Cập nhật ZaloPay deeplink với thông tin chuyển tiền

### Changes

**`src/data/bankInfo.ts`**:
- Thêm `zaloPayPhone: "0938048780"` vào `bankInfo`
- Cập nhật `generateZaloPayUrl(bookingCode)` để tạo deeplink ZaloPay chuyển tiền với:
  - Số điện thoại đích: `0938048780`
  - Số tiền: `bankInfo.depositAmount` (200,000)
  - Nội dung: transfer content (`ROWENA {bookingCode}`)
  - Deeplink format: `https://social.zalopay.vn/spa/personal-transfer?phone=0938048780&amount=200000&note=ROWENA%20RW-xxx`

**`src/pages/Success.tsx`**:
- Cập nhật lời gọi `generateZaloPayUrl()` → `generateZaloPayUrl(state.bookingCode)` để truyền mã booking vào deeplink

