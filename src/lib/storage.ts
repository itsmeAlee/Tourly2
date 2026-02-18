import { ImageGravity, ImageFormat } from "appwrite";
import { storage } from "@/lib/appwrite";
import { BUCKETS } from "@/lib/appwrite-config";

/**
 * Storage URL helpers for Tourly.
 *
 * These utilities generate Appwrite file preview URLs for display in the UI.
 * Preview URLs are publicly accessible (bucket read = "any"), so no auth
 * token is needed for rendering images in <img> tags or next/image.
 */

// ─── Generic Preview URL ─────────────────────────────────

/**
 * Returns an Appwrite storage preview URL for any file.
 *
 * @param bucketId  - The storage bucket ID
 * @param fileId    - The file ID within the bucket
 * @param width     - Resize width in px (default: 800)
 * @param height    - Resize height in px (optional, auto-scales if omitted)
 * @param quality   - Image quality 1–100 (default: 80)
 */
export function getFilePreviewUrl(
    bucketId: string,
    fileId: string,
    width: number = 800,
    height?: number,
    quality: number = 80
): string {
    return storage.getFilePreview({
        bucketId,
        fileId,
        width,
        height: height ?? undefined,
        quality,
        output: ImageFormat.Webp,
    });
}

// ─── Avatar URL ──────────────────────────────────────────

/**
 * Returns a cropped square avatar preview URL.
 *
 * Uses center gravity to produce a clean profile picture crop.
 * Output: 200×200 WebP at 80% quality.
 *
 * @param fileId  - The avatar file ID in the avatars bucket
 */
export function getAvatarUrl(fileId: string): string {
    return storage.getFilePreview({
        bucketId: BUCKETS.AVATARS,
        fileId,
        width: 200,
        height: 200,
        gravity: ImageGravity.Center,
        quality: 80,
        output: ImageFormat.Webp,
    });
}

// ─── Listing Image URL ──────────────────────────────────

/**
 * Returns a listing image preview URL.
 *
 * Optimized for gallery views and listing cards.
 * Output: WebP at 80% quality, height auto-scales to maintain aspect ratio.
 *
 * @param fileId  - The image file ID in the listing-images bucket
 * @param width   - Desired width in px (default: 800)
 */
export function getListingImageUrl(
    fileId: string,
    width: number = 800
): string {
    return storage.getFilePreview({
        bucketId: BUCKETS.LISTING_IMAGES,
        fileId,
        width,
        quality: 80,
        output: ImageFormat.Webp,
    });
}
