import { useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { tattooDesigns, formatVND } from "@/data/tattooDesigns";
import { Check, Upload, ArrowRight, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const steps = ["Chọn mẫu", "Thông tin", "Lịch hẹn"];

const Booking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [step, setStep] = useState(0);
  const [selectedDesign, setSelectedDesign] = useState(searchParams.get("design") || "");
  const [form, setForm] = useState({
    name: profile?.full_name || "",
    phone: profile?.phone || "",
    email: user?.email || "",
    note: "",
    placement: "",
    size: "",
    style: "",
  });
  const [schedule, setSchedule] = useState({ date: "", time: "" });
  const [referenceFiles, setReferenceFiles] = useState<File[]>([]);
  const [referencePreviews, setReferencePreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const design = tattooDesigns.find((d) => d.id === selectedDesign);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setReferenceFiles((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => setReferencePreviews((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (idx: number) => {
    setReferenceFiles((prev) => prev.filter((_, i) => i !== idx));
    setReferencePreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const code = `BK${Date.now().toString(36).toUpperCase().slice(-6)}`;

      const uploadedUrls: string[] = [];
      for (let i = 0; i < referenceFiles.length; i++) {
        const file = referenceFiles[i];
        const ext = file.name.split(".").pop();
        const folder = user?.id || 'anon';
        const path = `references/${folder}/${code}_${i}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("booking-uploads")
          .upload(path, file, { upsert: true });
        if (!uploadError) {
          const { data: urlData } = await supabase.storage.from("booking-uploads").createSignedUrl(path, 60 * 60 * 24 * 30);
          if (urlData?.signedUrl) uploadedUrls.push(urlData.signedUrl);
        }
      }

      // Navigate to success page with all data — booking will be inserted there
      navigate("/success", {
        state: {
          bookingCode: code,
          customerName: form.name,
          phone: form.phone,
          email: form.email,
          designName: design?.name || "Tùy chỉnh",
          placement: form.placement,
          size: form.size,
          style: form.style,
          appointmentDate: schedule.date,
          appointmentTime: schedule.time,
          note: form.note,
          referenceImages: uploadedUrls,
          userId: user?.id || null,
        },
      });
    } finally {
      setSubmitting(false);
    }
  };

  const canNext = () => {
    if (step === 0) return !!selectedDesign;
    if (step === 1) return form.name.trim() && form.phone.trim();
    if (step === 2) return schedule.date && schedule.time;
    return false;
  };

  return (
    <div className="pt-20 pb-16">
      <div className="mx-auto max-w-2xl px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="font-serif text-3xl font-bold text-foreground">Đặt lịch xăm</h1>
          <p className="mt-2 text-sm text-muted-foreground">Hoàn thành các bước bên dưới để đặt lịch</p>
        </motion.div>

        {/* Progress */}
        <div className="mt-8 mb-10">
          <div className="flex items-center justify-between">
            {steps.map((s, i) => (
              <div key={s} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                    i <= step ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                  }`}>
                    {i < step ? <Check size={14} /> : i + 1}
                  </div>
                  <span className="mt-1.5 hidden text-[10px] text-muted-foreground sm:block">{s}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`mx-2 h-px flex-1 transition-colors ${i < step ? "bg-primary" : "bg-border"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {step === 0 && (
              <div className="space-y-3">
                <h2 className="font-serif text-xl font-semibold text-foreground">Chọn mẫu xăm</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {tattooDesigns.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setSelectedDesign(d.id)}
                      className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-all ${
                        selectedDesign === d.id
                          ? "border-primary bg-primary/5"
                          : "border-border/50 bg-card hover:border-foreground/20"
                      }`}
                    >
                      <img src={d.image} alt={d.name} className="h-16 w-16 rounded object-cover" loading="lazy" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">{d.name}</p>
                        <p className="text-xs text-primary">{formatVND(d.price)}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <h2 className="font-serif text-xl font-semibold text-foreground">Thông tin cá nhân</h2>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">Họ tên *</label>
                    <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full rounded-lg border border-border bg-secondary/30 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                      placeholder="Nguyễn Văn A" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">Số điện thoại *</label>
                    <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full rounded-lg border border-border bg-secondary/30 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                      placeholder="0901 234 567" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">Email</label>
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full rounded-lg border border-border bg-secondary/30 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                      placeholder="email@example.com" />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-muted-foreground">Vị trí xăm</label>
                      <input type="text" value={form.placement} onChange={(e) => setForm({ ...form, placement: e.target.value })}
                        className="w-full rounded-lg border border-border bg-secondary/30 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                        placeholder="Bắp tay, lưng..." />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-muted-foreground">Kích thước</label>
                      <input type="text" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })}
                        className="w-full rounded-lg border border-border bg-secondary/30 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                        placeholder="10x15 cm" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">Phong cách</label>
                    <input type="text" value={form.style} onChange={(e) => setForm({ ...form, style: e.target.value })}
                      className="w-full rounded-lg border border-border bg-secondary/30 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                      placeholder="Truyền thống, tối giản, realistic..." />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">Ghi chú</label>
                    <textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} rows={3}
                      className="w-full rounded-lg border border-border bg-secondary/30 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                      placeholder="Yêu cầu đặc biệt..." />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">Ảnh tham khảo (tùy chọn)</label>
                    <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
                    {referencePreviews.length > 0 && (
                      <div className="mb-2 flex flex-wrap gap-2">
                        {referencePreviews.map((p, i) => (
                          <div key={i} className="relative">
                            <img src={p} alt={`Ref ${i + 1}`} className="h-20 w-20 rounded-lg border border-border/50 object-cover" />
                            <button onClick={() => removeFile(i)} className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">×</button>
                          </div>
                        ))}
                      </div>
                    )}
                    <button
                      onClick={() => fileRef.current?.click()}
                      className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border py-6 text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
                    >
                      <Upload size={18} />
                      Thêm ảnh tham khảo
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="font-serif text-xl font-semibold text-foreground">Chọn lịch hẹn</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">Ngày *</label>
                    <input type="date" value={schedule.date} onChange={(e) => setSchedule({ ...schedule, date: e.target.value })}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full rounded-lg border border-border bg-secondary/30 px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">Giờ *</label>
                    <select value={schedule.time} onChange={(e) => setSchedule({ ...schedule, time: e.target.value })}
                      className="w-full rounded-lg border border-border bg-secondary/30 px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none">
                      <option value="">Chọn giờ</option>
                      {["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"].map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>
                {design && (
                  <div className="rounded-lg border border-border/50 bg-card p-4">
                    <p className="text-xs text-muted-foreground">Mẫu đã chọn</p>
                    <p className="text-sm font-semibold text-foreground">{design.name}</p>
                    <p className="text-sm text-primary">{formatVND(design.price)}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Thời gian ước tính: {design.duration}</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex justify-between">
          <Button
            variant="ghost"
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="gap-1"
          >
            <ArrowLeft size={16} /> Quay lại
          </Button>
          {step < 2 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!canNext()}
              className="gap-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Tiếp theo <ArrowRight size={16} />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canNext() || submitting}
              className="gap-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {submitting ? "Đang gửi..." : "Đặt lịch"} <ArrowRight size={16} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Booking;