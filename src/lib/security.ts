
export function isValidRedirect(url: string | null | undefined): boolean {
  if (!url) return false;

  // Must start with /
  if (!url.startsWith('/')) return false;

  // Must not start with // (protocol relative)
  if (url.startsWith('//')) return false;

  // Must not start with /\ (backslash relative)
  if (url.startsWith('/\\')) return false;

  // Must not contain control characters
  if (/[\x00-\x1F\x7F]/.test(url)) return false;

  return true;
}
