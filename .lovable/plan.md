

## Plan: Update pricing model for Xăm full ngực & Xăm full bụng

### Problem
Ngực and bụng currently use the standard 2-option schedule (sessions + "Xong trong ngày"). The user wants a 3-option schedule for both BW and Color:
- **Trả hết** (1 buổi) — 3,500,000 (BW) / 5,200,000 (Color)
- **1,5 buổi** — 5,500,000 (both)
- **2 buổi** — 7,000,000 (both)

### Changes

**`src/data/tattooDesigns.ts`**

1. Add optional `scheduleOptions` field to `TattooVariant`:
   ```ts
   scheduleOptions?: { label: string; price: number }[];
   ```
2. Replace `makeFullBodyVariants` for ngực (id=4) and bụng (id=5) with manual variants that include `scheduleOptions`. Each variant (per position × style) will have:
   - BW: `scheduleOptions: [{ label: "Trả hết", price: 3500000 }, { label: "1,5 buổi", price: 5500000 }, { label: "2 buổi", price: 7000000 }]`
   - Color: `scheduleOptions: [{ label: "Trả hết", price: 5200000 }, { label: "1,5 buổi", price: 5500000 }, { label: "2 buổi", price: 7000000 }]`

**`src/components/BookingOptionStep.tsx`**

3. In the **Tiến độ** step: when `selectedVariant.scheduleOptions` exists, render those as buttons instead of the current simple/sameday pair. Track selected schedule index instead of `scheduleType`.
4. When `scheduleOptions` is used, auto-set `paymentType = "full"` and hide the payment step (similar to mini behavior). The selected option's price becomes the final price directly.
5. Hide the "Hình khó" note when `scheduleOptions` is present (prices are already explicit).

No other files need changes — the `SelectedOptions` output to the parent remains compatible.

