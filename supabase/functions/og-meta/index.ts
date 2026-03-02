import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SITE_URL = "https://rowena-ink-flow.lovable.app";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const slug = url.searchParams.get("slug");

  if (!slug) {
    return new Response("Missing slug", { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data: post } = await supabase
    .from("posts")
    .select("title, excerpt, cover_image, slug")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  const articleUrl = `${SITE_URL}/tin-tuc/${slug}`;

  if (!post) {
    // Redirect to site even if post not found
    return new Response(null, {
      status: 302,
      headers: { Location: articleUrl },
    });
  }

  const title = escapeHtml(`${post.title} | ROWENA TATTOO CLUB`);
  const description = escapeHtml(post.excerpt || "ROWENA TATTOO CLUB - Xăm hình nghệ thuật chuyên nghiệp");
  const image = post.cover_image || "";
  const escapedUrl = escapeHtml(articleUrl);

  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${escapeHtml(image)}" />
  <meta property="og:url" content="${escapedUrl}" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="ROWENA TATTOO CLUB" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${escapeHtml(image)}" />
  <meta http-equiv="refresh" content="0;url=${escapedUrl}" />
</head>
<body>
  <p>Redirecting to <a href="${escapedUrl}">${escapedUrl}</a>...</p>
  <script>window.location.replace("${articleUrl}");</script>
</body>
</html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
});
