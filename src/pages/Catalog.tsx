import { useState } from "react";
import { Link } from "react-router-dom";
import { tattooDesigns, categories, displayPrice } from "@/data/tattooDesigns";
import ImageSlideshow from "@/components/ImageSlideshow";

const Catalog = () => {
  const [active, setActive] = useState("Tất cả");
  const filtered = active === "Tất cả" ? tattooDesigns : tattooDesigns.filter((d) => d.category === active);

  return (
    <div className="min-h-screen pt-16">
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
    </div>
  );
};

export default Catalog;
