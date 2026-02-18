import { Client, Users, Databases, Storage } from "node-appwrite";

/**
 * Server-side Appwrite SDK singleton.
 *
 * Uses the secret API key — NEVER expose this client to the browser.
 * Use this in Server Actions, API Routes, and server-only utilities.
 *
 * @see https://appwrite.io/docs/sdks#server
 */
const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_API_KEY!);

/** Appwrite Users service — admin-level user management. */
export const users = new Users(client);

/** Appwrite Databases service — CRUD on collections & documents (server-side). */
export const databases = new Databases(client);

/** Appwrite Storage service — file management (server-side). */
export const storage = new Storage(client);

export { client };
