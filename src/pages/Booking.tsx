import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { tattooDesigns } from "@/data/tattooDesigns";
import { ArrowRight, ArrowLeft, Phone, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { siteConfig } from "@/data/siteConfig";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useFileUpload } from "@/hooks/useFileUpload";
import BookingOptionStep from "@/components/BookingOptionStep";
import type { SelectedOptions } from "@/components/BookingOptionStep";
import BookingProgress from "@/components/booking/BookingProgress";
import DesignStep from "@/components/booking/DesignStep";
import InfoStep from "@/components/booking/InfoStep";
import type { BookingForm } from "@/components/booking/InfoStep";
import ScheduleStep from "@/components/booking/ScheduleStep";
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
  work_start: string;
  work_end: string;
}

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
  const [form, setForm] = useState<BookingForm>({
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
  const [submitting, setSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [infoErrors, setInfoErrors] = useState<InfoErrors>({});
  const [scheduleErrors, setScheduleErrors] = useState<ScheduleErrors>({});
  const refUpload = useFileUpload({ maxFiles: MAX_FILES, validateFn: validateFile });

  const design = tattooDesigns.find((d) => d.id === selectedDesign);
  const hasVariants = design?.variants && design.variants.length > 0;

  const stepLabels = hasVariants
    ? ["Chọn mẫu", "Tùy chọn", "Thông tin", "Lịch hẹn"]
    : ["Chọn mẫu", "Thông tin", "Lịch hẹn"];

  const getContentStep = () => {
    if (!hasVariants) {
      return step === 0 ? "design" : step === 1 ? "info" : "schedule";
    }
    return step === 0 ? "design" : step === 1 ? "options" : step === 2 ? "info" : "schedule";
  };

  const contentStep = getContentStep();

  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      const [{ data: b }, { data: a }] = await Promise.all([
        supabase.from("branches").select("id, name, slug").order("name"),
        supabase.from("artists").select("id, name, branch_id, work_start, work_end").eq("is_active", true),
      ]);
      if (b) setBranches(b);
      if (a) setArtists(a);
      setLoadingData(false);
    };
    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const branch = branches.find((b) => b.id === selectedBranch);
      const tempCode = `TMP${Date.now().toString(36).toUpperCase()}`;
      const folder = user?.id || 'anon';
      const uploadedPaths = await refUpload.uploadAll("booking-uploads", (file, i) => {
        const ext = file.name.split(".").pop();
        return `references/${folder}/${tempCode}_${i}.${ext}`;
      });

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
      const result = infoStepSchema.safeParse({ name: form.name, phone: form.phone, email: form.email });
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
      const result = scheduleStepSchema.safeParse({ date: schedule.date, time: schedule.time, branch: selectedBranch });
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
    <div className="min-h-screen flex flex-col">
      {/* Booking container */}
      <div className="flex-grow flex items-start justify-center pt-20 pb-16 px-4">
        <div className="w-full max-w-2xl border border-border bg-card p-8 md:p-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary mb-3">
              STEP {step + 1}/{stepLabels.length}: {stepLabels[step]?.toUpperCase()}
            </p>
            <h1 className="font-serif text-4xl md:text-5xl font-bold uppercase tracking-tight text-foreground">
              ĐẶT LỊCH
            </h1>
          </motion.div>

          <BookingProgress stepLabels={stepLabels} currentStep={step} />

          <AnimatePresence mode="wait">
            <motion.div
              key={contentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {contentStep === "design" && (
                <DesignStep
                  selectedDesign={selectedDesign}
                  onSelect={(id) => { setSelectedDesign(id); setSelectedOptions(null); }}
                />
              )}

              {contentStep === "options" && design && (
                <BookingOptionStep design={design} onOptionsChange={handleOptionsChange} />
              )}

              {contentStep === "info" && (
                <InfoStep
                  form={form}
                  setForm={setForm}
                  infoErrors={infoErrors}
                  setInfoErrors={setInfoErrors}
                  refUpload={refUpload}
                />
              )}

              {contentStep === "schedule" && (
                <ScheduleStep
                  schedule={schedule}
                  setSchedule={setSchedule}
                  selectedBranch={selectedBranch}
                  setSelectedBranch={setSelectedBranch}
                  branches={branches}
                  artists={artists}
                  loadingData={loadingData}
                  scheduleErrors={scheduleErrors}
                  setScheduleErrors={setScheduleErrors}
                  design={design ? { name: design.name, duration: design.duration } : undefined}
                  selectedOptions={selectedOptions}
                />
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex justify-between items-center pt-6 border-t border-border">
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="font-mono text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
            >
              ← QUAY LẠI
            </button>
            {!isLastStep ? (
              <button
                onClick={validateAndNext}
                disabled={!canNext()}
                className="bg-primary px-8 py-3 font-mono text-sm font-bold uppercase tracking-[0.15em] text-primary-foreground transition-all hover:bg-foreground hover:text-background disabled:opacity-30"
              >
                TIẾP THEO →
              </button>
            ) : (
              <button
                onClick={validateAndNext}
                disabled={!canNext() || submitting}
                className="bg-primary px-8 py-3 font-mono text-sm font-bold uppercase tracking-[0.15em] text-primary-foreground transition-all hover:bg-foreground hover:text-background disabled:opacity-30"
              >
                {submitting ? "ĐANG GỬI..." : "ĐẶT LỊCH →"}
              </button>
            )}
          </div>

          <div className="mt-6 text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">── Hoặc liên hệ nhanh ──</p>
            <div className="flex justify-center gap-4">
              <a
                href={siteConfig.hotlineHref}
                className="inline-flex items-center gap-2 border border-border px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-widest text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Phone size={14} />
                Gọi hotline
              </a>
              <a
                href={siteConfig.zaloLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-border px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-widest text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <MessageCircle size={14} />
                Nhắn Zalo
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
