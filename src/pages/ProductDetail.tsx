import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { tattooDesigns, displayPrice, formatVNDShort } from "@/data/tattooDesigns";
import type { TattooVariant } from "@/data/tattooDesigns";
import { ArrowLeft, Clock, Ruler, Info, MessageCircle } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";
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
    <div className="overflow-x-auto border border-border">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary">
            <TableHead className="font-mono text-xs font-bold uppercase tracking-widest">Vị trí</TableHead>
            <TableHead className="font-mono text-xs font-bold uppercase tracking-widest">Thể loại</TableHead>
            <TableHead className="font-mono text-xs font-bold uppercase tracking-widest">Số buổi</TableHead>
            <TableHead className="font-mono text-xs font-bold uppercase tracking-widest">Trả hết</TableHead>
            <TableHead className="font-mono text-xs font-bold uppercase tracking-widest">Trong ngày</TableHead>
            <TableHead className="font-mono text-xs font-bold uppercase tracking-widest">Hình khó</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {positions.map((pos) => {
            const rows = variants.filter((v) => v.position === pos);
            return rows.map((v, i) => (
              <TableRow key={`${pos}-${v.style}-${i}`} className="hover:bg-transparent">
                {i === 0 && (
                  <TableCell rowSpan={rows.length} className="whitespace-nowrap text-xs font-medium align-middle text-center border-r border-border">
                    {pos}
                  </TableCell>
                )}
                <TableCell className="text-xs">{v.style}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{v.sessions}</TableCell>
                <TableCell className="text-xs font-bold text-primary">{formatVNDShort(v.priceSimple)}</TableCell>
                <TableCell className="text-xs">
                  {(() => {
                    const sameDayOpt = v.scheduleOptions?.find(o => o.label === "Xong trong ngày");
                    const price = v.priceSameDay || sameDayOpt?.price;
                    if (!price) return "—";
                    const note = sameDayOpt?.note;
                    return note ? `${formatVNDShort(price)} (tối thiểu 2 buổi)` : formatVNDShort(price);
                  })()}
                </TableCell>
                <TableCell className="text-xs">
                  {formatVNDShort(v.priceDifficult)}
                  {v.priceDifficultSessions ? ` (${v.priceDifficultSessions})` : ""}
                </TableCell>
              </TableRow>
            ));
          })}
        </TableBody>
      </Table>
    </div>
  );
};

const PriceTableMini = ({ variants }: { variants: TattooVariant[] }) => (
  <div className="overflow-x-auto border border-border">
    <Table>
      <TableHeader>
        <TableRow className="bg-secondary">
          <TableHead className="font-mono text-xs font-bold uppercase tracking-widest">Kích thước</TableHead>
          <TableHead className="font-mono text-xs font-bold uppercase tracking-widest">Vị trí</TableHead>
          <TableHead className="font-mono text-xs font-bold uppercase tracking-widest">Thời gian</TableHead>
          <TableHead className="font-mono text-xs font-bold uppercase tracking-widest">Đơn giản</TableHead>
          <TableHead className="font-mono text-xs font-bold uppercase tracking-widest">Hình khó</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {variants.map((v, i) => (
          <TableRow key={i}>
            <TableCell className="text-xs font-medium">{v.style || "—"}</TableCell>
            <TableCell className="text-xs">{v.position}</TableCell>
            <TableCell className="text-xs text-muted-foreground">{v.sessions}</TableCell>
            <TableCell className="text-xs font-bold text-primary">{formatVNDShort(v.priceSimple)}</TableCell>
            <TableCell className="text-xs">{formatVNDShort(v.priceDifficult)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

const ProductDetail = () => {
  const { slug } = useParams();
  const design = tattooDesigns.find((d) => d.slug === slug);

  if (!design) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-16">
        <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground">Không tìm thấy mẫu xăm.</p>
      </div>
    );
  }

  const hasSlideshow = design.images && design.images.length > 1;
  const hasVariants = design.variants && design.variants.length > 0;
  const isMini = !!design.isMiniType;

  return (
    <div className="pt-20 pb-16">
      <div className="mx-auto max-w-6xl px-4">
        <Link to="/mau-xam" className="mb-6 inline-flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft size={16} />
          QUAY LẠI
        </Link>

        <div className="grid gap-10 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="overflow-hidden border border-border"
          >
            {hasSlideshow ? (
              <div className="relative w-full bg-secondary aspect-[3/4]">
                <ImageSlideshow images={design.images!} alt={design.name} objectFit="contain" />
              </div>
            ) : (
              <img src={design.image} alt={design.name} className="w-full object-contain bg-secondary aspect-[3/4]" />
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:sticky lg:top-24 lg:self-start"
          >
            <p className="mb-2 font-mono text-xs font-bold uppercase tracking-widest text-primary">{design.category}</p>
            <h1 className="font-serif text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl">{design.name}</h1>
            <p className="mt-4 font-mono text-xl font-bold text-primary">{displayPrice(design)}</p>

            <p className="mt-6 leading-relaxed text-muted-foreground">{design.description}</p>

            <div className="mt-6 flex gap-6">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                <Ruler size={14} className="text-primary" />
                {design.size}
              </div>
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                <Clock size={14} className="text-primary" />
                {design.duration}
              </div>
            </div>

            {hasVariants && (
              <div className="mt-8">
                <h2 className="mb-3 font-sans text-lg font-bold uppercase tracking-wider text-foreground">Bảng giá chi tiết</h2>
                {isMini ? (
                  <PriceTableMini variants={design.variants!} />
                ) : (
                  <PriceTableFullBody variants={design.variants!} />
                )}
                <div className="mt-3 flex items-start gap-2 border border-border bg-secondary px-3 py-2">
                  <Info size={14} className="mt-0.5 shrink-0 text-primary" />
                  <p className="text-xs text-muted-foreground">Số buổi thực hiện phụ thuộc vào độ chịu đau của khách hàng (ủ tê chỉ giảm 1 phần sát thương 50-80%)</p>
                </div>
                {design.note && (
                  <div className="mt-3 flex items-start gap-2 border border-border bg-secondary px-3 py-2">
                    <Info size={14} className="mt-0.5 shrink-0 text-primary" />
                    <p className="text-xs text-muted-foreground">{design.note}</p>
                  </div>
                )}
              </div>
            )}

            {!hasVariants && design.note && (
              <div className="mt-6 flex items-start gap-2 border border-border bg-secondary px-3 py-2">
                <Info size={14} className="mt-0.5 shrink-0 text-primary" />
                <p className="text-xs text-muted-foreground">{design.note}</p>
              </div>
            )}

            <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur-sm p-4 sm:static sm:border-0 sm:bg-transparent sm:backdrop-blur-none sm:p-0 sm:mt-8">
              <Link
                to={`/dat-lich?design=${design.id}`}
                className="block w-full bg-primary py-4 text-center font-mono text-sm font-bold uppercase tracking-[0.15em] text-primary-foreground transition-all hover:bg-foreground hover:text-background"
              >
                ĐẶT LỊCH XĂM MẪU NÀY
              </Link>
            </div>

            <div className="mt-8 border border-border bg-secondary p-4">
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                <span className="font-bold text-foreground">Lưu ý:</span> Đặt cọc 200.000đ qua chuyển khoản ngân hàng để được ưu tiên lịch. Phần còn lại thanh toán tại studio.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
