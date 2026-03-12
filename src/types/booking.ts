export interface Booking {
  id: string;
  booking_code: string;
  user_id: string | null;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  product_name: string;
  design_name?: string;
  notes: string | null;
  reference_images: string[];
  preferred_date: string;
  preferred_time: string;
  placement: string | null;
  size: string | null;
  payment_status: "unpaid" | "pending_verify" | "paid" | "rejected";
  booking_status: "new" | "pending" | "confirmed" | "completed" | "cancelled";
  branch_id: string | null;
  branch_name: string | null;
  artist_id: string | null;
  total_price: number | null;
  deposit_amount: number | null;
  deposit_receipts: string[] | null;
  reject_reason: string | null;
  referral_code: string | null;
  created_at: string;
  artists?: { name: string } | null;
}

export interface WalletData {
  balance_vnd: number;
  reserved_vnd: number;
}

export interface WalletTransaction {
  id: string;
  user_id: string;
  type: string;
  amount_vnd: number;
  description: string | null;
  created_at: string;
}

export interface Withdrawal {
  id: string;
  user_id: string;
  amount_vnd: number;
  momo_phone: string;
  momo_name: string | null;
  status: "pending" | "approved" | "paid" | "rejected";
  note: string | null;
  created_at: string;
}

export interface PriceHistoryEntry {
  id: string;
  booking_id: string;
  old_price: number | null;
  new_price: number;
  changed_by: string;
  changed_by_name?: string;
  created_at: string;
}
