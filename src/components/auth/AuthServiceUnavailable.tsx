"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AuthServiceUnavailable() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-lg p-8 text-center">
                <h1 className="text-2xl font-bold text-foreground mb-3">
                    Service Temporarily Unavailable
                </h1>
                <p className="text-muted-foreground mb-6">
                    We’re having trouble connecting right now. Please try again later.
                </p>
                <Link href="/">
                    <Button className="w-full h-12 text-base font-semibold rounded-xl">
                        Back to Home
                    </Button>
                </Link>
            </div>
        </div>
    );
}
