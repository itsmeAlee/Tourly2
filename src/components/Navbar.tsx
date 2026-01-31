"use client";

import { useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles, MessageSquare, User, LogOut } from "lucide-react";
import { useSearch } from "@/contexts/SearchContext";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { ServiceTabs } from "@/components/ServiceTabs";
import Link from "next/link";

// Wrapper component for ServiceTabs with Suspense (used in center sticky nav)
function ServiceTabsWithSuspense({ className }: { className?: string }) {
  return (
    <Suspense fallback={<div className="h-8" />}>
      <ServiceTabs variant="underline" showIcons={true} className={className} />
    </Suspense>
  );
}

// Right-side navigation links (desktop)
function NavLinks({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-6", className)}>
      <a
        href="#about"
        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        About
      </a>
      <Link
        href="/inbox"
        className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <MessageSquare className="w-4 h-4" />
        Inbox
      </Link>
      <Link
        href="/ai-planner"
        className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
      >
        <Sparkles className="w-4 h-4" />
        TripAI
      </Link>
    </div>
  );
}

// Auth section component
function AuthSection() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

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
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="font-medium text-sm text-foreground truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
              <Link
                href="/profile"
                className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                onClick={() => setShowDropdown(false)}
              >
                <User className="w-4 h-4" />
                Profile
              </Link>
              <button
                onClick={() => {
                  logout();
                  setShowDropdown(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Log out
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <Link href="/login">
      <Button size="sm">Log in</Button>
    </Link>
  );
}

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isSearchHidden } = useSearch();
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isSearchHidden
          ? "bg-background shadow-md"
          : "nav-blur bg-background/80"
      )}
    >
      <nav className="container mx-auto px-4 lg:px-8">
        {/* Main Nav Row - 3 Section Layout: Left | Center | Right */}
        <div className="flex items-center justify-between h-14 lg:h-16">
          {/* LEFT SECTION: Logo (fixed width for balance) */}
          <div className="flex items-center shrink-0 lg:w-[200px]">
            <Link href="/" className="flex items-center gap-2" aria-label="Tourly home">
              <span className="text-2xl font-bold tracking-tight text-foreground">
                Tourly
              </span>
            </Link>
          </div>

          {/* MOBILE: Service Tabs (centered) - visible when scrolled */}
          <div
            className={cn(
              "lg:hidden flex-1 flex items-center justify-center transition-all duration-300",
              isSearchHidden ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
          >
            <Suspense fallback={<div className="h-6 w-20 bg-gray-100 rounded animate-pulse" />}>
              <ServiceTabs variant="underline" />
            </Suspense>
          </div>

          {/* CENTER SECTION: Service Tabs (only visible when scrolled on desktop) */}
          <div
            className={cn(
              "hidden lg:flex flex-1 items-center justify-center transition-all duration-300",
              isSearchHidden ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
          >
            <ServiceTabsWithSuspense />
          </div>

          {/* RIGHT SECTION: Navigation Links + Auth Buttons (fixed width for balance) */}
          <div className="hidden lg:flex items-center justify-end gap-4 lg:w-[320px]">
            {/* Nav Links: About, Inbox, TripAI */}
            <NavLinks />

            {/* Auth Section */}
            <AuthSection />
          </div>

          {/* MOBILE: Menu Button */}
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

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-in">
            {/* Mobile Nav Links */}
            <div className="flex flex-col gap-2 mb-4">
              <a
                href="#about"
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
              >
                About
              </a>
              <Link
                href="/inbox"
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                Inbox
              </Link>
              <Link
                href="/ai-planner"
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-md transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                TripAI
              </Link>
            </div>

            {/* Mobile Auth Section */}
            <div className="flex flex-col gap-2 pt-2 border-t border-border">
              {isLoading ? (
                <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
              ) : isAuthenticated && user ? (
                <>
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-3 py-2 hover:bg-muted rounded-md transition-colors"
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
                    <div>
                      <p className="text-sm font-medium text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Log out
                  </button>
                </>
              ) : (
                <Link href="/login">
                  <Button size="sm" className="w-full">Log in</Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

