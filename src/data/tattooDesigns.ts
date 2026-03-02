export interface TattooVariant {
  position: string;
  style?: string;
  sessions: string;
  priceSimple: string;
  priceFull?: string;
  priceSameDay?: string;
  priceDifficult: string;
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
}

const fullBodyStyles = ["Đá nét", "Đá tổ", "Đâu", "Nhạt", "Linework"];

function makeFullBodyVariants(
  bwSessions: string, bwSimple: string, bwSameDay: string, bwDifficult: string,
  colorSessions: string, colorSimple: string, colorSameDay: string, colorDifficult: string,
): TattooVariant[] {
  return [
    ...fullBodyStyles.map((style) => ({
      position: "Trắng đen",
      style,
      sessions: bwSessions,
      priceSimple: bwSimple,
      priceSameDay: bwSameDay,
      priceDifficult: bwDifficult,
    })),
    ...fullBodyStyles.map((style) => ({
      position: "Màu",
      style,
      sessions: colorSessions,
      priceSimple: colorSimple,
      priceSameDay: colorSameDay,
      priceDifficult: colorDifficult,
    })),
  ];
}

export const tattooDesigns: TattooDesign[] = [
  {
    id: "1",
    name: "Xăm full lưng",
    price: 7000000,
    priceText: "7tr – 18tr",
    category: "Full body",
    description: "Xăm full lưng với thiết kế theo yêu cầu, chi tiết tinh xảo. Tác phẩm nghệ thuật lớn trên toàn bộ vùng lưng.",
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
      "2 buổi", "7tr", "7tr5", "10tr5/3 buổi",
      "4 buổi", "13tr2", "7tr5*2", "18tr/6 buổi",
    ),
  },
  {
    id: "2",
    name: "Xăm full tay",
    price: 6600000,
    priceText: "6tr6 – 10tr",
    category: "Full body",
    description: "Xăm full tay (sleeve) từ vai đến cổ tay, thiết kế liền mạch theo phong cách bạn yêu thích.",
    image: "/assets/tattoo-full-arm.jpg",
    images: [
      "/assets/tattoo-full-arm.jpg",
      "/assets/tattoo-arm-1.jpg",
      "/assets/tattoo-arm-2.jpg",
      "/assets/tattoo-arm-3.jpg",
      "/assets/tattoo-arm-4.jpg",
    ],
    size: "Full tay",
    duration: "10-15 giờ",
    variants: makeFullBodyVariants(
      "2 buổi", "6tr6", "7tr5", "10tr/3 buổi",
      "2 buổi", "7tr", "7tr5", "10tr/3 buổi",
    ),
  },
  {
    id: "3",
    name: "Xăm full chân",
    price: 9900000,
    priceText: "9tr9 – 18tr",
    category: "Full body",
    description: "Xăm full chân từ đùi đến mắt cá, thiết kế tùy chỉnh theo ý tưởng của bạn.",
    image: "/assets/tattoo-full-leg.jpg",
    size: "Full chân",
    duration: "10-15 giờ",
    variants: makeFullBodyVariants(
      "3 buổi", "9tr9", "11tr5", "13tr2/4 buổi",
      "4 buổi", "13tr5", "7tr*2", "18tr/6 buổi",
    ),
  },
  {
    id: "4",
    name: "Xăm full ngực",
    price: 3500000,
    priceText: "3tr5 – 7tr",
    category: "Full body",
    description: "Xăm full ngực với thiết kế ấn tượng, phù hợp cho các tác phẩm lớn và chi tiết.",
    image: "/assets/tattoo-chest-1.jpg",
    images: [
      "/assets/tattoo-chest-1.jpg",
      "/assets/tattoo-chest-2.jpg",
    ],
    size: "Full ngực",
    duration: "8-12 giờ",
    variants: makeFullBodyVariants(
      "1 buổi", "3tr5", "5tr5/1.5", "7tr/2 buổi",
      "1.5 buổi", "5tr2", "5tr5/1.5", "7tr/2 buổi",
    ),
  },
  {
    id: "5",
    name: "Xăm full bụng",
    price: 3500000,
    priceText: "3tr5 – 7tr",
    category: "Full body",
    description: "Xăm full bụng với thiết kế cá nhân hóa, đường nét sắc sảo và chi tiết.",
    image: "https://images.unsplash.com/photo-1604941059800-a2c0aee40e77?w=600&h=800&fit=crop",
    size: "Full bụng",
    duration: "8-12 giờ",
    variants: makeFullBodyVariants(
      "1 buổi", "3tr5", "5tr5/1.5", "7tr/2 buổi",
      "1.5 buổi", "5tr2", "5tr5/1.5", "7tr/2 buổi",
    ),
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
    price: 500000,
    priceText: "500K – 3tr5",
    category: "Mini",
    description: "Hình xăm nhỏ từ mini đến khổ A4, phù hợp cho cổ tay, mắt cá chân, sau tai hoặc bất kỳ vị trí nào.",
    image: "/assets/tattoo-mini-1.jpg",
    size: "Mini – A4",
    duration: "1-6 giờ",
    variants: [
      { position: "Trắng đen / Màu", sessions: "2-3 giờ", priceSimple: "1tr – 1tr5", priceDifficult: "1tr5 – 2tr" },
      { position: "Trắng đen / Màu", sessions: "3-4 giờ", priceSimple: "1tr5 – 2tr", priceDifficult: "2tr – 3tr" },
      { position: "Trắng đen / Màu", sessions: "4-6 giờ", priceSimple: "2tr – 3tr5", priceDifficult: "3tr – 3tr5" },
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
    description: "Thiết kế và xăm theo yêu cầu riêng của bạn. Liên hệ để tư vấn chi tiết về ý tưởng, kích thước và giá.",
    image: "/assets/tattoo-custom-1.jpg",
    images: [
      "/assets/tattoo-custom-1.jpg",
      "/assets/tattoo-custom-2.jpg",
      "/assets/tattoo-custom-3.jpg",
    ],
    size: "Tùy yêu cầu",
    duration: "Tùy yêu cầu",
    note: "Giá tùy theo yêu cầu. Liên hệ để báo giá chi tiết.",
  },
];

export const categories = ["Tất cả", "Full body", "Đặc biệt", "Mini"];

export function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
}

export function displayPrice(design: TattooDesign): string {
  return design.priceText || formatVND(design.price);
}
