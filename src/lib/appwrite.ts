import { Client, Account, Databases, Storage } from "appwrite";

/**
 * Client-side Appwrite SDK singleton.
 *
 * Use this in Client Components (e.g., AuthContext, hooks)
 * where browser-based authentication is required.
 *
 * @see https://appwrite.io/docs/sdks#client
 */
const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

/** Appwrite Account service — auth operations (login, signup, sessions). */
export const account = new Account(client);

/** Appwrite Databases service — CRUD on collections & documents. */
export const databases = new Databases(client);

/** Appwrite Storage service — file uploads, downloads, previews. */
export const storage = new Storage(client);

export { client };
