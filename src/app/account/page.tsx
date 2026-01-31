import { AccountHub } from "@/components/account/AccountHub";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Account | Tourly",
    description: "Manage your Tourly account, view messages, and access settings.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function AccountPage() {
    return <AccountHub />;
}
