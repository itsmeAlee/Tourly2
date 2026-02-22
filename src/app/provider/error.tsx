"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ProviderError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        if (process.env.NODE_ENV !== "production") {
            console.error("[ProviderError]", {
                message: error?.message,
                digest: error?.digest,
            });
        }
    }, [error]);

    return (
        <div className="flex h-[50vh] items-center justify-center p-4">
            <Card className="max-w-md w-full rounded-2xl border-red-100 shadow-sm">
                <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
                    <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                        <AlertCircle className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-foreground">Something went wrong!</h2>
                        <p className="text-sm text-muted-foreground mt-2">
                            An unexpected error occurred while loading this page.
                        </p>
                    </div>
                    <Button
                        onClick={() => reset()}
                        variant="default"
                        className="rounded-xl w-full"
                    >
                        Try again
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
