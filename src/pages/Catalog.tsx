import { useState } from "react";
import { motion } from "framer-motion";
import CatalogCard from "@/components/CatalogCard";
import { tattooDesigns, categories } from "@/data/tattooDesigns";

const Catalog = () => {
  const [active, setActive] = useState("Tất cả");
  const filtered = active === "Tất cả" ? tattooDesigns : tattooDesigns.filter((d) => d.category === active);

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-10">
          <h1 className="font-sans text-4xl font-bold text-foreground">Mẫu xăm & Giá</h1>
          <p className="mt-2 text-sm text-muted-foreground">Chọn mẫu bạn yêu thích hoặc liên hệ để thiết kế riêng</p>
        </motion.div>

        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-all ${
                active === c
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d, i) => (
            <CatalogCard key={d.id} design={d} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Catalog;