import { supabase } from "@/integrations/supabase/client";

/**
 * Check if a string is a storage path (not a full URL).
 */
const isStoragePath = (value: string): boolean =>
  !value.startsWith("http://") && !value.startsWith("https://");

/**
 * Resolve an array of storage paths or legacy signed URLs to displayable URLs.
 * - Storage paths → creates signed URLs on-demand (1 hour expiry)
 * - Legacy full URLs → returned as-is
 */
export async function resolveStorageUrls(
  bucket: string,
  paths: string[]
): Promise<string[]> {
  if (!paths || paths.length === 0) return [];

  const storagePaths = paths.filter(isStoragePath);
  const legacyUrls = paths.filter((p) => !isStoragePath(p));

  let signedMap: Record<string, string> = {};

  if (storagePaths.length > 0) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrls(storagePaths, 60 * 60); // 1 hour

    if (!error && data) {
      for (const item of data) {
        if (item.signedUrl && item.path) {
          signedMap[item.path] = item.signedUrl;
        }
      }
    }
  }

  // Preserve original order
  return paths.map((p) => {
    if (isStoragePath(p)) {
      return signedMap[p] || "";
    }
    return p;
  });
}
