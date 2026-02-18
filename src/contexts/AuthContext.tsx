"use client";

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from "react";
import { Query, type Models } from "appwrite";
import { account, databases } from "@/lib/appwrite";
import { DATABASE_ID, COLLECTIONS } from "@/lib/appwrite-config";

/** Shape of a document in the `users` collection. */
interface UserDocument extends Models.Document {
    user_id: string;
    name: string;
    email: string;
    role?: "tourist" | "provider";
    avatar_url?: string;
    is_email_verified?: boolean;
}

// ─── Types ───────────────────────────────────────────────

/** Authenticated user profile, combining Appwrite Account + users collection data. */
export interface AuthUser {
    id: string; // Appwrite account $id
    name: string;
    email: string;
    role: "tourist" | "provider";
    isEmailVerified: boolean;
    avatarUrl?: string;
    providerId?: string; // providers collection $id, if role is provider

    // Legacy-compatible fields (used by existing components like Navbar)
    avatar?: string; // alias for avatarUrl
}

/** Shape of the auth context consumed by the rest of the app. */
interface AuthContextType {
    user: AuthUser | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    isEmailVerified: boolean;

    login: (
        email: string,
        password: string
    ) => Promise<{ success: boolean; error?: string }>;

    signup: (
        name: string,
        email: string,
        password: string
    ) => Promise<{ success: boolean; error?: string }>;

    logout: () => void;

    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Helpers ─────────────────────────────────────────────

/**
 * Fetches the users collection document matching the Appwrite account $id.
 * Returns null if no document is found (e.g., interrupted signup).
 */
async function fetchUserDocument(
    accountId: string
): Promise<UserDocument | null> {
    try {
        const response = await databases.listDocuments<UserDocument>(
            DATABASE_ID,
            COLLECTIONS.USERS,
            [Query.equal("user_id", accountId), Query.limit(1)]
        );
        return response.documents[0] ?? null;
    } catch (err) {
        console.error("[AuthContext] Failed to fetch user document:", err);
        return null;
    }
}

/**
 * Optionally fetches the providers collection document for a provider user.
 * Returns the provider doc $id, or undefined if not found.
 */
async function fetchProviderDocId(
    accountId: string
): Promise<string | undefined> {
    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.PROVIDERS,
            [Query.equal("user_id", accountId), Query.limit(1)]
        );
        return response.documents[0]?.$id;
    } catch {
        return undefined;
    }
}

/**
 * Builds an AuthUser from an Appwrite Account + users collection document.
 */
function buildAuthUser(
    appwriteAccount: Models.User<Models.Preferences>,
    userDoc: UserDocument,
    providerDocId?: string
): AuthUser {
    const role = userDoc.role ?? "tourist";

    if (!userDoc.role) {
        console.warn(
            "[AuthContext] User document missing 'role' field — defaulting to 'tourist'.",
            { userId: appwriteAccount.$id }
        );
    }

    const avatarUrl = userDoc.avatar_url || undefined;

    return {
        id: appwriteAccount.$id,
        name: userDoc.name || appwriteAccount.name || "User",
        email: userDoc.email || appwriteAccount.email,
        role,
        isEmailVerified: appwriteAccount.emailVerification ?? false,
        avatarUrl,
        avatar: avatarUrl, // legacy alias
        providerId: providerDocId,
    };
}

// ─── Provider ────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // ── Check Session (runs once on mount) ───────────────

    const checkSession = useCallback(async () => {
        try {
            const appwriteAccount = await account.get();
            const userDoc = await fetchUserDocument(appwriteAccount.$id);

            if (!userDoc) {
                // Account exists but no users document → interrupted signup
                console.error(
                    "[AuthContext] No users document found for account. Logging out.",
                    { accountId: appwriteAccount.$id }
                );
                try {
                    await account.deleteSession("current");
                } catch {
                    // ignore — session may already be gone
                }
                setUser(null);
                return;
            }

            const providerDocId =
                userDoc.role === "provider"
                    ? await fetchProviderDocId(appwriteAccount.$id)
                    : undefined;

            setUser(buildAuthUser(appwriteAccount, userDoc, providerDocId));
        } catch {
            // 401 or network error → no active session, that's fine
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        checkSession();
    }, [checkSession]);

    // ── Login ────────────────────────────────────────────

    const login = useCallback(
        async (
            email: string,
            password: string
        ): Promise<{ success: boolean; error?: string }> => {
            setIsLoading(true);

            try {
                // 1. Create session
                await account.createEmailPasswordSession(email, password);

                // 2. Fetch account
                const appwriteAccount = await account.get();

                // 3. Fetch users collection document
                const userDoc = await fetchUserDocument(appwriteAccount.$id);

                if (!userDoc) {
                    // Cleanup: destroy the session we just created
                    await account.deleteSession("current");
                    return {
                        success: false,
                        error: "Your account setup is incomplete. Please contact support.",
                    };
                }

                // 4. Optionally fetch provider doc
                const providerDocId =
                    userDoc.role === "provider"
                        ? await fetchProviderDocId(appwriteAccount.$id)
                        : undefined;

                // 5. Populate state
                setUser(
                    buildAuthUser(appwriteAccount, userDoc, providerDocId)
                );

                return { success: true };
            } catch (err: unknown) {
                // Appwrite throws typed errors with message + code
                const message =
                    err instanceof Error
                        ? err.message
                        : "Invalid credentials. Please try again.";

                return { success: false, error: message };
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    // ── Signup ────────────────────────────────────────────

    const signup = useCallback(
        async (
            name: string,
            email: string,
            password: string
        ): Promise<{ success: boolean; error?: string }> => {
            setIsLoading(true);

            try {
                // Input validation (also validated by forms, but belt-and-suspenders)
                if (!name.trim()) {
                    return { success: false, error: "Name is required" };
                }
                if (!email.trim()) {
                    return { success: false, error: "Email is required" };
                }
                if (password.length < 8) {
                    return {
                        success: false,
                        error: "Password must be at least 8 characters",
                    };
                }

                // 1. Create the Appwrite account
                const { ID } = await import("appwrite");
                const newAccount = await account.create(
                    ID.unique(),
                    email,
                    password,
                    name
                );

                // 2. Create a session
                await account.createEmailPasswordSession(email, password);

                // 3. Create the users collection document
                const now = new Date().toISOString();
                await databases.createDocument(
                    DATABASE_ID,
                    COLLECTIONS.USERS,
                    ID.unique(),
                    {
                        user_id: newAccount.$id,
                        name,
                        email,
                        role: "tourist", // default role on signup
                        is_email_verified: false,
                        created_at: now,
                    }
                );

                // 4. Fetch everything fresh and populate state
                const appwriteAccount = await account.get();
                const userDoc = await fetchUserDocument(appwriteAccount.$id);

                if (userDoc) {
                    setUser(buildAuthUser(appwriteAccount, userDoc));
                }

                return { success: true };
            } catch (err: unknown) {
                const message =
                    err instanceof Error
                        ? err.message
                        : "Could not create account. Please try again.";

                return { success: false, error: message };
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    // ── Logout ───────────────────────────────────────────

    const logout = useCallback(() => {
        // Fire-and-forget the Appwrite session deletion
        account.deleteSession("current").catch((err) => {
            console.error("[AuthContext] Failed to delete session:", err);
        });

        // Immediately clear local state so UI updates instantly
        setUser(null);
    }, []);

    // ── Refresh User ─────────────────────────────────────

    const refreshUser = useCallback(async () => {
        try {
            const appwriteAccount = await account.get();
            const userDoc = await fetchUserDocument(appwriteAccount.$id);

            if (!userDoc) {
                setUser(null);
                return;
            }

            const providerDocId =
                userDoc.role === "provider"
                    ? await fetchProviderDocId(appwriteAccount.$id)
                    : undefined;

            setUser(buildAuthUser(appwriteAccount, userDoc, providerDocId));
        } catch {
            setUser(null);
        }
    }, []);

    // ── Context Value ────────────────────────────────────

    const value: AuthContextType = {
        user,
        isLoading,
        isAuthenticated: !!user,
        isEmailVerified: user?.isEmailVerified ?? false,
        login,
        signup,
        logout,
        refreshUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// ─── Hook ────────────────────────────────────────────────

/** Consume the auth context. Must be used within <AuthProvider>. */
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
