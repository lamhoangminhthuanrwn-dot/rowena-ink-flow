import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { tattooDesigns, displayPrice, formatVNDShort } from "@/data/tattooDesigns";
import type { TattooVariant } from "@/data/tattooDesigns";
import { ArrowLeft, Clock, Ruler, Info } from "lucide-react";
import ImageSlideshow from "@/components/ImageSlideshow";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

const PriceTableFullBody = ({ variants }: { variants: TattooVariant[] }) => {
  const positions = [...new Set(variants.map((v) => v.position))];

  return (
    <div className="overflow-x-auto rounded-lg border border-border/50">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/40">
            <TableHead className="text-xs font-semibold">Vị trí</TableHead>
            <TableHead className="text-xs font-semibold">Thể loại</TableHead>
            <TableHead className="text-xs font-semibold">Số buổi</TableHead>
            <TableHead className="text-xs font-semibold">Trả hết</TableHead>
            <TableHead className="text-xs font-semibold">Trong ngày</TableHead>
            <TableHead className="text-xs font-semibold">Hình khó</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {positions.map((pos) => {
            const rows = variants.filter((v) => v.position === pos);
            return rows.map((v, i) => (
              <TableRow key={`${pos}-${v.style}-${i}`} className="hover:bg-transparent">
                {i === 0 && (
                  <TableCell rowSpan={rows.length} className="whitespace-nowrap text-xs font-medium align-middle text-center border-r border-border/30">
                    {pos}
                  </TableCell>
                )}
                <TableCell className="text-xs">{v.style}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{v.sessions}</TableCell>
                <TableCell className="text-xs font-semibold text-primary">{formatVNDShort(v.priceSimple)}</TableCell>
                <TableCell className="text-xs">{v.priceSameDay ? formatVNDShort(v.priceSameDay) : "—"}</TableCell>
                <TableCell className="text-xs">
                  {formatVNDShort(v.priceDifficult)}
                  {v.priceDifficultSessions ? ` / ${v.priceDifficultSessions}` : ""}
                </TableCell>
              </TableRow>
            ));
          })}
        </TableBody>
      </Table>
    </div>
  );
};

const PriceTableMini = ({ variants }: { variants: TattooVariant[] }) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-border/50">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/40">
            <TableHead className="text-xs font-semibold">Kích thước</TableHead>
            <TableHead className="text-xs font-semibold">Vị trí</TableHead>
            <TableHead className="text-xs font-semibold">Thời gian</TableHead>
            <TableHead className="text-xs font-semibold">Đơn giản</TableHead>
            <TableHead className="text-xs font-semibold">Hình khó</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {variants.map((v, i) => (
            <TableRow key={i}>
              <TableCell className="text-xs font-medium">{v.style || "—"}</TableCell>
              <TableCell className="text-xs">{v.position}</TableCell>
              <TableCell className="text-xs text-muted-foreground">{v.sessions}</TableCell>
              <TableCell className="text-xs font-semibold text-primary">{formatVNDShort(v.priceSimple)}</TableCell>
              <TableCell className="text-xs">{formatVNDShort(v.priceDifficult)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

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
  const hasVariants = design.variants && design.variants.length > 0;
  const isMini = !!design.isMiniType;

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

            {hasVariants && (
              <div className="mt-8">
                <h2 className="mb-3 font-serif text-lg font-semibold text-foreground">Bảng giá chi tiết</h2>
                {isMini ? (
                  <PriceTableMini variants={design.variants!} />
                ) : (
                  <PriceTableFullBody variants={design.variants!} />
                )}
                {design.note && (
                  <div className="mt-3 flex items-start gap-2 rounded-md bg-primary/5 px-3 py-2">
                    <Info size={14} className="mt-0.5 shrink-0 text-primary/70" />
                    <p className="text-xs text-muted-foreground">{design.note}</p>
                  </div>
                )}
              </div>
            )}

            {!hasVariants && design.note && (
              <div className="mt-6 flex items-start gap-2 rounded-md bg-primary/5 px-3 py-2">
                <Info size={14} className="mt-0.5 shrink-0 text-primary/70" />
                <p className="text-xs text-muted-foreground">{design.note}</p>
              </div>
            )}

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
