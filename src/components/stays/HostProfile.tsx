"use client";

import { BadgeCheck, Award } from "lucide-react";

interface HostProfileProps {
    host: {
        name: string;
        avatar: string;
        isVerified: boolean;
        isSuperhost?: boolean;
    };
}

export function HostProfile({ host }: HostProfileProps) {
    return (
        <div className="py-6 border-b border-gray-200">
            <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="relative">
                    <img
                        src={host.avatar}
                        alt={host.name}
                        className="w-14 h-14 rounded-full object-cover"
                    />
                    {host.isVerified && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <BadgeCheck className="w-4 h-4 text-white" />
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                        Hosted by {host.name}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                        {host.isVerified && (
                            <span className="flex items-center gap-1 text-sm text-gray-500">
                                <BadgeCheck className="w-4 h-4 text-primary" />
                                Verified Host
                            </span>
                        )}
                        {host.isSuperhost && (
                            <span className="flex items-center gap-1 text-sm text-gray-500">
                                <Award className="w-4 h-4 text-amber-500" />
                                Superhost
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
