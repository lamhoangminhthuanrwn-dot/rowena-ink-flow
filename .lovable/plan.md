

## Plan: Thay hình ảnh mẫu xăm full lưng

### Changes

**Copy 10 uploaded images to `public/assets/`**
- `user-uploads://1.png` → `public/assets/tattoo-back-new-1.png`
- `user-uploads://2.png` → `public/assets/tattoo-back-new-2.png`
- `user-uploads://3.png` → `public/assets/tattoo-back-new-3.png`
- `user-uploads://4.png` → `public/assets/tattoo-back-new-4.png`
- `user-uploads://5.png` → `public/assets/tattoo-back-new-5.png`
- `user-uploads://6.png` → `public/assets/tattoo-back-new-6.png`
- `user-uploads://7.png` → `public/assets/tattoo-back-new-7.png`
- `user-uploads://8.png` → `public/assets/tattoo-back-new-8.png`
- `user-uploads://Screenshot_2026-03-05_154400.png` → `public/assets/tattoo-back-new-9.png`
- `user-uploads://给你看看不一样的满背_1_天予刺青客服_来自小红书网页版.jpg` → `public/assets/tattoo-back-new-10.jpg`

**Update `src/data/tattooDesigns.ts`** (item id="1")
- Replace `image` with first new image path
- Replace entire `images` array with 10 new image paths
- Remove references to old `tattoo-back-*.png/jpg` files

