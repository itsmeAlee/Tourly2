import test from 'node:test';
import assert from 'node:assert';
import { AppwriteException } from 'appwrite';
import { mapAuthError } from './auth-errors.ts';

test('mapAuthError handling', async (t) => {
    await t.test('handles AppwriteException 401 (Unauthorized)', () => {
        const error = new AppwriteException('Invalid credentials', 401);
        assert.strictEqual(mapAuthError(error), "Invalid email or password.");
    });

    await t.test('handles AppwriteException 403 (Forbidden)', () => {
        const error = new AppwriteException('Access denied', 403);
        assert.strictEqual(mapAuthError(error), "We’re having trouble connecting. Please try again later.");
    });

    await t.test('handles AppwriteException 409 (Conflict)', () => {
        const error = new AppwriteException('User already exists', 409);
        assert.strictEqual(mapAuthError(error), "An account with this email already exists.");
    });

    await t.test('handles AppwriteException 429 (Too Many Requests)', () => {
        const error = new AppwriteException('Rate limit exceeded', 429);
        assert.strictEqual(mapAuthError(error), "Too many attempts. Please wait and try again.");
    });

    await t.test('handles AppwriteException with unknown code', () => {
        const error = new AppwriteException('Internal error', 500);
        assert.strictEqual(mapAuthError(error), "We’re having trouble connecting. Please try again later.");
    });

    await t.test('handles TypeError "failed to fetch"', () => {
        const error = new TypeError('Failed to fetch');
        assert.strictEqual(mapAuthError(error), "We’re having trouble connecting. Please try again later.");
    });

    await t.test('handles other TypeError', () => {
        const error = new TypeError('Some other type error');
        assert.strictEqual(mapAuthError(error), "We’re having trouble connecting. Please try again later.");
    });

    await t.test('handles generic Error', () => {
        const error = new Error('Generic error');
        assert.strictEqual(mapAuthError(error), "We’re having trouble connecting. Please try again later.");
    });

    await t.test('handles non-error objects', () => {
        assert.strictEqual(mapAuthError({ message: 'not an error' }), "We’re having trouble connecting. Please try again later.");
    });

    await t.test('handles null/undefined', () => {
        assert.strictEqual(mapAuthError(null), "We’re having trouble connecting. Please try again later.");
        assert.strictEqual(mapAuthError(undefined), "We’re having trouble connecting. Please try again later.");
    });

    await t.test('handles strings', () => {
        assert.strictEqual(mapAuthError("string error"), "We’re having trouble connecting. Please try again later.");
    });
});
