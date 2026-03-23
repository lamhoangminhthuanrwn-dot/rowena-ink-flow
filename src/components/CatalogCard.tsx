import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { TattooDesign } from "@/data/tattooDesigns";
import { displayPrice } from "@/data/tattooDesigns";
import ImageSlideshow from "@/components/ImageSlideshow";

interface CatalogCardProps {
  design: TattooDesign;
  index: number;
}

const CatalogCard = ({ design, index }: CatalogCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    viewport={{ once: true, margin: "-50px" }}
  >
    <Link
      to={`/mau-xam/${design.slug}`}
      className="group block overflow-hidden border border-border bg-card transition-all duration-300 hover:border-primary"
    >
      <div className="aspect-[3/4] overflow-hidden bg-secondary/30">
        {design.images && design.images.length > 1 ? (
          <ImageSlideshow
            images={design.images}
            alt={design.name}
            className="h-full w-full"
            objectFit="contain"
            showDots={false}
            showArrows={true}
            grayscale
          />
        ) : (
          <img
            src={design.image}
            alt={design.name}
            className="h-full w-full object-contain grayscale contrast-125 transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
            loading="lazy"
          />
        )}
      </div>
      <div className="p-4 border-t border-border">
        <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-foreground">{design.name}</h3>
        <p className="mt-0.5 font-mono text-xs uppercase tracking-widest text-muted-foreground">{design.category}</p>
        <p className="mt-2 font-mono text-xs font-bold text-primary">{displayPrice(design)}</p>
      </div>
    </Link>
  </motion.div>
);

export default CatalogCard;
