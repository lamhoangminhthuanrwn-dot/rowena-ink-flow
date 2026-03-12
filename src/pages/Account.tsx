import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { CalendarDays, Wallet as WalletIcon, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import BookingsTab from "@/components/account/BookingsTab";
import WalletTab from "@/components/account/WalletTab";
import ReferralTab from "@/components/account/ReferralTab";

const Account = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"bookings" | "wallet" | "referral">("bookings");

  useEffect(() => {
    if (!authLoading && !user) navigate("/dang-nhap");
  }, [user, authLoading, navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-16">
        <p className="text-muted-foreground">Đang tải...</p>
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

          {tab === "bookings" && <BookingsTab userId={user.id} />}
          {tab === "wallet" && <WalletTab userId={user.id} />}
          {tab === "referral" && <ReferralTab referralCode={profile?.referral_code} />}
        </motion.div>
      </div>
    </div>
  );
};

export default Account;
