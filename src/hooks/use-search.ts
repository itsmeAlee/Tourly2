"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { searchListings, getTopListings } from "@/services/listing.service";
import type { ListingDocument, ListingType } from "@/types/listing.types";

// ─── Types ──────────────────────────────────────────────

export interface SearchParams {
    /** Accepts both Appwrite types (stay/guide) and URL types (stays/guides). */
    type?: string;
    location?: string;
    region?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: number;
}

export interface UseSearchReturn {
    results: ListingDocument[];
    isLoading: boolean;
    error: string | null;
    totalCount: number;
    refetch: () => void;
}

// ─── Hook ───────────────────────────────────────────────

/**
 * Custom hook for searching Appwrite listings with debounce.
 *
 * - Debounces calls by 400ms to avoid spamming Appwrite on every keystroke
 * - Falls back to `getTopListings()` when no search query is provided
 * - Manages loading, error, and result state internally
 */
export function useSearch(params: SearchParams): UseSearchReturn {
    const [results, setResults] = useState<ListingDocument[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalCount, setTotalCount] = useState(0);

    // Track the latest params to avoid stale closure issues
    const paramsRef = useRef(params);
    paramsRef.current = params;

    // Debounce timer reference
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const fetchResults = useCallback(async () => {
        const { type, location, region } = paramsRef.current;

        setIsLoading(true);
        setError(null);

        try {
            let docs: ListingDocument[];

            // Map the URL's ServiceType to Appwrite's ListingType
            const listingType = mapServiceToListingType(type);

            if (location && location.trim().length > 0) {
                // Full-text search when user provides a location/query
                docs = await searchListings(location.trim(), listingType, region);
            } else {
                // No search query — show top listings for the selected type
                docs = await getTopListings(listingType ?? "stay", 20);
            }

            setResults(docs);
            setTotalCount(docs.length);
        } catch (err) {
            console.error("[useSearch] Fetch failed:", err);
            setError("Failed to load results. Please try again.");
            setResults([]);
            setTotalCount(0);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Debounced effect: refetch whenever params change
    useEffect(() => {
        // Clear any pending debounce
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
            fetchResults();
        }, 400);

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [params.type, params.location, params.region, fetchResults]);

    const refetch = useCallback(() => {
        fetchResults();
    }, [fetchResults]);

    return { results, isLoading, error, totalCount, refetch };
}

// ─── Helpers ────────────────────────────────────────────

/** Maps the URL's `type` param (stays/transport/guides) to ListingType. */
function mapServiceToListingType(
    type?: string
): ListingType | undefined {
    switch (type) {
        case "stays":
        case "stay":
            return "stay";
        case "transport":
            return "transport";
        case "guides":
        case "guide":
            return "guide";
        default:
            return undefined;
    }
}
