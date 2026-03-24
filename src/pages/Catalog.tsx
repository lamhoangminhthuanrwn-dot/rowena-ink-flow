import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { tattooDesigns, categories, displayPrice } from "@/data/tattooDesigns";
import ImageSlideshow from "@/components/ImageSlideshow";
import { setSEO, resetSEO } from "@/lib/seo";
import { siteConfig } from "@/data/siteConfig";

const Catalog = () => {
  const [active, setActive] = useState("Tất cả");
  const filtered = active === "Tất cả" ? tattooDesigns : tattooDesigns.filter((d) => d.category === active);

  useEffect(() => {
    setSEO({
      title: "Bộ sưu tập hình xăm",
      description: "Khám phá bộ sưu tập mẫu hình xăm đa dạng phong cách tại Rowena Tattoo. Mini tattoo, realism, blackwork, fine line và nhiều hơn nữa.",
    });
  }, []);

  return (
    <div className="min-h-screen pt-16">
      {/* H1 */}
      <div className="border-b border-border bg-secondary/30 px-6 py-10 md:px-10 md:py-14">
        <div className="mx-auto max-w-[1440px]">
          <h1 className="font-mono text-2xl font-bold uppercase tracking-wider text-foreground md:text-4xl">Bộ sưu tập hình xăm</h1>
          <p className="mt-2 text-sm text-muted-foreground md:text-base">Khám phá các phong cách và tìm nguồn cảm hứng cho tác phẩm của bạn.</p>
        </div>
      </div>

      {/* Sticky Filter Bar */}
      <div className="sticky top-16 z-40 border-b border-border/50 bg-background/95 backdrop-blur-sm w-full">
        <div className="mx-auto flex max-w-[1440px] gap-8 px-6 md:px-10 overflow-x-auto no-scrollbar">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`relative py-4 font-sans text-xs uppercase tracking-[0.2em] transition-colors whitespace-nowrap ${
                active === c
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
              {active === c && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry Grid */}
      <main className="mx-auto max-w-[1440px] px-6 md:px-10 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0">
          {filtered.map((d) => (
            <Link key={d.id} to={`/mau-xam/${d.slug}`} className="group relative block border border-border/50 overflow-hidden transition-colors hover:border-primary">
              <div className="aspect-[3/4] overflow-hidden bg-secondary/30">
                {d.images && d.images.length > 1 ? (
                  <ImageSlideshow
                    images={d.images}
                    alt={d.name}
                    className="h-full w-full"
                    objectFit="contain"
                    showDots={false}
                    showArrows={true}
                    grayscale
                  />
                ) : (
                  <img
                    src={d.image}
                    alt={d.name}
                    className="h-full w-full object-contain grayscale contrast-125 transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105"
                    loading="lazy"
                  />
                )}
              </div>
              <div className="absolute bottom-0 left-0 w-full translate-y-full transition-transform duration-300 group-hover:translate-y-0 bg-background/85 p-4 border-t border-border">
                <span className="font-sans text-sm font-bold uppercase tracking-wider text-foreground">{d.name}</span>
                <span className="block font-mono text-xs uppercase tracking-widest text-muted-foreground mt-1">{d.category}</span>
                <span className="block font-mono text-xs text-primary mt-1">{displayPrice(d)}</span>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* CTA */}
      <section className="border-t border-border bg-secondary/30 px-6 py-12 md:px-10 md:py-16">
        <div className="mx-auto max-w-[1440px] text-center">
          <h2 className="font-mono text-xl font-bold uppercase tracking-wider text-foreground md:text-2xl">
            Không tìm thấy mẫu ưng ý?
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">Đặt lịch tư vấn để artist thiết kế riêng theo ý tưởng của bạn.</p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/dat-lich"
              className="border border-primary bg-primary px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.15em] text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Đặt lịch tư vấn
            </Link>
            <a
              href={siteConfig.zaloLink}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-border px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.15em] text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Nhắn Zalo
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Catalog;
