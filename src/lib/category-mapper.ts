import type { ListingType } from "@/types/listing.types";
import type { ListingCategory } from "@/components/ListingCard";

// ─── Listing Type → Category Mapping ────────────────────

/** Maps service ListingType to the UI ListingCategory. */
export function listingTypeToCategory(type: ListingType): ListingCategory {
    switch (type) {
        case "stay":
            return "hotel";
        case "transport":
            return "tour-operator";
        case "guide":
            return "guide";
    }
}
