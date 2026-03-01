import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube } from "lucide-react";

const TikTokIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const socialLinks = [
  { href: "https://www.facebook.com/profile.php?id=61556145616091", icon: Facebook, label: "Facebook" },
  { href: "https://www.youtube.com/@rowenatattomiennam", icon: Youtube, label: "YouTube" },
  { href: "https://www.instagram.com/rowena_tattoo/", icon: Instagram, label: "Instagram" },
  { href: "https://www.tiktok.com/@rosaigontattoo?lang=vi-VN", icon: TikTokIcon, label: "TikTok" },
];

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

        <div className="flex items-center gap-4">
          {socialLinks.map(({ href, icon: Icon, label }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="text-muted-foreground transition-colors hover:text-primary">
              <Icon size={20} />
            </a>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">© 2025 ROWENA Tattoo. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;