import { AppwriteException } from "appwrite";

export function mapAuthError(error: unknown): string {
    if (error instanceof AppwriteException) {
        switch (error.code) {
            case 401:
                return "Invalid email or password.";
            case 403:
                return "Access denied. Please try again.";
            case 409:
                return "An account with this email already exists.";
            case 429:
                return "Too many attempts. Please wait and try again.";
            default:
                return "Authentication failed. Please try again.";
        }
    }

    if (error instanceof TypeError && /failed to fetch/i.test(error.message)) {
        return "Connection to authentication service failed. Verify Vercel NEXT_PUBLIC_APPWRITE_* variables and Appwrite Platform domain/CORS settings.";
    }

    return "Something went wrong. Please try again.";
}
