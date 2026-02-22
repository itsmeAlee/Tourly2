import { Client, Users, Databases, Storage } from "node-appwrite";

/**
 * Server-side Appwrite SDK singleton.
 *
 * Uses the secret API key — NEVER expose this client to the browser.
 * Use this in Server Actions, API Routes, and server-only utilities.
 *
 * @see https://appwrite.io/docs/sdks#server
 */
const endpoint =
    process.env.APPWRITE_ENDPOINT ?? process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId =
    process.env.APPWRITE_PROJECT_ID ?? process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;

if (!endpoint || !projectId || !apiKey) {
    console.warn(
        "[Appwrite Server] Missing APPWRITE_ENDPOINT/APPWRITE_PROJECT_ID/APPWRITE_API_KEY. Server-side privileged queries may fail and fall back to mock data."
    );
}

const client = new Client();
if (endpoint) client.setEndpoint(endpoint);
if (projectId) client.setProject(projectId);
if (apiKey) client.setKey(apiKey);

/** Appwrite Users service — admin-level user management. */
export const users = new Users(client);

/** Appwrite Databases service — CRUD on collections & documents (server-side). */
export const databases = new Databases(client);

/** Appwrite Storage service — file management (server-side). */
export const storage = new Storage(client);

export { client };
