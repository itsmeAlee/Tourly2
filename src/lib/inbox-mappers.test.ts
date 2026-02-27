import { describe, it } from 'node:test';
import assert from 'node:assert';
import { mapConversationToInboxItem } from './inbox-mappers';
import type { ConversationWithParticipants } from '@/types/conversation.types';

// Helper to create a mock conversation
function createMockConversation(overrides: Partial<ConversationWithParticipants> = {}): ConversationWithParticipants {
    return {
        $id: 'conv_123',
        listing_id: 'list_123',
        tourist_id: 'tourist_123',
        provider_id: 'provider_123',
        created_at: '2023-01-01T00:00:00.000Z',
        last_message: 'Hello there',
        last_message_at: '2023-01-02T10:00:00.000Z',
        tourist_unread: 2,
        provider_unread: 0,
        tourist: {
            id: 'tourist_123',
            name: 'John Tourist',
            avatar_url: 'avatar_tourist',
        },
        provider: {
            id: 'provider_123',
            name: 'Jane Provider',
            avatar_url: 'avatar_provider',
        },
        listing_title: 'Awesome Tour',
        $collectionId: 'conversations',
        $databaseId: 'main_db',
        $createdAt: '2023-01-01T00:00:00.000Z',
        $updatedAt: '2023-01-02T10:00:00.000Z',
        $permissions: [],
        ...overrides,
    } as ConversationWithParticipants; // Casting because we're mocking
}

describe('mapConversationToInboxItem', () => {

    describe('When current user is the Tourist', () => {
        const currentUserId = 'tourist_123';
        const conversation = createMockConversation({
            tourist_unread: 3,
            provider_unread: 0,
        });
        const result = mapConversationToInboxItem(conversation, currentUserId);

        it('should identify the Provider as the other participant', () => {
            assert.strictEqual(result.otherParticipantName, 'Jane Provider');
            assert.strictEqual(result.otherParticipantAvatar, 'avatar_provider');
        });

        it('should use tourist_unread count', () => {
            assert.strictEqual(result.unreadCount, 3);
        });

        it('should map common fields correctly', () => {
            assert.strictEqual(result.id, 'conv_123');
            assert.strictEqual(result.lastMessage, 'Hello there');
            assert.strictEqual(result.lastMessageAt, '2023-01-02T10:00:00.000Z');
            assert.strictEqual(result.listingTitle, 'Awesome Tour');
        });
    });

    describe('When current user is the Provider', () => {
        const currentUserId = 'provider_123';
        const conversation = createMockConversation({
            tourist_unread: 0,
            provider_unread: 5,
        });
        const result = mapConversationToInboxItem(conversation, currentUserId);

        it('should identify the Tourist as the other participant', () => {
            assert.strictEqual(result.otherParticipantName, 'John Tourist');
            assert.strictEqual(result.otherParticipantAvatar, 'avatar_tourist');
        });

        it('should use provider_unread count', () => {
            assert.strictEqual(result.unreadCount, 5);
        });
    });

    describe('Edge Cases', () => {
        it('should handle missing last_message and last_message_at', () => {
            const conversation = createMockConversation({
                last_message: undefined,
                last_message_at: undefined,
                $createdAt: '2023-01-01T00:00:00.000Z',
            });
            const result = mapConversationToInboxItem(conversation, 'tourist_123');

            assert.strictEqual(result.lastMessage, '');
            assert.strictEqual(result.lastMessageAt, '2023-01-01T00:00:00.000Z'); // Fallback to createdAt
        });

        it('should handle missing other participant data (e.g. deleted user)', () => {
            const conversation = createMockConversation({
                provider: undefined, // Provider deleted/missing
            });
            // User is tourist, so "other" is provider
            const result = mapConversationToInboxItem(conversation, 'tourist_123');

            assert.strictEqual(result.otherParticipantName, 'Unknown');
            assert.strictEqual(result.otherParticipantAvatar, '');
        });

        it('should handle missing other participant name', () => {
             const conversation = createMockConversation({
                provider: { id: 'p1', name: undefined as unknown as string }, // Invalid state but possible
            });
             const result = mapConversationToInboxItem(conversation, 'tourist_123');
             assert.strictEqual(result.otherParticipantName, 'Unknown');
        });
    });
});
