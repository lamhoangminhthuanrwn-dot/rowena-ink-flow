import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { tattooDesigns } from "@/data/tattooDesigns";
import ImageSlideshow from "@/components/ImageSlideshow";

const styles = [
  { label: "Full Body", category: "Full body" },
  { label: "Mini & A4", category: "Mini" },
  { label: "Đặc biệt", category: "Đặc biệt" },
];

const FeaturedPortfolio = () => {
  return (
    <section className="mx-auto max-w-[1440px] border-b border-border py-20 px-6 md:px-16">
      <div className="mb-12 flex items-end justify-between">
        <div>
          <h2 className="font-serif text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
            Bộ sưu tập
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Khám phá các tác phẩm nổi bật theo từng phong cách.
          </p>
        </div>
        <Link
          to="/mau-xam"
          className="hidden items-center gap-2 font-mono text-sm font-bold uppercase tracking-widest text-primary transition-colors hover:text-foreground md:flex"
        >
          Xem tất cả <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {styles.map((s) => {
          const items = tattooDesigns.filter((d) => d.category === s.category);
          const first = items[0];
          if (!first) return null;
          return (
            <Link
              key={s.category}
              to={`/mau-xam/${first.slug}`}
              className="group relative block overflow-hidden border border-border transition-colors hover:border-primary"
            >
              <div className="aspect-[3/4] w-full overflow-hidden">
                {first.images && first.images.length > 1 ? (
                  <ImageSlideshow
                    images={first.images}
                    alt={first.name}
                    className="h-full w-full"
                    objectFit="cover"
                    grayscale
                    showArrows={false}
                    showDots={false}
                  />
                ) : (
                  <img
                    src={first.image}
                    alt={first.name}
                    className="h-full w-full object-cover grayscale contrast-125 transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                    loading="lazy"
                  />
                )}
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-background/90 border-t border-border p-4 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
                <p className="font-sans text-sm font-bold uppercase text-foreground">
                  {s.label}
                </p>
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  {items.length} mẫu
                </p>
              </div>
              <div className="absolute bottom-4 left-4 group-hover:opacity-0 transition-opacity">
                <span className="bg-background/80 border border-border px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-foreground">
                  {s.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 md:hidden">
        <Link
          to="/mau-xam"
          className="block w-full border border-foreground py-4 text-center font-mono text-sm font-bold uppercase tracking-[0.15em] text-foreground transition-colors hover:bg-foreground hover:text-background"
        >
          Xem tất cả mẫu xăm
        </Link>
      </div>
    </section>
  );
};

export default FeaturedPortfolio;
