

## Problem

The `sendBeacon` in `Success.tsx` (lines 126-160) exposes the Supabase API key in the URL (`?apikey=...`), which is a security risk. The booking is also not inserted until the user leaves the page or clicks a button, risking data loss.

## Plan

**Single change in `src/pages/Success.tsx`:**

1. **Remove the entire `beforeunload`/`sendBeacon` useEffect** (lines 126-160)

2. **Add a new useEffect that calls `insertBooking()` immediately on mount** when `state` is available:
```tsx
useEffect(() => {
  if (state) {
    insertBooking();
  }
}, [state]);
```

This ensures the booking is inserted as soon as the Success page renders, eliminating both the API key exposure and the risk of losing booking data if the user closes the tab quickly.

No other files need changes. The `insertBooking` callback already has guards (`insertingRef` and `bookingInserted`) to prevent duplicate inserts, so existing calls in `handleDepositSubmit`, `handleSkip`, and `handleGoHome` remain safe.

