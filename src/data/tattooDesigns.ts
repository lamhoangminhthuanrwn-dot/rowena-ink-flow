export interface ScheduleOption {
  label: string;
  price: number;
  sessions?: string;
  note?: string;
  isPerSession?: boolean;
}

export interface TattooVariant {
  position: string;
  style?: string;
  sessions: string;
  priceSimple: number;
  priceSameDay?: number;
  priceDifficult: number;
  priceDifficultSessions?: string;
  scheduleOptions?: ScheduleOption[];
}

export interface TattooDesign {
  id: string;
  name: string;
  price: number;
  priceText?: string;
  category: string;
  description: string;
  image: string;
  images?: string[];
  size: string;
  duration: string;
  variants?: TattooVariant[];
  note?: string;
  isMiniType?: boolean;
}

const fullBodyStyles = ["Á nét", "Á tả", "Âu", "Nhật", "Linework"];

interface FullBodyPricing {
  fullSessions: string;
  fullPrice: number;
  perSessionSessions: string;
  perSessionPrice: number;
  sameDayPrice: number;
  sameDayNote?: string;
}

function makeScheduleOptions(p: FullBodyPricing): ScheduleOption[] {
  const options: ScheduleOption[] = [
    { label: "Trả hết 1 lần", price: p.fullPrice, sessions: p.fullSessions },
    { label: "Trả theo buổi", price: p.perSessionPrice, sessions: p.perSessionSessions, isPerSession: true },
  ];
  if (p.sameDayPrice > 0) {
    options.push({ label: "Xong trong ngày", price: p.sameDayPrice, note: p.sameDayNote });
  }
  return options;
}

interface DifficultPricing {
  price: number;
  sessions: string;
}

function makeFullBodyVariants(
  bw: FullBodyPricing,
  color: FullBodyPricing,
  colorLinework?: FullBodyPricing,
  bwDifficult: DifficultPricing = { price: 10000000, sessions: "3 buổi" },
  colorDifficult: DifficultPricing = { price: 10000000, sessions: "3 buổi" },
  colorLineworkDifficult?: DifficultPricing,
): TattooVariant[] {
  const variants: TattooVariant[] = [];
  for (const style of fullBodyStyles) {
    variants.push({
      position: "Trắng đen",
      style,
      sessions: bw.fullSessions,
      priceSimple: bw.fullPrice,
      priceDifficult: bwDifficult.price, priceDifficultSessions: bwDifficult.sessions,
      scheduleOptions: makeScheduleOptions(bw),
    });
  }
  for (const style of fullBodyStyles) {
    const pricing = (colorLinework && style === "Linework") ? colorLinework : color;
    const difficult = (colorLineworkDifficult && style === "Linework") ? colorLineworkDifficult : colorDifficult;
    variants.push({
      position: "Màu",
      style,
      sessions: pricing.fullSessions,
      priceSimple: pricing.fullPrice,
      priceDifficult: difficult.price, priceDifficultSessions: difficult.sessions,
      scheduleOptions: makeScheduleOptions(pricing),
    });
  }
  return variants;
}

export const tattooDesigns: TattooDesign[] = [
  {
    id: "1",
    name: "Xăm full lưng",
    price: 7000000,
    category: "Full body",
    description:
      "Xăm full lưng với thiết kế theo yêu cầu, chi tiết tinh xảo. Tác phẩm nghệ thuật lớn trên toàn bộ vùng lưng.",
    image: "/assets/tattoo-back-new-1.png",
    images: [
      "/assets/tattoo-back-new-1.png",
      "/assets/tattoo-back-new-2.png",
      "/assets/tattoo-back-new-3.png",
      "/assets/tattoo-back-new-4.png",
      "/assets/tattoo-back-new-5.png",
      "/assets/tattoo-back-new-6.png",
      "/assets/tattoo-back-new-7.png",
      "/assets/tattoo-back-new-8.png",
      "/assets/tattoo-back-new-9.png",
      "/assets/tattoo-back-new-10.jpg",
    ],
    size: "Full lưng",
    duration: "10-15 giờ",
    variants: makeFullBodyVariants(
      { fullSessions: "2 buổi", fullPrice: 7000000, perSessionSessions: "3 buổi", perSessionPrice: 10500000, sameDayPrice: 7500000 },
      { fullSessions: "4 buổi", fullPrice: 13200000, perSessionSessions: "6 buổi", perSessionPrice: 18000000, sameDayPrice: 15000000, sameDayNote: "Bắt buộc 2 buổi" },
      undefined,
      { price: 10500000, sessions: "3 buổi" },
      { price: 18000000, sessions: "6 buổi" },
    ),
  },
  {
    id: "2",
    name: "Xăm full tay",
    price: 6600000,
    category: "Full body",
    description: "Xăm full tay (sleeve) từ vai đến cổ tay, thiết kế liền mạch theo phong cách bạn yêu thích.",
    image: "/assets/tattoo-arm-1.jpg",
    images: [
      "/assets/tattoo-arm-1.jpg",
      "/assets/tattoo-arm-2.jpg",
      "/assets/tattoo-arm-4.jpg",
    ],
    size: "Full tay",
    duration: "10-15 giờ",
    variants: makeFullBodyVariants(
      { fullSessions: "2 buổi", fullPrice: 6600000, perSessionSessions: "3 buổi", perSessionPrice: 10000000, sameDayPrice: 7500000 },
      { fullSessions: "2 buổi", fullPrice: 7000000, perSessionSessions: "3 buổi", perSessionPrice: 10000000, sameDayPrice: 7500000 },
      undefined,
      { price: 10000000, sessions: "3 buổi" },
      { price: 10000000, sessions: "3 buổi" },
    ),
  },
  {
    id: "3",
    name: "Xăm full chân",
    price: 9900000,
    category: "Full body",
    description: "Xăm full chân từ đùi đến mắt cá, thiết kế tùy chỉnh theo ý tưởng của bạn.",
    image: "/assets/tattoo-full-leg.jpg",
    images: ["/assets/tattoo-full-leg.jpg", "/assets/tattoo-full-leg-2.jpg"],
    size: "Full chân",
    duration: "10-15 giờ",
    variants: makeFullBodyVariants(
      { fullSessions: "3 buổi", fullPrice: 9900000, perSessionSessions: "4 buổi", perSessionPrice: 13200000, sameDayPrice: 11500000 },
      { fullSessions: "4 buổi", fullPrice: 13500000, perSessionSessions: "6 buổi", perSessionPrice: 18000000, sameDayPrice: 14000000, sameDayNote: "Bắt buộc 2 buổi" },
      { fullSessions: "3 buổi", fullPrice: 9900000, perSessionSessions: "5 buổi", perSessionPrice: 16500000, sameDayPrice: 14000000, sameDayNote: "Bắt buộc 2 buổi" },
      { price: 13200000, sessions: "4 buổi" },
      { price: 18000000, sessions: "6 buổi" },
      { price: 16500000, sessions: "5 buổi" },
    ),
  },
  {
    id: "4",
    name: "Xăm full ngực hoặc full bụng",
    price: 3500000,
    category: "Full body",
    description: "Xăm full ngực hoặc full bụng với thiết kế ấn tượng, phù hợp cho các tác phẩm lớn và chi tiết trên vùng ngực hoặc bụng.",
    image: "/assets/tattoo-chest-new-1.png",
    images: [
      "/assets/tattoo-chest-new-1.png",
      "/assets/tattoo-chest-new-2.png",
      "/assets/tattoo-chest-new-3.png",
      "/assets/tattoo-chest-new-4.png",
      "/assets/tattoo-chest-new-5.png",
      "/assets/tattoo-chest-new-6.png",
      "/assets/tattoo-chest-new-7.png",
      "/assets/tattoo-chest-new-8.png",
      "/assets/tattoo-chest-new-9.jpg",
    ],
    size: "Full ngực hoặc full bụng",
    duration: "8-12 giờ",
    variants: (() => {
      const styles = ["Á nét", "Á tả", "Âu", "Nhật", "Linework"];
      const v: TattooVariant[] = [];
      // Trắng đen: 1 schedule option → auto-select, ẩn tiến độ
      for (const s of styles) {
        v.push({
          position: "Trắng đen", style: s, sessions: "1 buổi",
          priceSimple: 3500000, priceDifficult: 7000000, priceDifficultSessions: "2 buổi",
          scheduleOptions: [{ label: "Trả hết 1 lần", price: 3500000, sessions: "1 buổi" }],
        });
      }
      // Màu: sameDayPrice=0 → ẩn "Xong trong ngày", còn 2 options
      for (const s of styles) {
        v.push({
          position: "Màu", style: s, sessions: "1 buổi",
          priceSimple: 5200000, priceDifficult: 7000000, priceDifficultSessions: "2 buổi",
          scheduleOptions: makeScheduleOptions({
            fullSessions: "1 buổi", fullPrice: 5200000,
            perSessionSessions: "2 buổi", perSessionPrice: 7000000,
            sameDayPrice: 0,
          }),
        });
      }
      return v;
    })(),
  },
  {
    id: "6",
    name: "Cover hình xăm cũ",
    price: 0,
    priceText: "Liên hệ",
    category: "Đặc biệt",
    description: "Cover up hình xăm cũ bằng thiết kế mới, che phủ hoàn toàn hình cũ với tác phẩm ấn tượng hơn.",
    image: "/assets/tattoo-cover-1.png",
    images: ["/assets/tattoo-cover-1.png", "/assets/tattoo-cover-2.jpg"],
    size: "Tùy vùng",
    duration: "Tùy kích thước",
    note: "Giá tùy theo kích thước và độ phức tạp. Liên hệ để báo giá.",
  },
  {
    id: "7",
    name: "Xăm hình mini & A4",
    price: 1000000,
    category: "Mini",
    description: "Hình xăm nhỏ từ mini đến khổ A4, phù hợp cho cổ tay, mắt cá chân, sau tai hoặc bất kỳ vị trí nào.",
    image: "/assets/tattoo-mini-1.jpg",
    images: [
      "/assets/tattoo-mini-1.jpg",
      "/assets/tattoo-mini-2.png",
      "/assets/tattoo-mini-3.png",
      "/assets/tattoo-mini-4.png",
      "/assets/tattoo-mini-5.png",
    ],
    size: "Mini – A4",
    duration: "1-6 giờ",
    isMiniType: true,
    variants: [
      { position: "Trắng đen", style: "Dưới 10cm", sessions: "2 giờ", priceSimple: 1000000, priceDifficult: 1500000, priceDifficultSessions: "3 giờ" },
      { position: "Màu", style: "Dưới 10cm", sessions: "3 giờ", priceSimple: 1500000, priceDifficult: 2000000, priceDifficultSessions: "4 giờ" },
      { position: "Trắng đen", style: "A5", sessions: "3 giờ", priceSimple: 1500000, priceDifficult: 2000000, priceDifficultSessions: "4 giờ" },
      { position: "Màu", style: "A5", sessions: "4 giờ", priceSimple: 2000000, priceDifficult: 3000000, priceDifficultSessions: "6 giờ" },
      { position: "Trắng đen", style: "A4", sessions: "4 giờ", priceSimple: 2000000, priceDifficult: 3000000, priceDifficultSessions: "6 giờ" },
      { position: "Màu", style: "A4", sessions: "6 giờ", priceSimple: 3500000, priceDifficult: 3500000, priceDifficultSessions: "1 buổi" },
      { position: "Trắng đen", style: "A4", sessions: "4 giờ", priceSimple: 2000000, priceDifficult: 3000000 },
      { position: "Màu", style: "A4", sessions: "6 giờ", priceSimple: 3500000, priceDifficult: 3500000, priceDifficultSessions: "1 buổi" },
    ],
    note: "Bán thêm 4 giờ = 2tr",
  },
  {
    id: "9",
    name: "Xăm theo yêu cầu khác",
    price: 0,
    priceText: "Liên hệ",
    category: "Đặc biệt",
    description:
      "Thiết kế và xăm theo yêu cầu riêng của bạn. Liên hệ để tư vấn chi tiết về ý tưởng, kích thước và giá.",
    image: "/assets/tattoo-custom-1.jpg",
    images: ["/assets/tattoo-custom-1.jpg", "/assets/tattoo-custom-2.jpg", "/assets/tattoo-custom-3.jpg"],
    size: "Tùy yêu cầu",
    duration: "Tùy yêu cầu",
    note: "Giá tùy theo yêu cầu. Liên hệ để báo giá chi tiết.",
  },
];

export const categories = ["Tất cả", "Full body", "Đặc biệt", "Mini"];

export function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
}

export function formatVNDShort(amount: number): string {
  if (amount <= 0) return "Liên hệ";
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

export function displayPrice(design: TattooDesign): string {
  return design.priceText || formatVNDShort(design.price);
}

// Helpers for BookingOptionStep
export function getPositions(variants: TattooVariant[]): string[] {
  return [...new Set(variants.map((v) => v.position))];
}

export function getStyles(variants: TattooVariant[], position: string): string[] {
  return [...new Set(variants.filter((v) => v.position === position).map((v) => v.style).filter(Boolean))] as string[];
}

export function findVariant(variants: TattooVariant[], position: string, style?: string): TattooVariant | undefined {
  return variants.find((v) => v.position === position && (style ? v.style === style : true));
}
