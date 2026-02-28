

## Plan: Thêm nút mở ZaloPay trên trang /success

### Changes

**`src/pages/Success.tsx`**:
- Thêm nút "Thanh toán qua ZaloPay" ngay dưới phần bank details, trong section Deposit Instruction
- Nút sử dụng deeplink `zalopay://` để mở app ZaloPay trên điện thoại
- Styling: nút nổi bật với icon ZaloPay (dùng `Wallet` icon từ lucide), màu xanh ZaloPay (#008fe5)
- Fallback: nếu trên desktop/không có app, link sẽ mở trang ZaloPay web

**`src/data/bankInfo.ts`**:
- Thêm hàm `generateZaloPayUrl(bookingCode)` tạo deeplink ZaloPay dạng `https://social.zalopay.vn/spa/qr/...` hoặc fallback `zalopay://` scheme

### UI Layout
Nút ZaloPay sẽ nằm ngay sau bảng thông tin ngân hàng, trước section upload biên lai.

