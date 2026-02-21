"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export function ProviderGuard({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace("/login?next=/provider/dashboard");
        } else if (!isLoading && isAuthenticated && user?.role !== "provider") {
            router.replace("/");
        }
    }, [isLoading, isAuthenticated, user, router]);

    if (!mounted || isLoading || !isAuthenticated || user?.role !== "provider") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return <>{children}</>;
}
