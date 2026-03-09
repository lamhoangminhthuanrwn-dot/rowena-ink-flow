import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import logoRowena from "@/assets/logo-rowena.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();

  const links = [
    { to: "/trang-chu", label: "Trang chủ" },
    { to: "/mau-xam", label: "Mẫu xăm" },
    { to: "/tin-tuc", label: "Tin tức" },
    { to: "/dat-lich", label: "Đặt lịch" },
  ];

  const { canManagePosts } = useAuth();

  if (user && isAdmin) {
    links.push({ to: "/ketoan", label: "Kế toán" });
  }
  if (user && canManagePosts) {
    links.push({ to: "/admin/posts", label: "Bài viết" });
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/trang-chu" className="flex items-center gap-3">
          <img src={logoRowena} alt="ROWENA Tattoo" className="h-10 w-auto" />
          <span className="font-serif text-lg font-semibold tracking-wide text-foreground">
            ROWENA <span className="font-sans text-xs font-light uppercase tracking-[0.2em] text-muted-foreground">tattoo</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm font-medium tracking-wide transition-colors hover:text-primary ${
                location.pathname === l.to ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
          {!loading && (
            user ? (
              <button
                onClick={() => navigate("/tai-khoan")}
                className={`flex items-center gap-1.5 text-sm font-medium tracking-wide transition-colors hover:text-primary ${
                  location.pathname === "/tai-khoan" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <User size={16} />
                Tài khoản
              </button>
            ) : (
              <Link
                to="/dang-nhap"
                className={`text-sm font-medium tracking-wide transition-colors hover:text-primary ${
                  location.pathname === "/dang-nhap" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Đăng nhập
              </Link>
            )
          )}
        </div>

        <button onClick={() => setOpen(!open)} className="text-foreground md:hidden" aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/50 bg-background/95 backdrop-blur-md md:hidden">
          <div className="flex flex-col gap-1 px-4 py-3">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={`rounded-sm px-3 py-2.5 text-sm font-medium transition-colors ${
                  location.pathname === l.to ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
              </Link>
            ))}
            {!loading && (
              user ? (
                <Link
                  to="/account"
                  onClick={() => setOpen(false)}
                  className={`rounded-sm px-3 py-2.5 text-sm font-medium transition-colors ${
                    location.pathname === "/account" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Tài khoản
                </Link>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setOpen(false)}
                  className={`rounded-sm px-3 py-2.5 text-sm font-medium transition-colors ${
                    location.pathname === "/auth" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Đăng nhập
                </Link>
              )
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;