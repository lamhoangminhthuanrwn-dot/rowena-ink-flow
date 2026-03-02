

## Plan: Restructure all full body tattoo pricing to 3-option schedule model

### Approach
Convert ALL full body designs (lưng, tay, chân, ngực, bụng) to use `scheduleOptions` with 3 choices: **Trả hết 1 lần**, **Trả theo buổi**, **Xong trong ngày**. Each option has a fixed price and session count. Per-session display is always 3.500.000đ.

### File 1: `src/data/tattooDesigns.ts`

**Extend `ScheduleOption`** to include sessions and notes:
```ts
interface ScheduleOption {
  label: string;
  price: number;
  sessions?: string;     // e.g. "2 buổi"
  note?: string;          // e.g. "Bắt buộc 2 buổi"
  isPerSession?: boolean; // true for "Trả theo buổi" → show 3.5M/buổi
}
```

**Rewrite `makeFullBodyVariants`** to generate 3 scheduleOptions per variant. Handle the Linework exception for chân màu separately.

Full pricing data:

```text
             │ Trả hết 1 lần       │ Trả theo buổi          │ Xong trong ngày
─────────────┼──────────────────────┼────────────────────────┼──────────────────
Lưng BW      │ 7,000,000 / 2 buổi  │ 10,500,000 / 3 buổi   │ 7,500,000
Lưng Color   │ 13,200,000 / 4 buổi │ 18,000,000 / 6 buổi   │ 15,000,000 (2 buổi)
Tay BW       │ 6,600,000 / 2 buổi  │ 10,000,000 / 3 buổi   │ 7,500,000
Tay Color    │ 6,999,999 / 2 buổi  │ 10,000,000 / 3 buổi   │ 7,500,000
Chân BW      │ 9,900,000 / 3 buổi  │ 13,200,000 / 4 buổi   │ 11,500,000
Chân Color   │ 13,500,000 / 4 buổi │ 18,000,000 / 6 buổi   │ 14,000,000 (2 buổi)
Chân Color LW│ 9,900,000 / 3 buổi  │ 16,500,000 / 5 buổi   │ 14,000,000 (2 buổi)
Ngực BW      │ 3,500,000 / 1 buổi  │ 7,000,000 / 2 buổi    │ 5,500,000
Ngực Color   │ 5,200,000 / 1,5 buổi│ 7,000,000 / 2 buổi    │ 5,500,000
Bụng BW      │ 3,500,000 / 1 buổi  │ 7,000,000 / 2 buổi    │ 5,500,000
Bụng Color   │ 5,200,000 / 1,5 buổi│ 7,000,000 / 2 buổi    │ 5,500,000
```

- Remove old `makeChestBellyVariants`, `bwScheduleOptions`, `colorScheduleOptions`
- Remove `priceSimple`, `priceSameDay`, `priceDifficult`, `priceDifficultSessions` from full body variants (all pricing now lives in `scheduleOptions`)

### File 2: `src/components/BookingOptionStep.tsx`

**Update price display logic:**
- When selected option has `isPerSession: true` → show "3.500.000đ / buổi" as main price, "Tổng X buổi: Yđ" as subtitle
- When option has `note` → show the note (e.g. "Bắt buộc 2 buổi")
- When option has `sessions` → show sessions info
- Remove old payment step (Trả hết / Trả theo buổi) for full body — the 3 schedule option buttons replace it entirely
- Remove "Hình khó" display for scheduleOptions variants
- Keep existing mini/A4 flow unchanged

### Flow after changes
Position → Style → **3 buttons** (Trả hết 1 lần / Trả theo buổi / Xong trong ngày) → Price display

