export const bankInfo = {
  bankName: "Vietcombank",
  bankId: "970436",
  accountNumber: "1234567890",
  accountName: "ROWENA TATTOO STUDIO",
  branch: "Hồ Chí Minh",
  depositAmount: 200000,
};

export function generateTransferContent(bookingId: string): string {
  return `ROWENA ${bookingId}`;
}

export function generateVietQRUrl(bookingId: string): string {
  const content = generateTransferContent(bookingId);
  return `https://img.vietqr.io/image/${bankInfo.bankId}-${bankInfo.accountNumber}-compact2.png?amount=${bankInfo.depositAmount}&addInfo=${encodeURIComponent(content)}&accountName=${encodeURIComponent(bankInfo.accountName)}`;
}

export function generateZaloPayUrl(): string {
  return "https://zalopay.vn";
}