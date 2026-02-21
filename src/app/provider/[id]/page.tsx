import { getProviderById } from "@/services/provider.service";
import { getListingsByProvider } from "@/services/listing.service";
import { getListingImageUrls } from "@/services/storage.service";
import {
    mapProviderToPublicProfile,
    mapListingWithDetailsToListing,
} from "@/lib/mappers";
import { getListingById } from "@/services/listing.service";
import { ProviderProfile } from "@/components/provider/ProviderProfile";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAvatarUrl } from "@/lib/storage";
import type { Listing } from "@/components/listing/types";

type Props = {
    params: { id: string } | Promise<{ id: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await Promise.resolve(props.params);

    try {
        const provider = await getProviderById(params.id);

        if (!provider) {
            return { title: "Provider Not Found" };
        }

        const avatarUrl = provider.avatar_url
            ? getAvatarUrl(provider.avatar_url)
            : undefined;

        return {
            title: `${provider.business_name} | Tourly Provider`,
            description: `View all services by ${provider.business_name} in ${provider.region}.`,
            alternates: {
                canonical: `/provider/${provider.$id}`,
            },
            robots: { index: true, follow: true },
            openGraph: {
                title: `${provider.business_name} | Tourly Provider`,
                description: `View all services by ${provider.business_name} in ${provider.region}.`,
                type: "profile",
                images: avatarUrl ? [avatarUrl] : undefined,
            },
        };
    } catch {
        return { title: "Provider Not Found" };
    }
}

export default async function ProviderPage(props: Props) {
    const params = await Promise.resolve(props.params);

    // Fetch provider and their listings in PARALLEL
    const [provider, listings] = await Promise.all([
        getProviderById(params.id),
        getListingsByProvider(params.id, true), // onlyActive: true
    ]);

    if (!provider) {
        notFound();
    }

    // Map provider to public profile (strips phone)
    const publicProvider = mapProviderToPublicProfile(provider);

    // Map Appwrite ListingDocuments → component Listing type
    // We need full details for each listing for the provider profile cards
    const mappedListings: Listing[] = await Promise.all(
        listings.map(async (doc) => {
            try {
                const fullListing = await getListingById(doc.$id);
                if (!fullListing) {
                    // Fallback: create a minimal listing from the document
                    return createMinimalListing(doc, publicProvider);
                }
                const imageUrls =
                    fullListing.images?.length > 0
                        ? getListingImageUrls(fullListing.images)
                        : [];
                return mapListingWithDetailsToListing(
                    fullListing,
                    imageUrls,
                    publicProvider
                );
            } catch {
                return createMinimalListing(doc, publicProvider);
            }
        })
    );

    // Map public provider to the shape ProviderProfile component expects
    const componentProvider = {
        id: publicProvider.id,
        name: publicProvider.name,
        avatar: publicProvider.avatar,
        bio: publicProvider.bio,
        region: publicProvider.region,
        languages: publicProvider.languages,
        serviceAreas: publicProvider.serviceAreas,
        experienceYears: publicProvider.experienceYears,
        isVerified: publicProvider.isVerified,
        joinedDate: publicProvider.joinedDate,
    };

    return (
        <div className="min-h-screen bg-white">
            <ProviderProfile
                provider={componentProvider}
                listings={mappedListings}
            />
        </div>
    );
}

// ─── Helpers ────────────────────────────────────────────

import type { ListingDocument } from "@/types/listing.types";
import type { PublicProviderProfile } from "@/lib/mappers";
import { getListingImageUrl } from "@/lib/storage";

function createMinimalListing(
    doc: ListingDocument,
    provider: PublicProviderProfile
): Listing {
    const firstImage =
        doc.images?.length > 0
            ? getListingImageUrl(doc.images[0])
            : "/images/placeholder-listing.jpg";

    // Build a base listing matching StayListing as the safest fallback
    return {
        id: doc.$id,
        type: doc.type as "stay",
        title: doc.title,
        location: doc.region,
        region: doc.region,
        description: doc.description,
        price: doc.price,
        priceUnit: doc.price_unit,
        images: [{ url: firstImage, alt: doc.title }],
        highlights: [],
        provider: {
            id: provider.id,
            name: provider.name,
            avatar: provider.avatar,
            languages: provider.languages,
            region: provider.region,
        },
        rating: doc.rating,
        reviewCount: doc.review_count,
        propertyOverview: { guests: 0, bedrooms: 0, beds: 0, bathrooms: 0 },
        amenities: [],
        locationInfo: { landmark: "", howToReach: "" },
    } as Listing;
}
