import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const homeFaqs = [
  {
    q: "Xăm hình có đau không?",
    a: "Mức độ đau phụ thuộc vào vị trí xăm và ngưỡng chịu đau của mỗi người. Các vùng da mỏng (sườn, mắt cá chân) thường nhạy cảm hơn. Studio có thuốc tê hỗ trợ nếu cần.",
  },
  {
    q: "Hình xăm bao lâu thì lành?",
    a: "Thông thường 2-4 tuần để da phục hồi bề mặt. Sau 6-8 tuần, hình xăm ổn định hoàn toàn. Artist sẽ hướng dẫn chăm sóc chi tiết sau khi xăm.",
  },
  {
    q: "Giá xăm hình là bao nhiêu?",
    a: "Giá phụ thuộc vào kích thước, vị trí, độ phức tạp và phong cách. Xăm mini từ 1.000.000đ. Xem bảng giá chi tiết tại mục Mẫu xăm hoặc liên hệ để báo giá.",
  },
  {
    q: "Có cần đặt lịch trước không?",
    a: "Có, nên đặt lịch trước để đảm bảo được phục vụ đúng thời gian. Bạn có thể đặt lịch online hoặc nhắn Zalo.",
  },
  {
    q: "Chăm sóc sau xăm như thế nào?",
    a: "Giữ vệ sinh vùng xăm, bôi kem dưỡng theo hướng dẫn, tránh ngâm nước và ánh nắng trực tiếp trong 2 tuần đầu. Artist sẽ tư vấn cụ thể cho từng trường hợp.",
  },
  {
    q: "Có bảo hành hình xăm không?",
    a: "Rowena bảo hành miễn phí cho tất cả tác phẩm. Nếu hình xăm bị mờ hoặc cần chỉnh sửa trong quá trình lành, artist sẽ hỗ trợ touch-up.",
  },
];

const FAQSection = () => (
  <section className="mx-auto max-w-[1440px] border-b border-border py-20 px-6 md:px-16">
    <div className="mx-auto max-w-3xl">
      <h2 className="mb-4 text-center font-serif text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
        Câu hỏi thường gặp
      </h2>
      <p className="mb-12 text-center text-sm text-muted-foreground">
        Giải đáp những thắc mắc phổ biến trước khi bạn quyết định xăm.
      </p>
      <Accordion type="single" collapsible className="w-full">
        {homeFaqs.map((f, i) => (
          <AccordionItem key={i} value={`faq-${i}`} className="border-border">
            <AccordionTrigger className="font-sans text-base font-bold text-foreground hover:no-underline hover:text-primary">
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
);

export default FAQSection;
