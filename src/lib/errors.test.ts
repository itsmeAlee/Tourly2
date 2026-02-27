import { test } from 'node:test';
import assert from 'node:assert';
import { isNotFound } from './errors.ts';

test('isNotFound returns true for an object with code 404', () => {
    const error = { code: 404, message: 'Not Found' };
    assert.strictEqual(isNotFound(error), true);
});

test('isNotFound returns false for null', () => {
    assert.strictEqual(isNotFound(null), false);
});

test('isNotFound returns false for undefined', () => {
    assert.strictEqual(isNotFound(undefined), false);
});

test('isNotFound returns false for non-object', () => {
    assert.strictEqual(isNotFound('error'), false);
    assert.strictEqual(isNotFound(123), false);
});

test('isNotFound returns false for object without code', () => {
    const error = { message: 'Error' };
    assert.strictEqual(isNotFound(error), false);
});

test('isNotFound returns false for object with different code', () => {
    const error = { code: 500, message: 'Server Error' };
    assert.strictEqual(isNotFound(error), false);
});

test('isNotFound returns false for AppError instance', () => {
    // Mimicking AppError structure slightly just for shape check
    // In real usage, AppError wraps codes into string constants like "NOT_FOUND"
    // but the original check was looking for the raw appwrite error shape { code: 404 }
    const error = { name: 'AppError', code: 'NOT_FOUND' };
    assert.strictEqual(isNotFound(error), false);
});
