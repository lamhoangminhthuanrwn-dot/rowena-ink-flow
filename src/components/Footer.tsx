import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube, MapPin, Phone, Clock, Mail } from "lucide-react";
import logoRowena from "@/assets/logo-rowena.png";

const TikTokIcon = ({ size = 16 }: {size?: number;}) =>
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>;


const socialLinks = [
{ href: "https://www.facebook.com/people/Rowena-Tattoo/61556145616091/", icon: Facebook, label: "Facebook" },
{ href: "https://www.youtube.com/@rowenatattomiennam", icon: Youtube, label: "YouTube" },
{ href: "https://www.instagram.com/rowena_tattoo/", icon: Instagram, label: "Instagram" },
{ href: "https://www.tiktok.com/@rosaigontattoo?lang=vi-VN", icon: TikTokIcon, label: "TikTok" }];


const branches = [
{ name: "Gò Vấp", address: "88 Nguyễn Văn Khối, Phường 11, Gò Vấp, Hồ Chí Minh", mapQuery: "88+Nguyễn+Văn+Khối+Phường+11+Gò+Vấp+Hồ+Chí+Minh" },
{ name: "Hà nội", address: "18A Bờ Sông Sét, Hoàng Mai, Hà Nội", mapQuery: "18A+Bờ+Sông+Sét+Hoàng+Mai+Hà+Nội" },
{ name: "Buôn Ma Thuột", address: "250 Trần Phú, Buôn Ma Thuột, Đắk Lắk", mapQuery: "250+Trần+Phú+Buôn+Ma+Thuột+Đắk+Lắk" },
{ name: "Kuala Lumpur", address: "Level 1, Lot F112, Sungei Wang Plaza, Jalan Sultan Ismail, 50250 Kuala Lumpur", mapQuery: "Sungei+Wang+Plaza+Jalan+Sultan+Ismail+Kuala+Lumpur" }];


const Footer = () => {
  const [activeBranch, setActiveBranch] = useState(0);
  const [mapVisible, setMapVisible] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {if (entry.isIntersecting) {setMapVisible(true);observer.disconnect();}},
      { rootMargin: "200px" }
    );
    observer.observe(mapRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <footer className="border-t border-border bg-background pt-16 pb-8">
      <div className="mx-auto max-w-[1440px] px-6 md:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src={logoRowena} alt="Rowena Tattoo" className="h-6 w-auto object-contain" />
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Nghệ thuật xăm hình chuyên nghiệp. Mỗi tác phẩm là một câu chuyện riêng.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map(({ href, icon: Icon, label }) =>
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                onClick={(e) => {
                  e.preventDefault();
                  window.open(href, '_blank', 'noopener,noreferrer');
                }}
                className="flex h-9 w-9 items-center justify-center border border-border text-muted-foreground transition-all hover:border-primary hover:text-primary">
                
                  <Icon size={16} />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-foreground">Liên kết</h4>
            <ul className="space-y-2.5 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              <li><Link to="/mau-xam" className="transition-colors hover:text-primary">MẪU XĂM</Link></li>
              <li><Link to="/tin-tuc" className="transition-colors hover:text-primary">TIN TỨC</Link></li>
              <li><Link to="/dat-lich" className="transition-colors hover:text-primary">ĐẶT LỊCH</Link></li>
              <li><Link to="/tai-khoan" className="transition-colors hover:text-primary">TÀI KHOẢN</Link></li>
            </ul>
            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-2.5">
                <Clock size={14} className="mt-0.5 shrink-0 text-primary" />
                <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">T2 – CN: 8:00 – 18:00</p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-foreground">Liên hệ</h4>
            <ul className="space-y-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <Phone size={14} className="mt-0.5 shrink-0 text-primary" />
                <a href="tel:0938048780" className="transition-colors hover:text-primary">08888 37 414</a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail size={14} className="mt-0.5 shrink-0 text-primary" />
                <a href="mailto:rowena.tattoo@gmail.com" className="transition-colors hover:text-primary normal-case tracking-normal">rowena.tattoo@gmail.com</a>
              </li>
            </ul>
          </div>

          {/* Google Maps */}
          <div className="sm:col-span-2 space-y-4">
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-foreground">Chi nhánh Studio</h4>
            <div className="flex flex-wrap gap-2">
              {branches.map((branch, index) =>
              <button
                key={branch.name}
                onClick={() => setActiveBranch(index)}
                className={`border px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-widest transition-all ${
                activeBranch === index ?
                "border-primary bg-primary text-primary-foreground" :
                "border-border text-muted-foreground hover:border-primary hover:text-primary"}`
                }>
                
                  {branch.name}
                </button>
              )}
            </div>
            <div ref={mapRef}>
              {mapVisible ?
              branches.map((branch, index) =>
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
                title={`Vị trí ${branch.name}`} />

              ) :

              <div className="h-[200px] border border-border bg-secondary" />
              }
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
            <img src={logoRowena} alt="Rowena" className="h-4 w-auto object-contain" />
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              © 2023 ROWENA TATTOO. ALL RIGHTS RESERVED.
            </p>
          </div>
          <div className="flex gap-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            <a href="#" className="transition-colors hover:text-foreground">INSTAGRAM</a>
            <a href="#" className="transition-colors hover:text-foreground">TERMS</a>
            <a href="#" className="transition-colors hover:text-foreground">PRIVACY</a>
          </div>
        </div>
      </div>
    </footer>);

};

export default Footer;