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

    const bookingChannel = supabase
      .channel("admin-booking-alerts")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "bookings" },
        (payload) => {
          playNotificationSound();
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

    const withdrawalChannel = supabase
      .channel("admin-withdrawal-alerts")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "withdrawals" },
        (payload) => {
          playNotificationSound();
          const w = payload.new as Record<string, unknown>;
          const amount = new Intl.NumberFormat("vi-VN").format(Number(w.amount_vnd)) + "đ";
          toast(`Yêu cầu rút tiền: ${amount}`, {
            description: `MoMo: ${w.momo_phone}${w.momo_name ? ` - ${w.momo_name}` : ""}`,
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
      supabase.removeChannel(bookingChannel);
      supabase.removeChannel(withdrawalChannel);
    };
  }, [isAdmin, navigate]);

  return null;
};

export default AdminBookingNotifier;
