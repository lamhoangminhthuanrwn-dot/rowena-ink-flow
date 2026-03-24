import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Loader2, MessageCircle } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";
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
      try {
        const { data, error } = await supabase.functions.invoke("get-booking", {
          body: { booking_code: bookingCode },
        });

        if (error || !data?.booking) {
          console.error("Fetch booking error:", error);
          setLoading(false);
          return;
        }

        setBooking(data.booking);
        if (data.referral_code) setReferralCode(data.referral_code);
      } catch (err) {
        console.error("Fetch booking error:", err);
      } finally {
        setLoading(false);
      }
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
          <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground">Không tìm thấy thông tin booking.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 border border-foreground px-6 py-3 font-mono text-sm font-bold uppercase tracking-[0.15em] text-foreground hover:bg-foreground hover:text-background transition-colors"
          >
            VỀ TRANG CHỦ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-16">
      <div className="mx-auto max-w-lg px-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center border border-primary">
            <Check className="text-primary" size={32} />
          </div>
          <h1 className="font-serif text-3xl font-bold uppercase tracking-tight text-foreground">ĐẶT LỊCH THÀNH CÔNG!</h1>
          <p className="mt-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Cảm ơn bạn đã chọn ROWENA. Chúng tôi sẽ liên hệ xác nhận trong 24 giờ.
          </p>
        </motion.div>

        <BookingSummary
          bookingCode={booking.booking_code as string}
          customerName={booking.customer_name as string}
          phone={booking.customer_phone as string}
          email={(booking.customer_email as string) || ""}
          branchName={(booking.branch_name as string) || undefined}
          artistName={(booking.artist_name as string) || undefined}
          designName={(booking.product_name as string) || ""}
          placement={(booking.placement as string) || ""}
          size={(booking.size as string) || ""}
          style=""
          appointmentDate={(booking.preferred_date as string) || ""}
          appointmentTime={(booking.preferred_time as string) || ""}
          note={(booking.notes as string) || (booking.note as string) || ""}
        />

        <div className="mb-6 border border-border bg-secondary p-4 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">
            Cần hỗ trợ nhanh hơn?
          </p>
          <a
            href={siteConfig.zaloLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground transition-all hover:bg-foreground hover:text-background"
          >
            <MessageCircle size={14} />
            Nhắn Zalo để được hỗ trợ
          </a>
        </div>

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
