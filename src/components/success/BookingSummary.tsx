import { motion } from "framer-motion";

interface BookingSummaryProps {
  bookingCode: string;
  customerName: string;
  phone: string;
  email: string;
  branchName?: string;
  artistName?: string;
  designName: string;
  placement: string;
  size: string;
  style: string;
  appointmentDate: string;
  appointmentTime: string;
  note: string;
}

const BookingSummary = (props: BookingSummaryProps) => {
  const rows = [
    { label: "Mã booking", value: props.bookingCode, mono: true },
    { label: "Họ tên", value: props.customerName },
    { label: "Số điện thoại", value: props.phone },
    { label: "Email", value: props.email },
    { label: "Chi nhánh", value: props.branchName },
    { label: "Thợ xăm", value: props.artistName },
    { label: "Mẫu xăm", value: props.designName },
    { label: "Vị trí", value: props.placement },
    { label: "Kích thước", value: props.size },
    { label: "Phong cách", value: props.style },
    { label: "Ngày hẹn", value: `${props.appointmentDate} · ${props.appointmentTime}` },
    { label: "Ghi chú", value: props.note },
  ].filter((r) => r.value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-lg border border-border/50 bg-card p-6 mb-6"
    >
      <h2 className="font-serif text-lg font-semibold text-foreground mb-4">Thông tin đặt lịch</h2>
      <div className="space-y-2.5 text-sm">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between">
            <span className="text-muted-foreground">{row.label}</span>
            <span className={`text-foreground ${row.mono ? "font-mono font-semibold text-primary" : ""}`}>
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default BookingSummary;
