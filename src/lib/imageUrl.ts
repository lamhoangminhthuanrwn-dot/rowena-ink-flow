const STORAGE_BASE = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/tattoo-images`;
const RENDER_BASE = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/render/image/public/tattoo-images`;

/**
 * Returns an optimized image URL from Supabase Storage.
 * Uses Image Transformation (render endpoint) when width is specified.
 * Falls back to raw public URL if width is not provided.
 *
 * @param filename - The filename in the tattoo-images bucket (e.g. "tattoo-back-new-1.png")
 * @param width - Optional target width for resizing
 */
export function getImageUrl(filename: string, width?: number): string {
  if (width) {
    return `${RENDER_BASE}/${filename}?width=${width}&resize=contain`;
  }
  return `${STORAGE_BASE}/${filename}`;
}

/** Preset widths for different contexts */
export const IMG_WIDTH = {
  /** Catalog card thumbnails */
  CARD: 480,
  /** Product detail page */
  DETAIL: 900,
  /** Hero / full-width sections */
  HERO: 1400,
} as const;
