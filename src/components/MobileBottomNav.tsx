"use client";

import { useState } from "react";
import { Search, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { id: "explore", label: "Explore", icon: Search },
  { id: "wishlists", label: "Wishlists", icon: Heart },
  { id: "profile", label: "Profile", icon: User },
] as const;

type NavItemId = (typeof navItems)[number]["id"];

export function MobileBottomNav() {
  const [activeItem, setActiveItem] = useState<NavItemId>("explore");

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 h-14">
      <div className="flex items-center justify-around h-full pb-safe">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              className={cn(
                "flex flex-col items-center justify-center px-6 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className={cn("w-[18px] h-[18px] mb-0.5", isActive && "stroke-[2.5px]")} />
              <span className="text-[9px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
