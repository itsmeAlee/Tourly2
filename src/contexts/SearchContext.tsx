"use client";

import { createContext, useContext, useState, useCallback, ReactNode, RefObject, useRef, useMemo } from "react";

// Define the tab types - must match SearchWidget
// Note: "AI Trip Planner" moved to Navbar as standalone "TripAI" link
const tabs = ["Stays", "Transport", "Guides"] as const;
export type TabType = (typeof tabs)[number];
export { tabs };

interface SearchContextType {
    // Active tab state
    activeTab: TabType;
    setActiveTab: (tab: TabType) => void;

    // Scroll visibility state
    isSearchHidden: boolean;
    setIsSearchHidden: (hidden: boolean) => void;

    // Reference to the search widget for scrolling
    searchWidgetRef: RefObject<HTMLDivElement>;

    // Function to scroll back to search and optionally switch tabs
    scrollToSearch: (tab?: TabType) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

interface SearchProviderProps {
    children: ReactNode;
}

export function SearchProvider({ children }: SearchProviderProps) {
    const [activeTab, setActiveTab] = useState<TabType>("Stays");
    const [isSearchHidden, setIsSearchHidden] = useState(false);
    const searchWidgetRef = useRef<HTMLDivElement>(null);

    const scrollToSearch = useCallback((tab?: TabType) => {
        // If a tab is specified, switch to it
        if (tab) {
            setActiveTab(tab);
        }

        // Smooth scroll to the search widget
        if (searchWidgetRef.current) {
            const headerOffset = 80; // Account for sticky header
            const elementPosition = searchWidgetRef.current.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            });

            // After scrolling, try to focus the first input in the widget
            setTimeout(() => {
                const firstInput = searchWidgetRef.current?.querySelector("input, textarea") as HTMLElement;
                if (firstInput) {
                    firstInput.focus();
                }
            }, 500); // Wait for scroll to complete
        }
    }, []);

    const value = useMemo(
        () => ({
            activeTab,
            setActiveTab,
            isSearchHidden,
            setIsSearchHidden,
            searchWidgetRef,
            scrollToSearch,
        }),
        [activeTab, isSearchHidden, scrollToSearch]
    );

    return (
        <SearchContext.Provider value={value}>
            {children}
        </SearchContext.Provider>
    );
}

export function useSearch() {
    const context = useContext(SearchContext);
    if (context === undefined) {
        throw new Error("useSearch must be used within a SearchProvider");
    }
    return context;
}
