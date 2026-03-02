const defaults = {
  title: "ROWENA TATTOO CLUB",
  description: "ROWENA TATTOO CLUB - Xăm hình nghệ thuật chuyên nghiệp",
  image: "https://lovable.dev/opengraph-image-p98pqg.png",
  type: "website",
};

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function setSEO(opts: { title?: string; description?: string; image?: string; url?: string; type?: string }) {
  const title = opts.title ? `${opts.title} | ROWENA TATTOO CLUB` : defaults.title;
  const desc = opts.description || defaults.description;
  const image = opts.image || defaults.image;
  const type = opts.type || defaults.type;

  document.title = title;
  setMeta("name", "description", desc);
  setMeta("property", "og:title", title);
  setMeta("property", "og:description", desc);
  setMeta("property", "og:image", image);
  setMeta("property", "og:type", type);
  if (opts.url) setMeta("property", "og:url", opts.url);
  setMeta("name", "twitter:title", title);
  setMeta("name", "twitter:description", desc);
  setMeta("name", "twitter:image", image);
}

export function resetSEO() {
  document.title = defaults.title;
  setMeta("name", "description", defaults.description);
  setMeta("property", "og:title", defaults.title);
  setMeta("property", "og:description", defaults.description);
  setMeta("property", "og:image", defaults.image);
  setMeta("property", "og:type", defaults.type);
  setMeta("name", "twitter:title", defaults.title);
  setMeta("name", "twitter:description", defaults.description);
  setMeta("name", "twitter:image", defaults.image);
}
