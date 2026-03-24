import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X, User, Sun, Moon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import logoRowena from "@/assets/logo-rowena.png";
import logoRowenaLight from "@/assets/logo-rowena-light.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, canManagePosts, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const links = [
  { to: "/gioi-thieu", label: "GIỚI THIỆU" },
  { to: "/dich-vu", label: "DỊCH VỤ" },
  { to: "/mau-xam", label: "MẪU XĂM" },
  { to: "/chi-nhanh", label: "CHI NHÁNH" },
  { to: "/tin-tuc", label: "TIN TỨC" }];


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
        <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
          <img src={theme === "dark" ? logoRowena : logoRowenaLight} alt="Rowena Tattoo" className="h-8 w-auto object-contain" />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) =>
          <Link
            key={l.to}
            to={l.to}
            className={`font-mono text-sm font-bold uppercase tracking-[0.15em] transition-colors ${
            isActive(l.to) ? "text-primary border-b border-primary pb-1" : "text-foreground/70 hover:text-primary"}`
            }>
            
              {l.label}
            </Link>
          )}
          <button
            onClick={toggleTheme}
            className="text-foreground/70 hover:text-primary transition-colors"
            aria-label="Toggle theme">
            
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {!loading && user && (
            <button
              onClick={() => navigate("/tai-khoan")}
              className={`flex items-center gap-1.5 font-mono text-sm font-bold uppercase tracking-[0.15em] transition-colors ${
                isActive("/tai-khoan") ? "text-primary border-b border-primary pb-1" : "text-foreground/70 hover:text-primary"
              }`}
            >
              <User size={14} />
              TÀI KHOẢN
            </button>
          )}
          <Link
            to="/dat-lich"
            className={`border px-4 py-2 font-mono text-sm font-bold uppercase tracking-[0.15em] transition-all ${
            isActive("/dat-lich") ?
            "border-primary bg-primary text-primary-foreground" :
            "border-border text-foreground hover:border-primary hover:text-primary"}`
            }>
            
            ​đặt lịch 
          </Link>
        </div>

        <button onClick={() => setOpen(!open)} className="text-foreground md:hidden" aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open &&
      <div className="border-t border-border bg-background md:hidden">
          <div className="flex flex-col px-6 py-4">
            <Link
            to="/"
            onClick={() => setOpen(false)}
            className={`py-3 font-mono text-sm font-bold uppercase tracking-[0.15em] transition-colors ${
            isActive("/") ? "text-primary" : "text-foreground/70"}`
            }>
            
              TRANG CHỦ
            </Link>
            {links.map((l) =>
          <Link
            key={l.to}
            to={l.to}
            onClick={() => setOpen(false)}
            className={`py-3 font-mono text-sm font-bold uppercase tracking-[0.15em] transition-colors ${
            isActive(l.to) ? "text-primary" : "text-foreground/70"}`
            }>
            
                {l.label}
              </Link>
          )}
            <Link
            to="/dat-lich"
            onClick={() => setOpen(false)}
            className="mt-2 border border-primary bg-primary py-3 text-center font-mono text-sm font-bold uppercase tracking-[0.15em] text-primary-foreground">
            
              ​Đặt lịch
            </Link>
            {!loading && user && (
              <Link
                to="/tai-khoan"
                onClick={() => setOpen(false)}
                className="py-3 font-mono text-sm font-bold uppercase tracking-[0.15em] text-foreground/70"
              >
                TÀI KHOẢN
              </Link>
            )}
          </div>
        </div>
      }
    </nav>);

};

export default Navbar;