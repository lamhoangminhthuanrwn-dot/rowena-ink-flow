import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Copy, Home, Upload, Wallet, SkipForward } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { bankInfo, generateTransferContent, generateVietQRUrl, generateZaloPayUrl } from "@/data/bankInfo";
import { formatVND } from "@/data/tattooDesigns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
}

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState("");
  const [depositFiles, setDepositFiles] = useState<File[]>([]);
  const [depositPreviews, setDepositPreviews] = useState<string[]>([]);
  const [depositNote, setDepositNote] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [bookingInserted, setBookingInserted] = useState(false);
  const depositFileRef = useRef<HTMLInputElement>(null);
  const insertingRef = useRef(false);

  const state = location.state as BookingState | null;

  // Insert booking into DB
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
      }]);

      if (error) {
        console.error("Booking insert error:", error);
      } else {
        setBookingInserted(true);
        // Send email notification
        try {
          await supabase.functions.invoke("send-booking-email", {
            body: {
              booking_code: state.bookingCode,
              customer_name: state.customerName,
              phone: state.phone,
              email: state.email,
              design_name: state.designName,
              placement: state.placement,
              size: state.size,
              style: state.style,
              appointment_date: state.appointmentDate,
              appointment_time: state.appointmentTime,
              note: state.note,
              reference_urls: state.referenceImages || [],
            },
          });
        } catch (emailErr) {
          console.warn("Email notification failed:", emailErr);
        }
      }
    } catch (err) {
      console.error("Insert booking error:", err);
    }
  }, [state, bookingInserted]);

  // Insert on page unload / tab close
  useEffect(() => {
    if (!state) return;

    const handleBeforeUnload = () => {
      if (!insertingRef.current && !bookingInserted) {
        // Use sendBeacon for reliable unload
        const payload = JSON.stringify({
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
        });

        const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/bookings`;
        navigator.sendBeacon(
          url + `?apikey=${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          new Blob([payload], { type: "application/json" })
        );
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [state, bookingInserted]);

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

  const transferContent = generateTransferContent(state.bookingCode);
  const qrUrl = generateVietQRUrl(state.bookingCode);

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
  };

  const handleDepositFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 3 - depositFiles.length);
    setDepositFiles((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => setDepositPreviews((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const removeDepositFile = (idx: number) => {
    setDepositFiles((prev) => prev.filter((_, i) => i !== idx));
    setDepositPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleDepositSubmit = async () => {
    if (depositFiles.length === 0) {
      toast.error("Vui lòng tải lên ít nhất 1 ảnh biên lai.");
      return;
    }
    setUploading(true);
    try {
      // Insert booking first if not yet
      await insertBooking();

      const uploadedPaths: string[] = [];
      for (let i = 0; i < depositFiles.length; i++) {
        const file = depositFiles[i];
        const ext = file.name.split(".").pop();
        const path = `deposits/${state.bookingCode}_${Date.now()}_${i}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("booking-uploads")
          .upload(path, file, { upsert: true });
        if (uploadError) {
          console.error("Upload error:", uploadError);
        } else {
          uploadedPaths.push(path);
        }
      }

      if (uploadedPaths.length === 0) {
        toast.error("Không thể tải ảnh lên. Vui lòng thử lại.");
        setUploading(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke("upload-deposit", {
        body: {
          booking_code: state.bookingCode,
          receipt_paths: uploadedPaths,
          deposit_note: depositNote || undefined,
        },
      });

      if (error || (data && data.error)) {
        console.error("Deposit upload error:", data?.error || error?.message);
        toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
      } else {
        toast.success("Đã gửi biên lai! Chúng tôi sẽ xác nhận trong thời gian sớm nhất.");
        setSubmitted(true);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSkip = async () => {
    await insertBooking();
    toast.success("Đơn đặt lịch đã được gửi!");
  };

  const handleGoHome = async () => {
    await insertBooking();
    navigate("/");
  };

  return (
    <div className="pt-20 pb-16">
      <div className="mx-auto max-w-lg px-4">
        {/* Thank you */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-8"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Check className="text-primary" size={32} />
          </div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Đặt lịch thành công!</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Cảm ơn bạn đã chọn ROWENA. Chúng tôi sẽ liên hệ xác nhận lịch hẹn trong vòng 24 giờ.
          </p>
        </motion.div>

        {/* Booking Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-lg border border-border/50 bg-card p-6 mb-6"
        >
          <h2 className="font-serif text-lg font-semibold text-foreground mb-4">Thông tin đặt lịch</h2>
          <div className="space-y-2.5 text-sm">
            {[
              { label: "Mã booking", value: state.bookingCode, mono: true },
              { label: "Họ tên", value: state.customerName },
              { label: "Số điện thoại", value: state.phone },
              { label: "Email", value: state.email },
              { label: "Mẫu xăm", value: state.designName },
              { label: "Vị trí", value: state.placement },
              { label: "Kích thước", value: state.size },
              { label: "Phong cách", value: state.style },
              { label: "Ngày hẹn", value: `${state.appointmentDate} · ${state.appointmentTime}` },
              { label: "Ghi chú", value: state.note },
            ].filter((r) => r.value).map((row) => (
              <div key={row.label} className="flex justify-between">
                <span className="text-muted-foreground">{row.label}</span>
                <span className={`text-foreground ${row.mono ? "font-mono font-semibold text-primary" : ""}`}>{row.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Deposit Instruction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-lg border border-primary/20 bg-primary/5 p-6 mb-6"
        >
          <h2 className="font-serif text-lg font-semibold text-foreground mb-2">Đặt cọc để được ưu tiên lịch</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Đặt cọc <span className="font-semibold text-primary">{formatVND(bankInfo.depositAmount)}</span> để được ưu tiên lịch. Đây không phải bước bắt buộc.
          </p>

          {/* QR Code */}
          <div className="text-center mb-4">
            <img
              src={qrUrl}
              alt="VietQR"
              className="mx-auto h-48 w-48 rounded-lg border border-border/50"
              loading="lazy"
            />
            <p className="mt-2 text-xs text-muted-foreground">Quét mã QR bằng app ngân hàng</p>
          </div>

          {/* Bank details */}
          <div className="space-y-2 rounded-lg border border-border/50 bg-card p-4">
            {[
              { label: "Ngân hàng", value: bankInfo.bankName },
              { label: "Số tài khoản", value: bankInfo.accountNumber, copyable: true },
              { label: "Tên tài khoản", value: bankInfo.accountName },
              { label: "Nội dung CK", value: transferContent, copyable: true },
              { label: "Số tiền", value: formatVND(bankInfo.depositAmount) },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between py-1.5 text-sm">
                <span className="text-muted-foreground">{row.label}</span>
                <span className="flex items-center gap-2 font-medium text-foreground">
                  {row.value}
                  {row.copyable && (
                    <button
                      onClick={() => copyText(row.value, row.label)}
                      className="text-muted-foreground transition-colors hover:text-primary"
                      title="Sao chép"
                    >
                      {copied === row.label ? <Check size={14} className="text-primary" /> : <Copy size={14} />}
                    </button>
                  )}
                </span>
              </div>
            ))}
          </div>

          {/* ZaloPay Button */}
          <a
            href={generateZaloPayUrl(state.bookingCode)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#008fe5" }}
          >
            <Wallet size={18} />
            Mở ZaloPay để thanh toán
          </a>
        </motion.div>

        {/* Deposit Proof Upload */}
        {!submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="rounded-lg border border-border/50 bg-card p-6 mb-6"
          >
            <h2 className="font-serif text-lg font-semibold text-foreground mb-2">Tôi đã chuyển khoản</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Tải lên 1–3 ảnh biên lai chuyển khoản để xác nhận đặt cọc.
            </p>

            <input ref={depositFileRef} type="file" accept="image/*" multiple onChange={handleDepositFileChange} className="hidden" />

            {depositPreviews.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {depositPreviews.map((p, i) => (
                  <div key={i} className="relative">
                    <img src={p} alt={`Receipt ${i + 1}`} className="h-20 w-20 rounded-lg border border-border/50 object-cover" />
                    <button onClick={() => removeDepositFile(i)} className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">×</button>
                  </div>
                ))}
              </div>
            )}

            {depositFiles.length < 3 && (
              <button
                onClick={() => depositFileRef.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border py-4 text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground mb-3"
              >
                <Upload size={18} />
                Tải ảnh biên lai ({depositFiles.length}/3)
              </button>
            )}

            <div className="mb-3">
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Ghi chú (tùy chọn)</label>
              <input
                type="text"
                value={depositNote}
                onChange={(e) => setDepositNote(e.target.value)}
                className="w-full rounded-lg border border-border bg-secondary/30 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                placeholder="Ghi chú thêm..."
              />
            </div>

            <Button
              onClick={handleDepositSubmit}
              disabled={depositFiles.length === 0 || uploading}
              className="w-full"
            >
              {uploading ? "Đang tải lên..." : "Gửi biên lai xác nhận"}
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-primary/20 bg-primary/5 p-6 mb-6 text-center"
          >
            <Check className="mx-auto mb-2 text-primary" size={32} />
            <p className="font-semibold text-foreground">Biên lai đã được gửi!</p>
            <p className="text-sm text-muted-foreground">Chúng tôi sẽ xác nhận thanh toán trong thời gian sớm nhất.</p>
          </motion.div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col items-center gap-3">
          {!submitted && (
            <Button
              variant="outline"
              className="gap-2"
              onClick={handleSkip}
              disabled={bookingInserted}
            >
              <SkipForward size={16} />
              {bookingInserted ? "Đã gửi đơn" : "Bỏ qua, gửi đơn không cọc"}
            </Button>
          )}
          <Button className="gap-2" onClick={handleGoHome}>
            <Home size={16} /> Về trang chủ
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Success;
