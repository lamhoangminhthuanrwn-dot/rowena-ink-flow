import { Shield, Palette, Users, MapPin } from "lucide-react";

const reasons = [
  {
    icon: Palette,
    title: "Tay nghề artist",
    desc: "Đội ngũ artist giàu kinh nghiệm, sáng tạo đa phong cách từ mini tattoo đến full body.",
  },
  {
    icon: Shield,
    title: "Vệ sinh tuyệt đối",
    desc: "Kim mới 100%, dụng cụ tiệt trùng theo tiêu chuẩn y tế. An toàn là ưu tiên hàng đầu.",
  },
  {
    icon: Users,
    title: "Tư vấn cá nhân",
    desc: "Tư vấn miễn phí, thiết kế theo phong cách riêng của bạn. Không có hai hình xăm giống nhau.",
  },
  {
    icon: MapPin,
    title: "Nhiều chi nhánh",
    desc: "Có mặt tại TP.HCM, Hà Nội, Buôn Ma Thuột và Kuala Lumpur.",
  },
];

const WhyChooseUs = () => (
  <section className="mx-auto max-w-[1440px] border-b border-border py-20 px-6 md:px-16">
    <h2 className="mb-4 text-center font-serif text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
      Tại sao chọn Rowena?
    </h2>
    <p className="mx-auto mb-12 max-w-2xl text-center text-sm text-muted-foreground">
      Chúng tôi cam kết mang đến trải nghiệm xăm hình an toàn, chuyên nghiệp và đậm chất nghệ thuật.
    </p>
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {reasons.map((r) => (
        <div
          key={r.title}
          className="group flex flex-col items-center text-center p-6 border border-border transition-colors hover:border-primary"
        >
          <div className="mb-4 flex h-14 w-14 items-center justify-center border border-border text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <r.icon size={24} strokeWidth={1.5} />
          </div>
          <h3 className="mb-2 font-sans text-base font-bold uppercase tracking-tight text-foreground">
            {r.title}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">{r.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default WhyChooseUs;
