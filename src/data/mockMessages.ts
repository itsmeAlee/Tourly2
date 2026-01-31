// Mock data for conversations and messages
export interface Message {
    id: string;
    threadId: string;
    senderId: string;
    senderType: 'user' | 'provider';
    content: string;
    timestamp: string;
    isRead: boolean;
}

export interface Conversation {
    id: string;
    providerId: string;
    providerName: string;
    providerAvatar: string;
    listingId: string;
    listingTitle: string;
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
    messages: Message[];
}

// Sample mock data
export const MOCK_CONVERSATIONS: Conversation[] = [
    {
        id: 'thread-1',
        providerId: 'provider-1',
        providerName: 'Ahmad Khan',
        providerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        listingId: 'stay-1',
        listingTitle: 'Mountain View Retreat - Hunza',
        lastMessage: 'Thanks for your inquiry! The cabin is available for those dates.',
        lastMessageTime: '2h ago',
        unreadCount: 1,
        messages: [
            {
                id: 'msg-1',
                threadId: 'thread-1',
                senderId: 'user-1',
                senderType: 'user',
                content: "Hi! I'm interested in Mountain View Retreat. Is it available for Dec 15-20?",
                timestamp: '2:30 PM',
                isRead: true,
            },
            {
                id: 'msg-2',
                threadId: 'thread-1',
                senderId: 'provider-1',
                senderType: 'provider',
                content: "Hello! Thank you for reaching out. Yes, the retreat is available for those dates. It's a beautiful time to visit Hunza!",
                timestamp: '2:35 PM',
                isRead: true,
            },
            {
                id: 'msg-3',
                threadId: 'thread-1',
                senderId: 'user-1',
                senderType: 'user',
                content: 'Great! How many guests can it accommodate?',
                timestamp: '2:40 PM',
                isRead: true,
            },
            {
                id: 'msg-4',
                threadId: 'thread-1',
                senderId: 'provider-1',
                senderType: 'provider',
                content: 'The retreat can comfortably accommodate up to 8 guests with 3 bedrooms and 4 beds.',
                timestamp: '2:45 PM',
                isRead: false,
            },
        ],
    },
    {
        id: 'thread-2',
        providerId: 'provider-2',
        providerName: 'Karim Transport Services',
        providerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
        listingId: 'transport-1',
        listingTitle: 'Toyota Prado 4x4 - Gilgit to Skardu',
        lastMessage: 'Yes, I can arrange pickup from Gilgit airport. What time does your flight land?',
        lastMessageTime: 'Yesterday',
        unreadCount: 0,
        messages: [
            {
                id: 'msg-5',
                threadId: 'thread-2',
                senderId: 'user-1',
                senderType: 'user',
                content: 'Hi! I need a vehicle for the Gilgit to Skardu route on Dec 16.',
                timestamp: '10:00 AM',
                isRead: true,
            },
            {
                id: 'msg-6',
                threadId: 'thread-2',
                senderId: 'provider-2',
                senderType: 'provider',
                content: 'Yes, I can arrange pickup from Gilgit airport. What time does your flight land?',
                timestamp: '10:30 AM',
                isRead: true,
            },
        ],
    },
    {
        id: 'thread-3',
        providerId: 'provider-3',
        providerName: 'Faisal Ahmed',
        providerAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100',
        listingId: 'guide-1',
        listingTitle: 'K2 Base Camp Trek Guide',
        lastMessage: 'The trek starts from Skardu and typically takes 14-16 days depending on weather.',
        lastMessageTime: 'Jan 28',
        unreadCount: 0,
        messages: [
            {
                id: 'msg-7',
                threadId: 'thread-3',
                senderId: 'user-1',
                senderType: 'user',
                content: "I'm planning a K2 Base Camp trek next summer. What's the itinerary like?",
                timestamp: '3:00 PM',
                isRead: true,
            },
            {
                id: 'msg-8',
                threadId: 'thread-3',
                senderId: 'provider-3',
                senderType: 'provider',
                content: 'The trek starts from Skardu and typically takes 14-16 days depending on weather. We follow the classic Baltoro Glacier route.',
                timestamp: '4:15 PM',
                isRead: true,
            },
        ],
    },
];

// Helper functions
export const getConversationById = (threadId: string): Conversation | undefined =>
    MOCK_CONVERSATIONS.find(c => c.id === threadId);

export const getConversationByListingAndProvider = (listingId: string, providerId: string): Conversation | undefined =>
    MOCK_CONVERSATIONS.find(c => c.listingId === listingId && c.providerId === providerId);

export const getAllConversations = (): Conversation[] => MOCK_CONVERSATIONS;

export const getUnreadConversations = (): Conversation[] =>
    MOCK_CONVERSATIONS.filter(c => c.unreadCount > 0);

export const getTotalUnreadCount = (): number =>
    MOCK_CONVERSATIONS.reduce((sum, c) => sum + c.unreadCount, 0);
