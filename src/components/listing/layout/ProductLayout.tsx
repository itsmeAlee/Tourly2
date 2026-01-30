
import { ListingData, Amenity } from '@/components/listing/mock-data';
import Image from 'next/image';
import { Star, MapPin, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ProductLayoutProps {
    listing: ListingData;
}

export function ProductLayout({ listing }: ProductLayoutProps) {
    return (
        <div className="pb-32 animate-in fade-in duration-500">

            {/* Image Gallery - Mobile Carousel / Desktop Grid */}
            <div className="relative w-full h-[50vh] md:h-[60vh] md:grid md:grid-cols-4 md:grid-rows-2 md:gap-2 overflow-hidden">
                {listing.images.map((img, i) => (
                    <div
                        key={i}
                        className={`relative w-full h-full ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''} ${i > 4 ? 'hidden md:block' : ''}`}
                    >
                        <Image
                            src={img.url}
                            alt={img.alt}
                            fill
                            className="object-cover transition-transform hover:scale-105 duration-700"
                            priority={i === 0}
                        />
                    </div>
                ))}
                {/* Helper gradient for text readability on mobile */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden" />
            </div>

            <div className="max-w-4xl mx-auto px-4 -mt-8 md:mt-8 relative z-10">
                {/* Main Card */}
                <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 md:shadow-none md:border-none md:bg-transparent md:p-0">

                    {/* Header Info */}
                    <div className="space-y-2 mb-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">{listing.title}</h1>
                                <div className="flex items-center text-gray-500 mt-1 space-x-2">
                                    <MapPin className="w-4 h-4 text-[#0daae7]" />
                                    <span className="text-sm font-medium">{listing.location}</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <div className="flex items-center bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                                    <span className="font-bold text-gray-900 text-sm">{listing.rating}</span>
                                    <span className="text-gray-400 text-xs ml-1">({listing.reviewCount})</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Provider Card - Clean Version */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 mb-8">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                                <AvatarImage src={listing.provider.avatar} />
                                <AvatarFallback>{listing.provider.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-bold text-gray-900 text-sm">Hosted by {listing.provider.name}</p>
                                {listing.provider.isVerified && (
                                    <div className="flex items-center text-[#0daae7] text-xs font-medium">
                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                        Verified Partner
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Amenities / Specs Grid */}
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                            {listing.type === 'transport' ? 'Vehicle Specs' : 'Amenities'}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {(listing.specs || listing.amenities).map((item, idx) => {
                                // Handle both Specs (value) and Amenity (label) structure
                                const label = 'value' in item ? (item as any).value : (item as any).label;
                                const subLabel = 'value' in item ? (item as any).label : null;
                                const Icon = item.icon;

                                return (
                                    <div key={idx} className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl border border-gray-100 text-center hover:border-[#0daae7]/30 transition-colors cursor-default">
                                        <Icon className="w-6 h-6 text-gray-600 mb-2" />
                                        <span className="text-sm font-semibold text-gray-900">{label}</span>
                                        {subLabel && <span className="text-xs text-gray-500">{subLabel}</span>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-3">About this {listing.type}</h3>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                            {listing.description}
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}
