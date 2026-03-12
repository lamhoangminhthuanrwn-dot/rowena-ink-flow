import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { formatVND } from "@/data/tattooDesigns";
import type { Wallet, WalletTransaction, Withdrawal } from "@/types/database";

interface WalletTabProps {
  userId: string;
}

const WalletTab = ({ userId }: WalletTabProps) => {
  const queryClient = useQueryClient();
  const [wdAmount, setWdAmount] = useState("");
  const [wdPhone, setWdPhone] = useState("");
  const [wdName, setWdName] = useState("");
  const [wdLoading, setWdLoading] = useState(false);

  const { data: wallet = null } = useQuery<Wallet | null>({
    queryKey: ["account-wallet", userId],
    queryFn: async () => {
      const { data } = await supabase.from("wallet").select("*").eq("user_id", userId).single();
      return data;
    },
  });

  const { data: transactions = [] } = useQuery<WalletTransaction[]>({
    queryKey: ["account-transactions", userId],
    queryFn: async () => {
      const { data } = await supabase
        .from("wallet_transactions").select("*").eq("user_id", userId)
        .order("created_at", { ascending: false }).limit(20);
      return data || [];
    },
  });

  const { data: withdrawals = [] } = useQuery<Withdrawal[]>({
    queryKey: ["account-withdrawals", userId],
    queryFn: async () => {
      const { data } = await supabase
        .from("withdrawals").select("*").eq("user_id", userId)
        .order("created_at", { ascending: false });
      return data || [];
    },
  });

  const available = (wallet?.balance_vnd || 0) - (wallet?.reserved_vnd || 0);

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
        queryClient.invalidateQueries({ queryKey: ["account-wallet", userId] });
        queryClient.invalidateQueries({ queryKey: ["account-withdrawals", userId] });
        queryClient.invalidateQueries({ queryKey: ["account-transactions", userId] });
      }
    } finally {
      setWdLoading(false);
    }
  };

  return (
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
            <Input type="number" value={wdAmount} onChange={(e) => setWdAmount(e.target.value)} placeholder="300000" min="1" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Số điện thoại MoMo *</label>
            <Input type="tel" value={wdPhone} onChange={(e) => setWdPhone(e.target.value)} placeholder="0901 234 567" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Tên MoMo (tùy chọn)</label>
            <Input type="text" value={wdName} onChange={(e) => setWdName(e.target.value)} placeholder="Nguyễn Văn A" />
          </div>
          <Button onClick={handleWithdraw} disabled={wdLoading || available <= 0} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            {wdLoading ? "Đang xử lý..." : "Yêu cầu rút tiền"}
          </Button>
        </div>
      </div>

      {withdrawals.length > 0 && (
        <div>
          <h3 className="font-serif text-lg font-semibold text-foreground mb-3">Lịch sử rút tiền</h3>
          <div className="space-y-2">
            {withdrawals.map((w) => (
              <div key={w.id} className="flex items-center justify-between rounded-lg border border-border/50 bg-card px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{formatVND(w.amount_vnd)}</p>
                  <p className="text-xs text-muted-foreground">
                    {w.momo_phone} · {new Date(w.created_at).toLocaleDateString("vi-VN")}
                  </p>
                </div>
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                    w.status === "paid" ? "bg-success/10 text-success"
                      : w.status === "rejected" ? "bg-destructive/10 text-destructive"
                      : w.status === "approved" ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {w.status === "pending" ? "Chờ duyệt" : w.status === "approved" ? "Đã duyệt" : w.status === "paid" ? "Đã chuyển" : "Từ chối"}
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
              <div key={t.id} className="flex items-center justify-between rounded-lg border border-border/50 bg-card px-4 py-3">
                <div>
                  <p className="text-sm text-foreground">{t.description || t.type}</p>
                  <p className="text-xs text-muted-foreground">{new Date(t.created_at).toLocaleDateString("vi-VN")}</p>
                </div>
                <span className={`text-sm font-semibold ${t.amount_vnd > 0 ? "text-success" : "text-destructive"}`}>
                  {t.amount_vnd > 0 ? "+" : ""}{formatVND(t.amount_vnd)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletTab;
