export interface ScheduleOption {
  label: string;
  price: number;
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

function makeFullBodyVariants(
  bwSessions: string,
  bwSimple: number,
  bwSameDay: number,
  bwDifficult: number,
  bwDifficultSessions: string | undefined,
  colorSessions: string,
  colorSimple: number,
  colorSameDay: number,
  colorDifficult: number,
  colorDifficultSessions: string | undefined,
): TattooVariant[] {
  return [
    ...fullBodyStyles.map((style) => ({
      position: "Trắng đen",
      style,
      sessions: bwSessions,
      priceSimple: bwSimple,
      priceSameDay: bwSameDay,
      priceDifficult: bwDifficult,
      priceDifficultSessions: bwDifficultSessions,
    })),
    ...fullBodyStyles.map((style) => ({
      position: "Màu",
      style,
      sessions: colorSessions,
      priceSimple: colorSimple,
      priceSameDay: colorSameDay,
      priceDifficult: colorDifficult,
      priceDifficultSessions: colorDifficultSessions,
    })),
  ];
}

const bwScheduleOptions: ScheduleOption[] = [
  { label: "Trả hết", price: 3500000 },
  { label: "1,5 buổi", price: 5500000 },
  { label: "2 buổi", price: 7000000 },
];

const colorScheduleOptions: ScheduleOption[] = [
  { label: "Trả hết", price: 5200000 },
  { label: "1,5 buổi", price: 5500000 },
  { label: "2 buổi", price: 7000000 },
];

function makeChestBellyVariants(): TattooVariant[] {
  return [
    ...fullBodyStyles.map((style) => ({
      position: "Trắng đen",
      style,
      sessions: "1 buổi",
      priceSimple: 3500000,
      priceDifficult: 0,
      scheduleOptions: bwScheduleOptions,
    })),
    ...fullBodyStyles.map((style) => ({
      position: "Màu",
      style,
      sessions: "1 buổi",
      priceSimple: 5200000,
      priceDifficult: 0,
      scheduleOptions: colorScheduleOptions,
    })),
  ];
}

export const tattooDesigns: TattooDesign[] = [
  {
    id: "1",
    name: "Xăm full lưng",
    price: 7000000,
    category: "Full body",
    description:
      "Xăm full lưng với thiết kế theo yêu cầu, chi tiết tinh xảo. Tác phẩm nghệ thuật lớn trên toàn bộ vùng lưng.",
    image: "/assets/tattoo-back-1.png",
    images: [
      "/assets/tattoo-back-1.png",
      "/assets/tattoo-back-2.png",
      "/assets/tattoo-back-3.png",
      "/assets/tattoo-back-4.png",
      "/assets/tattoo-back-5.png",
      "/assets/tattoo-back-6.png",
      "/assets/tattoo-back-7.png",
      "/assets/tattoo-back-8.png",
      "/assets/tattoo-back-9.png",
      "/assets/tattoo-back-10.jpg",
      "/assets/tattoo-back-11.jpg",
      "/assets/tattoo-back-12.jpg",
      "/assets/tattoo-back-13.jpg",
      "/assets/tattoo-back-14.jpg",
      "/assets/tattoo-back-15.jpg",
      "/assets/tattoo-back-16.jpg",
    ],
    size: "Full lưng",
    duration: "10-15 giờ",
    variants: makeFullBodyVariants(
      "2 buổi", 7000000, 7500000, 10500000, "3 buổi",
      "4 buổi", 13200000, 15000000, 18000000, "6 buổi",
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
      "2 buổi", 6600000, 7500000, 10000000, "3 buổi",
      "2 buổi", 7000000, 7500000, 10000000, "3 buổi",
    ),
  },
  {
    id: "3",
    name: "Xăm full chân",
    price: 9900000,
    category: "Full body",
    description: "Xăm full chân từ đùi đến mắt cá, thiết kế tùy chỉnh theo ý tưởng của bạn.",
    image: "/assets/tattoo-full-leg.jpg",
    size: "Full chân",
    duration: "10-15 giờ",
    variants: makeFullBodyVariants(
      "3 buổi", 9900000, 11500000, 13200000, "4 buổi",
      "4 buổi", 13500000, 14000000, 18000000, "6 buổi",
    ),
  },
  {
    id: "4",
    name: "Xăm full ngực",
    price: 3500000,
    category: "Full body",
    description: "Xăm full ngực với thiết kế ấn tượng, phù hợp cho các tác phẩm lớn và chi tiết.",
    image: "/assets/tattoo-chest-1.jpg",
    images: ["/assets/tattoo-chest-1.jpg", "/assets/tattoo-chest-2.jpg"],
    size: "Full ngực",
    duration: "8-12 giờ",
    variants: makeChestBellyVariants(),
  },
  {
    id: "5",
    name: "Xăm full bụng",
    price: 3500000,
    category: "Full body",
    description: "Xăm full bụng với thiết kế cá nhân hóa, đường nét sắc sảo và chi tiết.",
    image: "https://images.unsplash.com/photo-1604941059800-a2c0aee40e77?w=600&h=800&fit=crop",
    size: "Full bụng",
    duration: "8-12 giờ",
    variants: makeChestBellyVariants(),
  },
  {
    id: "6",
    name: "Cover hình xăm cũ",
    price: 12000000,
    category: "Đặc biệt",
    description: "Cover up hình xăm cũ bằng thiết kế mới, che phủ hoàn toàn hình cũ với tác phẩm ấn tượng hơn.",
    image: "https://images.unsplash.com/photo-1586953208270-767889fa9b0e?w=600&h=800&fit=crop",
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
    size: "Mini – A4",
    duration: "1-6 giờ",
    isMiniType: true,
    variants: [
      { position: "Trắng đen", style: "Dưới 10cm", sessions: "2 giờ", priceSimple: 1000000, priceDifficult: 1500000 },
      { position: "Màu", style: "Dưới 10cm", sessions: "3 giờ", priceSimple: 1500000, priceDifficult: 2000000 },
      { position: "Trắng đen", style: "A5", sessions: "3 giờ", priceSimple: 1500000, priceDifficult: 2000000 },
      { position: "Màu", style: "A5", sessions: "4 giờ", priceSimple: 2000000, priceDifficult: 3000000 },
      { position: "Trắng đen", style: "A4", sessions: "4 giờ", priceSimple: 2000000, priceDifficult: 3000000 },
      { position: "Màu", style: "A4", sessions: "6 giờ", priceSimple: 3500000, priceDifficult: 3500000, priceDifficultSessions: "1 buổi" },
    ],
    note: "Bán thêm 4 giờ = 2tr",
  },
  {
    id: "8",
    name: "Xăm che sẹo",
    price: 12000000,
    category: "Đặc biệt",
    description: "Xăm che sẹo chuyên nghiệp, giúp bạn tự tin hơn với thiết kế nghệ thuật phủ lên vùng sẹo.",
    image: "https://images.unsplash.com/photo-1530982011887-3cc11cc85693?w=600&h=800&fit=crop",
    size: "Tùy vùng",
    duration: "Tùy kích thước",
    note: "Giá tùy theo kích thước và độ phức tạp. Liên hệ để báo giá.",
  },
  {
    id: "9",
    name: "Xăm theo yêu cầu khác",
    price: 12000000,
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
