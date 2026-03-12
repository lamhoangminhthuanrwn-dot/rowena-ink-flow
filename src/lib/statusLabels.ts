export const paymentStatusLabels: Record<string, { text: string; className: string }> = {
  unpaid: { text: "Chưa cọc", className: "bg-muted text-muted-foreground" },
  pending_verify: { text: "Chờ xác nhận", className: "bg-primary/10 text-primary" },
  paid: { text: "Đã thanh toán", className: "bg-success/10 text-success" },
  rejected: { text: "Từ chối", className: "bg-destructive/10 text-destructive" },
};

export const bookingStatusLabels: Record<string, { text: string; className: string }> = {
  pending: { text: "Chưa xăm", className: "bg-primary/10 text-primary" },
  confirmed: { text: "Đã xác nhận", className: "bg-ring/10 text-ring" },
  completed: { text: "Hoàn thành", className: "bg-success/10 text-success" },
  cancelled: { text: "Đã hủy", className: "bg-destructive/10 text-destructive" },
};

export const withdrawalStatusLabels: Record<string, { text: string; className: string }> = {
  pending: { text: "Chờ duyệt", className: "bg-muted text-muted-foreground" },
  approved: { text: "Đã duyệt", className: "bg-primary/10 text-primary" },
  paid: { text: "Đã chuyển", className: "bg-success/10 text-success" },
  rejected: { text: "Từ chối", className: "bg-destructive/10 text-destructive" },
};
