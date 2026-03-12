import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { formatVND } from "@/data/tattooDesigns";
import { FileText, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { BookingWithArtist, Withdrawal, BookingPriceHistory } from "@/types/database";
import BookingTable from "@/components/ketoan/BookingTable";
import WithdrawalTable from "@/components/ketoan/WithdrawalTable";
import ReceiptModal from "@/components/ketoan/ReceiptModal";
import PriceHistoryDialog from "@/components/ketoan/PriceHistoryDialog";

const Ketoan = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"bookings" | "withdrawals">("bookings");
  const [bookings, setBookings] = useState<BookingWithArtist[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [filter, setFilter] = useState("all");
  const [wdFilter, setWdFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [receiptModal, setReceiptModal] = useState<string[] | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editPriceId, setEditPriceId] = useState<string | null>(null);
  const [editPriceValue, setEditPriceValue] = useState<string>("");
  const [priceHistoryBookingId, setPriceHistoryBookingId] = useState<string | null>(null);
  const [priceHistory, setPriceHistory] = useState<BookingPriceHistory[]>([]);
  const [priceHistoryLoading, setPriceHistoryLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const PAGE_SIZE = 50;

  const fetchBookings = async () => {
    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    const { data, count } = await supabase
      .from("bookings")
      .select("*, artists(name)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);
    if (data) setBookings(data as unknown as BookingWithArtist[]);
    if (count !== null) setTotalCount(count);
  };

  const fetchWithdrawals = async () => {
    const { data } = await supabase.from("withdrawals").select("*").order("created_at", { ascending: false });
    if (data) setWithdrawals(data);
  };

  const fetchPriceHistory = async (bookingId: string) => {
    setPriceHistoryLoading(true);
    setPriceHistoryBookingId(bookingId);
    const { data } = await supabase.from("booking_price_history").select("*").eq("booking_id", bookingId).order("created_at", { ascending: false });
    if (data && data.length > 0) {
      const userIds = [...new Set(data.map((h) => h.changed_by))];
      const { data: profiles } = await supabase.from("profiles").select("id, full_name").in("id", userIds);
      const profileMap = new Map((profiles || []).map((p) => [p.id, p.full_name]));
      setPriceHistory(data.map((h) => ({ ...h, changed_by_name: profileMap.get(h.changed_by) || "Admin" })));
    } else {
      setPriceHistory([]);
    }
    setPriceHistoryLoading(false);
  };

  useEffect(() => {
    if (user && isAdmin) { fetchBookings(); fetchWithdrawals(); }
  }, [user, authLoading, isAdmin]);

  const markPaid = async (id: string) => {
    const { error } = await supabase.rpc("admin_update_booking_payment", { _booking_id: id, _payment_status: "paid" });
    if (error) { toast.error("Không thể thực hiện thao tác."); return; }
    toast.success("Đã xác nhận thanh toán!"); fetchBookings();
  };

  const rejectPayment = async (id: string) => {
    const { error } = await supabase.rpc("admin_update_booking_payment", { _booking_id: id, _payment_status: "rejected", _reject_reason: rejectReason || null });
    if (error) { toast.error("Không thể thực hiện thao tác."); return; }
    toast.success("Đã từ chối."); setRejectId(null); setRejectReason(""); fetchBookings();
  };

  const markCompleted = async (id: string) => {
    const booking = bookings.find(b => b.id === id);
    if (!booking?.total_price || booking.total_price <= 0) { toast.error("Vui lòng nhập giá trị đơn hàng trước khi đánh dấu hoàn thành."); return; }
    const { error } = await supabase.rpc("admin_update_booking_status", { _booking_id: id, _booking_status: "completed" });
    if (error) { toast.error("Không thể thực hiện thao tác."); return; }
    try { await supabase.functions.invoke("process-referral-reward", { body: { booking_id: id } }); } catch (e) { console.warn("Referral reward:", e); }
    toast.success("Đã đánh dấu hoàn thành!"); fetchBookings();
  };

  const confirmBooking = async (id: string) => {
    const { error } = await supabase.rpc("admin_update_booking_status", { _booking_id: id, _booking_status: "confirmed" });
    if (error) { toast.error("Không thể thực hiện thao tác."); return; }
    toast.success("Đã xác nhận đơn!"); fetchBookings();
  };

  const cancelBooking = async (id: string) => {
    const { error } = await supabase.rpc("admin_update_booking_status", { _booking_id: id, _booking_status: "cancelled" });
    if (error) { toast.error("Không thể thực hiện thao tác."); return; }
    toast.success("Đã hủy đơn!"); fetchBookings();
  };

  const savePrice = async (id: string) => {
    const price = parseInt(editPriceValue, 10);
    if (isNaN(price) || price < 0) { toast.error("Giá trị không hợp lệ"); return; }
    const { error } = await supabase.rpc("admin_update_booking_price", { _booking_id: id, _total_price: price });
    if (error) { toast.error("Không thể cập nhật giá."); return; }
    toast.success("Đã cập nhật giá trị đơn hàng!");
    const booking = bookings.find((b) => b.id === id);
    if (booking) {
      const session = (await supabase.auth.getSession()).data.session;
      if (session) {
        supabase.functions.invoke("send-price-update-email", {
          body: { booking_code: booking.booking_code, customer_name: booking.customer_name, old_price: booking.total_price, new_price: price },
        }).catch((err) => console.error("Price update email error:", err));
      }
    }
    setEditPriceId(null); setEditPriceValue(""); fetchBookings();
  };

  const approveWithdrawal = async (id: string) => {
    const { error } = await supabase.rpc("admin_update_withdrawal_status", { _withdrawal_id: id, _status: "approved" });
    if (error) { toast.error("Không thể thực hiện thao tác."); return; }
    toast.success("Đã duyệt yêu cầu rút tiền!"); fetchWithdrawals();
  };

  const rejectWithdrawal = async (id: string) => {
    const { error } = await supabase.rpc("admin_update_withdrawal_status", { _withdrawal_id: id, _status: "rejected", _note: rejectReason || null });
    if (error) { toast.error("Không thể thực hiện thao tác."); return; }
    toast.success("Đã từ chối yêu cầu rút tiền."); setRejectId(null); setRejectReason(""); fetchWithdrawals();
  };

  const markWithdrawalPaid = async (id: string) => {
    const { error } = await supabase.rpc("admin_update_withdrawal_status", { _withdrawal_id: id, _status: "paid" });
    if (error) { toast.error("Không thể thực hiện thao tác."); return; }
    toast.success("Đã đánh dấu đã chuyển!"); fetchWithdrawals();
  };

  const exportCSV = () => {
    const headers = ["Mã", "Khách hàng", "SĐT", "Mẫu", "Ngày hẹn", "Cọc", "Thanh toán", "Trạng thái", "Ngày tạo"];
    const rows = bookings.filter((b) => {
      const matchFilter = filter === "all" || (filter === "new" && b.payment_status === "unpaid") || (filter === "pending_verify" && b.payment_status === "pending_verify") || (filter === "paid" && b.payment_status === "paid") || (filter === "completed" && b.booking_status === "completed");
      const matchSearch = !search || b.booking_code?.toLowerCase().includes(search.toLowerCase()) || b.customer_name?.toLowerCase().includes(search.toLowerCase()) || b.customer_phone?.includes(search);
      return matchFilter && matchSearch;
    }).map((b) => [b.booking_code, b.customer_name, b.customer_phone, b.product_name, `${b.preferred_date} ${b.preferred_time}`, b.total_price, b.payment_status, b.booking_status, new Date(b.created_at).toLocaleDateString("vi-VN")]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `bookings_${new Date().toISOString().slice(0, 10)}.csv`; a.click();
  };

  if (authLoading) {
    return <div className="flex min-h-screen items-center justify-center pt-16"><p className="text-muted-foreground">Đang tải...</p></div>;
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

        <div className="mt-4 mb-4 flex gap-1.5">
          <button onClick={() => setActiveTab("bookings")}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-all ${activeTab === "bookings" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
            Bookings
          </button>
          <button onClick={() => setActiveTab("withdrawals")}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-all ${activeTab === "withdrawals" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
            Rút tiền ({withdrawals.filter((w) => w.status === "pending").length})
          </button>
        </div>

        {activeTab === "bookings" && (
          <BookingTable
            bookings={bookings}
            filter={filter}
            search={search}
            onFilterChange={setFilter}
            onSearchChange={setSearch}
            onExportCSV={exportCSV}
            expandedId={expandedId}
            onToggleExpand={(id) => setExpandedId(expandedId === id ? null : id)}
            editPriceId={editPriceId}
            editPriceValue={editPriceValue}
            onEditPrice={(id, price) => { setEditPriceId(id); setEditPriceValue(price?.toString() || ""); }}
            onEditPriceChange={setEditPriceValue}
            onSavePrice={savePrice}
            onCancelEditPrice={() => { setEditPriceId(null); setEditPriceValue(""); }}
            onMarkPaid={markPaid}
            rejectId={rejectId}
            rejectReason={rejectReason}
            onSetRejectId={setRejectId}
            onRejectReasonChange={setRejectReason}
            onConfirmReject={rejectPayment}
            onConfirmBooking={confirmBooking}
            onCancelBooking={cancelBooking}
            onMarkCompleted={markCompleted}
            onViewReceipts={setReceiptModal}
            onFetchPriceHistory={fetchPriceHistory}
          />
        )}

        {activeTab === "withdrawals" && (
          <WithdrawalTable
            withdrawals={withdrawals}
            wdFilter={wdFilter}
            onFilterChange={setWdFilter}
            onApprove={approveWithdrawal}
            onReject={rejectWithdrawal}
            onMarkPaid={markWithdrawalPaid}
          />
        )}

        {receiptModal && <ReceiptModal urls={receiptModal} onClose={() => setReceiptModal(null)} />}

        <PriceHistoryDialog
          bookingId={priceHistoryBookingId}
          history={priceHistory}
          loading={priceHistoryLoading}
          onClose={() => setPriceHistoryBookingId(null)}
        />
      </div>
    </div>
  );
};

export default Ketoan;
