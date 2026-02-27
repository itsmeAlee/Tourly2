"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getSavedListings, toggleSavedListing } from "@/services/saved.service";
import { useToast } from "@/components/ui/use-toast";

/**
 * Hook providing saved/wishlist state and toggle for any component.
 *
 * Fetches saved listing IDs on mount (once per session) and maintains
 * an in-memory Set for instant UI checks. Optimistic UI on toggle.
 *
 * @example
 * const { isSaved, toggleSaved, savedCount, isLoading } = useSaved();
 * <button onClick={() => toggleSaved("listingId123")}>
 *   <Heart className={isSaved("listingId123") ? "fill-red-500" : ""} />
 * </button>
 */
export function useSaved() {
    const { user, isAuthenticated } = useAuth();
    const { toast } = useToast();
    const router = useRouter();
    const pathname = usePathname();

    const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(false);
    const hasFetched = useRef(false);

    // Fetch saved listings on mount (once)
    useEffect(() => {
        if (!isAuthenticated || !user?.id || hasFetched.current) return;

        let cancelled = false;
        hasFetched.current = true;
        setIsLoading(true);

        getSavedListings(user.id)
            .then((ids) => {
                if (!cancelled) setSavedIds(new Set(ids));
            })
            .catch((err) => {
                console.error("[useSaved] Failed to fetch saved listings:", err);
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [isAuthenticated, user?.id]);

    /** Check if a listing is in the saved set. */
    const isSaved = useCallback(
        (listingId: string): boolean => savedIds.has(listingId),
        [savedIds]
    );

    /** Toggle saved state with optimistic UI. Redirects to login if not authenticated. */
    const toggleSaved = useCallback(
        async (listingId: string) => {
            if (!isAuthenticated || !user?.id) {
                router.push(`/login?next=${pathname}`);
                return;
            }

            // Optimistic update
            const wasSaved = savedIds.has(listingId);
            setSavedIds((prev) => {
                const next = new Set(prev);
                if (wasSaved) {
                    next.delete(listingId);
                } else {
                    next.add(listingId);
                }
                return next;
            });

            try {
                const result = await toggleSavedListing(user.id, listingId);
                // Sync with server truth (in case of race conditions)
                setSavedIds((prev) => {
                    const next = new Set(prev);
                    if (result.saved) {
                        next.add(listingId);
                    } else {
                        next.delete(listingId);
                    }
                    return next;
                });
            } catch {
                // Revert optimistic update
                setSavedIds((prev) => {
                    const next = new Set(prev);
                    if (wasSaved) {
                        next.add(listingId);
                    } else {
                        next.delete(listingId);
                    }
                    return next;
                });
                toast({
                    title: "Failed to update",
                    description: "Couldn't save this listing. Please try again.",
                    variant: "destructive",
                });
            }
        },
        [isAuthenticated, user?.id, savedIds, router, pathname, toast]
    );

    return {
        isSaved,
        toggleSaved,
        savedCount: savedIds.size,
        isLoading,
    };
}
