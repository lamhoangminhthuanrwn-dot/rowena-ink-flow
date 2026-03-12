import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { paymentStatusLabels, bookingStatusLabels } from "@/lib/statusLabels";
import type { Booking } from "@/types/database";

interface BookingsTabProps {
  userId: string;
}

const BookingsTab = ({ userId }: BookingsTabProps) => {
  const navigate = useNavigate();

  const { data: bookings = [] } = useQuery<Booking[]>({
    queryKey: ["account-bookings", userId],
    queryFn: async () => {
      const { data } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      return data || [];
    },
  });

  if (bookings.length === 0) {
    return (
      <div className="rounded-lg border border-border/50 bg-card p-8 text-center">
        <p className="text-muted-foreground">Bạn chưa có lịch hẹn nào.</p>
        <Button
          className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => navigate("/dat-lich")}
        >
          Đặt lịch ngay
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {bookings.map((b) => {
        const bs = bookingStatusLabels[b.booking_status] || bookingStatusLabels.pending;
        const ps = paymentStatusLabels[b.payment_status] || paymentStatusLabels.unpaid;
        return (
          <div key={b.id} className="rounded-lg border border-border/50 bg-card p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-xs text-primary">{b.booking_code}</p>
                <p className="mt-1 font-semibold text-foreground">{b.product_name}</p>
                <p className="text-xs text-muted-foreground">
                  {b.preferred_date} · {b.preferred_time}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${bs.className}`}>
                  {bs.text}
                </span>
                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${ps.className}`}>
                  {ps.text}
                </span>
              </div>
            </div>
            {b.reject_reason && (
              <p className="mt-2 text-xs text-destructive">Lý do từ chối: {b.reject_reason}</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default BookingsTab;
