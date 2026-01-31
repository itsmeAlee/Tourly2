import { getAllConversations } from '@/data/mockMessages';
import { InboxList } from '@/components/inbox/InboxList';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Inbox | Tourly',
    description: 'View and manage your conversations with service providers.',
    robots: {
        index: false, // Don't index personal inbox pages
        follow: false,
    },
};

export default function InboxPage() {
    const conversations = getAllConversations();

    return <InboxList conversations={conversations} />;
}
