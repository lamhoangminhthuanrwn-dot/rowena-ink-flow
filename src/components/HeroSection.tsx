import { Link } from "react-router-dom";
import heroImg from "@/assets/hero-tattoo.jpg";

const HeroSection = () => (
  <section className="relative flex h-screen w-full items-center justify-center border-b border-border overflow-hidden">
    <img
      src={heroImg}
      alt="Tattoo artist working in studio"
      className="absolute inset-0 h-full w-full object-cover grayscale contrast-125"
      loading="eager"
    />
    <div className="absolute inset-0 bg-background/60" />

    <div className="relative z-10 flex flex-col items-center gap-6 mt-16 px-4 text-center">
      <h1 className="font-serif text-5xl font-bold uppercase tracking-tighter text-foreground sm:text-6xl md:text-[5.5rem] leading-none">
        Rowena Tattoo
      </h1>
      <p className="max-w-lg font-sans text-base text-foreground/80 md:text-lg">
        Nghệ thuật xăm hình chuyên nghiệp — Thiết kế theo phong cách riêng của bạn
      </p>
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        <Link
          to="/dat-lich"
          className="bg-primary px-10 py-4 font-mono text-sm font-bold uppercase tracking-[0.15em] text-primary-foreground transition-all hover:bg-foreground hover:text-background border border-border"
        >
          Đặt lịch ngay
        </Link>
        <Link
          to="/mau-xam"
          className="border border-foreground/50 bg-background/30 backdrop-blur-sm px-10 py-4 font-mono text-sm font-bold uppercase tracking-[0.15em] text-foreground transition-all hover:border-primary hover:text-primary"
        >
          Xem mẫu xăm
        </Link>
      </div>
    </div>
  </section>
);

export default HeroSection;
