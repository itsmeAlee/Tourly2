"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MessageSquare, Heart, Settings, ChevronRight, Camera, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUnreadCount } from "@/hooks/use-unread-count";
import { Button } from "@/components/ui/button";
import { LogoutConfirmModal } from "@/components/auth/LogoutConfirmModal";
import { cn } from "@/lib/utils";

interface QuickActionTile {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    href: string;
    badge?: number;
}

export function AccountHub() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading } = useAuth();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const unreadMessages = useUnreadCount();

    const quickActions: QuickActionTile[] = [
        {
            id: "messages",
            label: "My Messages",
            icon: MessageSquare,
            href: "/inbox",
            badge: unreadMessages > 0 ? unreadMessages : undefined,
        },
        {
            id: "saved",
            label: "Saved",
            icon: Heart,
            href: "/saved",
        },
        {
            id: "settings",
            label: "Settings",
            icon: Settings,
            href: "/settings",
        },
    ];

    const handleBack = () => {
        router.push("/");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        router.push("/login?next=/account");
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleBack}
                            className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
                            aria-label="Go back"
                        >
                            <ArrowLeft className="w-5 h-5 text-foreground" />
                        </button>
                        <h1 className="text-xl font-bold text-foreground">Account</h1>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 max-w-lg">
                {/* Profile Section */}
                <div className="text-center mb-8">
                    {/* Avatar */}
                    <div className="relative inline-block mb-4">
                        {user.avatar ? (
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                            />
                        ) : (
                            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border-4 border-white shadow-md">
                                <span className="text-2xl font-bold text-primary">
                                    {user.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        )}
                        {/* Edit Avatar Overlay */}
                        <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors">
                            <Camera className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Name & Email */}
                    <h2 className="text-xl font-bold text-foreground mb-1">{user.name}</h2>
                    <p className="text-muted-foreground mb-4">{user.email}</p>

                    {/* Edit Profile Button */}
                    <Button
                        variant="outline"
                        className="rounded-xl"
                        onClick={() => router.push("/account/edit")}
                    >
                        Edit Profile
                    </Button>
                </div>

                {/* Quick Actions Grid (Desktop) */}
                <div className="hidden md:grid grid-cols-3 gap-4 mb-8">
                    {quickActions.map((action) => {
                        const Icon = action.icon;
                        return (
                            <Link
                                key={action.id}
                                href={action.href}
                                className="relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all flex flex-col items-center text-center"
                            >
                                <Icon className="w-8 h-8 text-primary mb-3" />
                                <span className="font-medium text-foreground">{action.label}</span>
                                {action.badge && (
                                    <span className="absolute top-4 right-4 min-w-[20px] h-5 px-1.5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                        {action.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* Quick Actions List (Mobile) */}
                <div className="md:hidden space-y-3 mb-8">
                    {quickActions.map((action) => {
                        const Icon = action.icon;
                        return (
                            <Link
                                key={action.id}
                                href={action.href}
                                className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
                            >
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <Icon className="w-5 h-5 text-primary" />
                                </div>
                                <span className="flex-1 font-medium text-foreground">{action.label}</span>
                                {action.badge && (
                                    <span className="min-w-[20px] h-5 px-1.5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center mr-2">
                                        {action.badge}
                                    </span>
                                )}
                                <ChevronRight className="w-5 h-5 text-muted-foreground" />
                            </Link>
                        );
                    })}
                </div>

                {/* Log Out Button */}
                <button
                    onClick={() => setShowLogoutModal(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors font-medium"
                >
                    <LogOut className="w-5 h-5" />
                    Log out
                </button>
            </main>

            {/* Logout Confirmation Modal */}
            <LogoutConfirmModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
            />
        </div>
    );
}
