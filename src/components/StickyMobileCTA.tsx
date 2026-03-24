import { Link } from "react-router-dom";
import { Phone } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";

const ZaloIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16c-.18-.422-.6-.675-1.068-.675H13.5l1.26-2.53c.18-.36.09-.795-.225-1.058-.315-.27-.765-.27-1.08 0L9.9 7.485H7.5c-.468 0-.888.253-1.068.675-.18.415-.09.893.232 1.215L9.9 12.84l-3.24 3.465c-.322.322-.412.8-.232 1.215.18.422.6.675 1.068.675H10.5l-1.26 2.53c-.18.36-.09.795.225 1.058.157.135.345.202.54.202.195 0 .383-.068.54-.202l3.555-3.588H17.1c.468 0 .888-.253 1.068-.675.18-.415.09-.893-.232-1.215L14.7 12.84l3.1-3.465c.322-.322.412-.8.232-1.215z" />
  </svg>
);

const StickyMobileCTA = () => (
  <div className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-border bg-background/95 backdrop-blur-sm md:hidden">
    <a
      href={siteConfig.hotlineHref}
      className="flex flex-1 items-center justify-center gap-2 py-3 font-mono text-xs font-bold uppercase tracking-widest text-foreground transition-colors hover:text-primary"
    >
      <Phone size={14} />
      Gọi ngay
    </a>
    <a
      href={siteConfig.zaloLink}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-1 items-center justify-center gap-2 border-x border-border py-3 font-mono text-xs font-bold uppercase tracking-widest text-foreground transition-colors hover:text-primary"
    >
      <ZaloIcon />
      Zalo
    </a>
    <Link
      to="/dat-lich"
      className="flex flex-1 items-center justify-center gap-2 bg-primary py-3 font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground"
    >
      Đặt lịch
    </Link>
  </div>
);

export default StickyMobileCTA;
