/**
 * Safely resolves a product or static image path for Next.js / Vercel (Linux case-sensitive):
 * - External URLs (http://, https://) are returned as-is
 * - Empty/missing paths fall back to /product_placeholder.jpg
 * - Local filenames with spaces are mapped to URL-safe lowercase hyphenated filenames
 */
export function resolveImageSrc(src?: string | null): string {
  if (!src || !src.trim()) {
    return "/product_placeholder.jpg";
  }

  const trimmed = src.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  const normalized = trimmed.replace(/^\/+/, "");
  const safeFile = normalized.includes(" ")
    ? normalized.replace(/\s+/g, "-").toLowerCase()
    : normalized;

  return `/${safeFile}`;
}
