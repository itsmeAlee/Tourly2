import { SettingsPage } from "@/components/account/SettingsPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Settings | Tourly",
    description: "Manage your account settings, preferences, and notifications.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function SettingsRoute() {
    return <SettingsPage />;
}
