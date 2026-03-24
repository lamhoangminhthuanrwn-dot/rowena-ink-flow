import { Star } from "lucide-react";

const reviews = [
  {
    name: "Minh T.",
    text: "Artist rất tận tâm, hình xăm đẹp hơn mong đợi. Sẽ quay lại lần sau!",
    rating: 5,
  },
  {
    name: "Hương N.",
    text: "Studio sạch sẽ, chuyên nghiệp. Tư vấn kỹ, giá hợp lý. Recommend 100%.",
    rating: 5,
  },
  {
    name: "Khang L.",
    text: "Xăm full tay, artist làm rất tỉ mỉ. Chăm sóc sau xăm chu đáo.",
    rating: 5,
  },
];

const SocialProof = () => (
  <section className="mx-auto max-w-[1440px] bg-secondary border-b border-border py-20 px-6 md:px-16">
    <div className="mb-12 text-center">
      <h2 className="font-serif text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
        Khách hàng nói gì
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Phản hồi thực từ khách hàng đã trải nghiệm dịch vụ.
      </p>
    </div>

    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {reviews.map((r, i) => (
        <div
          key={i}
          className="border border-border bg-background p-6 transition-colors hover:border-primary"
        >
          <div className="mb-3 flex gap-0.5">
            {Array.from({ length: r.rating }).map((_, j) => (
              <Star
                key={j}
                size={14}
                className="fill-primary text-primary"
              />
            ))}
          </div>
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground italic">
            "{r.text}"
          </p>
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-foreground">
            {r.name}
          </p>
        </div>
      ))}
    </div>
  </section>
);

export default SocialProof;
