import { Button } from "@/components/ui/button";

interface ReceiptModalProps {
  urls: string[];
  onClose: () => void;
}

const ReceiptModal = ({ urls, onClose }: ReceiptModalProps) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="mx-4 max-w-lg rounded-lg border border-border bg-card p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-sans text-lg font-semibold text-foreground mb-4">Biên lai đặt cọc</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {urls.map((url, i) => (
            <a key={i} href={url} target="_blank" rel="noopener noreferrer">
              <img
                src={url}
                alt={`Receipt ${i + 1}`}
                className="rounded-lg border border-border/50 object-cover"
              />
            </a>
          ))}
        </div>
        <Button variant="ghost" className="mt-4 w-full" onClick={onClose}>
          Đóng
        </Button>
      </div>
    </div>
  );
};

export default ReceiptModal;
