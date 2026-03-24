import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { setSEO, resetSEO } from "@/lib/seo";
import { CalendarDays, Wallet as WalletIcon, Share2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import BookingsTab from "@/components/account/BookingsTab";
import WalletTab from "@/components/account/WalletTab";
import ReferralTab from "@/components/account/ReferralTab";

const Account = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState<"bookings" | "wallet" | "referral">("bookings");

  useEffect(() => {
    if (!authLoading && !user) navigate("/dang-nhap");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const changeToken = searchParams.get("change_token");
    if (!changeToken) return;

    const confirmChange = async () => {
      try {
        const res = await supabase.functions.invoke("confirm-change-payment", {
          body: { token: changeToken },
        });
        if (res.error || res.data?.error) {
          toast.error(res.data?.error || "Xác nhận thất bại. Vui lòng thử lại.");
        } else {
          toast.success("Đã xóa tài khoản cũ. Bạn có thể liên kết tài khoản mới.");
          setTab("wallet");
        }
      } catch {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
      }
      searchParams.delete("change_token");
      setSearchParams(searchParams, { replace: true });
    };

    confirmChange();
  }, [searchParams, setSearchParams]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-16">
        <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground">Đang tải...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="pt-20 pb-16">
      <div className="mx-auto max-w-4xl px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif text-3xl font-bold uppercase tracking-tight text-foreground">TÀI KHOẢN</h1>
              <p className="mt-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            >
              ĐĂNG XUẤT
            </button>
          </div>

          {/* Tabs */}
          <div className="mb-6 flex border border-border">
            {[
              { key: "bookings" as const, label: "Lịch hẹn", icon: CalendarDays },
              { key: "wallet" as const, label: "Ví & Rút tiền", icon: WalletIcon },
              { key: "referral" as const, label: "Giới thiệu", icon: Share2 },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex flex-1 items-center justify-center gap-1.5 py-3 font-mono text-xs font-bold uppercase tracking-widest transition-all ${
                  tab === t.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <t.icon size={14} />
                {t.label}
              </button>
            ))}
          </div>

          {tab === "bookings" && <BookingsTab userId={user.id} />}
          {tab === "wallet" && <WalletTab userId={user.id} />}
          {tab === "referral" && <ReferralTab referralCode={profile?.referral_code} />}
        </motion.div>
      </div>
    </div>
  );
};

export default Account;
