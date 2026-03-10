

## Fix: Referral link domain on Success page

### Problem
Success page uses `window.location.origin` which shows the preview/Lovable domain instead of the production domain `https://thuanlam.id.vn`.

### Change

**`src/pages/Success.tsx`** (lines 334, 340):
- Replace `${window.location.origin}/inv/${referralCode}` with `https://thuanlam.id.vn/inv/${referralCode}`
- Matches the pattern already used in `Account.tsx`

