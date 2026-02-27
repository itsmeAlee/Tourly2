import { describe, it } from 'node:test';
import assert from 'node:assert';
import { formatTimeAgo } from './format-time.ts';

describe('formatTimeAgo', () => {
    const MOCK_NOW = new Date('2024-06-15T12:00:00Z');

    it('returns empty string if input is undefined', () => {
        assert.strictEqual(formatTimeAgo(undefined), '');
    });

    it('returns "now" if less than 60 seconds ago', (t) => {
        t.mock.timers.enable({ now: MOCK_NOW });
        const date = new Date(MOCK_NOW.getTime() - 30 * 1000);
        assert.strictEqual(formatTimeAgo(date), 'now');
    });

    it('returns "Xm" if less than 60 minutes ago', (t) => {
        t.mock.timers.enable({ now: MOCK_NOW });
        const date = new Date(MOCK_NOW.getTime() - 15 * 60 * 1000); // 15 mins ago
        assert.strictEqual(formatTimeAgo(date), '15m');
    });

    it('returns "Xh" if less than 24 hours ago', (t) => {
        t.mock.timers.enable({ now: MOCK_NOW });
        const date = new Date(MOCK_NOW.getTime() - 5 * 60 * 60 * 1000); // 5 hours ago
        assert.strictEqual(formatTimeAgo(date), '5h');
    });

    it('returns "Yesterday" if date was yesterday', (t) => {
        t.mock.timers.enable({ now: MOCK_NOW });
        // Set date to yesterday same time (24h ago)
        const date = new Date(MOCK_NOW);
        date.setDate(date.getDate() - 1);
        assert.strictEqual(formatTimeAgo(date), 'Yesterday');
    });

    it('returns "Month Day" if older than yesterday but same year', (t) => {
        t.mock.timers.enable({ now: MOCK_NOW });
        // June 13, 2024 (2 days ago)
        const date = new Date(MOCK_NOW);
        date.setDate(date.getDate() - 2);

        // June is index 5 -> "Jun"
        // Day 13
        assert.strictEqual(formatTimeAgo(date), 'Jun 13');
    });

    it('returns "Month Day, Year" if different year', (t) => {
        t.mock.timers.enable({ now: MOCK_NOW });
        // June 15, 2023
        const date = new Date('2023-06-15T12:00:00Z');
        assert.strictEqual(formatTimeAgo(date), 'Jun 15, 2023');
    });

    it('handles string input', (t) => {
        t.mock.timers.enable({ now: MOCK_NOW });
        const dateStr = new Date(MOCK_NOW.getTime() - 10 * 60 * 1000).toISOString();
        assert.strictEqual(formatTimeAgo(dateStr), '10m');
    });
});
