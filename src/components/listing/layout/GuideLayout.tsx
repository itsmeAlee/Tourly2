
import { ListingData } from '@/components/listing/mock-data';
import Image from 'next/image';
import { Star, MapPin, Globe, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface GuideLayoutProps {
    listing: ListingData;
}

export function GuideLayout({ listing }: GuideLayoutProps) {
    const { guideDetails } = listing;

    return (
        <div className="pb-32 animate-in fade-in duration-500 bg-white">

            {/* Hero Section - Portrait Focused */}
            <div className="relative w-full bg-gray-50 pt-20 pb-10 px-4">
                <div className="max-w-md mx-auto flex flex-col items-center text-center">

                    {/* Main Portrait */}
                    <div className="relative w-48 h-64 mb-6 rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform rotate-[-2deg] hover:rotate-0 transition-transform duration-300">
                        <Image
                            src={listing.images[0].url}
                            alt={listing.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">{listing.title}</h1>

                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Badge variant="secondary" className="bg-[#0daae7]/10 text-[#0daae7] border-0 px-3 py-1 rounded-full text-xs uppercase tracking-wide font-bold">
                            Pro Guide
                        </Badge>
                        <div className="flex items-center text-gray-600 text-sm">
                            <MapPin className="w-3 h-3 mr-1" />
                            {listing.location}
                        </div>
                    </div>

                    <div className="flex items-center gap-6 text-center">
                        <div className="text-center">
                            <div className="flex items-center justify-center font-bold text-gray-900 text-lg">
                                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 mr-1" />
                                {listing.rating}
                            </div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Rating</p>
                        </div>
                        <div className="w-px h-8 bg-gray-200" />
                        <div className="text-center">
                            <div className="font-bold text-gray-900 text-lg">
                                {listing.reviewCount}
                            </div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Reviews</p>
                        </div>
                        <div className="w-px h-8 bg-gray-200" />
                        <div className="text-center">
                            <div className="font-bold text-gray-900 text-lg">
                                {guideDetails?.experience}
                            </div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Exp</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">

                {/* Languages */}
                {guideDetails?.languages && (
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center">
                            <Globe className="w-4 h-4 mr-2 text-[#0daae7]" />
                            Languages Spoken
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {guideDetails.languages.map((lang) => (
                                <span key={lang} className="px-4 py-2 bg-gray-50 rounded-xl text-sm font-medium text-gray-700 border border-gray-100">
                                    {lang}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Specialties */}
                {guideDetails?.specialties && (
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center">
                            <Award className="w-4 h-4 mr-2 text-[#0daae7]" />
                            Specialties
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {guideDetails.specialties.map((spec) => (
                                <div key={spec} className="flex items-center px-4 py-2 bg-[#0daae7]/5 rounded-xl text-sm font-medium text-[#0077a3] border border-[#0daae7]/10">
                                    <CheckCircle2 className="w-3 h-3 mr-2 opacity-70" />
                                    {spec}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Bio */}
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">About {listing.title.split(' ')[0]}</h3>
                    <p className="text-gray-600 leading-relaxed text-lg">
                        {listing.description}
                    </p>
                </div>

                {/* Verification */}
                {listing.provider.isVerified && (
                    <div className="flex items-start bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                        <ShieldCheck className="w-6 h-6 text-emerald-600 mr-3 mt-1" />
                        <div>
                            <h4 className="font-bold text-emerald-900 text-sm">Identity Verified</h4>
                            <p className="text-emerald-700 text-xs mt-1">
                                {listing.title} has verified their identity and credentials with Tourly.
                            </p>
                        </div>
                    </div>
                )}

                {/* Gallery Grid (Secondary Images) */}
                {listing.images.length > 1 && (
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Gallery</h3>
                        <div className="grid grid-cols-2 gap-3 h-48">
                            {listing.images.slice(1).map((img, i) => (
                                <div key={i} className="relative rounded-2xl overflow-hidden w-full h-full">
                                    <Image src={img.url} alt={img.alt} fill className="object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
