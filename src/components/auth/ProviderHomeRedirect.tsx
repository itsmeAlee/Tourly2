"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export function ProviderHomeRedirect() {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && isAuthenticated && user?.role === "provider") {
            router.replace("/provider/dashboard");
        }
    }, [isLoading, isAuthenticated, user, router]);

    return null;
}
