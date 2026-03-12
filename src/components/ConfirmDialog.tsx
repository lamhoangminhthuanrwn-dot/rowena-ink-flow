import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog = ({
  open,
  title = "Xác nhận",
  description = "Bạn có chắc chắn muốn thực hiện hành động này?",
  confirmLabel = "Xác nhận",
  cancelLabel = "Hủy",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => (
  <AlertDialog open={open} onOpenChange={(v) => !v && onCancel()}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={onCancel}>{cancelLabel}</AlertDialogCancel>
        <AlertDialogAction
          onClick={onConfirm}
          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
        >
          {confirmLabel}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export default ConfirmDialog;
