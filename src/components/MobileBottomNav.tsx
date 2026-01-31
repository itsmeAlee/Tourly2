"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, User, Sparkles, MessageSquare, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { TripAIModal } from "@/components/TripAIModal";
import { useAuth } from "@/contexts/AuthContext";

type NavItemId = "explore" | "trip-ai" | "inbox" | "profile" | "login";

export function MobileBottomNav() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [activeItem, setActiveItem] = useState<NavItemId>("explore");
  const [isTripAIOpen, setIsTripAIOpen] = useState(false);

  // Dynamic nav items based on auth state
  const navItems = [
    { id: "explore" as const, label: "Explore", icon: Search },
    { id: "trip-ai" as const, label: "TripAI", icon: Sparkles },
    { id: "inbox" as const, label: "Inbox", icon: MessageSquare },
    // Last item changes based on auth state
    isAuthenticated
      ? { id: "profile" as const, label: "Profile", icon: User }
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
      case "profile":
        router.push("/profile");
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
                  "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors rounded-xl",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className={cn("w-6 h-6", isActive && "stroke-[2.5px]")} />
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

