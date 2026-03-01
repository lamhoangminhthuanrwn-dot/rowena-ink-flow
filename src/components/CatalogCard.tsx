import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { TattooDesign } from "@/data/tattooDesigns";
import { displayPrice } from "@/data/tattooDesigns";

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
      to={`/catalog/${design.id}`}
      className="group block overflow-hidden rounded-lg border border-border/50 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="aspect-[3/4] overflow-hidden">
        <img
          src={design.image}
          alt={design.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <h3 className="font-serif text-base font-semibold text-foreground">{design.name}</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">{design.category}</p>
        <p className="mt-2 text-sm font-semibold text-primary">{displayPrice(design)}</p>
      </div>
    </Link>
  </motion.div>
);

export default CatalogCard;