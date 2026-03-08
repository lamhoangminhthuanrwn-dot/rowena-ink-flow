import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { formatVND } from "@/data/tattooDesigns";
import { Check, X, Download, Search, Eye, ChevronDown, ChevronUp, CheckCircle, XCircle, MapPin, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const paymentStatusLabels: Record<string, { text: string; className: string }> = {
  unpaid: { text: "Chưa cọc", className: "bg-muted text-muted-foreground" },
  pending_verify: { text: "Chờ xác nhận", className: "bg-primary/10 text-primary" },
  paid: { text: "Đã thanh toán", className: "bg-success/10 text-success" },
  rejected: { text: "Từ chối", className: "bg-destructive/10 text-destructive" },
};

const bookingStatusLabels: Record<string, { text: string; className: string }> = {
  pending: { text: "Chưa xăm", className: "bg-primary/10 text-primary" },
  confirmed: { text: "Đã xác nhận", className: "bg-ring/10 text-ring" },
  completed: { text: "Hoàn thành", className: "bg-success/10 text-success" },
  cancelled: { text: "Đã hủy", className: "bg-destructive/10 text-destructive" },
};

const withdrawalStatusLabels: Record<string, { text: string; className: string }> = {
  pending: { text: "Chờ duyệt", className: "bg-muted text-muted-foreground" },
  approved: { text: "Đã duyệt", className: "bg-primary/10 text-primary" },
  paid: { text: "Đã chuyển", className: "bg-success/10 text-success" },
  rejected: { text: "Từ chối", className: "bg-destructive/10 text-destructive" },
};

const Ketoan = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"bookings" | "withdrawals">("bookings");
  const [bookings, setBookings] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [wdFilter, setWdFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [receiptModal, setReceiptModal] = useState<string[] | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);


  const fetchBookings = async () => {
    const { data } = await supabase.from("bookings").select("*, artists(name)").order("created_at", { ascending: false });
    if (data) setBookings(data);
  };

  const fetchWithdrawals = async () => {
    const { data } = await supabase.from("withdrawals").select("*").order("created_at", { ascending: false });
    if (data) setWithdrawals(data);
  };

  useEffect(() => {
    if (user && isAdmin) {
      fetchBookings();
      fetchWithdrawals();
    }
  }, [user, authLoading, isAdmin]);

  const markPaid = async (id: string) => {
    const { error } = await supabase.rpc("admin_update_booking_payment", {
      _booking_id: id, _payment_status: "paid",
    });
    if (error) {
      console.error("markPaid error:", error);
      toast.error("Không thể thực hiện thao tác. Vui lòng thử lại.");
      return;
    }

    try {
      await supabase.functions.invoke("process-referral-reward", { body: { booking_id: id } });
    } catch (e) {
      console.warn("Referral reward processing:", e);
    }

    toast.success("Đã xác nhận thanh toán!");
    fetchBookings();
  };

  const rejectPayment = async (id: string) => {
    const { error } = await supabase.rpc("admin_update_booking_payment", {
      _booking_id: id, _payment_status: "rejected", _reject_reason: rejectReason || null,
    });
    if (error) {
      console.error("rejectPayment error:", error);
      toast.error("Không thể thực hiện thao tác. Vui lòng thử lại.");
      return;
    }
    toast.success("Đã từ chối.");
    setRejectId(null);
    setRejectReason("");
    fetchBookings();
  };

  const markCompleted = async (id: string) => {
    const { error } = await supabase.rpc("admin_update_booking_status", {
      _booking_id: id, _booking_status: "completed",
    });
    if (error) {
      console.error("markCompleted error:", error);
      toast.error("Không thể thực hiện thao tác. Vui lòng thử lại.");
      return;
    }
    toast.success("Đã đánh dấu hoàn thành!");
    fetchBookings();
  };

  const confirmBooking = async (id: string) => {
    const { error } = await supabase.rpc("admin_update_booking_status", {
      _booking_id: id, _booking_status: "confirmed",
    });
    if (error) {
      console.error("confirmBooking error:", error);
      toast.error("Không thể thực hiện thao tác.");
      return;
    }
    toast.success("Đã xác nhận đơn!");
    fetchBookings();
  };

  const cancelBooking = async (id: string) => {
    const { error } = await supabase.rpc("admin_update_booking_status", {
      _booking_id: id, _booking_status: "cancelled",
    });
    if (error) {
      console.error("cancelBooking error:", error);
      toast.error("Không thể thực hiện thao tác.");
      return;
    }
    toast.success("Đã hủy đơn!");
    fetchBookings();
  };

  const approveWithdrawal = async (id: string) => {
    const { error } = await supabase.rpc("admin_update_withdrawal_status", {
      _withdrawal_id: id, _status: "approved",
    });
    if (error) {
      console.error("approveWithdrawal error:", error);
      toast.error("Không thể thực hiện thao tác. Vui lòng thử lại.");
      return;
    }
    toast.success("Đã duyệt yêu cầu rút tiền!");
    fetchWithdrawals();
  };

  const rejectWithdrawal = async (id: string) => {
    const { error } = await supabase.rpc("admin_update_withdrawal_status", {
      _withdrawal_id: id, _status: "rejected", _note: rejectReason || null,
    });
    if (error) {
      console.error("rejectWithdrawal error:", error);
      toast.error("Không thể thực hiện thao tác. Vui lòng thử lại.");
      return;
    }
    toast.success("Đã từ chối yêu cầu rút tiền.");
    setRejectId(null);
    setRejectReason("");
    fetchWithdrawals();
  };

  const markWithdrawalPaid = async (id: string) => {
    const { error } = await supabase.rpc("admin_update_withdrawal_status", {
      _withdrawal_id: id, _status: "paid",
    });
    if (error) {
      console.error("markWithdrawalPaid error:", error);
      toast.error("Không thể thực hiện thao tác. Vui lòng thử lại.");
      return;
    }
    toast.success("Đã đánh dấu đã chuyển!");
    fetchWithdrawals();
  };

  const exportCSV = () => {
    const headers = ["Mã", "Khách hàng", "SĐT", "Mẫu", "Ngày hẹn", "Cọc", "Thanh toán", "Trạng thái", "Ngày tạo"];
    const rows = filteredBookings.map((b) => [
      b.booking_code,
      b.customer_name,
      b.phone,
      b.design_name,
      `${b.appointment_date} ${b.appointment_time}`,
      b.deposit_amount,
      b.payment_status,
      b.booking_status,
      new Date(b.created_at).toLocaleDateString("vi-VN"),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookings_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const filteredBookings = bookings.filter((b) => {
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
      b.phone?.includes(search);
    return matchFilter && matchSearch;
  });

  const filteredWithdrawals = withdrawals.filter((w) => {
    return wdFilter === "all" || w.status === wdFilter;
  });

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-16">
        <p className="text-muted-foreground">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-16">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-end justify-between">
          <div>
            <h1 className="font-sans text-3xl font-bold text-foreground">Kế toán — Quản lý</h1>
            <p className="mt-2 text-sm text-muted-foreground">Xác nhận thanh toán, quản lý lịch hẹn & rút tiền</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1" onClick={() => navigate("/admin/posts")}>
              <FileText size={14} /> Bài viết
            </Button>
            <Button variant="outline" size="sm" className="gap-1" onClick={() => navigate("/admin/branches")}>
              <MapPin size={14} /> Chi nhánh & Thợ xăm
            </Button>
          </div>
        </motion.div>

        {/* Main tabs */}
        <div className="mt-4 mb-4 flex gap-1.5">
          <button
            onClick={() => setActiveTab("bookings")}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-all ${
              activeTab === "bookings"
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            Bookings
          </button>
          <button
            onClick={() => setActiveTab("withdrawals")}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-all ${
              activeTab === "withdrawals"
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            Rút tiền ({withdrawals.filter((w) => w.status === "pending").length})
          </button>
        </div>

        {activeTab === "bookings" && (
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
                    onClick={() => setFilter(f.key)}
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
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border border-border bg-secondary/30 pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={exportCSV}
                className="gap-1 border-border text-muted-foreground hover:text-foreground"
              >
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
                    <th className="px-3 py-3">Hóa đơn</th>
                    <th className="px-3 py-3">Thanh toán</th>
                    <th className="px-3 py-3">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((b) => {
                    const ps = paymentStatusLabels[b.payment_status] || paymentStatusLabels.unpaid;
                    const bs = bookingStatusLabels[b.booking_status] || bookingStatusLabels.pending;
                    return (
                      <React.Fragment key={b.id}>
                        <tr
                          className="border-b border-border/50 transition-colors hover:bg-secondary/20 cursor-pointer"
                          onClick={() => setExpandedId(expandedId === b.id ? null : b.id)}
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
                          <td className="px-3 py-3 text-foreground whitespace-nowrap">{(b as any).artists?.name || "—"}</td>
                          {/* Hóa đơn column */}
                          <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                            {b.deposit_receipts && b.deposit_receipts.length > 0 ? (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0 text-primary hover:text-primary/80"
                                onClick={() => setReceiptModal(b.deposit_receipts)}
                                title="Xem biên lai"
                              >
                                <Eye size={14} />
                              </Button>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </td>
                          {/* Thanh toán + inline actions */}
                          <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${ps.className}`}
                              >
                                {ps.text}
                              </span>
                              {(b.payment_status === "unpaid" || b.payment_status === "pending_verify") && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0 text-primary hover:text-primary/80"
                                    onClick={() => markPaid(b.id)}
                                    title="Xác nhận thanh toán"
                                  >
                                    <Check size={13} />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0 text-destructive hover:text-destructive/80"
                                    onClick={() => setRejectId(b.id)}
                                    title="Từ chối thanh toán"
                                  >
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
                                  onChange={(e) => setRejectReason(e.target.value)}
                                  className="w-full rounded border border-border bg-secondary/30 px-2 py-1 text-xs text-foreground focus:border-primary focus:outline-none"
                                />
                                <div className="flex gap-1">
                                  <Button
                                    size="sm"
                                    className="h-6 px-2 text-xs bg-destructive text-destructive-foreground hover:bg-destructive/80"
                                    onClick={() => rejectPayment(b.id)}
                                  >
                                    Từ chối
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 px-2 text-xs"
                                    onClick={() => {
                                      setRejectId(null);
                                      setRejectReason("");
                                    }}
                                  >
                                    Hủy
                                  </Button>
                                </div>
                              </div>
                            )}
                          </td>
                          {/* Trạng thái + inline actions */}
                          <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${bs.className}`}
                              >
                                {bs.text}
                              </span>
                              {(b.booking_status === "new" || b.booking_status === "pending") && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-auto px-1.5 py-0.5 text-xs text-primary hover:text-primary/80 gap-0.5"
                                    onClick={() => confirmBooking(b.id)}
                                    title="Xác nhận đơn"
                                  >
                                    <CheckCircle size={12} /> Xác nhận
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-auto px-1.5 py-0.5 text-xs text-destructive hover:text-destructive/80 gap-0.5"
                                    onClick={() => cancelBooking(b.id)}
                                    title="Hủy đơn"
                                  >
                                    <XCircle size={12} /> Hủy
                                  </Button>
                                </>
                              )}
                              {b.booking_status === "confirmed" && b.payment_status === "paid" && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-auto px-1.5 py-0.5 text-xs text-primary hover:text-primary/80"
                                  onClick={() => markCompleted(b.id)}
                                >
                                  Hoàn thành
                                </Button>
                              )}
                              {b.booking_status === "confirmed" && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-auto px-1.5 py-0.5 text-xs text-destructive hover:text-destructive/80 gap-0.5"
                                  onClick={() => cancelBooking(b.id)}
                                >
                                  <XCircle size={12} /> Hủy
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                        {/* Expanded detail row */}
                        {expandedId === b.id && (
                          <tr className="border-b border-border/50 bg-secondary/10">
                            <td colSpan={9} className="px-4 py-4">
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
                                    <div className="flex gap-2 flex-wrap">
                                      {b.reference_images.map((url: string, i: number) => (
                                        <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                                          <img
                                            src={url}
                                            alt={`Ref ${i + 1}`}
                                            className="h-20 w-20 rounded-lg border border-border/50 object-cover"
                                          />
                                        </a>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                <div>
                                  <span className="text-muted-foreground">Ngày tạo:</span>{" "}
                                  <span className="text-foreground">
                                    {new Date(b.created_at).toLocaleString("vi-VN")}
                                  </span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                  {filteredBookings.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-muted-foreground">
                        Không có booking nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === "withdrawals" && (
          <>
            <div className="flex gap-1.5 mb-4">
              {[
                { key: "all", label: "Tất cả" },
                { key: "pending", label: "Chờ duyệt" },
                { key: "approved", label: "Đã duyệt" },
                { key: "paid", label: "Đã chuyển" },
                { key: "rejected", label: "Từ chối" },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setWdFilter(f.key)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${wdFilter === f.key ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-3 py-3">User</th>
                    <th className="px-3 py-3">Số tiền</th>
                    <th className="px-3 py-3">MoMo</th>
                    <th className="px-3 py-3">Trạng thái</th>
                    <th className="px-3 py-3">Ngày</th>
                    <th className="px-3 py-3">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWithdrawals.map((w) => {
                    const ws = withdrawalStatusLabels[w.status] || withdrawalStatusLabels.pending;
                    return (
                      <tr key={w.id} className="border-b border-border/50 transition-colors hover:bg-secondary/20">
                        <td className="px-3 py-3 font-mono text-xs text-muted-foreground">
                          {w.user_id?.slice(0, 8)}...
                        </td>
                        <td className="px-3 py-3 font-semibold text-foreground">{formatVND(w.amount_vnd)}</td>
                        <td className="px-3 py-3">
                          <p className="text-foreground">{w.momo_phone}</p>
                          {w.momo_name && <p className="text-xs text-muted-foreground">{w.momo_name}</p>}
                        </td>
                        <td className="px-3 py-3">
                          <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${ws.className}`}>
                            {ws.text}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-muted-foreground whitespace-nowrap">
                          {new Date(w.created_at).toLocaleDateString("vi-VN")}
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex gap-1">
                            {w.status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 px-2 text-xs text-primary"
                                  onClick={() => approveWithdrawal(w.id)}
                                >
                                  Duyệt
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 px-2 text-xs text-destructive"
                                  onClick={() => rejectWithdrawal(w.id)}
                                >
                                  Từ chối
                                </Button>
                              </>
                            )}
                            {w.status === "approved" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 px-2 text-xs text-success"
                                onClick={() => markWithdrawalPaid(w.id)}
                              >
                                Đã chuyển
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredWithdrawals.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-muted-foreground">
                        Không có yêu cầu rút tiền nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Receipt Modal */}
        {receiptModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
            onClick={() => setReceiptModal(null)}
          >
            <div
              className="mx-4 max-w-lg rounded-lg border border-border bg-card p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-sans text-lg font-semibold text-foreground mb-4">Biên lai đặt cọc</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {receiptModal.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                    <img
                      src={url}
                      alt={`Receipt ${i + 1}`}
                      className="rounded-lg border border-border/50 object-cover"
                    />
                  </a>
                ))}
              </div>
              <Button variant="ghost" className="mt-4 w-full" onClick={() => setReceiptModal(null)}>
                Đóng
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Ketoan;
