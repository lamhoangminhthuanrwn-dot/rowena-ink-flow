import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Shield, Heart, Sparkles, Award, MessageSquare, Pencil, Zap, HeartHandshake } from "lucide-react";
import { setSEO, resetSEO, buildLocalBusinessJsonLd } from "@/lib/seo";
import { siteConfig } from "@/data/siteConfig";

const values = [
  { icon: Sparkles, title: "Nghệ thuật", desc: "Mỗi hình xăm là một tác phẩm nghệ thuật độc bản, được thiết kế riêng theo cá tính của bạn." },
  { icon: Shield, title: "An toàn", desc: "Quy trình vệ sinh nghiêm ngặt, dụng cụ tiệt trùng 100%, mực xăm nhập khẩu chính hãng." },
  { icon: Heart, title: "Tận tâm", desc: "Tư vấn kỹ lưỡng, lắng nghe và thấu hiểu ý tưởng để mang đến kết quả hoàn hảo nhất." },
  { icon: Award, title: "Chuyên nghiệp", desc: "Đội ngũ artist giàu kinh nghiệm, được đào tạo bài bản với hơn 10,000+ tác phẩm hoàn thành." },
];

const steps = [
  { icon: MessageSquare, step: "01", title: "Tư vấn", desc: "Trao đổi ý tưởng, phong cách, vị trí và kích thước mong muốn. Hoàn toàn miễn phí." },
  { icon: Pencil, step: "02", title: "Thiết kế", desc: "Artist phác thảo mẫu riêng dựa trên yêu cầu, chỉnh sửa đến khi bạn hài lòng." },
  { icon: Zap, step: "03", title: "Thực hiện", desc: "Xăm hình trong không gian studio sạch sẽ, chuyên nghiệp với thiết bị hiện đại." },
  { icon: HeartHandshake, step: "04", title: "Chăm sóc", desc: "Hướng dẫn chăm sóc sau xăm chi tiết. Bảo hành và hỗ trợ touch-up miễn phí." },
];

const About = () => {
  useEffect(() => {
    setSEO({
      title: "Giới thiệu",
      description: "Rowena Tattoo - Studio xăm hình nghệ thuật chuyên nghiệp tại TP.HCM & Hà Nội. Tìm hiểu câu chuyện, giá trị và quy trình làm việc của chúng tôi.",
      jsonLd: buildLocalBusinessJsonLd(),
    });
  }, []);

  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="border-b border-border bg-secondary/30 px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[1440px]">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Về chúng tôi</p>
          <h1 className="mt-3 font-mono text-3xl font-bold uppercase tracking-wider text-foreground md:text-5xl">
            Rowena Tattoo
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Được thành lập với niềm đam mê nghệ thuật xăm hình, Rowena Tattoo mang đến trải nghiệm xăm chuyên nghiệp, an toàn và đậm chất cá nhân tại mỗi chi nhánh.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1440px] grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Câu chuyện</p>
            <h2 className="mt-3 font-mono text-2xl font-bold uppercase tracking-wider text-foreground md:text-3xl">
              Nơi nghệ thuật gặp gỡ cá tính
            </h2>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>
                Rowena Tattoo ra đời từ niềm tin rằng mỗi hình xăm không chỉ là một bức tranh trên da — mà là câu chuyện, kỷ niệm và bản sắc riêng của mỗi người.
              </p>
              <p>
                Với đội ngũ artist tài năng và đam mê, chúng tôi cam kết mang đến những tác phẩm chất lượng cao, an toàn tuyệt đối và trải nghiệm thoải mái nhất cho khách hàng.
              </p>
              <p>
                Từ chi nhánh đầu tiên tại TP.HCM, Rowena Tattoo đã phát triển ra nhiều thành phố, phục vụ hàng nghìn khách hàng với đa dạng phong cách từ mini tattoo đến full body art.
              </p>
            </div>
          </div>
          <div className="aspect-[4/3] bg-secondary/50 border border-border flex items-center justify-center">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Studio Image</p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-y border-border bg-secondary/30 px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-center font-mono text-xs uppercase tracking-[0.3em] text-primary">Giá trị cốt lõi</p>
          <h2 className="mt-3 text-center font-mono text-2xl font-bold uppercase tracking-wider text-foreground md:text-3xl">
            Tại sao chọn Rowena
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="space-y-3 border border-border bg-background p-6">
                <v.icon className="h-6 w-6 text-primary" />
                <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-foreground">{v.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-center font-mono text-xs uppercase tracking-[0.3em] text-primary">Quy trình</p>
          <h2 className="mt-3 text-center font-mono text-2xl font-bold uppercase tracking-wider text-foreground md:text-3xl">
            4 bước đến hình xăm hoàn hảo
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.step} className="relative border border-border p-6">
                <span className="font-mono text-4xl font-bold text-primary/20">{s.step}</span>
                <s.icon className="mt-3 h-5 w-5 text-primary" />
                <h3 className="mt-2 font-mono text-sm font-bold uppercase tracking-wider text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-secondary/30 px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-[1440px] text-center">
          <h2 className="font-mono text-2xl font-bold uppercase tracking-wider text-foreground md:text-3xl">
            Sẵn sàng bắt đầu?
          </h2>
          <p className="mt-3 text-muted-foreground">Đặt lịch tư vấn miễn phí để biến ý tưởng thành hiện thực.</p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              to="/dat-lich"
              className="border border-primary bg-primary px-8 py-3 font-mono text-sm font-bold uppercase tracking-[0.15em] text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Đặt lịch tư vấn
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

export default About;
