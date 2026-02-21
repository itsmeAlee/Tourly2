"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, List, PlusCircle, MessageSquare, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { LogoutConfirmModal } from "@/components/auth/LogoutConfirmModal";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUnreadCount } from "@/hooks/use-unread-count";

const navItems = [
    { label: "Dashboard", href: "/provider/dashboard", icon: Home },
    { label: "My Listings", href: "/provider/listings", icon: List },
    { label: "Create Listing", href: "/provider/listings/create", icon: PlusCircle },
    { label: "Inbox", href: "/inbox", icon: MessageSquare }, // Reuse inbox
];

function AuthSection() {
    const { user, isAuthenticated, isLoading } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    if (isLoading) {
        return <div className="w-20 h-9 bg-gray-100 rounded-lg animate-pulse" />;
    }

    if (isAuthenticated && user) {
        return (
            <div className="relative">
                <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 p-1.5 rounded-full hover:bg-muted transition-colors"
                >
                    {user.avatar ? (
                        <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-8 h-8 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-4 h-4 text-primary" />
                        </div>
                    )}
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setShowDropdown(false)}
                        />
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                            <div className="px-4 py-2 border-b border-gray-100 mb-1">
                                <p className="font-medium text-sm text-foreground truncate">{user.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                            </div>
                            <Link
                                href="/account"
                                className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                                onClick={() => setShowDropdown(false)}
                            >
                                <User className="w-4 h-4" />
                                Provider Profile
                            </Link>
                            <Link
                                href="/"
                                className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors"
                                onClick={() => setShowDropdown(false)}
                            >
                                <Home className="w-4 h-4" />
                                Back to Tourist site
                            </Link>
                            <button
                                onClick={() => {
                                    setShowDropdown(false);
                                    setShowLogoutModal(true);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors mt-1 border-t border-gray-100"
                            >
                                <LogOut className="w-4 h-4" />
                                Log out
                            </button>
                            <LogoutConfirmModal
                                isOpen={showLogoutModal}
                                onClose={() => setShowLogoutModal(false)}
                            />
                        </div>
                    </>
                )}
            </div>
        );
    }

    return null;
}

export function ProviderNavbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const unreadCount = useUnreadCount();

    return (
        <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm nav-blur">
            <nav className="container mx-auto px-4 lg:px-8">
                <div className="flex items-center justify-between h-14 lg:h-16">
                    {/* LEFT SECTION: Logo */}
                    <div className="flex items-center shrink-0">
                        <Link href="/provider/dashboard" className="flex items-center gap-2" aria-label="Tourly Dashboard">
                            <span className="text-2xl font-bold tracking-tight text-primary">
                                Tourly <span className="text-base font-medium text-muted-foreground ml-1">Provider</span>
                            </span>
                        </Link>
                    </div>

                    {/* CENTER SECTION: Nav Links (Desktop) */}
                    <div className="hidden lg:flex items-center gap-6">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href || (item.href !== "/provider/dashboard" && pathname.startsWith(item.href) && item.href !== "/inbox") || (item.href === "/inbox" && pathname.startsWith("/inbox"));
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-2 text-sm font-medium transition-colors border-b-2 py-5",
                                        isActive
                                            ? "text-primary border-primary"
                                            : "text-muted-foreground border-transparent hover:text-foreground"
                                    )}
                                >
                                    <Icon className="w-4 h-4" />
                                    {item.label}
                                    {item.label === "Inbox" && unreadCount > 0 && (
                                        <span className="ml-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                                            {unreadCount > 99 ? "99+" : unreadCount}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* RIGHT SECTION: Auth (Desktop) & Menu (Mobile) */}
                    <div className="flex items-center gap-4">
                        <div className="hidden lg:block">
                            <AuthSection />
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="lg:hidden py-4 border-t border-border animate-fade-in bg-white">
                        <div className="flex flex-col gap-2 mb-4">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href || (item.href !== "/provider/dashboard" && pathname.startsWith(item.href) && item.href !== "/inbox") || (item.href === "/inbox" && pathname.startsWith("/inbox"));
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={cn(
                                            "flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
                                            isActive
                                                ? "text-primary bg-primary/10"
                                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                        )}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Icon className="w-5 h-5" />
                                            {item.label}
                                        </div>
                                        {item.label === "Inbox" && unreadCount > 0 && (
                                            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">
                                                {unreadCount > 99 ? "99+" : unreadCount}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                        <div className="pt-4 border-t border-border">
                            <div className="lg:hidden block px-2">
                                <AuthSection />
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}
