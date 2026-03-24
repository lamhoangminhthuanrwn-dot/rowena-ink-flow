

# Pha 2: Thêm trang mới + Nâng cấp Portfolio + Cập nhật Navigation

## Tổng quan

Tạo 3 trang mới (Giới thiệu, Dịch vụ, Chi nhánh), nâng cấp trang Portfolio, và cập nhật Navbar/Routes.

---

## 2A. Trang Giới thiệu — `/gioi-thieu`

**File**: `src/pages/About.tsx`

- Hero nhỏ: headline "Về Rowena Tattoo" + mô tả ngắn
- Section "Câu chuyện studio": lịch sử, triết lý, tầm nhìn (hardcode content)
- Section "Giá trị cốt lõi": 4 khối (Nghệ thuật, An toàn, Tận tâm, Chuyên nghiệp)
- Section "Quy trình làm việc": 4 bước (Tư vấn → Thiết kế → Thực hiện → Chăm sóc sau xăm)
- CTA đặt lịch cuối trang
- SEO: title, meta, canonical, JSON-LD (LocalBusiness)

## 2B. Trang Dịch vụ — `/dich-vu`

**File**: `src/pages/Services.tsx`

- Hero: "Dịch vụ của chúng tôi"
- Grid các dịch vụ (dữ liệu hardcode trong file hoặc data riêng):
  - Xăm mini / Xăm nghệ thuật full body / Cover tattoo / Xăm theo yêu cầu
  - Mỗi card: icon, tên, mô tả, đối tượng phù hợp, khoảng giá, CTA "Xem bảng giá" (link đến `/mau-xam/:slug`)
- Section FAQ riêng cho dịch vụ (5 câu)
- CTA đặt lịch + Zalo cuối trang
- SEO: title, meta, Service schema JSON-LD

## 2C. Trang Chi nhánh — `/chi-nhanh`

**File**: `src/pages/Branches.tsx`

- Load chi nhánh từ `siteConfig.branches` + bổ sung artist từ DB (query `artists` join `branches`)
- Mỗi chi nhánh: card lớn với map embed, địa chỉ, hotline, giờ mở cửa, danh sách artist tại chi nhánh
- CTA: Gọi ngay / Nhắn Zalo / Chỉ đường
- SEO: title, meta, LocalBusiness schema cho từng chi nhánh

## 2D. Nâng cấp Portfolio — `/mau-xam`

**File**: `src/pages/Catalog.tsx`

- Thêm SEO (title, meta, canonical) — hiện chưa có
- Thêm heading H1 "Bộ sưu tập hình xăm"
- CTA cuối trang: "Không tìm thấy mẫu ưng ý? Đặt lịch tư vấn"
- Giữ nguyên filter và grid hiện tại, bổ sung hover info rõ hơn

## 2E. Cập nhật Navbar + Routes

**File**: `src/components/Navbar.tsx`
- Thêm links: Giới thiệu, Dịch vụ, Chi nhánh vào menu (trước "Mẫu xăm")
- Thứ tự: Giới thiệu | Dịch vụ | Mẫu xăm | Chi nhánh | Tin tức

**File**: `src/App.tsx`
- Thêm lazy import + routes cho `/gioi-thieu`, `/dich-vu`, `/chi-nhanh`

**File**: `src/components/Footer.tsx`
- Thêm links mới vào phần "Liên kết"

---

## Danh sách file thay đổi

| File | Hành động |
|------|-----------|
| `src/pages/About.tsx` | Tạo mới |
| `src/pages/Services.tsx` | Tạo mới |
| `src/pages/Branches.tsx` | Tạo mới |
| `src/pages/Catalog.tsx` | Sửa (thêm SEO, H1, CTA) |
| `src/components/Navbar.tsx` | Sửa (thêm menu items) |
| `src/components/Footer.tsx` | Sửa (thêm links) |
| `src/App.tsx` | Sửa (thêm routes) |

Không cần thay đổi database.

