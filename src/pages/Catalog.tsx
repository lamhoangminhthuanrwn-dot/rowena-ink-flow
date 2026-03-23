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
      <div className="sticky top-16 z-40 border-b border-border bg-secondary w-full">
        <div className="mx-auto flex max-w-[1440px] gap-6 px-6 md:px-10 py-3">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`font-mono text-sm font-bold uppercase tracking-widest transition-colors ${
                active === c ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              [{c.toUpperCase()}]
            </button>
          ))}
        </div>
      </div>

      {/* Masonry Grid */}
      <main className="mx-auto max-w-[1440px] px-6 md:px-10 py-10">
        <div className="masonry-grid">
          {filtered.map((d) => (
            <Link key={d.id} to={`/mau-xam/${d.slug}`} className="masonry-item block">
              {d.images && d.images.length > 1 ? (
                <div className="w-full">
                  <img
                    src={d.image}
                    alt={d.name}
                    className="w-full h-auto grayscale-hover block"
                    loading="lazy"
                  />
                </div>
              ) : (
                <img
                  src={d.image}
                  alt={d.name}
                  className="w-full h-auto grayscale-hover block"
                  loading="lazy"
                />
              )}
              <div className="meta-overlay flex flex-col">
                <span className="font-sans text-sm font-bold uppercase tracking-wider text-foreground">{d.name}</span>
                <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground mt-1">{d.category}</span>
                <span className="font-mono text-xs text-primary mt-1">{displayPrice(d)}</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Catalog;
