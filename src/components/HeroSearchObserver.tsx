"use client";

import { useEffect } from "react";
import { useSearch } from "@/contexts/SearchContext";

export function HeroSearchObserver({ children }: { children: React.ReactNode }) {
    const { searchWidgetRef, setIsSearchHidden } = useSearch();

    // Set up Intersection Observer to detect when search widget is out of view
    useEffect(() => {
        const element = searchWidgetRef.current;
        if (!element) return;

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
    }, [searchWidgetRef, setIsSearchHidden]);

    return (
        <div ref={searchWidgetRef}>
            {children}
        </div>
    );
}
