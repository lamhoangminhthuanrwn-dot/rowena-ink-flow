import { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { tattooDesigns, formatVNDShort } from "@/data/tattooDesigns";
import { Check, Upload, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import BookingOptionStep from "@/components/BookingOptionStep";
import type { SelectedOptions } from "@/components/BookingOptionStep";
import {
  infoStepSchema,
  scheduleStepSchema,
  validateFile,
  MAX_FILES,
  type InfoErrors,
  type ScheduleErrors,
} from "@/lib/bookingValidation";

interface Branch {
  id: string;
  name: string;
  slug: string;
}

interface Artist {
  id: string;
  name: string;
  branch_id: string;
}

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="mt-1 text-xs text-destructive">{message}</p> : null;

const Booking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [step, setStep] = useState(0);
  const [selectedDesign, setSelectedDesign] = useState(searchParams.get("design") || "");
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions | null>(null);
  const handleOptionsChange = useCallback((options: SelectedOptions | null) => {
    setSelectedOptions(options);
  }, []);
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
  const [selectedBranch, setSelectedBranch] = useState("");
  const [branches, setBranches] = useState<Branch[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [referenceFiles, setReferenceFiles] = useState<File[]>([]);
  const [referencePreviews, setReferencePreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [infoErrors, setInfoErrors] = useState<InfoErrors>({});
  const [scheduleErrors, setScheduleErrors] = useState<ScheduleErrors>({});
  const fileRef = useRef<HTMLInputElement>(null);

  const design = tattooDesigns.find((d) => d.id === selectedDesign);
  const hasVariants = design?.variants && design.variants.length > 0;

  // Dynamic steps: insert "Chọn tùy chọn" if design has variants
  const stepLabels = hasVariants
    ? ["Chọn mẫu", "Tùy chọn", "Thông tin", "Lịch hẹn"]
    : ["Chọn mẫu", "Thông tin", "Lịch hẹn"];

  // Map logical step to content step
  const getContentStep = () => {
    if (!hasVariants) {
      return step === 0 ? "design" : step === 1 ? "info" : "schedule";
    }
    return step === 0 ? "design" : step === 1 ? "options" : step === 2 ? "info" : "schedule";
  };

  const contentStep = getContentStep();

  useEffect(() => {
    const fetchData = async () => {
      const [{ data: b }, { data: a }] = await Promise.all([
        supabase.from("branches").select("id, name, slug").order("name"),
        supabase.from("artists").select("id, name, branch_id").eq("is_active", true),
      ]);
      if (b) setBranches(b);
      if (a) setArtists(a);
    };
    fetchData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = MAX_FILES - referenceFiles.length;
    if (remaining <= 0) {
      toast.error(`Tối đa ${MAX_FILES} ảnh tham khảo`);
      return;
    }
    const toAdd = files.slice(0, remaining);
    const validFiles: File[] = [];
    for (const file of toAdd) {
      const err = validateFile(file);
      if (err) {
        toast.error(err);
      } else {
        validFiles.push(file);
      }
    }
    if (files.length > remaining) {
      toast.warning(`Chỉ thêm được ${remaining} ảnh nữa`);
    }
    setReferenceFiles((prev) => [...prev, ...validFiles]);
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => setReferencePreviews((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
    // Reset input so same file can be selected again
    e.target.value = "";
  };

  const removeFile = (idx: number) => {
    setReferenceFiles((prev) => prev.filter((_, i) => i !== idx));
    setReferencePreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      // Artist assignment is handled server-side with availability check
      const branch = branches.find((b) => b.id === selectedBranch);

      // Upload reference images first
      const tempCode = `TMP${Date.now().toString(36).toUpperCase()}`;
      const uploadedPaths: string[] = [];
      for (let i = 0; i < referenceFiles.length; i++) {
        const file = referenceFiles[i];
        const ext = file.name.split(".").pop();
        const folder = user?.id || 'anon';
        const path = `references/${folder}/${tempCode}_${i}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("booking-uploads")
          .upload(path, file, { upsert: true });
        if (!uploadError) {
          uploadedPaths.push(path);
        }
      }

      // Call server-side Edge Function to create booking
      const savedRefCode = localStorage.getItem("ref_code");
      const { data, error } = await supabase.functions.invoke("create-booking", {
        body: {
          customer_name: form.name,
          phone: form.phone,
          email: form.email,
          design_name: design?.name || "Tùy chỉnh",
          placement: form.placement,
          size: form.size,
          style: form.style,
          preferred_date: schedule.date,
          preferred_time: schedule.time,
          note: form.note,
          reference_images: uploadedPaths,
          branch_id: selectedBranch || null,
          branch_name: branch?.name || null,
          // artist_id is assigned server-side based on availability
          referral_code: savedRefCode || null,
          total_price: selectedOptions?.finalPrice || null,
        },
      });

      if (error || data?.error) {
        console.error("Create booking error:", data?.error || error);
        toast.error("Không thể tạo đơn đặt lịch. Vui lòng thử lại.");
        return;
      }

      navigate(`/success?code=${encodeURIComponent(data.booking_code)}`);
    } catch (err) {
      console.error("Booking submit error:", err);
      toast.error("Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  const validateAndNext = () => {
    if (contentStep === "info") {
      const result = infoStepSchema.safeParse({
        name: form.name,
        phone: form.phone,
        email: form.email,
      });
      if (!result.success) {
        const fieldErrors: InfoErrors = {};
        result.error.issues.forEach((issue) => {
          const field = issue.path[0] as keyof InfoErrors;
          if (!fieldErrors[field]) fieldErrors[field] = issue.message;
        });
        setInfoErrors(fieldErrors);
        return;
      }
      setInfoErrors({});
    }
    if (contentStep === "schedule") {
      const result = scheduleStepSchema.safeParse({
        date: schedule.date,
        time: schedule.time,
        branch: selectedBranch,
      });
      if (!result.success) {
        const fieldErrors: ScheduleErrors = {};
        result.error.issues.forEach((issue) => {
          const field = issue.path[0] as keyof ScheduleErrors;
          if (!fieldErrors[field]) fieldErrors[field] = issue.message;
        });
        setScheduleErrors(fieldErrors);
        return;
      }
      setScheduleErrors({});
    }

    if (contentStep === "schedule") {
      // Last step — submit
      handleSubmit();
    } else {
      setStep(step + 1);
    }
  };

  const canNext = () => {
    if (contentStep === "design") return !!selectedDesign;
    if (contentStep === "options") return !!selectedOptions;
    if (contentStep === "info") return form.name.trim().length > 0 && form.phone.trim().length > 0;
    if (contentStep === "schedule") return schedule.date && schedule.time && !!selectedBranch;
    return false;
  };

  const isLastStep = step === stepLabels.length - 1;

  return (
    <div className="pt-20 pb-16">
      <div className="mx-auto max-w-2xl px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="font-sans text-3xl font-bold text-foreground">Đặt lịch xăm</h1>
          <p className="mt-2 text-sm text-muted-foreground">Hoàn thành các bước bên dưới để đặt lịch</p>
        </motion.div>

        {/* Progress */}
        <div className="mt-8 mb-10">
          <div className="flex items-center justify-between">
            {stepLabels.map((s, i) => (
              <div key={s} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                    i <= step ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                  }`}>
                    {i < step ? <Check size={14} /> : i + 1}
                  </div>
                  <span className="mt-1.5 hidden text-[10px] text-muted-foreground sm:block">{s}</span>
                </div>
                {i < stepLabels.length - 1 && (
                  <div className={`mx-2 h-px flex-1 transition-colors ${i < step ? "bg-primary" : "bg-border"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={contentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {contentStep === "design" && (
              <div className="space-y-3">
                <h2 className="font-sans text-xl font-semibold text-foreground">Chọn mẫu xăm</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {tattooDesigns.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => { setSelectedDesign(d.id); setSelectedOptions(null); }}
                      className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-all ${
                        selectedDesign === d.id
                          ? "border-primary bg-primary/5"
                          : "border-border/50 bg-card hover:border-foreground/20"
                      }`}
                    >
                      <img src={d.image} alt={d.name} className="h-16 w-16 rounded object-cover" loading="lazy" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">{d.name}</p>
                        <p className="text-xs text-primary">{formatVNDShort(d.price)}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {contentStep === "options" && design && (
              <BookingOptionStep design={design} onOptionsChange={handleOptionsChange} />
            )}

            {contentStep === "info" && (
              <div className="space-y-4">
                <h2 className="font-sans text-xl font-semibold text-foreground">Thông tin cá nhân</h2>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">Họ tên *</label>
                    <Input type="text" value={form.name} onChange={(e) => { setForm({ ...form, name: e.target.value }); setInfoErrors((p) => ({ ...p, name: undefined })); }}
                      className={infoErrors.name ? "border-destructive bg-destructive/5" : ""}
                      placeholder="Nguyễn Văn A" />
                    <FieldError message={infoErrors.name} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">Số điện thoại *</label>
                    <Input type="tel" value={form.phone} onChange={(e) => { setForm({ ...form, phone: e.target.value }); setInfoErrors((p) => ({ ...p, phone: undefined })); }}
                      className={infoErrors.phone ? "border-destructive bg-destructive/5" : ""}
                      placeholder="0901234567" />
                    <FieldError message={infoErrors.phone} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">Email</label>
                    <Input type="email" value={form.email} onChange={(e) => { setForm({ ...form, email: e.target.value }); setInfoErrors((p) => ({ ...p, email: undefined })); }}
                      className={infoErrors.email ? "border-destructive bg-destructive/5" : ""}
                      placeholder="email@example.com" />
                    <FieldError message={infoErrors.email} />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-muted-foreground">Vị trí xăm</label>
                      <Input type="text" value={form.placement} onChange={(e) => setForm({ ...form, placement: e.target.value })}
                        placeholder="Bắp tay, lưng..." />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-muted-foreground">Kích thước</label>
                      <Input type="text" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })}
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
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">
                      Ảnh tham khảo (tối đa {MAX_FILES} ảnh, mỗi ảnh ≤ 5MB)
                    </label>
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
                    {referenceFiles.length < MAX_FILES && (
                      <button
                        onClick={() => fileRef.current?.click()}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border py-6 text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
                      >
                        <Upload size={18} />
                        Thêm ảnh tham khảo
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {contentStep === "schedule" && (
              <div className="space-y-4">
                <h2 className="font-sans text-xl font-semibold text-foreground">Chọn lịch hẹn</h2>

                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Chi nhánh *</label>
                  <select
                    value={selectedBranch}
                    onChange={(e) => { setSelectedBranch(e.target.value); setScheduleErrors((p) => ({ ...p, branch: undefined })); }}
                    className={`w-full rounded-lg border px-4 py-2.5 text-sm text-foreground focus:outline-none ${scheduleErrors.branch ? "border-destructive bg-destructive/5" : "border-border bg-secondary/30 focus:border-primary"}`}
                  >
                    <option value="">Chọn chi nhánh</option>
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                  <FieldError message={scheduleErrors.branch} />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">Ngày *</label>
                    <input type="date" value={schedule.date} onChange={(e) => { setSchedule({ ...schedule, date: e.target.value }); setScheduleErrors((p) => ({ ...p, date: undefined })); }}
                      min={new Date().toISOString().split("T")[0]}
                      className={`w-full rounded-lg border px-4 py-2.5 text-sm text-foreground focus:outline-none ${scheduleErrors.date ? "border-destructive bg-destructive/5" : "border-border bg-secondary/30 focus:border-primary"}`} />
                    <FieldError message={scheduleErrors.date} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">Giờ *</label>
                    <select value={schedule.time} onChange={(e) => { setSchedule({ ...schedule, time: e.target.value }); setScheduleErrors((p) => ({ ...p, time: undefined })); }}
                      className={`w-full rounded-lg border px-4 py-2.5 text-sm text-foreground focus:outline-none ${scheduleErrors.time ? "border-destructive bg-destructive/5" : "border-border bg-secondary/30 focus:border-primary"}`}>
                      <option value="">Chọn giờ</option>
                      {["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"].map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    <FieldError message={scheduleErrors.time} />
                  </div>
                </div>

                {/* Summary */}
                {design && (
                  <div className="rounded-lg border border-border/50 bg-card p-4 space-y-1">
                    <p className="text-xs text-muted-foreground">Mẫu đã chọn</p>
                    <p className="text-sm font-semibold text-foreground">{design.name}</p>
                    {selectedOptions && (
                      <>
                        <p className="text-xs text-muted-foreground">
                          {selectedOptions.position} · {selectedOptions.style} · {selectedOptions.sessionsLabel}
                        </p>
                        <p className="text-sm font-bold text-primary">{formatVNDShort(selectedOptions.finalPrice)}
                          {selectedOptions.paymentType === "perSession" ? " / buổi" : ""}
                        </p>
                      </>
                    )}
                    {!selectedOptions && (
                      <p className="text-xs text-muted-foreground">Thời gian ước tính: {design.duration}</p>
                    )}
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
          {!isLastStep ? (
            <Button
              onClick={validateAndNext}
              disabled={!canNext()}
              className="gap-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Tiếp theo <ArrowRight size={16} />
            </Button>
          ) : (
            <Button
              onClick={validateAndNext}
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
