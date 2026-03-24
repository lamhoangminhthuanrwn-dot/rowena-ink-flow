

# Redesign & Refactor Website Tattoo — Kế hoạch triển khai theo pha

Yêu cầu này rất lớn, bao gồm redesign UX/UI, tái cấu trúc sitemap, thêm nhiều trang/section mới, chuẩn hóa dữ liệu, và tối ưu SEO. Để đảm bảo chất lượng và tránh lỗi, tôi đề xuất chia thành **4 pha** triển khai tuần tự. Mỗi pha sẽ là 1 lần implement riêng.

---

## Phân tích hiện trạng

### Điểm mạnh hiện tại
- Brutalist design nhất quán, dark/light theme hoạt động tốt
- Booking flow đã component hóa tốt (DesignStep, InfoStep, ScheduleStep)
- SEO cơ bản đã có (canonical, JSON-LD, robots.txt)
- Dữ liệu chi nhánh, artist đã có trong database

### Vấn đề cần sửa
- Trang chủ quá đơn giản: chỉ có Hero + danh sách sản phẩm, thiếu social proof, FAQ, giới thiệu team
- Footer có số hotline `08888 37 414` nhưng `href="tel:0938048780"` — **mâu thuẫn**
- Thiếu các trang: Giới thiệu, Dịch vụ, Đội ngũ, Chi nhánh riêng
- Trang Account/Wallet/Referral mang cảm giác "web bán hàng" hơn là dịch vụ tattoo
- Không có floating CTA sticky (Zalo/Gọi/Đặt lịch) trên mobile
- Thiếu FAQ section, social proof, review khách hàng
- Chưa có trang About/Giới thiệu studio

---

## PHA 1: Chuẩn hóa dữ liệu + Redesign trang chủ

### 1A. Tạo file dữ liệu chung (`src/data/siteConfig.ts`)
Một nguồn duy nhất cho toàn bộ thông tin liên hệ:
```text
- hotline: "08888 37 414"
- hotlineHref: "tel:0888837414"
- zaloLink: "https://zalo.me/..."
- email: "rowena.tattoo@gmail.com"
- giờ mở cửa: "T2 – CN: 8:00 – 18:00"
- social links (FB, IG, TikTok, YouTube)
- danh sách chi nhánh (tên, địa chỉ, mapQuery, hotline riêng nếu có)
```

→ Footer, Navbar, và tất cả trang sẽ import từ file này.

### 1B. Redesign trang chủ (Index.tsx)
Thêm các section theo thứ tự:

1. **Hero section** — giữ hình nền, cải thiện headline + thêm CTA phụ "Xem mẫu xăm"
2. **Khối "Tại sao chọn Rowena"** — 4 cột icon: Tay nghề artist / Vệ sinh tuyệt đối / Tư vấn cá nhân / Nhiều chi nhánh
3. **Portfolio nổi bật** — grid ảnh lớn, chia theo style, nút "Xem thêm"
4. **Đội ngũ Artist** — load từ DB (table `artists`), hiển thị tên + chi nhánh + CTA đặt lịch
5. **Chi nhánh** — load từ DB (table `branches`), địa chỉ + map embed + nút gọi
6. **FAQ** — Accordion với 5-7 câu hỏi phổ biến (hardcode data)
7. **Social proof / Review** — placeholder section (có thể thêm data thật sau)

### 1C. Floating CTA sticky trên mobile
Thay thế `FloatingCTA.tsx` hiện tại bằng thanh sticky 3 nút: **Gọi ngay | Zalo | Đặt lịch**

### 1D. Sửa Footer
- Import từ `siteConfig.ts` thay vì hardcode
- Sửa lỗi hotline href
- Thêm link Zalo
- Cập nhật năm copyright

---

## PHA 2: Thêm trang mới + Nâng cấp Portfolio

### 2A. Trang Giới thiệu (`/gioi-thieu`)
- Câu chuyện studio, giá trị cốt lõi, quy trình làm việc
- Ảnh studio, team
- CTA đặt lịch

### 2B. Trang Dịch vụ (`/dich-vu`)
- Liệt kê dịch vụ: Mini tattoo, Full body, Cover-up, Theo yêu cầu
- Mỗi dịch vụ: mô tả, đối tượng, khoảng giá, ảnh minh họa, CTA
- FAQ riêng cho từng dịch vụ

### 2C. Nâng cấp Portfolio/Catalog (`/mau-xam`)
- Thêm bộ lọc: phong cách (hiện đã có category), có thể mở rộng
- Ảnh hiển thị lớn hơn, lightbox khi click
- Mỗi item: tên, style, artist, CTA "Tư vấn mẫu tương tự"

### 2D. Trang Chi nhánh (`/chi-nhanh`)
- Load từ DB, hiển thị map, địa chỉ, hotline, giờ mở cửa
- CTA gọi/Zalo cho từng chi nhánh

### 2E. Cập nhật Navbar + Routes
- Thêm menu items mới: Giới thiệu, Dịch vụ, Chi nhánh
- Cập nhật App.tsx routes

---

## PHA 3: Giảm cảm giác "web bán hàng" + Tối ưu Booking

### 3A. Ẩn/giảm nhẹ Account features
- Trang Account chỉ hiển thị cho user đã đăng nhập, không hiện trên Navbar mặc định
- Ẩn link "Đăng nhập" khỏi menu chính (chuyển xuống footer hoặc icon nhỏ)
- Wallet/Referral giữ nguyên nhưng không quảng bá trên trang chủ

### 3B. Tối ưu form đặt lịch
- Thêm CTA thay thế dưới form: "Hoặc nhắn Zalo / Gọi hotline"
- Cải thiện UX mobile cho form
- Thông báo thành công rõ ràng hơn

### 3C. Sửa FloatingCTA cho ProductDetail
- Nút CTA sticky dưới cùng mobile đã có, giữ nguyên + thêm nút Zalo

---

## PHA 4: SEO Technical + Cleanup

### 4A. Chuẩn hóa SEO cho tất cả trang mới
- Title, meta description, canonical, JSON-LD cho mỗi trang
- Schema: LocalBusiness, FAQ, Service
- Breadcrumb JSON-LD

### 4B. Cập nhật robots.txt + sitemap
- Thêm routes mới vào sitemap edge function
- Noindex các trang hệ thống

### 4C. Tối ưu heading structure
- H1 duy nhất mỗi trang
- H2-H3 logic, semantic

### 4D. Internal linking
- Link giữa dịch vụ ↔ portfolio ↔ blog ↔ chi nhánh

---

## Đề xuất sitemap tối ưu

```text
/                    → Trang chủ (redesign)
/gioi-thieu          → Giới thiệu studio (MỚI)
/dich-vu             → Tổng quan dịch vụ (MỚI)
/mau-xam             → Portfolio / Bộ sưu tập (nâng cấp)
/mau-xam/:slug       → Chi tiết mẫu xăm
/chi-nhanh           → Chi nhánh (MỚI)
/tin-tuc             → Blog / Kiến thức (giữ)
/tin-tuc/:slug       → Chi tiết bài viết (giữ)
/dat-lich            → Đặt lịch (giữ, tối ưu)
/success             → Xác nhận đặt lịch (giữ, noindex)
/dang-nhap           → Đăng nhập (giữ, noindex)
/tai-khoan           → Tài khoản (giữ, noindex)
/ketoan              → Admin (giữ, noindex)
/admin/*             → Admin (giữ, noindex)
```

**Trang giữ**: /, /mau-xam, /dat-lich, /tin-tuc, /tai-khoan, /dang-nhap, /success, admin routes
**Trang thêm mới**: /gioi-thieu, /dich-vu, /chi-nhanh
**Trang noindex**: /success, /dang-nhap, /tai-khoan, /ketoan, /admin/*, /unsubscribe

---

## Component mới cần tạo

| Component | Mô tả |
|-----------|--------|
| `src/data/siteConfig.ts` | Nguồn dữ liệu chung (hotline, social, chi nhánh) |
| `src/components/home/WhyChooseUs.tsx` | 4 lý do chọn studio |
| `src/components/home/FeaturedPortfolio.tsx` | Grid portfolio nổi bật |
| `src/components/home/ArtistTeam.tsx` | Hiển thị đội ngũ artist |
| `src/components/home/BranchesSection.tsx` | Chi nhánh trên trang chủ |
| `src/components/home/FAQSection.tsx` | Accordion FAQ |
| `src/components/home/SocialProof.tsx` | Review/đánh giá |
| `src/components/StickyMobileCTA.tsx` | Thanh CTA sticky (Gọi/Zalo/Đặt lịch) |
| `src/pages/About.tsx` | Trang giới thiệu |
| `src/pages/Services.tsx` | Trang dịch vụ |
| `src/pages/Branches.tsx` | Trang chi nhánh |

---

## Kế hoạch triển khai

Tôi đề xuất bắt đầu với **Pha 1** — chuẩn hóa dữ liệu + redesign trang chủ. Đây là thay đổi có impact lớn nhất đối với conversion và trải nghiệm khách hàng lần đầu.

Sau khi hoàn thành Pha 1, chúng ta sẽ review kết quả và tiếp tục các pha tiếp theo.

**Bạn có muốn bắt đầu với Pha 1 không?**

