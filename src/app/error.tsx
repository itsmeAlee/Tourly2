
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        if (process.env.NODE_ENV !== "production") {
            console.error("[AppErrorBoundary]", {
                message: error?.message,
                digest: error?.digest,
            });
        }
    }, [error]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong!</h2>
            <p className="text-gray-600 mb-8 max-w-md">
                We encountered an unexpected error while loading this page. Please try again.
            </p>
            <div className="flex gap-4">
                <Button
                    onClick={() => reset()}
                    variant="outline"
                >
                    Try again
                </Button>
                <Button
                    onClick={() => window.location.href = '/'}
                    className="bg-primary text-white"
                >
                    Go Home
                </Button>
            </div>
        </div>
    );
}
