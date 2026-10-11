/**
 * URL helpers used when saving links and tabs.
 */

/** Normalize user-entered URLs by adding a protocol when missing. */
export function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  // Chrome-internal and other schemes are left untouched.
  if (/^[a-z]+:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

/** Best-effort favicon URL derived from a page URL's origin. */
export function faviconForUrl(url: string): string | undefined {
  try {
    const { origin } = new URL(url);
    return `${origin}/favicon.ico`;
  } catch {
    return undefined;
  }
}

/** A short, human-friendly hostname for display (drops the leading www.). */
export function hostnameForUrl(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
