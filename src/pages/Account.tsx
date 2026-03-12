import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { CalendarDays, Wallet as WalletIcon, Share2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { formatVND } from "@/data/tattooDesigns";
import type { Booking, Withdrawal, WalletTransaction, Wallet } from "@/types/database";
import { getReferralUrl } from "@/lib/constants";

import { paymentStatusLabels, bookingStatusLabels } from "@/lib/statusLabels";

const Account = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<"bookings" | "wallet" | "referral">("bookings");

  const [wdAmount, setWdAmount] = useState("");
  const [wdPhone, setWdPhone] = useState("");
  const [wdName, setWdName] = useState("");
  const [wdLoading, setWdLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate("/dang-nhap");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;

    supabase
      .from("bookings")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setBookings(data);
      });

    supabase
      .from("wallet")
      .select("*")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data) setWallet(data);
      });

    supabase
      .from("wallet_transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (data) setTransactions(data);
      });

    supabase
      .from("withdrawals")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setWithdrawals(data);
      });
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleCopyReferral = () => {
    if (!profile?.referral_code) return;
    const link = getReferralUrl(profile.referral_code);
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Đã sao chép link giới thiệu!");
  };

  const handleWithdraw = async () => {
    if (!wdAmount || !wdPhone) {
      toast.error("Vui lòng nhập đủ thông tin.");
      return;
    }
    const amount = parseInt(wdAmount);
    if (isNaN(amount) || amount < 10000) {
      toast.error("Số tiền rút tối thiểu là 10.000đ.");
      return;
    }
    const phoneClean = wdPhone.replace(/\s/g, "");
    if (!/^(0\d{9,10})$/.test(phoneClean)) {
      toast.error("Số điện thoại MoMo không hợp lệ.");
      return;
    }
    const available = (wallet?.balance_vnd || 0) - (wallet?.reserved_vnd || 0);
    if (amount > available) {
      toast.error("Số tiền vượt quá số dư khả dụng.");
      return;
    }

    setWdLoading(true);
    try {
      const { error } = await supabase.rpc("request_withdrawal", {
        _amount: amount,
        _momo_phone: wdPhone,
        _momo_name: wdName || "",
      });
      if (error) {
        console.error("Withdrawal error:", error);
        toast.error("Không thể thực hiện thao tác. Vui lòng thử lại.");
      } else {
        toast.success("Yêu cầu rút tiền đã được gửi!");
        // Send email notification to admin
        try {
          await supabase.functions.invoke("send-withdrawal-email", {
            body: { amount_vnd: amount, momo_phone: wdPhone, momo_name: wdName || "" },
          });
        } catch (emailErr) {
          console.error("Email notification failed:", emailErr);
        }
        setWdAmount("");
        setWdPhone("");
        setWdName("");
        const { data: wData } = await supabase.from("wallet").select("*").eq("user_id", user!.id).single();
        if (wData) setWallet(wData);
        const { data: wdData } = await supabase
          .from("withdrawals")
          .select("*")
          .eq("user_id", user!.id)
          .order("created_at", { ascending: false });
        if (wdData) setWithdrawals(wdData);
      }
    } finally {
      setWdLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-16">
        <p className="text-muted-foreground">Đang tải...</p>
      </div>
    );
  }

  if (!user) return null;

  const available = (wallet?.balance_vnd || 0) - (wallet?.reserved_vnd || 0);

  return (
    <div className="pt-20 pb-16">
      <div className="mx-auto max-w-4xl px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-sans text-3xl font-bold text-foreground">Tài khoản</h1>
              <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
            </div>
            <Button variant="ghost" onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
              Đăng xuất
            </Button>
          </div>

          {/* Tabs */}
          <div className="mb-6 flex gap-1.5 rounded-lg border border-border bg-secondary/30 p-1">
            {[
              { key: "bookings" as const, label: "Lịch hẹn", icon: CalendarDays },
              { key: "wallet" as const, label: "Ví & Rút tiền", icon: WalletIcon },
              { key: "referral" as const, label: "Giới thiệu", icon: Share2 },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-xs font-medium transition-all sm:text-sm ${
                  tab === t.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <t.icon size={14} />
                {t.label}
              </button>
            ))}
          </div>

          {/* Bookings Tab */}
          {tab === "bookings" && (
            <div>
              {bookings.length === 0 ? (
                <div className="rounded-lg border border-border/50 bg-card p-8 text-center">
                  <p className="text-muted-foreground">Bạn chưa có lịch hẹn nào.</p>
                  <Button
                    className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => navigate("/dat-lich")}
                  >
                    Đặt lịch ngay
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {bookings.map((b) => {
                    const bs = bookingStatusLabels[b.booking_status] || bookingStatusLabels.pending;
                    const ps = paymentStatusLabels[b.payment_status] || paymentStatusLabels.unpaid;
                    return (
                      <div key={b.id} className="rounded-lg border border-border/50 bg-card p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-mono text-xs text-primary">{b.booking_code}</p>
                            <p className="mt-1 font-semibold text-foreground">{b.product_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {b.preferred_date} · {b.preferred_time}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span
                              className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${bs.className}`}
                            >
                              {bs.text}
                            </span>
                            <span
                              className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${ps.className}`}
                            >
                              {ps.text}
                            </span>
                          </div>
                        </div>
                        {b.reject_reason && (
                          <p className="mt-2 text-xs text-destructive">Lý do từ chối: {b.reject_reason}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Wallet Tab */}
          {tab === "wallet" && (
            <div className="space-y-6">
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-6">
                <p className="text-xs font-medium text-muted-foreground mb-1">Số dư khả dụng</p>
                <p className="text-3xl font-bold text-primary">{formatVND(available)}</p>
                {(wallet?.reserved_vnd || 0) > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Đang giữ: {formatVND(wallet?.reserved_vnd || 0)} · Tổng: {formatVND(wallet?.balance_vnd || 0)}
                  </p>
                )}
              </div>

              <div className="rounded-lg border border-border/50 bg-card p-6">
                <h3 className="font-sans text-lg font-semibold text-foreground mb-4">Yêu cầu rút về MoMo</h3>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">Số tiền (VNĐ) *</label>
                    <Input
                      type="number"
                      value={wdAmount}
                      onChange={(e) => setWdAmount(e.target.value)}
                      placeholder="300000"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">Số điện thoại MoMo *</label>
                    <input
                      type="tel"
                      value={wdPhone}
                      onChange={(e) => setWdPhone(e.target.value)}
                      className="w-full rounded-lg border border-border bg-secondary/30 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                      placeholder="0901 234 567"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">Tên MoMo (tùy chọn)</label>
                    <input
                      type="text"
                      value={wdName}
                      onChange={(e) => setWdName(e.target.value)}
                      className="w-full rounded-lg border border-border bg-secondary/30 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                  <Button
                    onClick={handleWithdraw}
                    disabled={wdLoading || available <= 0}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {wdLoading ? "Đang xử lý..." : "Yêu cầu rút tiền"}
                  </Button>
                </div>
              </div>

              {withdrawals.length > 0 && (
                <div>
                  <h3 className="font-serif text-lg font-semibold text-foreground mb-3">Lịch sử rút tiền</h3>
                  <div className="space-y-2">
                    {withdrawals.map((w) => (
                      <div
                        key={w.id}
                        className="flex items-center justify-between rounded-lg border border-border/50 bg-card px-4 py-3"
                      >
                        <div>
                          <p className="text-sm font-medium text-foreground">{formatVND(w.amount_vnd)}</p>
                          <p className="text-xs text-muted-foreground">
                            {w.momo_phone} · {new Date(w.created_at).toLocaleDateString("vi-VN")}
                          </p>
                        </div>
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                            w.status === "paid"
                              ? "bg-success/10 text-success"
                              : w.status === "rejected"
                                ? "bg-destructive/10 text-destructive"
                                : w.status === "approved"
                                  ? "bg-primary/10 text-primary"
                                  : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {w.status === "pending"
                            ? "Chờ duyệt"
                            : w.status === "approved"
                              ? "Đã duyệt"
                              : w.status === "paid"
                                ? "Đã chuyển"
                                : "Từ chối"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {transactions.length > 0 && (
                <div>
                  <h3 className="font-serif text-lg font-semibold text-foreground mb-3">Lịch sử giao dịch</h3>
                  <div className="space-y-2">
                    {transactions.map((t) => (
                      <div
                        key={t.id}
                        className="flex items-center justify-between rounded-lg border border-border/50 bg-card px-4 py-3"
                      >
                        <div>
                          <p className="text-sm text-foreground">{t.description || t.type}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(t.created_at).toLocaleDateString("vi-VN")}
                          </p>
                        </div>
                        <span
                          className={`text-sm font-semibold ${t.amount_vnd > 0 ? "text-success" : "text-destructive"}`}
                        >
                          {t.amount_vnd > 0 ? "+" : ""}
                          {formatVND(t.amount_vnd)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Referral Tab */}
          {tab === "referral" && (
            <div className="space-y-6">
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-6 text-center">
                <Share2 className="mx-auto mb-3 text-primary" size={32} />
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                  Giới thiệu bạn bè — Nhận 10% hoa hồng
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Chia sẻ link giới thiệu. Khi bạn bè đặt lịch và cọc thành công lần đầu, bạn nhận{" "}
                  <span className="font-semibold text-primary">10% giá trị đơn đặt</span> vào ví.
                </p>

                {profile?.referral_code ? (
                  <div className="space-y-3">
                    <div className="rounded-lg border border-border bg-card px-4 py-3">
                      <p className="text-xs text-muted-foreground mb-1">Mã giới thiệu</p>
                      <p className="font-mono text-lg font-bold text-primary">{profile.referral_code}</p>
                    </div>
                    <div className="rounded-lg border border-border bg-card px-4 py-3">
                      <p className="text-xs text-muted-foreground mb-1">Link giới thiệu</p>
                      <p className="break-all text-sm text-foreground">
                        {getReferralUrl(profile.referral_code)}
                      </p>
                    </div>
                    <Button
                      onClick={handleCopyReferral}
                      className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                      {copied ? "Đã sao chép!" : "Sao chép link giới thiệu"}
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Mã giới thiệu sẽ hiển thị sau khi tài khoản được kích hoạt.
                  </p>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Account;
