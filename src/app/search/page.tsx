import type { Metadata } from "next";
import { SearchPageClient } from "./SearchPageClient";

type SearchPageProps = {
    searchParams?: { [key: string]: string | string[] | undefined };
};

export function generateMetadata({ searchParams }: SearchPageProps): Metadata {
    const location = typeof searchParams?.location === "string" ? searchParams.location : "";
    const title = location ? `Search results in ${location} | Tourly` : "Search results | Tourly";
    const description = location
        ? `Browse stays, transport, and guides in ${location}. Compare top-rated options and plan your trip with Tourly.`
        : "Browse stays, transport, and guides. Compare top-rated options and plan your trip with Tourly.";

    return {
        title,
        description,
        alternates: {
            canonical: "/search",
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default function SearchPage() {
    return <SearchPageClient />;
}
