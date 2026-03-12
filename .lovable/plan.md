

## Plan: Create typed interfaces and replace `any[]`

### 1. Create `src/types/database.ts`

Export type aliases derived from the auto-generated Supabase types:

```ts
import { Database } from "@/integrations/supabase/types";

export type Booking = Database["public"]["Tables"]["bookings"]["Row"];
export type Withdrawal = Database["public"]["Tables"]["withdrawals"]["Row"];
export type WalletTransaction = Database["public"]["Tables"]["wallet_transactions"]["Row"];
export type BookingPriceHistory = Database["public"]["Tables"]["booking_price_history"]["Row"] & {
  changed_by_name?: string;
};
```

### 2. Update `src/pages/Account.tsx`

Replace `any[]` with proper types:
- `useState<any[]>([])` → `useState<Booking[]>([])`
- `useState<any[]>([])` → `useState<WalletTransaction[]>([])`
- `useState<any[]>([])` → `useState<Withdrawal[]>([])`

### 3. Update `src/pages/Ketoan.tsx`

- `useState<any[]>([])` for bookings → `useState<Booking[]>([])`
- `useState<any[]>([])` for withdrawals → `useState<Withdrawal[]>([])`
- `useState<any[]>([])` for priceHistory → `useState<BookingPriceHistory[]>([])`
- Remove `as any[]` and `as any` casts in `fetchPriceHistory`

No functional or visual changes. Only type safety improvements.

