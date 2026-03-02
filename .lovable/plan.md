

## Plan: Fix Vietnamese font rendering across the entire site

### Problem
Crimson Pro (`font-serif`) has poor rendering of Vietnamese diacritical marks, causing characters to separate (e.g., "cầ u" instead of "cầu"). This affects all headings using `font-serif` that contain Vietnamese text.

### Scope
Found `font-serif` used on Vietnamese text in 14 files. The fix applies to headings in these files:

1. **`src/components/CatalogCard.tsx`** (line 36) — card title "Xăm theo yêu cầu khác" (the exact bug shown in screenshot)
2. **`src/pages/Catalog.tsx`** (line 14) — page heading
3. **`src/pages/ProductDetail.tsx`** (lines 136, 154) — product name, price table heading
4. **`src/pages/Booking.tsx`** (lines 170, 205, 234, 308) — section headings
5. **`src/pages/Auth.tsx`** (line 64) — login/signup heading
6. **`src/pages/Account.tsx`** (lines 162, 256) — account heading, withdraw heading
7. **`src/pages/Ketoan.tsx`** (lines 239, 655) — admin headings
8. **`src/pages/AdminBranches.tsx`** (lines 171, 177) — branch management headings
9. **`src/components/HeroSection.tsx`** — hero heading
10. **`src/components/Footer.tsx`** — already fixed
11. **Other components** using `font-serif` on Vietnamese text

### Fix
Replace `font-serif` with `font-sans` on all headings that display Vietnamese text. This switches from Crimson Pro to DM Sans, which has proper Vietnamese diacritics support.

### Note
The global CSS rule `h1, h2, h3, h4, h5, h6 { @apply font-serif; }` in `src/index.css` also forces all headings to use Crimson Pro by default. This rule should be changed to `font-sans` to prevent the issue at the base level, then any heading that explicitly sets `font-serif` in className will override it anyway if needed for non-Vietnamese text.

### Changes summary
- **`src/index.css`**: Change base heading rule from `font-serif` to `font-sans`
- **All 8+ component/page files**: Replace `font-serif` with `font-sans` on headings containing Vietnamese text

