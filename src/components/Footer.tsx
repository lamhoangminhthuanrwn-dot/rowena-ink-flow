import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border/50 bg-background py-12">
    <div className="mx-auto max-w-6xl px-4">
      <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-sm border border-primary/30 font-serif text-sm font-bold text-primary">
            R
          </span>
          <span className="font-serif text-base font-semibold tracking-wide text-foreground">
            ROWENA <span className="font-sans text-[10px] font-light uppercase tracking-[0.2em] text-muted-foreground">tattoo</span>
          </span>
        </div>

        <div className="flex gap-6 text-xs text-muted-foreground">
          <Link to="/catalog" className="transition-colors hover:text-foreground">Mẫu xăm</Link>
          <Link to="/booking" className="transition-colors hover:text-foreground">Đặt lịch</Link>
        </div>

        <p className="text-xs text-muted-foreground">© 2025 ROWENA Tattoo. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;