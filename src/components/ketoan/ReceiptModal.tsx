import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ReceiptModalProps {
  urls: string[];
  onClose: () => void;
}

const ReceiptModal = ({ urls, onClose }: ReceiptModalProps) => {
  return (
    <Dialog open={urls.length > 0} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-foreground">Biên lai đặt cọc</DialogTitle>
        </DialogHeader>
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
      </DialogContent>
    </Dialog>
  );
};

export default ReceiptModal;
