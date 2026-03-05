

## Plan: Replace deposit QR code with custom QR image

### What
Replace the dynamically generated VietQR URL on the Success page with the uploaded static QR image (ZaloPay QR for ROWENA TATTOO GO VAP).

### Changes

**Copy asset**
- Copy `user-uploads://image-18.png` → `public/assets/qr-deposit.png`

**`src/pages/Success.tsx`**
- Replace the dynamic `qrUrl` (`generateVietQRUrl(...)`) with the static path `/assets/qr-deposit.png`
- Remove the `generateVietQRUrl` import since it's no longer used
- Keep the transfer content and bank details section as-is for manual transfer option

