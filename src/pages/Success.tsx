import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import BookingSummary from "@/components/success/BookingSummary";
import ReferralBanner from "@/components/success/ReferralBanner";
import DepositSection from "@/components/success/DepositSection";

interface BookingState {
  bookingCode: string;
  customerName: string;
  phone: string;
  email: string;
  designName: string;
  placement: string;
  size: string;
  style: string;
  appointmentDate: string;
  appointmentTime: string;
  note: string;
  referenceImages?: string[];
  userId?: string | null;
  branchId?: string;
  branchName?: string;
  artistId?: string | null;
  artistName?: string;
  selectedPrice?: number | null;
}

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState("");
  const [bookingInserted, setBookingInserted] = useState(false);
  const insertingRef = useRef(false);

  const state = location.state as BookingState | null;
  const savedRefCode = useRef(localStorage.getItem("ref_code")).current;
  const [referralCode, setReferralCode] = useState<string | null>(null);

  useEffect(() => {
    if (!state?.userId) return;
    supabase.from("profiles").select("referral_code").eq("id", state.userId).single()
      .then(({ data }) => { if (data?.referral_code) setReferralCode(data.referral_code); });
  }, [state?.userId]);

  const insertBooking = useCallback(async () => {
    if (!state || insertingRef.current || bookingInserted) return;
    insertingRef.current = true;
    try {
      const { error } = await supabase.from("bookings").insert([{
        booking_code: state.bookingCode,
        user_id: state.userId || null,
        customer_name: state.customerName,
        customer_phone: state.phone,
        customer_email: state.email,
        product_name: state.designName,
        notes: state.note,
        reference_images: state.referenceImages || [],
        preferred_date: state.appointmentDate,
        preferred_time: state.appointmentTime,
        placement: state.placement,
        size: state.size,
        payment_status: "unpaid",
        booking_status: "new",
        branch_id: state.branchId || null,
        branch_name: state.branchName || null,
        artist_id: state.artistId || null,
        referral_code: savedRefCode,
        total_price: state.selectedPrice || null,
      }]);
      if (error) {
        console.error("Booking insert error:", error);
        toast.error("Không thể lưu đơn đặt lịch. Vui lòng thử lại.");
      } else {
        setBookingInserted(true);
        try {
          await supabase.functions.invoke("send-booking-email", {
            body: {
              booking_code: state.bookingCode, customer_name: state.customerName, phone: state.phone,
              email: state.email, design_name: state.designName, placement: state.placement,
              size: state.size, style: state.style, appointment_date: state.appointmentDate,
              appointment_time: state.appointmentTime, note: state.note, reference_urls: state.referenceImages || [],
            },
          });
        } catch (emailErr) { console.warn("Email notification failed:", emailErr); }
      }
    } catch (err) {
      console.error("Insert booking error:", err);
      toast.error("Không thể lưu đơn đặt lịch. Vui lòng thử lại.");
    }
  }, [state, bookingInserted]);

  useEffect(() => { if (state) insertBooking(); }, [state, insertBooking]);

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
  };

  if (!state) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-16">
        <div className="text-center">
          <p className="text-muted-foreground">Không tìm thấy thông tin booking.</p>
          <Button className="mt-4" onClick={() => navigate("/")}>Về trang chủ</Button>
        </div>
      </div>
    );
  }

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
          bookingCode={state.bookingCode} customerName={state.customerName} phone={state.phone}
          email={state.email} branchName={state.branchName} artistName={state.artistName}
          designName={state.designName} placement={state.placement} size={state.size}
          style={state.style} appointmentDate={state.appointmentDate} appointmentTime={state.appointmentTime}
          note={state.note}
        />

        <ReferralBanner referralCode={referralCode} copied={copied} onCopy={copyText} />

        <DepositSection
          bookingCode={state.bookingCode}
          bookingInserted={bookingInserted}
          onInsertBooking={insertBooking}
          onSubmitted={() => {}}
          onSkipped={() => {}}
        />
      </div>
    </div>
  );
};

export default Success;
