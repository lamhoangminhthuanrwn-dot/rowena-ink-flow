import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube, MapPin, Phone, Clock, Mail } from "lucide-react";
import logoRowena from "@/assets/logo-rowena.png";
import logoRowenaLight from "@/assets/logo-rowena-light.png";
import { useTheme } from "@/hooks/useTheme";
import { siteConfig } from "@/data/siteConfig";

const TikTokIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const socialLinks = [
  { href: siteConfig.socials.facebook, icon: Facebook, label: "Facebook" },
  { href: siteConfig.socials.youtube, icon: Youtube, label: "YouTube" },
  { href: siteConfig.socials.instagram, icon: Instagram, label: "Instagram" },
  { href: siteConfig.socials.tiktok, icon: TikTokIcon, label: "TikTok" },
];

const Footer = () => {
  const { theme } = useTheme();
  const [activeBranch, setActiveBranch] = useState(0);
  const [mapVisible, setMapVisible] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setMapVisible(true); observer.disconnect(); } },
      { rootMargin: "200px" }
    );
    observer.observe(mapRef.current);
    return () => observer.disconnect();
  }, []);

  const branches = siteConfig.branches;

  return (
    <footer className="border-t border-border bg-background pt-16 pb-8">
      <div className="mx-auto max-w-[1440px] px-6 md:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src={theme === "dark" ? logoRowena : logoRowenaLight} alt="Rowena Tattoo" className="h-6 w-auto object-contain" />
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {siteConfig.tagline}. Mỗi tác phẩm là một câu chuyện riêng.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center border border-border text-muted-foreground transition-all hover:border-primary hover:text-primary"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-foreground">Liên kết</h4>
            <ul className="space-y-2.5 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              <li><Link to="/mau-xam" className="transition-colors hover:text-primary">MẪU XĂM</Link></li>
              <li><Link to="/tin-tuc" className="transition-colors hover:text-primary">TIN TỨC</Link></li>
              <li><Link to="/dat-lich" className="transition-colors hover:text-primary">ĐẶT LỊCH</Link></li>
            </ul>
            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-2.5">
                <Clock size={14} className="mt-0.5 shrink-0 text-primary" />
                <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{siteConfig.workingHours}</p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-foreground">Liên hệ</h4>
            <ul className="space-y-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <Phone size={14} className="mt-0.5 shrink-0 text-primary" />
                <a href={siteConfig.hotlineHref} className="transition-colors hover:text-primary">{siteConfig.hotline}</a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail size={14} className="mt-0.5 shrink-0 text-primary" />
                <a href={`mailto:${siteConfig.email}`} className="transition-colors hover:text-primary normal-case tracking-normal">{siteConfig.email}</a>
              </li>
            </ul>
            <a
              href={siteConfig.zaloLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block border border-border px-4 py-2 font-mono text-xs font-bold uppercase tracking-widest text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Nhắn Zalo
            </a>
          </div>

          {/* Google Maps */}
          <div className="sm:col-span-2 space-y-4">
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-foreground">Chi nhánh Studio</h4>
            <div className="flex flex-wrap gap-2">
              {branches.map((branch, index) => (
                <button
                  key={branch.name}
                  onClick={() => setActiveBranch(index)}
                  className={`border px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-widest transition-all ${
                    activeBranch === index
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                  }`}
                >
                  {branch.name}
                </button>
              ))}
            </div>
            <div ref={mapRef}>
              {mapVisible ? (
                branches.map((branch, index) => (
                  <iframe
                    key={branch.name}
                    src={`https://maps.google.com/maps?q=${branch.mapQuery}&output=embed`}
                    width="100%"
                    height="200"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className={`border border-border ${index !== activeBranch ? "hidden" : ""}`}
                    title={`Vị trí ${branch.name}`}
                  />
                ))
              ) : (
                <div className="h-[200px] border border-border bg-secondary" />
              )}
            </div>
            <p className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
              <MapPin size={12} className="shrink-0 text-primary" />
              {branches[activeBranch].address}
            </p>
          </div>
        </div>

        <div className="my-8 h-px w-full bg-border" />

        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="flex items-center gap-3">
            <img src={theme === "dark" ? logoRowena : logoRowenaLight} alt="Rowena" className="h-4 w-auto object-contain" />
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              © {new Date().getFullYear()} ROWENA TATTOO. ALL RIGHTS RESERVED.
            </p>
          </div>
          <div className="flex gap-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            <a href={siteConfig.socials.instagram} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-foreground">INSTAGRAM</a>
            <a href={siteConfig.socials.facebook} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-foreground">FACEBOOK</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
