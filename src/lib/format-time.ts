/**
 * Formats a date string or Date object into a human-friendly "time ago" display.
 *
 * - Under 60s → "now"
 * - 1–59 min → "2m"
 * - 1–23 hr → "1h"
 * - Yesterday → "Yesterday"
 * - Older → "Jan 12" / "Jun 5, 2024" (if different year)
 */
export function formatTimeAgo(dateInput: string | Date | undefined): string {
    if (!dateInput) return "";

    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);

    if (diffSec < 60) return "now";
    if (diffMin < 60) return `${diffMin}m`;
    if (diffHr < 24) return `${diffHr}h`;

    // Check "Yesterday"
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

    // Older: "Jan 12" or "Jan 12, 2024"
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    if (year === now.getFullYear()) return `${month} ${day}`;
    return `${month} ${day}, ${year}`;
}

/**
 * Formats a date into chat-style day separators.
 *
 * - Today → "Today"
 * - Yesterday → "Yesterday"
 * - This year → "Jan 12"
 * - Older → "Jan 12, 2024"
 */
export function formatMessageDate(dateInput: string | Date): string {
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    const now = new Date();

    if (date.toDateString() === now.toDateString()) return "Today";

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    if (year === now.getFullYear()) return `${month} ${day}`;
    return `${month} ${day}, ${year}`;
}

/**
 * Formats a date into a short time string, e.g. "2:30 PM".
 */
export function formatMessageTime(dateInput: string | Date): string {
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}
