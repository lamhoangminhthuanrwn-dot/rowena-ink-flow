

## Plan: Update difficult design pricing per category

Currently `makeFullBodyVariants` hardcodes `priceDifficult: 10000000` and `priceDifficultSessions: "3 buổi"` for all variants. Each design now needs different difficult pricing for BW vs Color, and full chân needs a special Linework color price.

### Changes in `src/data/tattooDesigns.ts`

**1. Update `makeFullBodyVariants` signature** to accept difficult pricing parameters:
- Add `bwDifficult` and `colorDifficult` objects (price + sessions) as parameters
- Optionally accept `colorLineworkDifficult` for chân Linework exception
- Use these instead of hardcoded values in the variant generation loops

**2. Update each `makeFullBodyVariants` call with correct difficult pricing:**

| Design | BW Difficult | Color Difficult | Color Linework Difficult |
|--------|-------------|-----------------|--------------------------|
| Full lưng | 10,500,000 (3 buổi) | 18,000,000 (6 buổi) | — |
| Full tay | 10,000,000 (3 buổi) | 10,000,000 (3 buổi) | — |
| Full chân | 13,200,000 (4 buổi) | 18,000,000 (6 buổi) | 16,500,000 (5 buổi) |
| Full ngực & bụng | 7,000,000 (2 buổi) | 7,000,000 (2 buổi) | — |

**3. Update mini variants' `priceDifficult` and add `priceDifficultSessions`:**

| Size | Position | priceDifficult | priceDifficultSessions |
|------|----------|---------------|----------------------|
| Dưới 10cm | Trắng đen | 1,500,000 | "3 giờ" |
| Dưới 10cm | Màu | 2,000,000 | "4 giờ" |
| A5 | Trắng đen | 2,000,000 | "4 giờ" |
| A5 | Màu | 3,000,000 | "6 giờ" |
| A4 | Trắng đen | 3,000,000 | "6 giờ" |
| A4 | Màu | 3,500,000 | "1 buổi" |

Note: Mini prices match the user's request — most already match existing values, just adding `priceDifficultSessions` where missing.

