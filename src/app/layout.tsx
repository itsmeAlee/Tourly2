import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const dmSans = DM_Sans({
    subsets: ["latin"],
    variable: "--font-dm-sans",
    weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
    title: "Tourly - Journey to the Roof of the World",
    description:
        "Discover the majestic valleys, glaciers, and culture of Gilgit-Baltistan. Your gateway to the North starts here.",
    robots: {
        index: true,
        follow: true,
    },
    openGraph: {
        title: "Tourly - Journey to the Roof of the World",
        description:
            "Discover the majestic valleys, glaciers, and culture of Gilgit-Baltistan. Your gateway to the North starts here.",
        type: "website",
        siteName: "Tourly",
    },
    twitter: {
        card: "summary",
        title: "Tourly - Journey to the Roof of the World",
        description:
            "Discover the majestic valleys, glaciers, and culture of Gilgit-Baltistan. Your gateway to the North starts here.",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${dmSans.variable} font-sans`}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
