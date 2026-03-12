import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PriceEditorProps {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

const PriceEditor = ({ value, onChange, onSave, onCancel }: PriceEditorProps) => {
  return (
    <div className="flex items-center gap-1">
      <input
        type="number"
        min="0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-24 rounded border border-border bg-secondary/30 px-2 py-1 text-xs text-foreground focus:border-primary focus:outline-none"
        autoFocus
        onKeyDown={(e) => {
          if (e.key === "Enter") onSave();
          if (e.key === "Escape") onCancel();
        }}
      />
      <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-primary" onClick={onSave} title="Lưu">
        <Check size={13} />
      </Button>
      <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-muted-foreground" onClick={onCancel} title="Hủy">
        <X size={13} />
      </Button>
    </div>
  );
};

export default PriceEditor;
