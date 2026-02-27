import { AppwriteException } from "appwrite";

/**
 * Application-level error class.
 *
 * Wraps Appwrite errors (and network errors) with a semantic `code`
 * and a user-facing `message`. Services throw these; UI catches and
 * displays them.
 */
export class AppError extends Error {
    /** Semantic error code, e.g. "UNAUTHORIZED", "NOT_FOUND". */
    public readonly code: string;

    constructor(code: string, message: string) {
        super(message);
        this.name = "AppError";
        this.code = code;
    }
}

// ─── Status → Code / Message Map ────────────────────────

const ERROR_MAP: Record<number, { code: string; message: string }> = {
    401: {
        code: "UNAUTHORIZED",
        message: "You must be logged in to do this.",
    },
    403: {
        code: "FORBIDDEN",
        message: "You do not have permission to do this.",
    },
    404: {
        code: "NOT_FOUND",
        message: "The requested item was not found.",
    },
    409: {
        code: "CONFLICT",
        message: "This item already exists.",
    },
    429: {
        code: "RATE_LIMITED",
        message: "Too many requests. Please slow down.",
    },
};

/**
 * Converts any caught error into a typed `AppError`.
 *
 * @example
 * ```ts
 * try {
 *   await databases.getDocument(...)
 * } catch (err) {
 *   throw handleAppwriteError(err);
 * }
 * ```
 */
export function handleAppwriteError(error: unknown): AppError {
    if (error instanceof AppError) {
        return error;
    }

    if (error instanceof AppwriteException) {
        const mapped = ERROR_MAP[error.code];
        if (mapped) {
            return new AppError(mapped.code, mapped.message);
        }
        return new AppError(
            "APPWRITE_ERROR",
            error.message || "Something went wrong. Please try again."
        );
    }

    if (error instanceof Error) {
        // Network errors, fetch failures, etc.
        return new AppError("NETWORK_ERROR", error.message);
    }

    return new AppError(
        "UNKNOWN_ERROR",
        "Something went wrong. Please try again."
    );
}

/**
 * Checks if an error is a 404 Not Found error from Appwrite.
 *
 * Used in services to gracefully handle missing documents (return null)
 * instead of throwing.
 */
export function isNotFound(error: unknown): boolean {
    return (
        !!error &&
        typeof error === "object" &&
        "code" in error &&
        (error as { code: unknown }).code === 404
    );
}
