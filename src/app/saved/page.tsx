import type { Metadata } from "next";
import { SavedPage } from "@/components/account/SavedPage";

export const metadata: Metadata = {
    title: "Saved | Tourly",
    robots: { index: false, follow: false },
};

export default function SavedRoute() {
    return <SavedPage />;
}
