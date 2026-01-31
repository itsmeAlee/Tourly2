import { getConversationById, getAllConversations } from '@/data/mockMessages';
import { ChatRoom } from '@/components/inbox/ChatRoom';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

type Props = {
    params: { threadId: string } | Promise<{ threadId: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await Promise.resolve(props.params);
    const conversation = getConversationById(params.threadId);

    if (!conversation) {
        return {
            title: 'Conversation Not Found',
        };
    }

    return {
        title: `Chat with ${conversation.providerName} | Tourly`,
        description: `Conversation about ${conversation.listingTitle}`,
        robots: {
            index: false,
            follow: false,
        },
    };
}

export default async function ChatPage(props: Props) {
    const params = await Promise.resolve(props.params);
    const conversation = getConversationById(params.threadId);

    if (!conversation) {
        notFound();
    }

    return <ChatRoom conversation={conversation} />;
}
