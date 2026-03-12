import React, { useEffect, useState } from "react";
import { Check, X, Download, Search, Eye, CheckCircle, XCircle, Pencil, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatVND } from "@/data/tattooDesigns";
import PriceEditor from "./PriceEditor";
import type { BookingWithArtist } from "@/types/database";
import { resolveStorageUrls } from "@/lib/storageUtils";
import { paymentStatusLabels, bookingStatusLabels } from "@/lib/statusLabels";

interface BookingTableProps {
  bookings: BookingWithArtist[];
  filter: string;
  search: string;
  onFilterChange: (filter: string) => void;
  onSearchChange: (search: string) => void;
  onExportCSV: () => void;
  expandedId: string | null;
  onToggleExpand: (id: string) => void;
  editPriceId: string | null;
  editPriceValue: string;
  onEditPrice: (id: string, currentPrice: number | null) => void;
  onEditPriceChange: (value: string) => void;
  onSavePrice: (id: string) => void;
  onCancelEditPrice: () => void;
  onMarkPaid: (id: string) => void;
  rejectId: string | null;
  rejectReason: string;
  onSetRejectId: (id: string | null) => void;
  onRejectReasonChange: (reason: string) => void;
  onConfirmReject: (id: string) => void;
  onConfirmBooking: (id: string) => void;
  onCancelBooking: (id: string) => void;
  onMarkCompleted: (id: string) => void;
  onViewReceipts: (urls: string[]) => void;
  onFetchPriceHistory: (id: string) => void;
}

const ReferenceImages = ({ paths }: { paths: string[] }) => {
  const [urls, setUrls] = useState<string[]>([]);
  useEffect(() => {
    resolveStorageUrls("booking-uploads", paths).then(setUrls);
  }, [paths]);

  if (urls.length === 0) return <span className="text-xs text-muted-foreground">Đang tải...</span>;

  return (
    <div className="flex gap-2 flex-wrap">
      {urls.map((url, i) => (
        url ? (
          <a key={i} href={url} target="_blank" rel="noopener noreferrer">
            <img src={url} alt={`Ref ${i + 1}`}
              className="h-20 w-20 rounded-lg border border-border/50 object-cover" />
          </a>
        ) : null
      ))}
    </div>
  );
};

const BookingTable = ({
  bookings, filter, search, onFilterChange, onSearchChange, onExportCSV,
  expandedId, onToggleExpand,
  editPriceId, editPriceValue, onEditPrice, onEditPriceChange, onSavePrice, onCancelEditPrice,
  onMarkPaid, rejectId, rejectReason, onSetRejectId, onRejectReasonChange, onConfirmReject,
  onConfirmBooking, onCancelBooking, onMarkCompleted,
  onViewReceipts, onFetchPriceHistory,
}: BookingTableProps) => {
  const filtered = bookings.filter((b) => {
    const matchFilter =
      filter === "all" ||
      (filter === "new" && b.payment_status === "unpaid") ||
      (filter === "pending_verify" && b.payment_status === "pending_verify") ||
      (filter === "paid" && b.payment_status === "paid") ||
      (filter === "completed" && b.booking_status === "completed");
    const matchSearch =
      !search ||
      b.booking_code?.toLowerCase().includes(search.toLowerCase()) ||
      b.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      b.customer_phone?.includes(search);
    return matchFilter && matchSearch;
  });

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1.5">
          {[
            { key: "all", label: "Tất cả" },
            { key: "new", label: "Mới" },
            { key: "pending_verify", label: "Chờ xác nhận" },
            { key: "paid", label: "Đã TT" },
            { key: "completed", label: "Hoàn thành" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => onFilterChange(f.key)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${filter === f.key ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm theo mã, tên, SĐT..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-border bg-secondary/30 pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>
        <Button variant="outline" size="sm" onClick={onExportCSV} className="gap-1 border-border text-muted-foreground hover:text-foreground">
          <Download size={14} /> CSV
        </Button>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-3 py-3">Mã</th>
              <th className="px-3 py-3">Khách hàng</th>
              <th className="px-3 py-3">Mẫu</th>
              <th className="px-3 py-3">Ngày</th>
              <th className="px-3 py-3">Chi nhánh</th>
              <th className="px-3 py-3">Thợ xăm</th>
              <th className="px-3 py-3">Giá trị</th>
              <th className="px-3 py-3">Hóa đơn</th>
              <th className="px-3 py-3">Thanh toán</th>
              <th className="px-3 py-3">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => {
              const ps = paymentStatusLabels[b.payment_status] || paymentStatusLabels.unpaid;
              const bs = bookingStatusLabels[b.booking_status] || bookingStatusLabels.pending;
              return (
                <React.Fragment key={b.id}>
                  <tr
                    className="border-b border-border/50 transition-colors hover:bg-secondary/20 cursor-pointer"
                    onClick={() => onToggleExpand(b.id)}
                  >
                    <td className="px-3 py-3 font-mono text-xs text-primary">{b.booking_code}</td>
                    <td className="px-3 py-3">
                      <p className="font-medium text-foreground">{b.customer_name}</p>
                      <p className="text-xs text-muted-foreground">{b.customer_phone}</p>
                    </td>
                    <td className="px-3 py-3 text-foreground">{b.product_name}</td>
                    <td className="px-3 py-3 text-muted-foreground whitespace-nowrap">
                      {b.preferred_date} · {b.preferred_time}
                    </td>
                    <td className="px-3 py-3 text-foreground whitespace-nowrap">{b.branch_name || "—"}</td>
                    <td className="px-3 py-3 text-foreground whitespace-nowrap">{b.artists?.name || "—"}</td>
                    {/* Price */}
                    <td className="px-3 py-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      {editPriceId === b.id ? (
                        <PriceEditor
                          value={editPriceValue}
                          onChange={onEditPriceChange}
                          onSave={() => onSavePrice(b.id)}
                          onCancel={onCancelEditPrice}
                        />
                      ) : (
                        <div className="flex items-center gap-1">
                          <span className="text-foreground text-xs">{b.total_price ? formatVND(b.total_price) : "—"}</span>
                          {b.booking_status !== "completed" && (
                            <Button size="sm" variant="ghost" className="h-5 w-5 p-0 text-muted-foreground hover:text-primary"
                              onClick={() => onEditPrice(b.id, b.total_price)} title="Chỉnh sửa giá">
                              <Pencil size={11} />
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" className="h-5 w-5 p-0 text-muted-foreground hover:text-primary"
                            onClick={() => onFetchPriceHistory(b.id)} title="Lịch sử chỉnh sửa giá">
                            <History size={11} />
                          </Button>
                        </div>
                      )}
                    </td>
                    {/* Receipts */}
                    <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                      {b.deposit_receipts && b.deposit_receipts.length > 0 ? (
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-primary hover:text-primary/80"
                          onClick={() => onViewReceipts(b.deposit_receipts!)} title="Xem biên lai">
                          <Eye size={14} />
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    {/* Payment status */}
                    <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1.5">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${ps.className}`}>
                          {ps.text}
                        </span>
                        {(b.payment_status === "unpaid" || b.payment_status === "pending_verify") && (
                          <>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-primary hover:text-primary/80"
                              onClick={() => onMarkPaid(b.id)} title="Xác nhận thanh toán">
                              <Check size={13} />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-destructive hover:text-destructive/80"
                              onClick={() => onSetRejectId(b.id)} title="Từ chối thanh toán">
                              <X size={13} />
                            </Button>
                          </>
                        )}
                      </div>
                      {rejectId === b.id && (
                        <div className="mt-2 space-y-2">
                          <input
                            type="text"
                            placeholder="Lý do từ chối..."
                            value={rejectReason}
                            onChange={(e) => onRejectReasonChange(e.target.value)}
                            className="w-full rounded border border-border bg-secondary/30 px-2 py-1 text-xs text-foreground focus:border-primary focus:outline-none"
                          />
                          <div className="flex gap-1">
                            <Button size="sm" className="h-6 px-2 text-xs bg-destructive text-destructive-foreground hover:bg-destructive/80"
                              onClick={() => onConfirmReject(b.id)}>
                              Từ chối
                            </Button>
                            <Button size="sm" variant="ghost" className="h-6 px-2 text-xs"
                              onClick={() => { onSetRejectId(null); onRejectReasonChange(""); }}>
                              Hủy
                            </Button>
                          </div>
                        </div>
                      )}
                    </td>
                    {/* Booking status */}
                    <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1.5">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${bs.className}`}>
                          {bs.text}
                        </span>
                        {(b.booking_status === "new" || b.booking_status === "pending") && (
                          <>
                            <Button size="sm" variant="ghost"
                              className="h-auto px-1.5 py-0.5 text-xs text-primary hover:text-primary/80 gap-0.5"
                              onClick={() => onConfirmBooking(b.id)} title="Xác nhận đơn">
                              <CheckCircle size={12} /> Xác nhận
                            </Button>
                            <Button size="sm" variant="ghost"
                              className="h-auto px-1.5 py-0.5 text-xs text-destructive hover:text-destructive/80 gap-0.5"
                              onClick={() => onCancelBooking(b.id)} title="Hủy đơn">
                              <XCircle size={12} /> Hủy
                            </Button>
                          </>
                        )}
                        {b.booking_status === "confirmed" && b.payment_status === "paid" && (
                          <Button size="sm" variant="ghost"
                            className="h-auto px-1.5 py-0.5 text-xs text-primary hover:text-primary/80 disabled:opacity-40 disabled:cursor-not-allowed"
                            onClick={() => onMarkCompleted(b.id)}
                            disabled={!b.total_price || b.total_price <= 0}
                            title={!b.total_price || b.total_price <= 0 ? "Cần nhập giá trước khi hoàn thành" : ""}>
                            Hoàn thành
                          </Button>
                        )}
                        {b.booking_status === "confirmed" && (
                          <Button size="sm" variant="ghost"
                            className="h-auto px-1.5 py-0.5 text-xs text-destructive hover:text-destructive/80 gap-0.5"
                            onClick={() => onCancelBooking(b.id)}>
                            <XCircle size={12} /> Hủy
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                  {/* Expanded row */}
                  {expandedId === b.id && (
                    <tr className="border-b border-border/50 bg-secondary/10">
                      <td colSpan={10} className="px-4 py-4">
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
                          <div>
                            <span className="text-muted-foreground">Email:</span>{" "}
                            <span className="text-foreground">{b.customer_email || "—"}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Kích thước:</span>{" "}
                            <span className="text-foreground">{b.size || "—"}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Vị trí:</span>{" "}
                            <span className="text-foreground">{b.placement || "—"}</span>
                          </div>
                          <div className="sm:col-span-2 lg:col-span-3">
                            <span className="text-muted-foreground">Ghi chú:</span>{" "}
                            <span className="text-foreground">{b.notes || b.note || "—"}</span>
                          </div>
                          {b.reference_images && b.reference_images.length > 0 && (
                            <div className="sm:col-span-2 lg:col-span-3">
                              <span className="text-muted-foreground block mb-2">Ảnh tham khảo:</span>
                              <ReferenceImages paths={b.reference_images} />
                            </div>
                          )}
                          <div>
                            <span className="text-muted-foreground">Ngày tạo:</span>{" "}
                            <span className="text-foreground">{new Date(b.created_at).toLocaleString("vi-VN")}</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={10} className="py-8 text-center text-muted-foreground">
                  Không có booking nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default BookingTable;
