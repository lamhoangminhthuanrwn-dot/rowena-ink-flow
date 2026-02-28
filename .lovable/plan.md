

## Plan: Đổi link ZaloPay sang deeplink mở app

### Changes

**`src/data/bankInfo.ts`**:
- Sửa hàm `generateZaloPayUrl()` trả về `"zalopay://"` thay vì `"https://zalopay.vn"` để mở trực tiếp app ZaloPay trên điện thoại.

