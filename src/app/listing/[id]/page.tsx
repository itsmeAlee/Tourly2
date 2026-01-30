
import { MOCK_LISTINGS } from '@/components/listing/mock-data';
import { GuideLayout } from '@/components/listing/layout/GuideLayout';
import { ProductLayout } from '@/components/listing/layout/ProductLayout';
import { ListingHeader } from '@/components/listing/layout/ListingHeader';
import { ListingBottomBar } from '@/components/listing/layout/ListingBottomBar';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

type Props = {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params;
    const listing = MOCK_LISTINGS[params.id];

    if (!listing) {
        return {
            title: 'Listing Not Found',
        };
    }

    return {
        title: `${listing.title} | Tourly`,
        description: listing.description,
    };
}

export default async function ListingPage(props: Props) {
    const params = await props.params;
    const listing = MOCK_LISTINGS[params.id];

    if (!listing) {
        notFound();
    }

    // Polymorphic Layout Strategy
    const isGuide = listing.type === 'guide';
    const LayoutComponent = isGuide ? GuideLayout : ProductLayout;

    return (
        <div className="min-h-screen bg-white">
            {/* Unified Header */}
            <ListingHeader />

            {/* Dynamic Content */}
            <main className="pb-20">
                <LayoutComponent listing={listing} />
            </main>

            {/* Unified Bottom Bar */}
            <ListingBottomBar
                price={listing.price}
                priceUnit={listing.priceUnit}
            />
        </div>
    );
}
