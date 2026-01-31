import { MOCK_PROVIDERS, getProviderById, getListingsByProviderId } from '@/data/mockProviders';
import { ProviderProfile } from '@/components/provider/ProviderProfile';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

type Props = {
    params: { id: string } | Promise<{ id: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await Promise.resolve(props.params);
    const provider = getProviderById(params.id);

    if (!provider) {
        return {
            title: 'Provider Not Found',
        };
    }

    return {
        title: `${provider.name} | Tourly Provider`,
        description: `View all services by ${provider.name} in ${provider.region}. ${provider.experienceYears}+ years of experience.`,
        alternates: {
            canonical: `/provider/${provider.id}`,
        },
        robots: {
            index: true,
            follow: true,
        },
        openGraph: {
            title: `${provider.name} | Tourly Provider`,
            description: `View all services by ${provider.name} in ${provider.region}.`,
            type: 'profile',
            images: provider.avatar ? [provider.avatar] : undefined,
        },
    };
}

export default async function ProviderPage(props: Props) {
    const params = await Promise.resolve(props.params);
    const provider = getProviderById(params.id);

    if (!provider) {
        notFound();
    }

    // Get all listings for this provider
    const listings = getListingsByProviderId(params.id);

    return (
        <div className="min-h-screen bg-white">
            <ProviderProfile provider={provider} listings={listings} />
        </div>
    );
}
