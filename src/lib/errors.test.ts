import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isAppwrite404 } from './errors.ts';

describe('isAppwrite404', () => {
    it('should return true for an object with code 404', () => {
        const error = { code: 404, message: 'Not found' };
        assert.strictEqual(isAppwrite404(error), true);
    });

    it('should return false for null', () => {
        assert.strictEqual(isAppwrite404(null), false);
    });

    it('should return false for undefined', () => {
        assert.strictEqual(isAppwrite404(undefined), false);
    });

    it('should return false for a number', () => {
        assert.strictEqual(isAppwrite404(404), false);
    });

    it('should return false for a string', () => {
        assert.strictEqual(isAppwrite404('404'), false);
    });

    it('should return false for an object with a different code', () => {
        const error = { code: 500, message: 'Server error' };
        assert.strictEqual(isAppwrite404(error), false);
    });

    it('should return false for an empty object', () => {
        const error = {};
        assert.strictEqual(isAppwrite404(error), false);
    });

    it('should return false for an object without code property', () => {
        const error = { message: 'Error' };
        assert.strictEqual(isAppwrite404(error), false);
    });
});
