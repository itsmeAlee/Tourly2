"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { SearchProvider } from "@/contexts/SearchContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
    // Create QueryClient instance inside component to avoid sharing state between requests
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <SearchProvider>
                    <TooltipProvider>
                        {children}
                        <Toaster />
                        <Sonner />
                    </TooltipProvider>
                </SearchProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}

