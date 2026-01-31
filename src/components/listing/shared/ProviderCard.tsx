import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ChevronRight, Globe } from "lucide-react";
import Link from "next/link";
import type { Provider } from "../types";

interface ProviderCardProps {
    provider: Provider;
}

export function ProviderCard({ provider }: ProviderCardProps) {
    // Get initials for avatar fallback
    const initials = provider.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <div className="flex items-start gap-4">
                {/* Avatar - Clickable */}
                <Link href={`/provider/${provider.id}`} className="shrink-0">
                    <Avatar className="w-16 h-16 hover:ring-2 hover:ring-primary/20 transition-all cursor-pointer">
                        <AvatarImage src={provider.avatar} alt={provider.name} />
                        <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <Link
                        href={`/provider/${provider.id}`}
                        className="block hover:text-primary transition-colors"
                    >
                        <h3 className="font-bold text-lg text-foreground truncate">
                            {provider.name}
                        </h3>
                    </Link>

                    {/* Languages */}
                    <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
                        <Globe className="w-4 h-4 shrink-0" />
                        <span className="truncate">
                            {provider.languages.join(', ')}
                        </span>
                    </div>

                    {/* Region */}
                    <p className="text-sm text-muted-foreground mt-0.5">
                        {provider.region}
                    </p>
                </div>
            </div>

            {/* View all services link */}
            <Link
                href={`/provider/${provider.id}`}
                className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 text-sm font-medium text-primary hover:text-primary/80 transition-colors group"
            >
                <span>View all services by this provider</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
        </div>
    );
}
