import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isValidRedirect } from './security.ts';

describe('isValidRedirect', () => {
    it('should return true for valid relative paths', () => {
        assert.strictEqual(isValidRedirect('/dashboard'), true);
        assert.strictEqual(isValidRedirect('/'), true);
        assert.strictEqual(isValidRedirect('/login?next=/'), true);
        assert.strictEqual(isValidRedirect('/foo/bar/baz'), true);
    });

    it('should return false for absolute URLs', () => {
        assert.strictEqual(isValidRedirect('https://google.com'), false);
        assert.strictEqual(isValidRedirect('http://evil.com'), false);
        assert.strictEqual(isValidRedirect('ftp://example.com'), false);
    });

    it('should return false for protocol-relative URLs', () => {
        assert.strictEqual(isValidRedirect('//google.com'), false);
        assert.strictEqual(isValidRedirect('//evil.com/x'), false);
    });

    it('should return false for backslash trick', () => {
        // Use double backslash in string literal to represent single backslash
        assert.strictEqual(isValidRedirect('/\\google.com'), false);
    });

    it('should return false for empty or non-string inputs', () => {
        assert.strictEqual(isValidRedirect(''), false);
        assert.strictEqual(isValidRedirect(null), false);
        assert.strictEqual(isValidRedirect(undefined), false);
    });

    it('should return false for URLs with whitespace', () => {
        assert.strictEqual(isValidRedirect('/ foo'), false);
        assert.strictEqual(isValidRedirect('/foo bar'), false);
    });

    it('should handle search params correctly', () => {
        // Should be valid relative path
        assert.strictEqual(isValidRedirect('/login?foo=bar'), true);
    });
});
