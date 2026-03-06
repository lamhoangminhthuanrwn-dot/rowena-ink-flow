import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const playNotificationSound = () => {
  try {
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.frequency.value = 800;
    oscillator.type = "sine";
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.5);
  } catch (e) {
    // Silently fail if AudioContext is not available
  }
};

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
