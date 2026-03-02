import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube, MapPin, Phone, Clock, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";

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
  <footer className="border-t border-border/50 bg-card/50 pt-16 pb-8">
    <div className="mx-auto max-w-6xl px-4">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-sm border border-primary/30 font-serif text-base font-bold text-primary">
              R
            </span>
            <span className="font-serif text-lg font-semibold tracking-wide text-foreground">
              ROWENA <span className="font-sans text-[10px] font-light uppercase tracking-[0.2em] text-muted-foreground">tattoo club</span>
            </span>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Nghệ thuật xăm hình chuyên nghiệp. Mỗi tác phẩm là một câu chuyện riêng, được thực hiện với sự tận tâm và kỹ thuật cao nhất.
          </p>
          <div className="flex items-center gap-3 pt-2">
            {socialLinks.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border/50 text-muted-foreground transition-all hover:border-primary/50 hover:text-primary hover:shadow-[0_0_12px_hsl(var(--primary)/0.2)]"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-foreground">Liên kết</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li><Link to="/catalog" className="transition-colors hover:text-primary">Mẫu xăm</Link></li>
            <li><Link to="/booking" className="transition-colors hover:text-primary">Đặt lịch xăm</Link></li>
            <li><Link to="/account" className="transition-colors hover:text-primary">Tài khoản</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="space-y-4">
          <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-foreground">Liên hệ</h4>
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

        {/* Studio Info */}
        <div className="space-y-4">
          <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-foreground">Studio</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2.5">
              <MapPin size={15} className="mt-0.5 shrink-0 text-primary/70" />
              <span>Hồ Chí Minh, Việt Nam</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Clock size={15} className="mt-0.5 shrink-0 text-primary/70" />
              <p>Thứ 2 – Chủ nhật : 9:00 – 19:00</p>
            </li>
          </ul>
        </div>
      </div>

      {/* Google Maps */}
      <div className="mt-10">
        <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-foreground mb-4">Vị trí Studio</h4>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125418.77791228806!2d106.62966791640625!3d10.823098600000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529292e8d3dd1%3A0xf15f5aad773c112b!2sHo%20Chi%20Minh%20City%2C%20Vietnam!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
          width="100%"
          height="200"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="rounded-lg border border-border/30"
          title="Vị trí Studio Rowena Tattoo"
        />
      </div>

      <Separator className="my-8 bg-border/30" />

      <div className="flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
        <p>© 2025 ROWENA Tattoo Club. All rights reserved.</p>
        <p className="text-muted-foreground/60">Thiết kế bởi ❤️ cho nghệ thuật xăm</p>
      </div>
    </div>
  </footer>
);

export default Footer;
