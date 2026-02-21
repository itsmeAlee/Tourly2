import { Client, Account, Databases, Storage } from "appwrite";

/**
 * Client-side Appwrite SDK singleton.
 *
 * Use this in Client Components (e.g., AuthContext, hooks)
 * where browser-based authentication is required.
 *
 * @see https://appwrite.io/docs/sdks#client
 */

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

if (!ENDPOINT || !PROJECT_ID) {
    console.warn(
        "[Appwrite] Missing env vars NEXT_PUBLIC_APPWRITE_ENDPOINT or NEXT_PUBLIC_APPWRITE_PROJECT_ID. " +
        "Appwrite calls will fail until these are set in .env.local."
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
