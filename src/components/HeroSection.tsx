import { Link } from "react-router-dom";
import heroImg from "@/assets/hero-tattoo.jpg";

const HeroSection = () =>
<section className="relative flex h-screen w-full items-center justify-center border-b border-border overflow-hidden">
    {/* Background image with grayscale + contrast */}
    <img
    src={heroImg}
    alt="Tattoo artist working in studio"
    className="absolute inset-0 h-full w-full object-cover grayscale contrast-125"
    loading="eager" />
  
    <div className="absolute inset-0 bg-background/50" />

    {/* Content */}
    <div className="relative z-10 flex flex-col items-center gap-10 mt-16 px-4">
      <h1 className="text-center font-serif text-6xl font-bold uppercase tracking-tighter text-foreground sm:text-7xl md:text-[6rem] leading-none">
        ROWENA TATTOO
      </h1>
      <Link
      to="/dat-lich"
      className="bg-primary px-10 py-4 font-mono text-sm font-bold uppercase tracking-[0.15em] text-primary-foreground transition-all hover:bg-foreground hover:text-background border border-border">
      
        ĐẶT LỊCH ngay  
      </Link>
    </div>
  </section>;


export default HeroSection;