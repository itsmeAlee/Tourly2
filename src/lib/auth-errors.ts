import { AppwriteException } from "appwrite";

export function mapAuthError(error: unknown): string {
    if (error instanceof AppwriteException) {
        switch (error.code) {
            case 401:
                return "Invalid email or password.";
            case 403:
                return "We’re having trouble connecting. Please try again later.";
            case 409:
                return "An account with this email already exists.";
            case 429:
                return "Too many attempts. Please wait and try again.";
            default:
                return "We’re having trouble connecting. Please try again later.";
        }
    }

    if (error instanceof TypeError && /failed to fetch/i.test(error.message)) {
        return "We’re having trouble connecting. Please try again later.";
    }

    return "We’re having trouble connecting. Please try again later.";
}
