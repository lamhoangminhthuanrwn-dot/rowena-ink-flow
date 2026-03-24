import { SITE_DOMAIN } from "@/lib/constants";
import { siteConfig } from "@/data/siteConfig";

const defaults = {
  title: "ROWENA TATTOO CLUB",
  description: "ROWENA TATTOO CLUB - Xăm hình nghệ thuật chuyên nghiệp tại TP.HCM. Đặt lịch online, xem mẫu xăm và giá.",
  image: "https://rowenatattoos.com/favicon.png",
  type: "website",
};

const SITE_URL = SITE_DOMAIN;

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(url: string) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", url);
}

function setJsonLd(id: string, data: Record<string, unknown>) {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script");
    el.id = id;
    el.type = "application/ld+json";
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

function removeJsonLd(id: string) {
  document.getElementById(id)?.remove();
}

export function setSEO(opts: {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown>;
  jsonLdExtra?: { id: string; data: Record<string, unknown> };
}) {
  const title = opts.title ? `${opts.title} | ROWENA TATTOO CLUB` : defaults.title;
  const desc = opts.description || defaults.description;
  const image = opts.image || defaults.image;
  const type = opts.type || defaults.type;
  const url = opts.url || `${SITE_URL}${window.location.pathname}`;
  const robots = opts.noindex ? "noindex, nofollow" : "index, follow";

  document.title = title;
  setMeta("name", "robots", robots);
  setMeta("name", "description", desc);
  setMeta("property", "og:title", title);
  setMeta("property", "og:description", desc);
  setMeta("property", "og:image", image);
  setMeta("property", "og:type", type);
  setMeta("property", "og:url", url);
  setMeta("property", "og:site_name", "ROWENA TATTOO CLUB");
  setMeta("name", "twitter:title", title);
  setMeta("name", "twitter:description", desc);
  setMeta("name", "twitter:image", image);
  setMeta("name", "twitter:card", "summary_large_image");
  setCanonical(url);

  if (opts.jsonLd) {
    setJsonLd("seo-jsonld", opts.jsonLd);
  }
  if (opts.jsonLdExtra) {
    setJsonLd(opts.jsonLdExtra.id, opts.jsonLdExtra.data);
  }
}

export function resetSEO() {
  document.title = defaults.title;
  setMeta("name", "robots", "index, follow");
  setMeta("name", "description", defaults.description);
  setMeta("property", "og:title", defaults.title);
  setMeta("property", "og:description", defaults.description);
  setMeta("property", "og:image", defaults.image);
  setMeta("property", "og:type", defaults.type);
  setMeta("property", "og:url", SITE_URL);
  setMeta("property", "og:site_name", "ROWENA TATTOO CLUB");
  setMeta("name", "twitter:title", defaults.title);
  setMeta("name", "twitter:description", defaults.description);
  setMeta("name", "twitter:image", defaults.image);
  setMeta("name", "twitter:card", "summary_large_image");
  setCanonical(SITE_URL);
  removeJsonLd("seo-jsonld");
  removeJsonLd("seo-jsonld-faq");
}

// JSON-LD builders
export function buildLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "TattooParlor",
    name: "ROWENA TATTOO CLUB",
    description: defaults.description,
    url: SITE_URL,
    image: defaults.image,
    telephone: siteConfig.hotline,
    priceRange: "$$",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "08:00",
      closes: "18:00",
    },
    address: siteConfig.branches.map((b) => ({
      "@type": "PostalAddress",
      streetAddress: b.address,
      addressLocality: b.area,
    })),
    sameAs: [
      siteConfig.socials.facebook,
      siteConfig.socials.instagram,
      siteConfig.socials.youtube,
      siteConfig.socials.tiktok,
    ],
  };
}

export function buildFAQJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export function buildServiceJsonLd(services: { name: string; desc: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    provider: {
      "@type": "TattooParlor",
      name: "ROWENA TATTOO CLUB",
      url: SITE_URL,
    },
    serviceType: "Tattoo",
    areaServed: siteConfig.branches.map((b) => b.area),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Dịch vụ xăm hình",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.name,
          description: s.desc,
        },
      })),
    },
  };
}

export function buildArticleJsonLd(post: {
  title: string;
  excerpt?: string | null;
  cover_image?: string | null;
  published_at?: string | null;
  updated_at?: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || defaults.description,
    image: post.cover_image || defaults.image,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    url: `${SITE_URL}/tin-tuc/${post.slug}`,
    publisher: {
      "@type": "Organization",
      name: "ROWENA TATTOO CLUB",
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/tin-tuc/${post.slug}`,
    },
  };
}

export function buildBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}
