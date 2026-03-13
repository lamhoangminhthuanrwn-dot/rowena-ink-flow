import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { formatVND } from "@/data/tattooDesigns";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Smartphone, ArrowRight, RefreshCw } from "lucide-react";
import type { Wallet, WalletTransaction, Withdrawal } from "@/types/database";

interface WalletTabProps {
  userId: string;
}

interface PaymentAccount {
  id: string;
  user_id: string;
  account_type: string;
  momo_phone: string | null;
  momo_name: string | null;
  bank_name: string | null;
  bank_account_number: string | null;
  bank_account_name: string | null;
  created_at: string;
  updated_at: string;
}

const WalletTab = ({ userId }: WalletTabProps) => {
  const queryClient = useQueryClient();
  const [wdAmount, setWdAmount] = useState("");
  const [wdLoading, setWdLoading] = useState(false);
  const [changeLoading, setChangeLoading] = useState(false);

  // Link form state
  const [linkType, setLinkType] = useState<"momo" | "bank">("momo");
  const [linkMomoPhone, setLinkMomoPhone] = useState("");
  const [linkMomoName, setLinkMomoName] = useState("");
  const [linkBankName, setLinkBankName] = useState("");
  const [linkBankNumber, setLinkBankNumber] = useState("");
  const [linkBankAccountName, setLinkBankAccountName] = useState("");
  const [linkLoading, setLinkLoading] = useState(false);

  const { data: wallet = null } = useQuery<Wallet | null>({
    queryKey: ["account-wallet", userId],
    queryFn: async () => {
      const { data } = await supabase.from("wallet").select("*").eq("user_id", userId).single();
      return data;
    },
  });

  const { data: paymentAccount, isLoading: paLoading, refetch: refetchPA } = useQuery<PaymentAccount | null>({
    queryKey: ["payment-account", userId],
    queryFn: async () => {
      const { data } = await supabase
        .from("payment_accounts" as any)
        .select("*")
        .eq("user_id", userId)
        .single();
      return data as unknown as PaymentAccount | null;
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

  const handleLinkAccount = async () => {
    if (linkType === "momo") {
      const phoneClean = linkMomoPhone.replace(/\s/g, "");
      if (!/^(0\d{9,10})$/.test(phoneClean)) {
        toast.error("Số điện thoại MoMo không hợp lệ.");
        return;
      }
      if (!linkMomoName.trim()) {
        toast.error("Vui lòng nhập tên MoMo.");
        return;
      }
    } else {
      if (!linkBankName.trim() || !linkBankNumber.trim() || !linkBankAccountName.trim()) {
        toast.error("Vui lòng nhập đầy đủ thông tin ngân hàng.");
        return;
      }
    }

    setLinkLoading(true);
    try {
      const payload: any = {
        user_id: userId,
        account_type: linkType,
        momo_phone: linkType === "momo" ? linkMomoPhone.replace(/\s/g, "") : null,
        momo_name: linkType === "momo" ? linkMomoName.trim() : null,
        bank_name: linkType === "bank" ? linkBankName.trim() : null,
        bank_account_number: linkType === "bank" ? linkBankNumber.trim() : null,
        bank_account_name: linkType === "bank" ? linkBankAccountName.trim() : null,
      };

      const { error } = await supabase.from("payment_accounts" as any).insert(payload);
      if (error) {
        console.error("Link error:", error);
        toast.error("Không thể liên kết tài khoản. Vui lòng thử lại.");
      } else {
        toast.success("Liên kết tài khoản thành công!");
        refetchPA();
      }
    } finally {
      setLinkLoading(false);
    }
  };

  const handleRequestChange = async () => {
    setChangeLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-change-payment-email");
      if (error) {
        console.error("Change request error:", error);
        toast.error("Không thể gửi email xác nhận. Vui lòng thử lại.");
      } else {
        const responseData = (data ?? {}) as { email_sent?: boolean; confirm_url?: string };

        if (responseData.email_sent === false && responseData.confirm_url) {
          try {
            await navigator.clipboard.writeText(responseData.confirm_url);
          } catch (clipboardErr) {
            console.warn("Clipboard unavailable:", clipboardErr);
          }
          toast.success("Email đang ở chế độ test, link xác nhận đã được sao chép.");
        } else {
          toast.success("Email xác nhận đã được gửi! Vui lòng kiểm tra hộp thư.");
        }
      }
    } finally {
      setChangeLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!wdAmount) {
      toast.error("Vui lòng nhập số tiền.");
      return;
    }
    const amount = parseInt(wdAmount);
    if (isNaN(amount) || amount < 10000) {
      toast.error("Số tiền rút tối thiểu là 10.000đ.");
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
        _momo_phone: "",
        _momo_name: "",
      });
      if (error) {
        console.error("Withdrawal error:", error);
        if (error.message?.includes("No linked payment account")) {
          toast.error("Vui lòng liên kết tài khoản thanh toán trước.");
        } else {
          toast.error("Không thể thực hiện thao tác. Vui lòng thử lại.");
        }
      } else {
        toast.success("Yêu cầu rút tiền đã được gửi!");
        try {
          const acctLabel = paymentAccount?.account_type === "momo"
            ? paymentAccount.momo_phone
            : paymentAccount?.bank_account_number;
          await supabase.functions.invoke("send-withdrawal-email", {
            body: {
              amount_vnd: amount,
              momo_phone: acctLabel || "",
              momo_name: paymentAccount?.account_type === "momo"
                ? paymentAccount.momo_name || ""
                : paymentAccount?.bank_account_name || "",
            },
          });
        } catch (emailErr) {
          console.error("Email notification failed:", emailErr);
        }
        setWdAmount("");
        queryClient.invalidateQueries({ queryKey: ["account-wallet", userId] });
        queryClient.invalidateQueries({ queryKey: ["account-withdrawals", userId] });
        queryClient.invalidateQueries({ queryKey: ["account-transactions", userId] });
      }
    } finally {
      setWdLoading(false);
    }
  };

  if (paLoading) {
    return <p className="text-muted-foreground text-center py-8">Đang tải...</p>;
  }

  return (
    <div className="space-y-6">
      {/* Balance */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-6">
        <p className="text-xs font-medium text-muted-foreground mb-1">Số dư khả dụng</p>
        <p className="text-3xl font-bold text-primary">{formatVND(available)}</p>
        {(wallet?.reserved_vnd || 0) > 0 && (
          <p className="text-xs text-muted-foreground mt-1">
            Đang giữ: {formatVND(wallet?.reserved_vnd || 0)} · Tổng: {formatVND(wallet?.balance_vnd || 0)}
          </p>
        )}
      </div>

      {/* Link account or Withdraw */}
      {!paymentAccount ? (
        <div className="rounded-lg border border-border/50 bg-card p-6">
          <h3 className="font-sans text-lg font-semibold text-foreground mb-1">Liên kết tài khoản thanh toán</h3>
          <p className="text-xs text-muted-foreground mb-4">Bạn cần liên kết tài khoản MoMo hoặc ngân hàng trước khi rút tiền. Thông tin này chỉ được thiết lập một lần.</p>

          <RadioGroup value={linkType} onValueChange={(v) => setLinkType(v as "momo" | "bank")} className="flex gap-3 mb-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="momo" id="type-momo" />
              <Label htmlFor="type-momo" className="flex items-center gap-1.5 cursor-pointer">
                <Smartphone size={14} /> MoMo
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bank" id="type-bank" />
              <Label htmlFor="type-bank" className="flex items-center gap-1.5 cursor-pointer">
                <CreditCard size={14} /> Ngân hàng
              </Label>
            </div>
          </RadioGroup>

          {linkType === "momo" ? (
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Số điện thoại MoMo *</label>
                <Input type="tel" value={linkMomoPhone} onChange={(e) => setLinkMomoPhone(e.target.value)} placeholder="0901 234 567" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Tên MoMo *</label>
                <Input type="text" value={linkMomoName} onChange={(e) => setLinkMomoName(e.target.value)} placeholder="Nguyễn Văn A" />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Tên ngân hàng *</label>
                <Input type="text" value={linkBankName} onChange={(e) => setLinkBankName(e.target.value)} placeholder="Vietcombank" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Số tài khoản *</label>
                <Input type="text" value={linkBankNumber} onChange={(e) => setLinkBankNumber(e.target.value)} placeholder="1234567890" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Tên chủ tài khoản *</label>
                <Input type="text" value={linkBankAccountName} onChange={(e) => setLinkBankAccountName(e.target.value)} placeholder="NGUYEN VAN A" />
              </div>
            </div>
          )}

          <Button onClick={handleLinkAccount} disabled={linkLoading} className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
            {linkLoading ? "Đang xử lý..." : (
              <span className="flex items-center gap-1.5">
                Liên kết tài khoản <ArrowRight size={14} />
              </span>
            )}
          </Button>
        </div>
      ) : (
        <>
          {/* Linked account info */}
          <div className="rounded-lg border border-border/50 bg-card p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-sans text-lg font-semibold text-foreground">Tài khoản đã liên kết</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRequestChange}
                disabled={changeLoading}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                <RefreshCw size={12} className={changeLoading ? "animate-spin" : ""} />
                Đổi tài khoản
              </Button>
            </div>
            {paymentAccount.account_type === "momo" ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Smartphone size={14} className="text-primary" />
                  <span className="text-sm font-medium text-foreground">MoMo</span>
                </div>
                <p className="text-sm text-muted-foreground">SĐT: {paymentAccount.momo_phone}</p>
                <p className="text-sm text-muted-foreground">Tên: {paymentAccount.momo_name}</p>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CreditCard size={14} className="text-primary" />
                  <span className="text-sm font-medium text-foreground">Ngân hàng</span>
                </div>
                <p className="text-sm text-muted-foreground">Ngân hàng: {paymentAccount.bank_name}</p>
                <p className="text-sm text-muted-foreground">STK: {paymentAccount.bank_account_number}</p>
                <p className="text-sm text-muted-foreground">Chủ TK: {paymentAccount.bank_account_name}</p>
              </div>
            )}
          </div>

          {/* Withdraw form */}
          <div className="rounded-lg border border-border/50 bg-card p-6">
            <h3 className="font-sans text-lg font-semibold text-foreground mb-4">Yêu cầu rút tiền</h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Số tiền (VNĐ) *</label>
                <Input type="number" value={wdAmount} onChange={(e) => setWdAmount(e.target.value)} placeholder="300000" min="1" />
              </div>
              <p className="text-xs text-muted-foreground">
                Tiền sẽ được chuyển về {paymentAccount.account_type === "momo" ? `MoMo ${paymentAccount.momo_phone}` : `STK ${paymentAccount.bank_account_number} (${paymentAccount.bank_name})`}
              </p>
              <Button onClick={handleWithdraw} disabled={wdLoading || available <= 0} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                {wdLoading ? "Đang xử lý..." : "Yêu cầu rút tiền"}
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Withdrawal history */}
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

      {/* Transaction history */}
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
