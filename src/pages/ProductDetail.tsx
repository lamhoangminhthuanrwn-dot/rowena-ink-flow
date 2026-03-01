import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { tattooDesigns, displayPrice } from "@/data/tattooDesigns";
import { ArrowLeft, Clock, Ruler } from "lucide-react";
import ImageSlideshow from "@/components/ImageSlideshow";

const ProductDetail = () => {
  const { id } = useParams();
  const design = tattooDesigns.find((d) => d.id === id);

  if (!design) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-16">
        <p className="text-muted-foreground">Không tìm thấy mẫu xăm.</p>
      </div>
    );
  }

  const hasSlideshow = design.images && design.images.length > 1;

  return (
    <div className="pt-20 pb-16">
      <div className="mx-auto max-w-6xl px-4">
        <Link to="/catalog" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft size={16} />
          Quay lại
        </Link>

        <div className="grid gap-10 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="overflow-hidden rounded-lg border border-border/50"
          >
            {hasSlideshow ? (
              <div className="aspect-[3/4]">
                <ImageSlideshow images={design.images!} alt={design.name} />
              </div>
            ) : (
              <img src={design.image} alt={design.name} className="aspect-[3/4] w-full object-cover" />
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:sticky lg:top-24 lg:self-start"
          >
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-primary">{design.category}</p>
            <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">{design.name}</h1>
            <p className="mt-4 text-2xl font-bold text-primary">{displayPrice(design)}</p>

            <p className="mt-6 leading-relaxed text-muted-foreground">{design.description}</p>

            <div className="mt-6 flex gap-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Ruler size={16} className="text-primary/60" />
                {design.size}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock size={16} className="text-primary/60" />
                {design.duration}
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 font-semibold uppercase tracking-wider shadow-lg shadow-primary/25">
                <Link to={`/booking?design=${design.id}`}>Đặt lịch xăm mẫu này</Link>
              </Button>
            </div>

            <div className="mt-8 rounded-lg border border-border/50 bg-secondary/30 p-4">
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Lưu ý:</span> Đặt cọc 200.000đ qua chuyển khoản ngân hàng để được ưu tiên lịch. Phần còn lại thanh toán tại studio.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
