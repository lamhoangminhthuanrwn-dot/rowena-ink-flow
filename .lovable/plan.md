

## Plan: Edge function for server-side OG meta tags

### Problem
Social media crawlers (Facebook, Zalo) don't execute JavaScript, so they can't see the dynamically updated meta tags. When sharing a news article link, the preview shows generic site info instead of the article's title, description, and cover image.

### Approach
Create an edge function `og-meta` that acts as a share URL proxy:
- URL format: `https://{supabase-url}/functions/v1/og-meta?slug=bai-viet-slug`
- The function fetches the post from DB, returns a minimal HTML page with correct OG tags + an automatic redirect to the real article page
- When users want to share an article on social media, they use this URL instead of the direct SPA URL
- Crawlers read the OG tags from the server-rendered HTML; real users get redirected to the full SPA page

Additionally, add a "Copy share link" button on the `NewsDetail` page that copies the edge function URL (the crawler-friendly version) to clipboard.

### Changes

1. **Create `supabase/functions/og-meta/index.ts`**
   - Accept `slug` query parameter
   - Query `posts` table for the matching published post using service role key
   - Return minimal HTML with `og:title`, `og:description`, `og:image`, `og:url`, `og:type`
   - Include `<meta http-equiv="refresh">` and JS redirect to the actual article URL (`https://rowena-ink-flow.lovable.app/tin-tuc/{slug}`)
   - Handle CORS and missing posts gracefully
   - Set `verify_jwt = false` in config (public endpoint for crawlers)

2. **Update `src/pages/NewsDetail.tsx`**
   - Add a share button (copy icon) next to the article title/meta area
   - On click, copy the edge function share URL to clipboard with a toast confirmation
   - Build the URL using `VITE_SUPABASE_PROJECT_ID` env var

3. **Update `supabase/config.toml`** — not needed, it's auto-managed; JWT verification will be set via the function code

### Technical detail

The edge function returns HTML like:
```html
<!DOCTYPE html>
<html>
<head>
  <meta property="og:title" content="Article Title | ROWENA TATTOO CLUB" />
  <meta property="og:description" content="Article excerpt..." />
  <meta property="og:image" content="https://..." />
  <meta property="og:url" content="https://rowena-ink-flow.lovable.app/tin-tuc/slug" />
  <meta property="og:type" content="article" />
  <meta http-equiv="refresh" content="0;url=https://rowena-ink-flow.lovable.app/tin-tuc/slug" />
</head>
<body><p>Redirecting...</p></body>
</html>
```

Crawlers read meta tags from this response. Real users are instantly redirected to the SPA. The site URL for redirects will use the published domain.

