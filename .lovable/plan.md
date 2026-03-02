

## Plan: Unify thank-you view for both "skip deposit" and "submitted receipt"

### Problem
Currently when `submitted` is true (after uploading deposit receipt), the user sees a small confirmation card but the deposit instructions and action buttons remain visible. The user wants this to transition to the same full thank-you view as the "skip" flow -- with phone notification reminder and a clean "Về trang chủ" button.

### Changes

**`src/pages/Success.tsx`**

1. Change the outer conditional from `skipped ? (thankyou) : (deposit flow)` to `(skipped || submitted) ? (thankyou) : (deposit flow)`
2. In the thank-you branch, adjust the message based on which path was taken:
   - If `submitted`: show "Biên lai đã được gửi!" message + phone notice
   - If `skipped`: show existing phone notice (as-is)
3. Remove the old `submitted` inline confirmation card (lines 450-459) since it's now handled by the shared thank-you view
4. Remove the `submitted` check around the skip button (lines 464-469) since this section only renders when neither submitted nor skipped

This reuses the existing thank-you UI block and simply extends it to also trigger on `submitted`.

