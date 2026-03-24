import { Facebook, Instagram, Youtube } from "lucide-react";

export const siteConfig = {
  name: "Rowena Tattoo",
  tagline: "Nghệ thuật xăm hình chuyên nghiệp",
  description:
    "ROWENA TATTOO CLUB - Xăm hình nghệ thuật chuyên nghiệp tại TP.HCM & Hà Nội. Đặt lịch online, xem mẫu xăm và giá.",

  hotline: "08888 37 414",
  hotlineHref: "tel:0888837414",
  zaloLink: "https://zalo.me/0888837414",
  email: "rowena.tattoo@gmail.com",
  workingHours: "T2 – CN: 8:00 – 18:00",

  socials: {
    facebook:
      "https://www.facebook.com/people/Rowena-Tattoo/61556145616091/",
    youtube: "https://www.youtube.com/@rowenatattomiennam",
    instagram: "https://www.instagram.com/rowena_tattoo/",
    tiktok: "https://www.tiktok.com/@rosaigontattoo?lang=vi-VN",
  },

  branches: [
    {
      name: "Gò Vấp",
      address: "88 Nguyễn Văn Khối, Phường 11, Gò Vấp, TP.HCM",
      mapQuery:
        "88+Nguyễn+Văn+Khối+Phường+11+Gò+Vấp+Hồ+Chí+Minh",
      area: "TP. Hồ Chí Minh",
    },
    {
      name: "Hà Nội",
      address: "18A Bờ Sông Sét, Hoàng Mai, Hà Nội",
      mapQuery: "18A+Bờ+Sông+Sét+Hoàng+Mai+Hà+Nội",
      area: "Hà Nội",
    },
    {
      name: "Buôn Ma Thuột",
      address: "250 Trần Phú, Buôn Ma Thuột, Đắk Lắk",
      mapQuery: "250+Trần+Phú+Buôn+Ma+Thuột+Đắk+Lắk",
      area: "Đắk Lắk",
    },
    {
      name: "Kuala Lumpur",
      address:
        "Level 1, Lot F112, Sungei Wang Plaza, Jalan Sultan Ismail, 50250 KL",
      mapQuery: "Sungei+Wang+Plaza+Jalan+Sultan+Ismail+Kuala+Lumpur",
      area: "Malaysia",
    },
  ],
} as const;

export type Branch = (typeof siteConfig.branches)[number];
