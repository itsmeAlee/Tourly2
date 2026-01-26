"use client";

import { useState, useEffect, useRef, RefObject } from "react";

interface UseSearchVisibilityReturn {
    isSearchHidden: boolean;
    searchWidgetRef: RefObject<HTMLDivElement>;
}

/**
 * Hook to detect when the Hero Search Widget scrolls out of view.
 * Uses Intersection Observer for efficient scroll detection.
 */
export function useSearchVisibility(): UseSearchVisibilityReturn {
    const [isSearchHidden, setIsSearchHidden] = useState(false);
    const searchWidgetRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = searchWidgetRef.current;
        if (!element) return;

        // Create an Intersection Observer
        // When the bottom of the search widget crosses the top of the viewport,
        // isIntersecting will become false
        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                // If the element is NOT intersecting (not visible), search is hidden
                setIsSearchHidden(!entry.isIntersecting);
            },
            {
                // rootMargin: negative top margin means we detect when element
                // is completely above the viewport
                rootMargin: "-64px 0px 0px 0px", // Account for navbar height
                threshold: 0, // Trigger as soon as any part leaves/enters
            }
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, []);

    return {
        isSearchHidden,
        searchWidgetRef,
    };
}
