export interface TattooDesign {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  size: string;
  duration: string;
}

export const tattooDesigns: TattooDesign[] = [
  {
    id: "1",
    name: "Rồng Phương Đông",
    price: 3500000,
    category: "Truyền thống",
    description: "Hình xăm rồng phương Đông với chi tiết tinh xảo, phong cách truyền thống Nhật Bản. Phù hợp cho vùng lưng, vai hoặc bắp tay.",
    image: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=600&h=800&fit=crop",
    size: "20 × 30 cm",
    duration: "6-8 giờ",
  },
  {
    id: "2",
    name: "Hoa Sen Mandala",
    price: 2000000,
    category: "Mandala",
    description: "Thiết kế mandala kết hợp hoa sen, đường nét đối xứng hoàn hảo. Thích hợp cho bắp tay, đùi hoặc lưng.",
    image: "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?w=600&h=800&fit=crop",
    size: "15 × 15 cm",
    duration: "4-5 giờ",
  },
  {
    id: "3",
    name: "Hổ Thủy Mặc",
    price: 4000000,
    category: "Truyền thống",
    description: "Hổ phong cách thủy mặc Á Đông, kết hợp nét cọ mềm mại và chi tiết sắc nét. Tác phẩm nghệ thuật trên da.",
    image: "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?w=600&h=800&fit=crop",
    size: "25 × 35 cm",
    duration: "8-10 giờ",
  },
  {
    id: "4",
    name: "Hình Học Tối Giản",
    price: 1200000,
    category: "Tối giản",
    description: "Thiết kế hình học tối giản với đường nét sạch sẽ, hiện đại. Phù hợp cho cổ tay, mắt cá chân hoặc sau tai.",
    image: "https://images.unsplash.com/photo-1562962230-16e4623d36e6?w=600&h=800&fit=crop",
    size: "5 × 8 cm",
    duration: "1-2 giờ",
  },
  {
    id: "5",
    name: "Phượng Hoàng",
    price: 5000000,
    category: "Truyền thống",
    description: "Phượng hoàng lửa phong cách tân cổ điển, màu sắc rực rỡ, chi tiết cầu kỳ. Tác phẩm lớn cho lưng hoặc ngực.",
    image: "https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?w=600&h=800&fit=crop",
    size: "30 × 40 cm",
    duration: "10-12 giờ",
  },
  {
    id: "6",
    name: "Chữ Calligraphy",
    price: 800000,
    category: "Chữ",
    description: "Chữ viết tay calligraphy tinh tế, font tùy chỉnh theo yêu cầu. Phù hợp cho xương đòn, cổ tay hoặc sườn.",
    image: "https://images.unsplash.com/photo-1475090169767-40ed8d18f67d?w=600&h=800&fit=crop",
    size: "3 × 10 cm",
    duration: "1 giờ",
  },
];

export const categories = ["Tất cả", "Truyền thống", "Mandala", "Tối giản", "Chữ"];

export function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
}