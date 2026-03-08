

## Plan: Thêm 4 hình ảnh vào mục "Xăm hình mini & A4"

### Changes

**1. Copy 4 uploaded images to `public/assets/`:**
- `user-uploads://1-4.png` → `public/assets/tattoo-mini-2.png`
- `user-uploads://2-3.png` → `public/assets/tattoo-mini-3.png`
- `user-uploads://3-3.png` → `public/assets/tattoo-mini-4.png`
- `user-uploads://Screenshot_2026-03-05_160517.png` → `public/assets/tattoo-mini-5.png`

**2. Update `src/data/tattooDesigns.ts`:**
- Add `images` array to design id "7" containing the current `image` plus the 4 new images
- This enables the slideshow on both the catalog card and product detail page

