

## Plan: Thêm hình vào "Cover hình xăm cũ"

### Changes

**Copy 2 uploaded images to `public/assets/`**
- `user-uploads://Screenshot_2026-03-05_160713.png` → `public/assets/tattoo-cover-1.png`
- `user-uploads://花胸龙_遮盖_完成度百分之65_1_远刺_来自小红书网页版.jpg` → `public/assets/tattoo-cover-2.jpg`

**Update `src/data/tattooDesigns.ts`** (item id="6")
- Set `image` to `/assets/tattoo-cover-1.png`
- Add `images` array with both new paths
- Remove the old Unsplash URL

