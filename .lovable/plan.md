

## Plan: Add dynamic SEO meta tags for news articles

### Problem
Currently, all pages share the same static meta tags defined in `index.html`. When a news article is shared on social media (Facebook, Zalo, Twitter), it shows generic "ROWENA TATTOO CLUB" title/image instead of the article's actual title, description, and cover image.

### Approach
Since this is a client-side React SPA, we have two layers:

1. **Client-side `document.title` + meta tags** — Update `<title>`, `<meta name="description">`, and Open Graph tags dynamically using `useEffect` when post data loads. This handles browser tab title and basic SEO for crawlers that execute JavaScript.

2. **News listing page** — Also update the title for the `/tin-tuc` page.

### Limitation
Client-side meta tag updates work for Google (which renders JS) and browser tabs, but some social media crawlers (Facebook, Zalo) don't execute JavaScript. For full social media preview support, a server-side rendering solution (edge function that serves pre-rendered HTML) would be needed — but that's a separate, more complex feature. The client-side approach is still valuable and covers most use cases.

### Changes

1. **`src/pages/NewsDetail.tsx`**
   - Add a `useEffect` that runs when `post` data is available
   - Set `document.title` to `{post.title} | ROWENA TATTOO CLUB`
   - Update/create meta tags: `description` (from excerpt), `og:title`, `og:description`, `og:image`, `og:type` (article), `og:url`, `twitter:title`, `twitter:description`, `twitter:image`
   - Cleanup function to restore original meta tags on unmount

2. **`src/pages/News.tsx`**
   - Add a simple `useEffect` to set `document.title` to `Tin tức & Khuyến mãi | ROWENA TATTOO CLUB`
   - Set description meta tag for the listing page

### Technical detail
A helper function `updateMetaTag(property, content)` will find or create the `<meta>` element and set its content. On component unmount, tags revert to defaults.

