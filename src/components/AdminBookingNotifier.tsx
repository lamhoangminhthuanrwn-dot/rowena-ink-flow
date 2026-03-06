import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const AdminBookingNotifier = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) return;

    const channel = supabase
      .channel("admin-booking-alerts")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "bookings" },
        (payload) => {
          const booking = payload.new as Record<string, unknown>;
          toast(`Booking mới: ${booking.booking_code}`, {
            description: `${booking.customer_name} - ${booking.product_name || "Tự thiết kế"}`,
            duration: 10000,
            action: {
              label: "Xem",
              onClick: () => navigate("/ketoan"),
            },
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin, navigate]);

  return null;
};

export default AdminBookingNotifier;
