import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatVNDShort } from "@/data/tattooDesigns";
import type { ScheduleErrors } from "@/lib/bookingValidation";
import type { SelectedOptions } from "@/components/BookingOptionStep";

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

interface DesignInfo {
  name: string;
  duration: string;
}

interface ScheduleStepProps {
  schedule: { date: string; time: string };
  setSchedule: React.Dispatch<React.SetStateAction<{ date: string; time: string }>>;
  selectedBranch: string;
  setSelectedBranch: (id: string) => void;
  branches: Branch[];
  artists: Artist[];
  loadingData: boolean;
  scheduleErrors: ScheduleErrors;
  setScheduleErrors: React.Dispatch<React.SetStateAction<ScheduleErrors>>;
  design: DesignInfo | undefined;
  selectedOptions: SelectedOptions | null;
}

function generateTimeSlots(start = "08:00", end = "17:00"): string[] {
  const slots: string[] = [];
  const [sh, sm] = start.split(":").map(Number);
  const [eh] = end.split(":").map(Number);
  let h = sh;
  while (h < eh || (h === eh && sm <= 0)) {
    slots.push(`${String(h).padStart(2, "0")}:${String(sm).padStart(2, "0")}`);
    h += 1;
  }
  return slots.filter((s) => s !== "12:00");
}

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="mt-1 font-mono text-xs text-destructive">{message}</p> : null;

const ScheduleStep = ({
  schedule, setSchedule, selectedBranch, setSelectedBranch,
  branches, artists, loadingData, scheduleErrors, setScheduleErrors,
  design, selectedOptions,
}: ScheduleStepProps) => {
  const selectedArtist = artists.find((a) => a.branch_id === selectedBranch);
  const timeSlots = useMemo(
    () => selectedArtist ? generateTimeSlots(selectedArtist.work_start, selectedArtist.work_end) : generateTimeSlots(),
    [selectedArtist]
  );

  return (
    <div className="space-y-6">
      <h2 className="font-serif text-xl font-bold uppercase tracking-tight text-foreground">Chọn lịch hẹn</h2>
      {loadingData ? (
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <div className="grid gap-3 sm:grid-cols-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      ) : (
        <>
          <div>
            <label className="mb-2 block font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">Chi nhánh *</label>
            <select
              value={selectedBranch}
              onChange={(e) => { setSelectedBranch(e.target.value); setScheduleErrors((p) => ({ ...p, branch: undefined })); }}
              className={cn(
                "brutalist-input appearance-none cursor-pointer",
                scheduleErrors.branch && "border-b-destructive"
              )}
            >
              <option value="">Chọn chi nhánh</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
            <FieldError message={scheduleErrors.branch} />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">Ngày *</label>
              <input
                type="date"
                value={schedule.date}
                onChange={(e) => { setSchedule({ ...schedule, date: e.target.value }); setScheduleErrors((p) => ({ ...p, date: undefined })); }}
                min={new Date().toISOString().split("T")[0]}
                className={cn(
                  "brutalist-input",
                  scheduleErrors.date && "border-b-destructive"
                )}
              />
              <FieldError message={scheduleErrors.date} />
            </div>
            <div>
              <label className="mb-2 block font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">Giờ *</label>
              <select
                value={schedule.time}
                onChange={(e) => { setSchedule({ ...schedule, time: e.target.value }); setScheduleErrors((p) => ({ ...p, time: undefined })); }}
                className={cn(
                  "brutalist-input appearance-none cursor-pointer",
                  scheduleErrors.time && "border-b-destructive"
                )}
              >
                <option value="">Chọn giờ</option>
                {timeSlots.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <FieldError message={scheduleErrors.time} />
            </div>
          </div>

          {design && (
            <div className="border border-border bg-secondary p-4 space-y-1">
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Mẫu đã chọn</p>
              <p className="font-sans text-sm font-bold uppercase text-foreground">{design.name}</p>
              {selectedOptions && (
                <>
                  <p className="font-mono text-xs text-muted-foreground">
                    {selectedOptions.position} · {selectedOptions.style} · {selectedOptions.sessionsLabel}
                  </p>
                  <p className="font-mono text-sm font-bold text-primary">
                    {formatVNDShort(selectedOptions.finalPrice)}
                    {selectedOptions.paymentType === "perSession" ? " / buổi" : ""}
                  </p>
                </>
              )}
              {!selectedOptions && (
                <p className="font-mono text-xs text-muted-foreground">Thời gian ước tính: {design.duration}</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ScheduleStep;
export type { Branch, Artist };
