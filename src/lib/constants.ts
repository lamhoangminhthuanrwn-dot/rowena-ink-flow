/** Domain chính dùng cho các link giới thiệu (referral) */
export const SITE_DOMAIN = "https://thuanlam.id.vn";

/** Tạo referral URL từ mã giới thiệu */
export function getReferralUrl(code: string): string {
  return `${SITE_DOMAIN}/inv/${code}`;
}
