import { Client, Account, Databases, Storage } from "appwrite";

/**
 * Client-side Appwrite SDK singleton.
 *
 * Use this in Client Components (e.g., AuthContext, hooks)
 * where browser-based authentication is required.
 *
 * @see https://appwrite.io/docs/sdks#client
 */

const RAW_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

function normalizeEndpoint(endpoint?: string): string | undefined {
    if (!endpoint) return undefined;

    const trimmed = endpoint.trim().replace(/\/+$/, "");
    if (!trimmed) return undefined;

    return /\/v\d+$/i.test(trimmed) ? trimmed : `${trimmed}/v1`;
}

const ENDPOINT = normalizeEndpoint(RAW_ENDPOINT);

export const isAppwriteClientConfigured = Boolean(ENDPOINT && PROJECT_ID);

export function getAppwriteClientConfigError(): string {
    return "Authentication service is not configured. Set NEXT_PUBLIC_APPWRITE_ENDPOINT and NEXT_PUBLIC_APPWRITE_PROJECT_ID in Vercel, and ensure your Vercel domain is added in Appwrite Platform settings.";
}

if (!isAppwriteClientConfigured) {
    console.warn(
        "[Appwrite] Client SDK not fully configured. " +
        "Auth calls can fail until NEXT_PUBLIC_APPWRITE_ENDPOINT and NEXT_PUBLIC_APPWRITE_PROJECT_ID are set, and the current origin is allowed in Appwrite Platforms."
    );
}

const client = new Client();

// Only configure if env vars exist — prevents crash during build/ISR
if (ENDPOINT) client.setEndpoint(ENDPOINT);
if (PROJECT_ID) client.setProject(PROJECT_ID);

/** Appwrite Account service — auth operations (login, signup, sessions). */
export const account = new Account(client);

/** Appwrite Databases service — CRUD on collections & documents. */
export const databases = new Databases(client);

/** Appwrite Storage service — file uploads, downloads, previews. */
export const storage = new Storage(client);

export { client };
