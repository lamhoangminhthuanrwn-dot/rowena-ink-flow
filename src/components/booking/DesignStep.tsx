import { tattooDesigns, formatVNDShort } from "@/data/tattooDesigns";

interface DesignStepProps {
  selectedDesign: string;
  onSelect: (id: string) => void;
}

const DesignStep = ({ selectedDesign, onSelect }: DesignStepProps) => (
  <div className="space-y-4">
    <h2 className="font-serif text-xl font-bold uppercase tracking-tight text-foreground">Chọn mẫu xăm</h2>
    <div className="grid gap-3 sm:grid-cols-2">
      {tattooDesigns.map((d) => (
        <button
          key={d.id}
          onClick={() => onSelect(d.id)}
          className={`flex items-center gap-3 border p-3 text-left transition-all ${
            selectedDesign === d.id
              ? "border-primary bg-primary/5"
              : "border-border bg-card hover:border-primary/50"
          }`}
        >
          <img src={d.image} alt={d.name} className="h-16 w-16 object-cover grayscale contrast-125" loading="lazy" />
          <div>
            <p className="font-sans text-sm font-bold uppercase text-foreground">{d.name}</p>
            <p className="font-mono text-xs text-primary">{formatVNDShort(d.price)}</p>
          </div>
        </button>
      ))}
    </div>
  </div>
);

export default DesignStep;
