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
  message ? <p className="mt-1 font-mono text-xs text-destructive">{message}</p> : null;

const InfoStep = ({ form, setForm, infoErrors, setInfoErrors, refUpload }: InfoStepProps) => {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-6">
      <h2 className="font-serif text-xl font-bold uppercase tracking-tight text-foreground">Thông tin cá nhân</h2>
      <div className="space-y-5">
        <div>
          <label className="mb-2 block font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">Họ tên *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => { setForm({ ...form, name: e.target.value }); setInfoErrors((p) => ({ ...p, name: undefined })); }}
            className={`brutalist-input ${infoErrors.name ? "border-b-destructive" : ""}`}
            placeholder="Nguyễn Văn A"
          />
          <FieldError message={infoErrors.name} />
        </div>
        <div>
          <label className="mb-2 block font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">Số điện thoại *</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => { setForm({ ...form, phone: e.target.value }); setInfoErrors((p) => ({ ...p, phone: undefined })); }}
            className={`brutalist-input ${infoErrors.phone ? "border-b-destructive" : ""}`}
            placeholder="0901234567"
          />
          <FieldError message={infoErrors.phone} />
        </div>
        <div>
          <label className="mb-2 block font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => { setForm({ ...form, email: e.target.value }); setInfoErrors((p) => ({ ...p, email: undefined })); }}
            className={`brutalist-input ${infoErrors.email ? "border-b-destructive" : ""}`}
            placeholder="email@example.com"
          />
          <FieldError message={infoErrors.email} />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">Vị trí xăm</label>
            <input type="text" value={form.placement} onChange={(e) => setForm({ ...form, placement: e.target.value })} className="brutalist-input" placeholder="Bắp tay, lưng..." />
          </div>
          <div>
            <label className="mb-2 block font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">Kích thước</label>
            <input type="text" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} className="brutalist-input" placeholder="10x15 cm" />
          </div>
        </div>
        <div>
          <label className="mb-2 block font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">Ghi chú / Ý tưởng</label>
          <textarea
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            rows={3}
            className="brutalist-input resize-none"
            placeholder="Mô tả ý tưởng hình xăm..."
          />
        </div>

        <div>
          <label className="mb-2 block font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Ảnh tham khảo (tối đa {MAX_FILES})
          </label>
          <input ref={fileRef} type="file" accept="image/*" multiple onChange={(e) => { refUpload.addFiles(e.target.files || []); e.target.value = ""; }} className="hidden" />
          {refUpload.previews.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {refUpload.previews.map((p, i) => (
                <div key={i} className="relative">
                  <img src={p} alt={`Ref ${i + 1}`} className="h-20 w-20 border border-border object-cover" />
                  <button onClick={() => refUpload.removeFile(i)} className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center bg-destructive text-[10px] text-destructive-foreground">×</button>
                </div>
              ))}
            </div>
          )}
          {refUpload.canAddMore && (
            <button
              onClick={() => fileRef.current?.click()}
              className="dropzone-brutalist flex w-full items-center justify-center gap-2 py-8 font-mono text-sm uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
            >
              <Upload size={18} />
              DRAG REFERENCE IMAGES HERE
              <br />
              <span className="text-xs opacity-50">OR CLICK TO BROWSE</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoStep;
export type { BookingForm };
