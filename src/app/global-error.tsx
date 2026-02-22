
'use client';

import { useEffect } from "react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("[GlobalError]", {
            message: error?.message,
            digest: error?.digest,
        });
    }, [error]);

    return (
        <html>
            <body>
                <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Critical Application Error</h2>
                    <p className="text-gray-600 mb-6 max-w-md">
                        We hit an unexpected error. Please try again.
                    </p>
                    <button
                        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                        onClick={() => reset()}
                    >
                        Try again
                    </button>
                </div>
            </body>
        </html>
    );
}
