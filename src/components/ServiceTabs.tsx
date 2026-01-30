"use client";

import React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Bed, Car, Users, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Service type definitions (AI Trip Planner moved to Navbar)
export type ServiceType = "stays" | "transport" | "guides";

interface ServiceTab {
    id: ServiceType;
    label: string;
    shortLabel: string;
    icon: LucideIcon;
    searchType: string; // URL parameter value
}

// Note: AI Trip Planner removed - TripAI is now a standalone link in the Navbar right section
export const serviceTabs: ServiceTab[] = [
    { id: "stays", label: "Stays", shortLabel: "Stays", icon: Bed, searchType: "stays" },
    { id: "transport", label: "Transport", shortLabel: "Transport", icon: Car, searchType: "transport" },
    { id: "guides", label: "Guides", shortLabel: "Guides", icon: Users, searchType: "guides" },
];

interface ServiceTabsProps {
    variant?: "pills" | "underline" | "cards";
    showIcons?: boolean;
    className?: string;
    onTabClick?: (type: ServiceType) => void; // Optional callback for local state changes
}

export function ServiceTabs({
    variant = "pills",
    showIcons = true,
    className,
    onTabClick,
}: ServiceTabsProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Prefetch the search route on idle to avoid first-interaction stalls
    React.useEffect(() => {
        const prefetchSearch = () => {
            router.prefetch("/search");
        };

        if (typeof window !== "undefined" && "requestIdleCallback" in window) {
            const id = (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback?.(prefetchSearch);
            return () => {
                if (typeof id === "number") {
                    (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback?.(id);
                }
            };
        }

        const timeoutId = window.setTimeout(prefetchSearch, 200);
        return () => window.clearTimeout(timeoutId);
    }, [router]);

    // Determine active tab from URL
    const urlType = searchParams.get("type");
    const isSearchPage = pathname === "/search";
    const isHomePage = pathname === "/";

    // Context-aware active state:
    // Priority 1: URL Query Param (Explicit user selection)
    // Priority 2: Pathname context (e.g. /transport/123)
    // Priority 3: Default to "Stays"
    const getIsActive = (tab: ServiceTab): boolean => {
        // 0. Home Page Exception
        if (isHomePage) return false;

        // 1. Explicit Query Param
        if (urlType) {
            return tab.searchType === urlType;
        }

        // 2. Pathname Context (Persistence across navigation)
        if (pathname?.includes("/transport")) return tab.id === "transport";
        if (pathname?.includes("/guides")) return tab.id === "guides";
        if (pathname?.includes("/stays")) return tab.id === "stays";

        // 3. Default Fallback
        return tab.id === "stays";
    };

    // Handle tab click - navigate to search page with preserved params
    const handleTabClick = (tab: ServiceTab) => {
        // Preserve existing search params but update type
        const params = new URLSearchParams(searchParams.toString());
        params.set("type", tab.searchType);

        // Navigate to search page
        router.push(`/search?${params.toString()}`);

        // Optional callback for components that need local state updates
        onTabClick?.(tab.id);
    };

    // Render based on variant
    if (variant === "underline") {
        return (
            <div className={cn("flex items-center gap-2 md:gap-4", className)}>
                {serviceTabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = getIsActive(tab);

                    return (
                        <button
                            key={tab.id}
                            onClick={() => handleTabClick(tab)}
                            className={cn(
                                "relative flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 text-sm font-medium transition-colors duration-200 group",
                                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {showIcons && <Icon className="w-4 h-4" />}
                            <span>{tab.shortLabel}</span>
                            {/* Underline indicator */}
                            <span
                                className={cn(
                                    "absolute bottom-0 left-1 right-1 md:left-2 md:right-2 h-[2px] bg-primary transition-transform duration-200 origin-center",
                                    isActive ? "scale-x-100" : "scale-x-0",
                                    "group-hover:scale-x-100"
                                )}
                            />
                        </button>
                    );
                })}
            </div>
        );
    }

    if (variant === "cards") {
        return (
            <div className={cn("flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory", className)}>
                {serviceTabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = getIsActive(tab);

                    return (
                        <button
                            key={tab.id}
                            onClick={() => handleTabClick(tab)}
                            className={cn(
                                "flex flex-col items-center justify-center min-w-[72px] px-3 py-3 rounded-xl transition-all snap-start",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-md"
                                    : "bg-background text-muted-foreground hover:bg-muted"
                            )}
                        >
                            <Icon className="w-5 h-5 mb-1.5" />
                            <span className="text-xs font-medium whitespace-nowrap">{tab.shortLabel}</span>
                        </button>
                    );
                })}
            </div>
        );
    }

    // Default: pills variant
    return (
        <div className={cn("flex items-center gap-1", className)}>
            {serviceTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = getIsActive(tab);

                return (
                    <button
                        key={tab.id}
                        onClick={() => handleTabClick(tab)}
                        className={cn(
                            "relative flex items-center gap-2 px-3 py-1.5 text-sm font-medium transition-colors duration-200 group",
                            isActive
                                ? "text-primary"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {showIcons && <Icon className="w-4 h-4" />}
                        <span>{tab.shortLabel}</span>
                        <span
                            className={cn(
                                "absolute bottom-0 left-2 right-2 h-[2px] bg-primary transition-transform duration-200 origin-center",
                                isActive ? "scale-x-100" : "scale-x-0",
                                "group-hover:scale-x-100"
                            )}
                        />
                    </button>
                );
            })}
        </div>
    );
}
