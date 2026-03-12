import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatVND } from "@/data/tattooDesigns";
import type { BookingPriceHistory } from "@/types/database";

interface PriceHistoryDialogProps {
  bookingId: string | null;
  history: BookingPriceHistory[];
  loading: boolean;
  onClose: () => void;
}

const PriceHistoryDialog = ({ bookingId, history, loading, onClose }: PriceHistoryDialogProps) => {
  return (
    <Dialog open={!!bookingId} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Lịch sử chỉnh sửa giá</DialogTitle>
        </DialogHeader>
        {loading ? (
          <p className="text-sm text-muted-foreground py-4 text-center">Đang tải...</p>
        ) : history.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">Chưa có lịch sử chỉnh sửa giá.</p>
        ) : (
          <div className="max-h-80 overflow-y-auto space-y-3">
            {history.map((h) => (
              <div key={h.id} className="rounded-lg border border-border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {new Date(h.created_at).toLocaleString("vi-VN")}
                  </span>
                  <span className="text-xs font-medium text-foreground">{h.changed_by_name}</span>
                </div>
                <div className="mt-1.5 flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">{h.old_price != null ? formatVND(h.old_price) : "—"}</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="font-medium text-primary">{formatVND(h.new_price)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PriceHistoryDialog;
