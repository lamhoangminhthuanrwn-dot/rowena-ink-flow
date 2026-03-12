import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import { MAX_FILES } from "@/lib/bookingValidation";
import type { InfoErrors } from "@/lib/bookingValidation";

interface BookingForm {
  name: string;
  phone: string;
  email: string;
  note: string;
  placement: string;
  size: string;
  style: string;
}

interface FileUploadHook {
  previews: string[];
  canAddMore: boolean;
  addFiles: (files: FileList | File[]) => void;
  removeFile: (index: number) => void;
}

interface InfoStepProps {
  form: BookingForm;
  setForm: React.Dispatch<React.SetStateAction<BookingForm>>;
  infoErrors: InfoErrors;
  setInfoErrors: React.Dispatch<React.SetStateAction<InfoErrors>>;
  refUpload: FileUploadHook;
}

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="mt-1 text-xs text-destructive">{message}</p> : null;

const InfoStep = ({ form, setForm, infoErrors, setInfoErrors, refUpload }: InfoStepProps) => {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-4">
      <h2 className="font-sans text-xl font-semibold text-foreground">Thông tin cá nhân</h2>
      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Họ tên *</label>
          <Input
            type="text"
            value={form.name}
            onChange={(e) => { setForm({ ...form, name: e.target.value }); setInfoErrors((p) => ({ ...p, name: undefined })); }}
            className={infoErrors.name ? "border-destructive bg-destructive/5" : ""}
            placeholder="Nguyễn Văn A"
          />
          <FieldError message={infoErrors.name} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Số điện thoại *</label>
          <Input
            type="tel"
            value={form.phone}
            onChange={(e) => { setForm({ ...form, phone: e.target.value }); setInfoErrors((p) => ({ ...p, phone: undefined })); }}
            className={infoErrors.phone ? "border-destructive bg-destructive/5" : ""}
            placeholder="0901234567"
          />
          <FieldError message={infoErrors.phone} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Email</label>
          <Input
            type="email"
            value={form.email}
            onChange={(e) => { setForm({ ...form, email: e.target.value }); setInfoErrors((p) => ({ ...p, email: undefined })); }}
            className={infoErrors.email ? "border-destructive bg-destructive/5" : ""}
            placeholder="email@example.com"
          />
          <FieldError message={infoErrors.email} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Vị trí xăm</label>
            <Input type="text" value={form.placement} onChange={(e) => setForm({ ...form, placement: e.target.value })} placeholder="Bắp tay, lưng..." />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Kích thước</label>
            <Input type="text" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} placeholder="10x15 cm" />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Phong cách</label>
          <Input type="text" value={form.style} onChange={(e) => setForm({ ...form, style: e.target.value })} placeholder="Truyền thống, tối giản, realistic..." />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Ghi chú</label>
          <Textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} rows={3} placeholder="Yêu cầu đặc biệt..." />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            Ảnh tham khảo (tối đa {MAX_FILES} ảnh, mỗi ảnh ≤ 5MB)
          </label>
          <input ref={fileRef} type="file" accept="image/*" multiple onChange={(e) => { refUpload.addFiles(e.target.files || []); e.target.value = ""; }} className="hidden" />
          {refUpload.previews.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {refUpload.previews.map((p, i) => (
                <div key={i} className="relative">
                  <img src={p} alt={`Ref ${i + 1}`} className="h-20 w-20 rounded-lg border border-border/50 object-cover" />
                  <button onClick={() => refUpload.removeFile(i)} className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">×</button>
                </div>
              ))}
            </div>
          )}
          {refUpload.canAddMore && (
            <button
              onClick={() => fileRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border py-6 text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
            >
              <Upload size={18} />
              Thêm ảnh tham khảo
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoStep;
export type { BookingForm };
