import { test } from 'node:test';
import assert from 'node:assert';
import { listingTypeToCategory } from './category-mapper.ts';

test('listingTypeToCategory maps correctly', async (t) => {
    await t.test('maps "stay" to "hotel"', () => {
        assert.strictEqual(listingTypeToCategory('stay'), 'hotel');
    });

    await t.test('maps "transport" to "tour-operator"', () => {
        assert.strictEqual(listingTypeToCategory('transport'), 'tour-operator');
    });

    await t.test('maps "guide" to "guide"', () => {
        assert.strictEqual(listingTypeToCategory('guide'), 'guide');
    });
});
