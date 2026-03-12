

## Plan: Thay hardcoded domain bằng SITE_URL / window.location.origin

### Phạm vi

Có 2 nhóm file cần xử lý:

**Client-side (React)** — dùng `window.location.origin`:
- `src/lib/seo.ts` — thay `const SITE_URL = "https://rowena-ink-flow.lovable.app"` bằng `window.location.origin`
- `src/pages/Account.tsx` (dòng 93, 399) — thay `https://thuanlam.id.vn` bằng `window.location.origin`
- `src/pages/Success.tsx` (dòng 306, 312) — tương tự

**Edge Functions (Deno)** — giữ nguyên hoặc dùng env var, không thể dùng `window.location.origin`:
- `supabase/functions/sitemap/index.ts` — đọc từ env `SITE_URL` với fallback `https://thuanlam.id.vn`
- `supabase/functions/og-meta/index.ts` — tương tự, fallback `https://rowena-ink-flow.lovable.app`
- `supabase/functions/auth-email-hook/index.ts` — domain email sender (`notify.thuanlam.id.vn`) là cấu hình DNS cố định, **không nên thay đổi**

### Chi tiết thay đổi

#### 1. `src/lib/seo.ts`
```ts
// Before
const SITE_URL = "https://rowena-ink-flow.lovable.app";

// After
const SITE_URL = typeof window !== "undefined" ? window.location.origin : "https://rowena-ink-flow.lovable.app";
```

#### 2. `src/pages/Account.tsx` & `src/pages/Success.tsx`
Thay tất cả `https://thuanlam.id.vn` bằng `${window.location.origin}` trong referral link.

#### 3. `supabase/functions/sitemap/index.ts` & `supabase/functions/og-meta/index.ts`
```ts
const SITE_URL = Deno.env.get("SITE_URL") || "https://thuanlam.id.vn";
```

#### 4. `supabase/functions/auth-email-hook/index.ts`
Giữ nguyên — domain email phụ thuộc vào DNS config, không nên dynamic.

### Tổng cộng: 4 file sửa, 0 file tạo mới. Không thay đổi chức năng.

