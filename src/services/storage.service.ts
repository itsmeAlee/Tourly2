import { ID } from "appwrite";
import { storage } from "@/lib/appwrite";
import { BUCKETS } from "@/lib/appwrite-config";
import { handleAppwriteError, AppError } from "@/lib/errors";
import { getListingImageUrl } from "@/lib/storage";

// ─── Constants ──────────────────────────────────────────

const ALLOWED_IMAGE_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
]);

const MAX_LISTING_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_AVATAR_SIZE = 3 * 1024 * 1024; // 3 MB

// ─── Storage Service ────────────────────────────────────

/**
 * Uploads an image to the `listing-images` bucket.
 *
 * Validates file type (JPEG, PNG, WebP) and size (≤ 10 MB).
 * Returns the Appwrite file ID — store this, not the URL.
 * URLs are generated at render time via `getListingImageUrl()`.
 */
export async function uploadListingImage(
    file: File,
    _providerId: string
): Promise<string> {
    // ── Validation ──────────────────────────────────────

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
        throw new AppError(
            "VALIDATION",
            "Image must be JPEG, PNG, or WebP format."
        );
    }

    if (file.size > MAX_LISTING_IMAGE_SIZE) {
        throw new AppError(
            "VALIDATION",
            "Image must be smaller than 10 MB."
        );
    }

    try {
        const result = await storage.createFile(
            BUCKETS.LISTING_IMAGES,
            ID.unique(),
            file
        );
        return result.$id;
    } catch (err) {
        throw handleAppwriteError(err);
    }
}

/**
 * Uploads an avatar image to the `avatars` bucket.
 *
 * Validates file type (any image/*) and size (≤ 3 MB).
 * Returns the Appwrite file ID.
 */
export async function uploadAvatar(
    file: File,
    _userId: string
): Promise<string> {
    if (!file.type.startsWith("image/")) {
        throw new AppError("VALIDATION", "File must be an image.");
    }

    if (file.size > MAX_AVATAR_SIZE) {
        throw new AppError(
            "VALIDATION",
            "Avatar must be smaller than 3 MB."
        );
    }

    try {
        const result = await storage.createFile(
            BUCKETS.AVATARS,
            ID.unique(),
            file
        );
        return result.$id;
    } catch (err) {
        throw handleAppwriteError(err);
    }
}

/**
 * Deletes a file from Appwrite Storage.
 *
 * @param bucketId  The storage bucket ID.
 * @param fileId    The file ID to delete.
 */
export async function deleteFile(
    bucketId: string,
    fileId: string
): Promise<void> {
    try {
        await storage.deleteFile(bucketId, fileId);
    } catch (err) {
        throw handleAppwriteError(err);
    }
}

/**
 * Converts an array of file IDs to preview URLs.
 *
 * Pure function — no network calls. Uses `getListingImageUrl()`
 * from `@/lib/storage` which generates Appwrite preview URLs.
 *
 * @param fileIds  Array of Appwrite Storage file IDs.
 * @returns        Array of WebP preview URL strings.
 */
export function getListingImageUrls(fileIds: string[]): string[] {
    return fileIds.map((id) => getListingImageUrl(id));
}
