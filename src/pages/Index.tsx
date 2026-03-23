import { useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import CatalogCard from "@/components/CatalogCard";
import { tattooDesigns } from "@/data/tattooDesigns";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { setSEO, resetSEO, buildLocalBusinessJsonLd } from "@/lib/seo";

const Index = () => {
  const featured = tattooDesigns.slice(0, 3);

  useEffect(() => {
    setSEO({
      title: undefined,
      description: "ROWENA TATTOO CLUB - Xăm hình nghệ thuật chuyên nghiệp tại TP.HCM. Đặt lịch online, xem mẫu xăm và giá.",
      jsonLd: buildLocalBusinessJsonLd(),
    });
    return () => resetSEO();
  }, []);

  return (
    <>
      <HeroSection />

      {/* Featured Work + Quick Links */}
      <section className="mx-auto max-w-[1440px] grid grid-cols-1 lg:grid-cols-2 border-b border-border">
        {/* Left: Featured Work */}
        <div className="border-b lg:border-b-0 lg:border-r border-border p-8 md:p-16 group cursor-pointer hover:bg-secondary transition-colors duration-300">
          <Link to="/mau-xam" className="block">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-sans text-2xl font-bold uppercase tracking-tight text-foreground">FEATURED WORK</h2>
              <ArrowRight className="text-muted-foreground group-hover:text-primary transition-colors" size={20} />
            </div>
            <div className="aspect-[4/5] w-full overflow-hidden border border-border">
              <img
                src={featured[0]?.image}
                alt={featured[0]?.name}
                className="h-full w-full object-cover grayscale contrast-125 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700"
              />
            </div>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{featured[0]?.category}</p>
                <p className="mt-1 font-sans text-lg font-bold uppercase text-foreground">{featured[0]?.name}</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Right: Quick Links */}
        <div className="p-8 md:p-16 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-sans text-2xl font-bold uppercase tracking-tight text-foreground">SẢN PHẨM</h2>
            <Link to="/mau-xam">
              <ArrowRight className="text-muted-foreground hover:text-primary transition-colors" size={20} />
            </Link>
          </div>
          <div className="flex flex-col gap-4 flex-1">
            {tattooDesigns.slice(0, 5).map((d) => (
              <Link
                key={d.id}
                to={`/mau-xam/${d.slug}`}
                className="flex items-center justify-between border-b border-border pb-4 hover:pl-4 transition-all duration-300 group/item"
              >
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 overflow-hidden border border-border">
                    <img src={d.image} alt={d.name} className="h-full w-full object-cover grayscale contrast-125" />
                  </div>
                  <div>
                    <h3 className="font-sans text-base font-bold uppercase text-foreground">{d.name}</h3>
                    <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mt-0.5">{d.category}</p>
                  </div>
                </div>
                <span className="font-mono text-xs uppercase text-primary">{d.priceText || `Từ ${new Intl.NumberFormat("vi-VN").format(d.price)}đ`}</span>
              </Link>
            ))}
          </div>
          <div className="mt-8">
            <Link
              to="/mau-xam"
              className="block w-full border border-foreground py-4 text-center font-mono text-sm font-bold uppercase tracking-[0.15em] text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              XEM TẤT CẢ
            </Link>
          </div>
        </div>
      </section>

      {/* Manifesto */}
      <section className="mx-auto max-w-[1440px] bg-secondary py-20 px-8 md:px-16 border-b border-border">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <div className="size-8 text-primary mb-8">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path clipRule="evenodd" d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z" fill="currentColor" fillRule="evenodd" />
            </svg>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-foreground leading-tight">
            VỆ SINH TUYỆT ĐỐI. NGHỆ THUẬT KHÔNG THỎA HIỆP. TIÊU CHUẨN KHÔNG THƯƠNG LƯỢNG.
          </h2>
          <Link
            to="/tin-tuc"
            className="mt-8 font-mono text-sm uppercase tracking-widest text-primary border-b border-primary pb-1 hover:text-foreground hover:border-foreground transition-colors"
          >
            ĐỌC THÊM
          </Link>
        </div>
      </section>
    </>
  );
};

export default Index;
