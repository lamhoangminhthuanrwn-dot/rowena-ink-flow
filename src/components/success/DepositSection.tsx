import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, Wallet, Check, Copy, Home, SkipForward, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { bankInfo, generateTransferContent, generateZaloPayUrl } from "@/data/bankInfo";
import { formatVND } from "@/data/tattooDesigns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface DepositSectionProps {
  bookingCode: string;
  bookingInserted: boolean;
  onInsertBooking: () => Promise<void>;
  onSubmitted: () => void;
  onSkipped: () => void;
}

const DepositSection = ({ bookingCode, bookingInserted, onInsertBooking, onSubmitted, onSkipped }: DepositSectionProps) => {
  const navigate = useNavigate();
  const [depositFiles, setDepositFiles] = useState<File[]>([]);
  const [depositPreviews, setDepositPreviews] = useState<string[]>([]);
  const [depositNote, setDepositNote] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const [copied, setCopied] = useState("");
  const depositFileRef = useRef<HTMLInputElement>(null);

  const transferContent = generateTransferContent(bookingCode);
  const qrUrl = "/assets/qr-deposit.png";

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
      await onInsertBooking();

      const uploadedPaths: string[] = [];
      for (let i = 0; i < depositFiles.length; i++) {
        const file = depositFiles[i];
        const ext = file.name.split(".").pop();
        const path = `deposits/${bookingCode}_${Date.now()}_${i}.${ext}`;
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
          booking_code: bookingCode,
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
        onSubmitted();
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSkip = async () => {
    await onInsertBooking();
    setSkipped(true);
    onSkipped();
  };

  const handleGoHome = async () => {
    await onInsertBooking();
    navigate("/");
  };

  if (skipped || submitted) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-lg border border-primary/20 bg-primary/5 p-6 mb-6"
        >
          {submitted && (
            <div className="flex items-start gap-3 mb-4">
              <Check className="mt-0.5 shrink-0 text-primary" size={20} />
              <p className="text-sm text-foreground">
                <span className="font-semibold">Biên lai đã được gửi!</span>{" "}
                Chúng tôi sẽ xác nhận thanh toán trong thời gian sớm nhất.
              </p>
            </div>
          )}
          <div className="flex items-start gap-3">
            <Phone className="mt-0.5 shrink-0 text-primary" size={20} />
            <p className="text-sm text-foreground">
              <span className="font-semibold">Vui lòng chú ý điện thoại!</span>{" "}
              Nhân viên sẽ gọi hoặc nhắn tin để xác nhận lịch hẹn của bạn trong thời gian sớm nhất.
            </p>
          </div>
        </motion.div>
        <div className="flex justify-center">
          <Button className="gap-2" onClick={() => navigate("/")}>
            <Home size={16} /> Về trang chủ
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Deposit Instruction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-lg border border-primary/20 bg-primary/5 p-6 mb-6"
      >
        <h2 className="font-serif text-lg font-semibold text-foreground mb-2">Đặt cọc để được ưu tiên lịch</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Đặt cọc <span className="font-semibold text-primary">{formatVND(bankInfo.depositAmount)}</span> để được ưu
          tiên lịch. Đây không phải bước bắt buộc.
        </p>

        <div className="text-center mb-4">
          <img src={qrUrl} alt="VietQR" className="mx-auto h-48 w-48 rounded-lg border border-border/50" loading="lazy" />
          <p className="mt-2 text-xs text-muted-foreground">Quét mã QR bằng app ngân hàng</p>
        </div>

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
                  <button onClick={() => copyText(row.value, row.label)}
                    className="text-muted-foreground transition-colors hover:text-primary" title="Sao chép">
                    {copied === row.label ? <Check size={14} className="text-primary" /> : <Copy size={14} />}
                  </button>
                )}
              </span>
            </div>
          ))}
        </div>

        <a href={generateZaloPayUrl(bookingCode)} target="_blank" rel="noopener noreferrer"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#008fe5" }}>
          <Wallet size={18} /> Mở ZaloPay để thanh toán
        </a>
      </motion.div>

      {/* Upload */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-lg border border-border/50 bg-card p-6 mb-6"
      >
        <h2 className="font-serif text-lg font-semibold text-foreground mb-2">Tôi đã chuyển khoản</h2>
        <p className="text-sm text-muted-foreground mb-4">Tải lên 1–3 ảnh biên lai chuyển khoản để xác nhận đặt cọc.</p>

        <input ref={depositFileRef} type="file" accept="image/*" multiple onChange={handleDepositFileChange} className="hidden" />

        {depositPreviews.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {depositPreviews.map((p, i) => (
              <div key={i} className="relative">
                <img src={p} alt={`Receipt ${i + 1}`} className="h-20 w-20 rounded-lg border border-border/50 object-cover" />
                <button onClick={() => removeDepositFile(i)}
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {depositFiles.length < 3 && (
          <button onClick={() => depositFileRef.current?.click()}
            className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border py-4 text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground mb-3">
            <Upload size={18} /> Tải ảnh biên lai ({depositFiles.length}/3)
          </button>
        )}

        <div className="mb-3">
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Ghi chú (tùy chọn)</label>
          <Input type="text" value={depositNote} onChange={(e) => setDepositNote(e.target.value)}
            placeholder="Ghi chú thêm..." />
        </div>

        <Button onClick={handleDepositSubmit} disabled={depositFiles.length === 0 || uploading} className="w-full">
          {uploading ? "Đang tải lên..." : "Gửi biên lai xác nhận"}
        </Button>
      </motion.div>

      {/* Actions */}
      <div className="flex flex-col items-center gap-3">
        <Button variant="outline" className="gap-2" onClick={handleSkip} disabled={bookingInserted}>
          <SkipForward size={16} />
          {bookingInserted ? "Đã gửi đơn" : "Bỏ qua, không cọc"}
        </Button>
        <Button className="gap-2" onClick={handleGoHome}>
          <Home size={16} /> Về trang chủ
        </Button>
      </div>
    </>
  );
};

export default DepositSection;
