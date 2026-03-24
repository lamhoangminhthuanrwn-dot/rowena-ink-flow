import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { setSEO, resetSEO } from "@/lib/seo";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const refCode = searchParams.get("ref") || localStorage.getItem("ref_code") || "";
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSEO({ title: "Đăng nhập", noindex: true });
    return () => resetSEO();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Đăng nhập thành công!");
      navigate("/tai-khoan");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const phoneClean = phone.replace(/\s/g, "");
    if (phoneClean && !/^(0\d{9,10})$/.test(phoneClean)) {
      toast.error("Số điện thoại không hợp lệ. Vui lòng nhập đúng định dạng (VD: 0901234567).");
      return;
    }
    if (password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          full_name: fullName,
          phone,
          ...(refCode ? { referred_by_code: refCode } : {}),
        },
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Đăng ký thành công! Vui lòng kiểm tra hộp thư đến để xác nhận email. Nếu không thấy, hãy kiểm tra thư mục Spam.", { duration: 10000 });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center pt-16 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-4 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl font-bold uppercase tracking-tight text-foreground">
            {tab === "login" ? "ĐĂNG NHẬP" : "ĐĂNG KÝ"}
          </h1>
          <p className="mt-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {tab === "login" ? "Chào mừng trở lại ROWENA" : "Tạo tài khoản ROWENA"}
          </p>
        </div>

        <div className="border border-border bg-card p-8">
          <div className="mb-6 flex border border-border">
            <button
              onClick={() => setTab("login")}
              className={`flex-1 py-3 font-mono text-xs font-bold uppercase tracking-widest transition-all ${
                tab === "login" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Đăng nhập
            </button>
            <button
              onClick={() => setTab("signup")}
              className={`flex-1 py-3 font-mono text-xs font-bold uppercase tracking-widest transition-all ${
                tab === "signup" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Đăng ký
            </button>
          </div>

          <form onSubmit={tab === "login" ? handleLogin : handleSignup} className="space-y-6">
            {tab === "signup" && (
              <>
                <div>
                  <label className="mb-2 block font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">Họ tên</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="brutalist-input"
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                <div>
                  <label className="mb-2 block font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">Số điện thoại</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="brutalist-input"
                    placeholder="0901 234 567"
                  />
                </div>
              </>
            )}

            <div>
              <label className="mb-2 block font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="brutalist-input"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="mb-2 block font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">Mật khẩu *</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="brutalist-input"
                placeholder="Tối thiểu 6 ký tự"
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary py-4 font-mono text-sm font-bold uppercase tracking-[0.15em] text-primary-foreground transition-all hover:bg-foreground hover:text-background disabled:opacity-50"
            >
              {loading ? "Đang xử lý..." : tab === "login" ? "ĐĂNG NHẬP" : "ĐĂNG KÝ"}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-card px-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">hoặc</span>
              </div>
            </div>

            <button
              type="button"
              className="w-full border border-border py-3 font-mono text-sm font-bold uppercase tracking-[0.1em] text-foreground transition-all hover:bg-foreground hover:text-background flex items-center justify-center gap-2"
              onClick={async () => {
                const { error } = await lovable.auth.signInWithOAuth("google", {
                  redirect_uri: window.location.origin,
                });
                if (error) toast.error("Đăng nhập Google thất bại: " + error.message);
              }}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              GOOGLE
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
