import { Database } from "@/integrations/supabase/types";

export type Booking = Database["public"]["Tables"]["bookings"]["Row"];
export type BookingWithArtist = Booking & { artists: { name: string } | null };
export type Withdrawal = Database["public"]["Tables"]["withdrawals"]["Row"];
export type WalletTransaction = Database["public"]["Tables"]["wallet_transactions"]["Row"];
export type BookingPriceHistory = Database["public"]["Tables"]["booking_price_history"]["Row"] & {
  changed_by_name?: string;
};
export type Wallet = Database["public"]["Tables"]["wallet"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
