import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import BookingSummary from "@/components/success/BookingSummary";
import ReferralBanner from "@/components/success/ReferralBanner";
import DepositSection from "@/components/success/DepositSection";

const Success = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState("");
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<Record<string, unknown> | null>(null);
  const [referralCode, setReferralCode] = useState<string | null>(null);

  const bookingCode = searchParams.get("code");

  useEffect(() => {
    if (!bookingCode) {
      setLoading(false);
      return;
    }

    const fetchBooking = async () => {
      // Try as authenticated user first, then anon
      const { data, error } = await supabase
        .from("bookings")
        .select("*, artists(name)")
        .eq("booking_code", bookingCode)
        .single();

      if (error || !data) {
        console.error("Fetch booking error:", error);
        setLoading(false);
        return;
      }

      setBooking(data);

      // Fetch referral code if user is logged in
      if (data.user_id) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("referral_code")
          .eq("id", data.user_id as string)
          .single();
        if (profile?.referral_code) setReferralCode(profile.referral_code);
      }

      setLoading(false);
    };

    fetchBooking();
  }, [bookingCode]);

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!bookingCode || !booking) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-16">
        <div className="text-center">
          <p className="text-muted-foreground">Không tìm thấy thông tin booking.</p>
          <Button className="mt-4" onClick={() => navigate("/")}>Về trang chủ</Button>
        </div>
      </div>
    );
  }

  const artistName = (booking.artists as { name: string } | null)?.name;

  return (
    <div className="pt-20 pb-16">
      <div className="mx-auto max-w-lg px-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Check className="text-primary" size={32} />
          </div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Đặt lịch thành công!</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Cảm ơn bạn đã chọn ROWENA. Chúng tôi sẽ liên hệ xác nhận lịch hẹn trong vòng 24 giờ.
          </p>
        </motion.div>

        <BookingSummary
          bookingCode={booking.booking_code as string}
          customerName={booking.customer_name as string}
          phone={booking.customer_phone as string}
          email={(booking.customer_email as string) || ""}
          branchName={(booking.branch_name as string) || undefined}
          artistName={artistName || undefined}
          designName={(booking.product_name as string) || ""}
          placement={(booking.placement as string) || ""}
          size={(booking.size as string) || ""}
          style=""
          appointmentDate={(booking.preferred_date as string) || ""}
          appointmentTime={(booking.preferred_time as string) || ""}
          note={(booking.notes as string) || (booking.note as string) || ""}
        />

        <ReferralBanner referralCode={referralCode} copied={copied} onCopy={copyText} />

        <DepositSection
          bookingCode={booking.booking_code as string}
          bookingInserted={true}
          onInsertBooking={async () => {}}
          onSubmitted={() => {}}
          onSkipped={() => {}}
        />
      </div>
    </div>
  );
};

export default Success;
