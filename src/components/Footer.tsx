import { useState, useRef, useEffect } from "react";
import logoRowena from "@/assets/logo-rowena-footer.png";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube, MapPin, Phone, Clock, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const TikTokIcon = ({ size = 20 }: {size?: number;}) =>
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>;


const socialLinks = [
{ href: "https://www.facebook.com/profile.php?id=61556145616091", icon: Facebook, label: "Facebook" },
{ href: "https://www.youtube.com/@rowenatattomiennam", icon: Youtube, label: "YouTube" },
{ href: "https://www.instagram.com/rowena_tattoo/", icon: Instagram, label: "Instagram" },
{ href: "https://www.tiktok.com/@rosaigontattoo?lang=vi-VN", icon: TikTokIcon, label: "TikTok" }];


const branches = [
{ name: "Gò Vấp, HCM", address: "99 đường số 18, Phường 8, Quận Gò Vấp, TP. Hồ Chí Minh", mapQuery: "99+đường+số+18+Phường+8+Quận+Gò+Vấp+Hồ+Chí+Minh" },
{ name: "Hà Đông, Hà Nội", address: "Sh41 KPark Văn Phú, Phú La, Hà Đông, Hà Nội", mapQuery: "Sh41+KPark+Văn+Phú+Phú+La+Hà+Đông+Hà+Nội" },
{ name: "Buôn Ma Thuột", address: "250 Trần Phú, Buôn Ma Thuột, Đắk Lắk", mapQuery: "250+Trần+Phú+Buôn+Ma+Thuột+Đắk+Lắk" },
{ name: "Kuala Lumpur", address: "Level 1, Lot F112, Sungei Wang Plaza, Jalan Sultan Ismail, 50250 Kuala Lumpur", mapQuery: "Sungei+Wang+Plaza+Jalan+Sultan+Ismail+Kuala+Lumpur" }];


const Footer = () => {
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

  return (
    <footer className="border-t border-border/50 bg-card/50 pt-16 pb-8">
    <div className="mx-auto max-w-6xl px-4">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img src={logoRowena} alt="Rowena Tattoo" className="h-9 w-auto" />
            <span className="font-serif font-semibold tracking-wide text-foreground text-base">
              ROWENA <span className="font-sans text-[10px] font-light uppercase tracking-[0.2em] text-muted-foreground">tattoo club</span>
            </span>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Nghệ thuật xăm hình chuyên nghiệp. Mỗi tác phẩm là một câu chuyện riêng, được thực hiện với sự tận tâm và kỹ thuật cao nhất.
          </p>
          <div className="flex items-center gap-3 pt-2">
            {socialLinks.map(({ href, icon: Icon, label }) =>
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border/50 text-muted-foreground transition-all hover:border-primary/50 hover:text-primary hover:shadow-[0_0_12px_hsl(var(--primary)/0.2)]">

                <Icon size={16} />
              </a>
              )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h4 className="font-sans text-sm font-semibold uppercase tracking-wider text-foreground">Liên kết</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li><Link to="/mau-xam" className="transition-colors hover:text-primary">Mẫu xăm</Link></li>
            <li><Link to="/tin-tuc" className="transition-colors hover:text-primary">Tin tức</Link></li>
            <li><Link to="/dat-lich" className="transition-colors hover:text-primary">Đặt lịch xăm</Link></li>
            <li><Link to="/tai-khoan" className="transition-colors hover:text-primary">Tài khoản</Link></li>
          </ul>
          <div className="mt-4 space-y-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-2.5">
              <Clock size={15} className="mt-0.5 shrink-0 text-primary/70" />
              <p className="text-muted-foreground text-justify text-xs font-medium">Thứ 2 – Chủ nhật: 8:00 – 18:00
                </p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="space-y-4">
          <h4 className="font-sans text-sm font-semibold uppercase tracking-wider text-foreground">Liên hệ</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2.5">
              <Phone size={15} className="mt-0.5 shrink-0 text-primary/70" />
              <a href="tel:0938048780" className="transition-colors hover:text-primary">0938 048 780</a>
            </li>
            <li className="flex items-start gap-2.5">
              <Mail size={15} className="mt-0.5 shrink-0 text-primary/70" />
              <a href="mailto:rowena.tattoo@gmail.com" className="transition-colors hover:text-primary">rowena.tattoo@gmail.com</a>
            </li>
          </ul>
        </div>

        {/* Google Maps with branch selector - spans 2 columns */}
        <div className="sm:col-span-2 space-y-4">
          <h4 className="font-sans text-sm font-semibold uppercase tracking-wider text-foreground">Chi nhánh Studio</h4>
          <div className="flex flex-wrap gap-2">
            {branches.map((branch, index) => <button
                key={branch.name}
                onClick={() => setActiveBranch(index)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                activeBranch === index ?
                "bg-primary text-primary-foreground shadow-sm" :
                "border border-border/50 text-muted-foreground hover:border-primary/50 hover:text-primary"}`
                }>

                {branch.name}
              </button>
              )}
          </div>
          <div ref={mapRef}>
            {mapVisible ? (
              <iframe
                src={`https://maps.google.com/maps?q=${branches[activeBranch].mapQuery}&output=embed`}
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg border border-border/30"
                title={`Vị trí ${branches[activeBranch].name}`} />
            ) : (
              <div className="h-[200px] rounded-lg border border-border/30 bg-secondary/30" />
            )}
          </div>

          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin size={12} className="shrink-0 text-primary/70" />
            {branches[activeBranch].address}
          </p>
        </div>
      </div>

      <Separator className="my-8 bg-border/30" />

      <div className="flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
        <p>© {new Date().getFullYear()} ROWENA Tattoo Club. All rights reserved.</p>
        <p className="text-muted-foreground/60">Thiết kế bởi ❤️ cho nghệ thuật xăm</p>
      </div>
    </div>
  </footer>);

};

export default Footer;