import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Page not found | Tourly",
    description: "The page you’re looking for could not be found.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">404</h1>
                <p className="text-xl text-muted-foreground mb-4">
                    Oops! Page not found
                </p>
                <Link
                    href="/"
                    className="text-primary hover:text-primary/80 underline"
                >
                    Return to Home
                </Link>
            </div>
        </div>
    );
}
