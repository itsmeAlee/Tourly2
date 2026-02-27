/**
 * Validates a redirect URL to prevent open redirect vulnerabilities.
 * Only allows relative paths starting with a single '/'.
 */
export function isValidRedirect(url: string | null | undefined): boolean {
    if (!url) return false;

    // Check if it's a relative path starting with a single '/'
    // Must start with '/' AND not start with '//' (protocol-relative URL)
    // Also avoid '/\' which some browsers might treat as '//'
    return url.startsWith("/") && !url.startsWith("//") && !url.startsWith("/\\");
}
