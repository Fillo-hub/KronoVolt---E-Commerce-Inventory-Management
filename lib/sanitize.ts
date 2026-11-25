import DOMPurify from "dompurify";

/**
 * Fast, isomorphic text sanitizer that strips HTML tags consistently on both SSR and CSR
 * without double-escaping characters that React JSX already escapes.
 */
export function sanitize(text: string | null | undefined): string {
  if (!text) return "";
  return String(text).replace(/<[^>]*>/g, "");
}

/**
 * Sanitize HTML content that needs to preserve basic formatting
 */
export function sanitizeHtml(text: string | null | undefined): string {
  if (!text) return "";

  if (typeof window !== "undefined") {
    return DOMPurify.sanitize(text, {
      ALLOWED_TAGS: ["p", "br", "strong", "em", "u", "b", "i"],
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true,
    });
  }

  return String(text).replace(/<[^>]*>/g, "");
}
