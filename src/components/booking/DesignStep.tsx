import { tattooDesigns, formatVNDShort } from "@/data/tattooDesigns";

interface DesignStepProps {
  selectedDesign: string;
  onSelect: (id: string) => void;
}

const DesignStep = ({ selectedDesign, onSelect }: DesignStepProps) => (
  <div className="space-y-3">
    <h2 className="font-sans text-xl font-semibold text-foreground">Chọn mẫu xăm</h2>
    <div className="grid gap-3 sm:grid-cols-2">
      {tattooDesigns.map((d) => (
        <button
          key={d.id}
          onClick={() => onSelect(d.id)}
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
);

export default DesignStep;
