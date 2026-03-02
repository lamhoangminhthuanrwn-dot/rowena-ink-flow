

## Plan: Fix font rendering issue with Vietnamese text

### Problem
Font **Crimson Pro** (`font-serif`) combined with `uppercase` and `tracking-wider` causes Vietnamese diacritical marks to render incorrectly -- characters appear separated (e.g., "LIÊN KẾ T" instead of "LIÊN KẾT"). This is a known issue with certain serif fonts and CSS `text-transform: uppercase` + `letter-spacing` on Vietnamese text.

### Root cause
The CSS combination `font-serif uppercase tracking-wider` on Vietnamese text breaks diacritics rendering in Crimson Pro.

### Fix

**File: `src/components/Footer.tsx`** (3 changes)

Replace `font-serif` with `font-sans` on all three `<h4>` section headers (lines 63, 80, 95) that use `uppercase tracking-wider`:
- "Liên kết" (line 63)
- "Liên hệ" (line 80)
- "Chi nhánh Studio" (line 95)

Change: `font-serif text-sm font-semibold uppercase tracking-wider` → `font-sans text-sm font-semibold uppercase tracking-wider`

This keeps the uppercase styling but uses DM Sans which has proper Vietnamese diacritics support. No other files are affected since the search confirmed only `Footer.tsx` uses the `font-serif + uppercase` combination.

