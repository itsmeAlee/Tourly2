"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, User, Sparkles, MessageSquare, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { TripAIModal } from "@/components/TripAIModal";
import { useAuth } from "@/contexts/AuthContext";
import { useUnreadCount } from "@/hooks/use-unread-count";

type NavItemId = "explore" | "trip-ai" | "inbox" | "account" | "login";

export function MobileBottomNav() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const unreadCount = useUnreadCount();
  const [activeItem, setActiveItem] = useState<NavItemId>("explore");
  const [isTripAIOpen, setIsTripAIOpen] = useState(false);

  // Dynamic nav items based on auth state
  const navItems = [
    { id: "explore" as const, label: "Explore", icon: Search },
    { id: "trip-ai" as const, label: "TripAI", icon: Sparkles },
    { id: "inbox" as const, label: "Inbox", icon: MessageSquare },
    // Last item changes based on auth state
    isAuthenticated
      ? { id: "account" as const, label: "Account", icon: User }
      : { id: "login" as const, label: "Log in", icon: LogIn },
  ];

  const handleNavClick = (itemId: NavItemId) => {
    setActiveItem(itemId);

    switch (itemId) {
      case "explore":
        router.push("/");
        break;
      case "trip-ai":
        setIsTripAIOpen(true);
        break;
      case "inbox":
        if (isAuthenticated) {
          router.push("/inbox");
        } else {
          // Redirect to login with next param
          router.push("/login?next=/inbox");
        }
        break;
      case "account":
        router.push("/account");
        break;
      case "login":
        router.push("/login");
        break;
    }
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 h-[60px] pb-safe lg:hidden">
        <div className="flex items-center justify-around h-full">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={cn(
                  "relative flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors rounded-xl",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <div className="relative">
                  <Icon className={cn("w-6 h-6", isActive && "stroke-[2.5px]")} />
                  {item.id === "inbox" && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold border-2 border-background text-white">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <TripAIModal open={isTripAIOpen} onOpenChange={setIsTripAIOpen} />
    </>
  );
}

