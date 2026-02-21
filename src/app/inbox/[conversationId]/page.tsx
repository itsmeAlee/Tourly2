import type { Metadata } from "next";
import { ChatScreen } from "@/components/inbox/ChatScreen";

export const metadata: Metadata = {
    title: "Conversation | Tourly",
    robots: {
        index: false,
        follow: false,
    },
};

type Props = {
    params: { conversationId: string } | Promise<{ conversationId: string }>;
};

export default async function ChatPage(props: Props) {
    const params = await Promise.resolve(props.params);

    return <ChatScreen conversationId={params.conversationId} />;
}
