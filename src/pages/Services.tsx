import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Palette, Maximize, RefreshCw, PenTool, HelpCircle } from "lucide-react";
import { setSEO } from "@/lib/seo";
import { siteConfig } from "@/data/siteConfig";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SITE_DOMAIN } from "@/lib/constants";

const services = [
  {
    icon: Palette,
    name: "Xăm Mini",
    desc: "Hình xăm nhỏ gọn, tinh tế — phù hợp cho người mới bắt đầu hoặc muốn điểm nhấn nhẹ nhàng.",
    audience: "Phù hợp cho người lần đầu xăm, thích phong cách tối giản.",
    price: "Từ 500.000đ",
    cta: "/mau-xam",
  },
  {
    icon: Maximize,
    name: "Xăm nghệ thuật",
    desc: "Tác phẩm lớn, chi tiết cao — realism, blackwork, Japanese, neo-traditional và nhiều phong cách khác.",
    audience: "Dành cho người yêu nghệ thuật, muốn tác phẩm độc bản.",
    price: "Từ 2.000.000đ",
    cta: "/mau-xam",
  },
  {
    icon: RefreshCw,
    name: "Cover Tattoo",
    desc: "Che phủ hình xăm cũ bằng thiết kế mới đẹp hơn — biến điều không ưng ý thành tác phẩm hoàn hảo.",
    audience: "Dành cho ai muốn thay đổi hoặc che hình xăm không ưng ý.",
    price: "Từ 1.500.000đ",
    cta: "/mau-xam",
  },
  {
    icon: PenTool,
    name: "Xăm theo yêu cầu",
    desc: "Thiết kế hoàn toàn theo ý tưởng của bạn — artist sẽ phác thảo và chỉnh sửa đến khi hoàn hảo.",
    audience: "Dành cho ai có ý tưởng riêng và muốn hình xăm độc nhất.",
    price: "Tùy thiết kế",
    cta: "/dat-lich",
  },
];

const faqs = [
  { q: "Xăm hình có đau không?", a: "Mức độ đau phụ thuộc vào vị trí xăm và ngưỡng chịu đau của mỗi người. Các vùng như cổ tay, mắt cá thường ít đau hơn. Artist sẽ tư vấn kỹ trước khi bắt đầu." },
  { q: "Bao lâu thì hình xăm lành?", a: "Thông thường 2-3 tuần cho lớp da bên ngoài. Hoàn toàn lành sâu cần 4-6 tuần. Chúng tôi sẽ hướng dẫn chăm sóc chi tiết." },
  { q: "Giá xăm hình được tính như thế nào?", a: "Giá phụ thuộc vào kích thước, độ phức tạp, vị trí và phong cách. Liên hệ để được báo giá chính xác sau khi tư vấn." },
  { q: "Cần chuẩn bị gì trước khi xăm?", a: "Ngủ đủ giấc, ăn no, không uống rượu bia 24h trước. Mặc trang phục thoải mái phù hợp vị trí xăm." },
  { q: "Có cần đặt lịch trước không?", a: "Có, chúng tôi khuyến khích đặt lịch trước để đảm bảo artist và thời gian phù hợp nhất cho bạn." },
];

const Services = () => {
  useEffect(() => {
    setSEO({
      title: "Dịch vụ xăm hình",
      description: "Dịch vụ xăm hình chuyên nghiệp tại Rowena Tattoo: xăm mini, xăm nghệ thuật, cover tattoo, xăm theo yêu cầu. Tư vấn miễn phí.",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Service",
        provider: {
          "@type": "TattooParlor",
          name: "ROWENA TATTOO CLUB",
          url: `https://${SITE_DOMAIN}`,
        },
        serviceType: "Tattoo",
        areaServed: ["Hồ Chí Minh", "Hà Nội", "Đắk Lắk", "Kuala Lumpur"],
      },
    });
  }, []);

  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="border-b border-border bg-secondary/30 px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1440px]">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Dịch vụ</p>
          <h1 className="mt-3 font-mono text-3xl font-bold uppercase tracking-wider text-foreground md:text-5xl">
            Dịch vụ của chúng tôi
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Từ mini tattoo tinh tế đến tác phẩm full body — Rowena Tattoo mang đến đa dạng dịch vụ phù hợp mọi phong cách.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1440px] grid gap-6 sm:grid-cols-2">
          {services.map((s) => (
            <div key={s.name} className="flex flex-col border border-border p-6 md:p-8 transition-colors hover:border-primary/50">
              <s.icon className="h-6 w-6 text-primary" />
              <h2 className="mt-4 font-mono text-lg font-bold uppercase tracking-wider text-foreground">{s.name}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground flex-1">{s.desc}</p>
              <p className="mt-3 text-xs text-muted-foreground">{s.audience}</p>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <span className="font-mono text-sm font-bold text-primary">{s.price}</span>
                <Link
                  to={s.cta}
                  className="font-mono text-xs font-bold uppercase tracking-widest text-foreground transition-colors hover:text-primary"
                >
                  Xem thêm →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-y border-border bg-secondary/30 px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-2 justify-center">
            <HelpCircle className="h-4 w-4 text-primary" />
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">FAQ</p>
          </div>
          <h2 className="mt-3 text-center font-mono text-2xl font-bold uppercase tracking-wider text-foreground md:text-3xl">
            Câu hỏi thường gặp
          </h2>
          <Accordion type="single" collapsible className="mt-10">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-border">
                <AccordionTrigger className="font-mono text-sm font-bold uppercase tracking-wider text-foreground hover:no-underline hover:text-primary">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-[1440px] text-center">
          <h2 className="font-mono text-2xl font-bold uppercase tracking-wider text-foreground md:text-3xl">
            Bắt đầu hành trình của bạn
          </h2>
          <p className="mt-3 text-muted-foreground">Đặt lịch tư vấn miễn phí hoặc nhắn tin để được hỗ trợ ngay.</p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              to="/dat-lich"
              className="border border-primary bg-primary px-8 py-3 font-mono text-sm font-bold uppercase tracking-[0.15em] text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Đặt lịch ngay
            </Link>
            <a
              href={siteConfig.zaloLink}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-border px-8 py-3 font-mono text-sm font-bold uppercase tracking-[0.15em] text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Nhắn Zalo
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
