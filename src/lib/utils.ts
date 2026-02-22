import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// The EXACT classes to completely remove input styling - lighter text for placeholder look
export const SEARCH_INPUT_CLASSES = "appearance-none border-none outline-none shadow-none ring-0 focus:ring-0 focus:outline-none focus:border-none bg-transparent p-0 w-full text-base font-semibold text-foreground/60 placeholder:text-foreground/50 leading-tight";

// The EXACT classes for select triggers - must override ALL default styles
export const SEARCH_SELECT_CLASSES = "!appearance-none !border-none !outline-none !shadow-none !ring-0 !ring-offset-0 focus:!ring-0 focus:!outline-none focus:!border-none focus-visible:!ring-0 focus-visible:!outline-none !bg-transparent !p-0 !h-auto w-full text-base font-semibold text-foreground/60 leading-tight [&>svg]:hidden [&>span]:truncate [&>span]:text-foreground/60";

// Label classes - larger, positioned near top
export const SEARCH_LABEL_CLASSES = "text-sm font-semibold text-muted-foreground leading-none";
