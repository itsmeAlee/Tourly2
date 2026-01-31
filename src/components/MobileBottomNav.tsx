"use client";

import { useState } from "react";
import { Search, User, Sparkles, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { TripAIModal } from "@/components/TripAIModal";

const navItems = [
  { id: "explore", label: "Explore", icon: Search },
  { id: "trip-ai", label: "TripAI", icon: Sparkles },
  { id: "inbox", label: "Inbox", icon: MessageSquare },
  { id: "profile", label: "Profile", icon: User },
] as const;

type NavItemId = (typeof navItems)[number]["id"];

export function MobileBottomNav() {
  const [activeItem, setActiveItem] = useState<NavItemId>("explore");
  const [isTripAIOpen, setIsTripAIOpen] = useState(false);

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 h-[60px] pb-safe">
        <div className="flex items-center justify-around h-full">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveItem(item.id);
                  if (item.id === "trip-ai") {
                    setIsTripAIOpen(true);
                  }
                  if (item.id === "inbox") {
                    window.location.href = "/inbox";
                  }
                }}
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
