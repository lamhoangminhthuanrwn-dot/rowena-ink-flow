import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingProgressProps {
  stepLabels: string[];
  currentStep: number;
}

const BookingProgress = ({ stepLabels, currentStep }: BookingProgressProps) => (
  <div className="mt-8 mb-10">
    <div className="flex items-center justify-between">
      {stepLabels.map((s, i) => (
        <div key={s} className="flex flex-1 items-center">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center text-xs font-bold transition-colors border",
                i <= currentStep ? "border-primary bg-primary text-primary-foreground" : "border-border bg-secondary text-muted-foreground"
              )}
            >
              {i < currentStep ? <Check size={14} /> : i + 1}
            </div>
            <span className="mt-1.5 hidden font-mono text-[10px] uppercase tracking-widest text-muted-foreground sm:block">{s}</span>
          </div>
          {i < stepLabels.length - 1 && (
            <div className={cn("mx-2 h-px flex-1 transition-colors", i < currentStep ? "bg-primary" : "bg-border")} />
          )}
        </div>
      ))}
    </div>
  </div>
);

export default BookingProgress;
