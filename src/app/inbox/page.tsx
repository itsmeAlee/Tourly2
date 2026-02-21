import type { Metadata } from "next";
import { InboxPageClient } from "@/components/inbox/InboxPageClient";

export const metadata: Metadata = {
    title: "Inbox | Tourly",
    description: "View and manage your conversations with service providers.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function InboxPage() {
    return <InboxPageClient />;
}
