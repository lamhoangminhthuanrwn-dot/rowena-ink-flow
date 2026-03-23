import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const DiamondIcon = ({ className = "size-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path clipRule="evenodd" d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z" fill="currentColor" fillRule="evenodd" />
  </svg>
);

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, canManagePosts, loading } = useAuth();

  const links = [
    { to: "/mau-xam", label: "ARCHIVE" },
    { to: "/tin-tuc", label: "TIN TỨC" },
  ];

  if (user && isAdmin) {
    links.push({ to: "/ketoan", label: "KẾ TOÁN" });
  }
  if (user && canManagePosts) {
    links.push({ to: "/admin/posts", label: "BÀI VIẾT" });
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6 md:px-8">
        <Link to="/" className="flex items-center gap-3 text-foreground hover:text-primary transition-colors">
          <DiamondIcon className="size-5 text-primary" />
          <span className="text-lg font-bold uppercase tracking-widest">ROWENA TATTOO</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`font-mono text-sm font-bold uppercase tracking-[0.15em] transition-colors ${
                isActive(l.to) ? "text-primary border-b border-primary pb-1" : "text-foreground/70 hover:text-primary"
              }`}
            >
              {l.label}
            </Link>
          ))}
          {!loading && (
            user ? (
              <button
                onClick={() => navigate("/tai-khoan")}
                className={`flex items-center gap-1.5 font-mono text-sm font-bold uppercase tracking-[0.15em] transition-colors ${
                  isActive("/tai-khoan") ? "text-primary border-b border-primary pb-1" : "text-foreground/70 hover:text-primary"
                }`}
              >
                <User size={14} />
                TÀI KHOẢN
              </button>
            ) : (
              <Link
                to="/dang-nhap"
                className={`font-mono text-sm font-bold uppercase tracking-[0.15em] transition-colors ${
                  isActive("/dang-nhap") ? "text-primary" : "text-foreground/70 hover:text-primary"
                }`}
              >
                ĐĂNG NHẬP
              </Link>
            )
          )}
          <Link
            to="/dat-lich"
            className={`border px-4 py-2 font-mono text-sm font-bold uppercase tracking-[0.15em] transition-all ${
              isActive("/dat-lich")
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-foreground hover:border-primary hover:text-primary"
            }`}
          >
            BOOK
          </Link>
        </div>

        <button onClick={() => setOpen(!open)} className="text-foreground md:hidden" aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="flex flex-col px-6 py-4">
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className={`py-3 font-mono text-sm font-bold uppercase tracking-[0.15em] transition-colors ${
                isActive("/") ? "text-primary" : "text-foreground/70"
              }`}
            >
              TRANG CHỦ
            </Link>
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={`py-3 font-mono text-sm font-bold uppercase tracking-[0.15em] transition-colors ${
                  isActive(l.to) ? "text-primary" : "text-foreground/70"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/dat-lich"
              onClick={() => setOpen(false)}
              className="mt-2 border border-primary bg-primary py-3 text-center font-mono text-sm font-bold uppercase tracking-[0.15em] text-primary-foreground"
            >
              BOOK
            </Link>
            {!loading && (
              user ? (
                <Link
                  to="/tai-khoan"
                  onClick={() => setOpen(false)}
                  className="py-3 font-mono text-sm font-bold uppercase tracking-[0.15em] text-foreground/70"
                >
                  TÀI KHOẢN
                </Link>
              ) : (
                <Link
                  to="/dang-nhap"
                  onClick={() => setOpen(false)}
                  className="py-3 font-mono text-sm font-bold uppercase tracking-[0.15em] text-foreground/70"
                >
                  ĐĂNG NHẬP
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
