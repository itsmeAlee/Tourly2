
/**
 * Validates if a redirect URL is safe to use.
 * Prevents open redirect vulnerabilities by ensuring the URL is a relative path.
 *
 * @param url The URL to validate
 * @returns true if the URL is a safe relative path, false otherwise
 */
export function isValidRedirect(url: string | null | undefined): boolean {
    if (!url || typeof url !== 'string') return false;

    // Must start with /
    if (!url.startsWith("/")) return false;

    // Must not be protocol-relative // (e.g. //google.com)
    if (url.startsWith("//")) return false;

    // Must not use backslash trick /\ (e.g. /\google.com)
    if (url.startsWith("/\\")) return false;

    // Must not contain whitespace (basic check)
    if (/\s/.test(url)) return false;

    return true;
}
