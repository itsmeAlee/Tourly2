import { test } from 'node:test';
import assert from 'node:assert';
import { formatMessageDate } from './format-time.ts';

const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

test('formatMessageDate', async (t) => {

    await t.test('returns "Today" for current date', () => {
        const now = new Date();
        assert.strictEqual(formatMessageDate(now), 'Today');
        assert.strictEqual(formatMessageDate(now.toISOString()), 'Today');
    });

    await t.test('returns "Yesterday" for previous day', () => {
        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);

        assert.strictEqual(formatMessageDate(yesterday), 'Yesterday');
        assert.strictEqual(formatMessageDate(yesterday.toISOString()), 'Yesterday');
    });

    await t.test('returns "Mon DD" for same year (older than yesterday)', () => {
        const now = new Date();
        let targetDate = new Date(now);
        targetDate.setDate(now.getDate() - 2);

        // Edge case: If going back 2 days lands in the previous year (e.g., today is Jan 1 or 2),
        // we pick a date later in the current year instead (e.g., Dec 31) to ensure we test the "same year" format.
        if (targetDate.getFullYear() !== now.getFullYear()) {
            targetDate = new Date(now.getFullYear(), 11, 31); // Dec 31

            // If today happens to be Dec 31, ensure targetDate is not Today.
            if (targetDate.toDateString() === now.toDateString()) {
                // If today is Dec 31, then Jan 1 is in the same year and not Today/Yesterday.
                targetDate = new Date(now.getFullYear(), 0, 1);
            }
        }

        const expected = `${months[targetDate.getMonth()]} ${targetDate.getDate()}`;
        assert.strictEqual(formatMessageDate(targetDate), expected);
    });

    await t.test('returns "Mon DD, YYYY" for previous year', () => {
        const now = new Date();
        const lastYear = new Date(now);
        lastYear.setFullYear(now.getFullYear() - 1);

        const expected = `${months[lastYear.getMonth()]} ${lastYear.getDate()}, ${lastYear.getFullYear()}`;
        assert.strictEqual(formatMessageDate(lastYear), expected);
        assert.strictEqual(formatMessageDate(lastYear.toISOString()), expected);
    });
});
