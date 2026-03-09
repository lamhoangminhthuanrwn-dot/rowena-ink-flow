import { useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import FloatingCTA from "@/components/FloatingCTA";
import CatalogCard from "@/components/CatalogCard";
import { tattooDesigns } from "@/data/tattooDesigns";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
      <FloatingCTA />

      <section className="py-24">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">Mẫu nổi bật</h2>
            <p className="mt-3 text-sm text-muted-foreground">Một vài tác phẩm tiêu biểu từ studio</p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((d, i) => (
              <CatalogCard key={d.id} design={d} index={i} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" variant="outline" asChild className="rounded-full border-primary/30 px-8 font-semibold uppercase tracking-wider text-primary hover:bg-primary/10">
              <Link to="/mau-xam">Xem tất cả mẫu</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;