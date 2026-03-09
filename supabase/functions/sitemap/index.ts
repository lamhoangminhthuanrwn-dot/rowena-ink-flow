import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SITE_URL = "https://thuanlam.id.vn";

const staticRoutes = [
  { loc: "/trang-chu", changefreq: "weekly", priority: "1.0" },
  { loc: "/mau-xam", changefreq: "weekly", priority: "0.9" },
  { loc: "/booking", changefreq: "monthly", priority: "0.8" },
  { loc: "/tin-tuc", changefreq: "daily", priority: "0.8" },
  { loc: "/auth", changefreq: "monthly", priority: "0.3" },
];

function urlEntry(loc: string, lastmod?: string, changefreq = "weekly", priority = "0.5") {
  return `  <url>
    <loc>${SITE_URL}${loc}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Fetch published posts
  const { data: posts } = await supabase
    .from("posts")
    .select("slug, updated_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  // Fetch active products
  const { data: products } = await supabase
    .from("products")
    .select("slug, created_at")
    .eq("is_active", true);

  const entries: string[] = [];

  // Static routes
  for (const r of staticRoutes) {
    entries.push(urlEntry(r.loc, undefined, r.changefreq, r.priority));
  }

  // Product pages
  if (products) {
    for (const p of products) {
      entries.push(urlEntry(`/mau-xam/${p.slug}`, p.created_at?.split("T")[0], "weekly", "0.7"));
    }
  }

  // News articles
  if (posts) {
    for (const p of posts) {
      entries.push(urlEntry(`/tin-tuc/${p.slug}`, p.updated_at?.split("T")[0], "weekly", "0.6"));
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
});
