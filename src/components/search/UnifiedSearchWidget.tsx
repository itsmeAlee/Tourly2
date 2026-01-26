"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Bed, Car, Users, MapPin, User, Minus, Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useSmartDateRange } from "@/hooks/use-smart-date-range";
import { useSearch, tabs, TabType } from "@/contexts/SearchContext";

// Service type for URL-driven mode
export type ServiceTypeParam = "stays" | "transport" | "guides";

// Props interface for initial values (used on Search Page)
export interface UnifiedSearchWidgetProps {
    /** Initial location value (from URL params) */
    initialLocation?: string;
    /** Initial check-in date (ISO string) */
    initialCheckIn?: string;
    /** Initial check-out date (ISO string) */
    initialCheckOut?: string;
    /** Initial number of guests */
    initialGuests?: number;
    /** Initial number of rooms */
    initialRooms?: number;
    /** Whether to show the folder-style tabs (default: true) */
    showTabs?: boolean;
    /** Optional className for the container */
    className?: string;
    /** Variant - 'hero' for home page, 'compact' for search page header */
    variant?: "hero" | "compact";
    /** 
     * Active service type from URL (used on Search Page).
     * When provided, this OVERRIDES the internal tab state.
     * Values: 'stays' | 'transport' | 'guides'
     */
    activeServiceType?: ServiceTypeParam;
    /** Optional callback when search is triggered (e.g., to close overlay) */
    onSearch?: () => void;
}

const tabIcons: Record<TabType, React.ReactNode> = {
    Stays: <Bed className="w-4 h-4" />,
    Transport: <Car className="w-4 h-4" />,
    Guides: <Users className="w-4 h-4" />,
};

// The EXACT classes to completely remove input styling - lighter text for placeholder look
const inputClasses = "appearance-none border-none outline-none shadow-none ring-0 focus:ring-0 focus:outline-none focus:border-none bg-transparent p-0 w-full text-base font-semibold text-foreground/60 placeholder:text-foreground/50 leading-tight";

// The EXACT classes for select triggers - must override ALL default styles
const selectClasses = "!appearance-none !border-none !outline-none !shadow-none !ring-0 !ring-offset-0 focus:!ring-0 focus:!outline-none focus:!border-none focus-visible:!ring-0 focus-visible:!outline-none !bg-transparent !p-0 !h-auto w-full text-base font-semibold text-foreground/60 leading-tight [&>svg]:hidden [&>span]:truncate [&>span]:text-foreground/60";

// Label classes - larger, positioned near top
const labelClasses = "text-sm font-semibold text-muted-foreground leading-none";

// Boxed container - RIGID dimensions for zero CLS
// Fixed height ensures no layout shift when switching tabs
// NOTE: now a function to support compact mode styling
const getBoxClasses = (isCompact: boolean) => cn(
    // ALWAYS: Layout + rigid dimensions
    "flex-none lg:flex-1 h-14 lg:h-full flex items-center gap-3 px-4 rounded-xl transition-colors overflow-hidden shrink-0 w-full",
    // COMPACT MODE: More prominent individual boxes since parent has no background
    isCompact
        ? "bg-white border border-gray-200 shadow-sm hover:border-gray-300"
        : "border border-border bg-background hover:border-muted-foreground/40"
);

export function UnifiedSearchWidget({
    initialLocation = "",
    initialCheckIn,
    initialCheckOut,
    initialGuests = 2,
    initialRooms = 1,
    showTabs = true,
    className,
    variant = "hero",
    activeServiceType,
    onSearch,
}: UnifiedSearchWidgetProps) {
    const { activeTab, setActiveTab } = useSearch();
    const [location, setLocation] = useState(initialLocation);
    const [travelers, setTravelers] = useState(initialGuests);
    const [rooms, setRooms] = useState(initialRooms);
    const [pickupPoint, setPickupPoint] = useState(initialLocation);
    const [region, setRegion] = useState(initialLocation);
    const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false);

    // Helper: Convert URL service type to TabType
    const serviceTypeToTabType = (type: ServiceTypeParam): TabType => {
        switch (type) {
            case "stays": return "Stays";
            case "transport": return "Transport";
            case "guides": return "Guides";
            default: return "Stays";
        }
    };

    // Sync activeServiceType prop with context (for Search Page URL-driven mode)
    useEffect(() => {
        if (activeServiceType) {
            const tabType = serviceTypeToTabType(activeServiceType);
            if (activeTab !== tabType) {
                setActiveTab(tabType);
            }
        }
    }, [activeServiceType, activeTab, setActiveTab]);

    // Effective tab: Use context's activeTab (which is now synced with prop)
    const effectiveTab = activeTab;

    // Determine if we're in compact mode (Search Page - no white box wrapper)
    const isCompact = variant === "compact";

    // Get box classes based on mode
    const boxClasses = getBoxClasses(isCompact);

    // BUG FIX: Reset UI state when switching tabs to prevent dropdown lockup
    // This closes any open popovers when changing service types
    useEffect(() => {
        setIsDatePopoverOpen(false);
    }, [effectiveTab]);

    // Parse initial dates if provided
    const parseInitialDate = (dateStr?: string): Date | undefined => {
        if (!dateStr) return undefined;
        const parsed = new Date(dateStr);
        return isNaN(parsed.getTime()) ? undefined : parsed;
    };

    // Smart date range hook with initial values
    const {
        dateRange,
        startDate,
        endDate,
        isSelectingEnd,
        isRangeComplete,
        handleRangeSelect,
        setDateRange,
    } = useSmartDateRange({
        initialFrom: parseInitialDate(initialCheckIn),
        initialTo: parseInitialDate(initialCheckOut),
    });

    const router = useRouter();

    // Sync location state when initialLocation changes (URL navigation)
    useEffect(() => {
        setLocation(initialLocation);
        setPickupPoint(initialLocation);
        setRegion(initialLocation);
    }, [initialLocation]);

    // Sync travelers when initialGuests changes
    useEffect(() => {
        setTravelers(initialGuests);
    }, [initialGuests]);

    // Sync rooms when initialRooms changes
    useEffect(() => {
        setRooms(initialRooms);
    }, [initialRooms]);

    // Map tab to search type
    const getSearchType = (): string => {
        switch (effectiveTab) {
            case "Stays": return "stays";
            case "Transport": return "transport";
            case "Guides": return "guides";
            default: return "stays";
        }
    };

    // Handle search button click - navigate to search results
    const handleSearch = () => {
        // Trigger callback first (e.g. to close overlay)
        onSearch?.();

        const params = new URLSearchParams();
        params.set("type", getSearchType());

        // Add location based on tab
        const searchLocation = effectiveTab === "Stays" ? location :
            effectiveTab === "Transport" ? pickupPoint : region;
        if (searchLocation) {
            params.set("location", searchLocation);
        }

        // Add dates if selected
        if (startDate) {
            params.set("checkIn", startDate.toISOString().split("T")[0]);
        }
        if (endDate) {
            params.set("checkOut", endDate.toISOString().split("T")[0]);
        }

        // Add travelers/guests
        params.set("guests", travelers.toString());

        router.push(`/search?${params.toString()}`);
    };

    const renderStaysFields = () => (
        <>
            {/* Where to? */}
            <div className={boxClasses}>
                <MapPin className="w-5 h-5 text-muted-foreground shrink-0" />
                <div className="flex flex-col flex-1 min-w-0 h-full justify-center gap-0.5">
                    <label className={labelClasses}>Where to?</label>
                    <input
                        type="text"
                        placeholder="Istanbul, Türkiye (IST)"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className={inputClasses}
                    />
                </div>
            </div>

            {/* Dates */}
            <Popover open={isDatePopoverOpen} onOpenChange={setIsDatePopoverOpen}>
                <PopoverTrigger asChild>
                    <button className={cn(boxClasses, "text-left cursor-pointer")}>
                        <CalendarIcon className="w-5 h-5 text-muted-foreground shrink-0" />
                        <div className="flex flex-col flex-1 min-w-0 h-full justify-center gap-0.5">
                            <span className={labelClasses}>Dates</span>
                            <span className="text-base font-semibold text-foreground/60 leading-tight truncate">
                                {startDate && endDate
                                    ? `${format(startDate, "MMM d")} - ${format(endDate, "MMM d")}`
                                    : startDate
                                        ? `${format(startDate, "MMM d")} - Select end`
                                        : "Add dates"}
                            </span>
                        </div>
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-50 bg-background rounded-xl overflow-hidden" align="start">
                    <div className="p-3 border-b border-border">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-foreground">
                                Select Dates
                            </span>
                            {startDate && (
                                <span className="text-xs text-muted-foreground">
                                    {startDate && !endDate && `Check-in: ${format(startDate, "MMM d")}`}
                                    {startDate && endDate && `${format(startDate, "MMM d")} - ${format(endDate, "MMM d")}`}
                                </span>
                            )}
                        </div>
                    </div>
                    <Calendar
                        mode="range"
                        selected={dateRange}
                        onSelect={(range) => {
                            const isComplete = handleRangeSelect(range);
                            // Only close popover when a valid complete range is set
                            if (isComplete) {
                                setTimeout(() => setIsDatePopoverOpen(false), 150);
                            }
                        }}
                        numberOfMonths={2}
                        disabled={{ before: new Date() }}
                        initialFocus
                        className="p-3 pointer-events-auto"
                    />
                </PopoverContent>
            </Popover>

            {/* Travelers */}
            <Popover>
                <PopoverTrigger asChild>
                    <button className={cn(boxClasses, "text-left cursor-pointer")}>
                        <User className="w-5 h-5 text-muted-foreground shrink-0" />
                        <div className="flex flex-col flex-1 min-w-0 h-full justify-center gap-0.5">
                            <span className={labelClasses}>Travelers</span>
                            <span className="text-base font-semibold text-foreground/60 leading-tight truncate">
                                {travelers} traveler{travelers > 1 ? "s" : ""}, {rooms} room{rooms > 1 ? "s" : ""}
                            </span>
                        </div>
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-64 bg-background z-50 rounded-xl" align="start">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Travelers</span>
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => setTravelers(Math.max(1, travelers - 1))}
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-6 text-center">{travelers}</span>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => setTravelers(travelers + 1)}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Rooms</span>
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => setRooms(Math.max(1, rooms - 1))}
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-6 text-center">{rooms}</span>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => setRooms(rooms + 1)}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </>
    );

    const renderTransportFields = () => (
        <>
            {/* Pickup Point */}
            <div className={boxClasses}>
                <MapPin className="w-5 h-5 text-muted-foreground shrink-0" />
                <div className="flex flex-col flex-1 min-w-0 h-full justify-center gap-0.5">
                    <label className={labelClasses}>Pickup</label>
                    <input
                        type="text"
                        placeholder="Enter pickup location"
                        value={pickupPoint}
                        onChange={(e) => setPickupPoint(e.target.value)}
                        className={inputClasses}
                    />
                </div>
            </div>

            {/* Vehicle Type */}
            <div className={boxClasses}>
                <Car className="w-5 h-5 text-muted-foreground shrink-0" />
                <div className="flex flex-col flex-1 min-w-0 h-full justify-center gap-0.5">
                    <span className={labelClasses}>Vehicle Type</span>
                    <Select>
                        <SelectTrigger className={selectClasses}>
                            <SelectValue placeholder="Select vehicle" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border shadow-lg z-50 rounded-xl">
                            <SelectItem value="prado" className="rounded-lg">Prado (4x4)</SelectItem>
                            <SelectItem value="land-cruiser" className="rounded-lg">Land Cruiser (4x4)</SelectItem>
                            <SelectItem value="corolla" className="rounded-lg">Corolla (City)</SelectItem>
                            <SelectItem value="hi-roof" className="rounded-lg">Hi-Roof (Group)</SelectItem>
                            <SelectItem value="coaster" className="rounded-lg">Coaster (Large Group)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Duration */}
            <div className={boxClasses}>
                <CalendarIcon className="w-5 h-5 text-muted-foreground shrink-0" />
                <div className="flex flex-col flex-1 min-w-0 h-full justify-center gap-0.5">
                    <span className={labelClasses}>Duration</span>
                    <Select>
                        <SelectTrigger className={selectClasses}>
                            <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border shadow-lg z-50 rounded-xl">
                            <SelectItem value="1-day" className="rounded-lg">1 Day</SelectItem>
                            <SelectItem value="3-days" className="rounded-lg">3 Days</SelectItem>
                            <SelectItem value="5-days" className="rounded-lg">5 Days</SelectItem>
                            <SelectItem value="7-days" className="rounded-lg">7 Days</SelectItem>
                            <SelectItem value="10-days" className="rounded-lg">10 Days</SelectItem>
                            <SelectItem value="custom" className="rounded-lg">Custom</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </>
    );

    const renderGuidesFields = () => (
        <>
            {/* Region */}
            <div className={boxClasses}>
                <MapPin className="w-5 h-5 text-muted-foreground shrink-0" />
                <div className="flex flex-col flex-1 min-w-0 h-full justify-center gap-0.5">
                    <label className={labelClasses}>Where to?</label>
                    <input
                        type="text"
                        placeholder="Enter destination"
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        className={inputClasses}
                    />
                </div>
            </div>

            {/* Activity */}
            <div className={boxClasses}>
                <Users className="w-5 h-5 text-muted-foreground shrink-0" />
                <div className="flex flex-col flex-1 min-w-0 h-full justify-center gap-0.5">
                    <span className={labelClasses}>Activity</span>
                    <Select>
                        <SelectTrigger className={selectClasses}>
                            <SelectValue placeholder="Select activity" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border shadow-lg z-50 rounded-xl">
                            <SelectItem value="trekking" className="rounded-lg">Trekking</SelectItem>
                            <SelectItem value="cultural-tour" className="rounded-lg">Cultural Tour</SelectItem>
                            <SelectItem value="photography" className="rounded-lg">Photography Tour</SelectItem>
                            <SelectItem value="mountaineering" className="rounded-lg">Mountaineering</SelectItem>
                            <SelectItem value="shopping" className="rounded-lg">Shopping Guide</SelectItem>
                            <SelectItem value="food-tour" className="rounded-lg">Food Tour</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Language */}
            <div className={boxClasses}>
                <User className="w-5 h-5 text-muted-foreground shrink-0" />
                <div className="flex flex-col flex-1 min-w-0 h-full justify-center gap-0.5">
                    <span className={labelClasses}>Language</span>
                    <Select>
                        <SelectTrigger className={selectClasses}>
                            <SelectValue placeholder="Any language" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border shadow-lg z-50 rounded-xl">
                            <SelectItem value="english" className="rounded-lg">English</SelectItem>
                            <SelectItem value="urdu" className="rounded-lg">Urdu</SelectItem>
                            <SelectItem value="chinese" className="rounded-lg">Chinese</SelectItem>
                            <SelectItem value="arabic" className="rounded-lg">Arabic</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </>
    );

    // Render fields with KEY prop to force React remount on tab switch
    // This ensures all internal Select/Popover states are completely reset
    const renderFields = () => {
        switch (effectiveTab) {
            case "Stays":
                return <div key="stays-fields" className="contents">{renderStaysFields()}</div>;
            case "Transport":
                return <div key="transport-fields" className="contents">{renderTransportFields()}</div>;
            case "Guides":
                return <div key="guides-fields" className="contents">{renderGuidesFields()}</div>;
            default:
                return <div key="default-fields" className="contents">{renderStaysFields()}</div>;
        }
    };

    return (
        <div className={cn("w-full max-w-5xl mx-auto", className)}>
            {/* Folder-style Tabs - only show if showTabs is true */}
            {showTabs && (
                <div className="flex">
                    {tabs.map((tab, index) => {
                        const isFirst = index === 0;
                        const isLast = index === tabs.length - 1;
                        const cornerClasses = isFirst
                            ? "rounded-tl-2xl"
                            : isLast
                                ? "rounded-tr-2xl"
                                : "";

                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "px-5 py-2.5 text-sm font-medium transition-all flex items-center gap-2",
                                    cornerClasses,
                                    effectiveTab === tab
                                        ? "bg-white text-foreground"
                                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                                )}
                            >
                                {tabIcons[tab]}
                                {tab}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Main Search Card */}
            {/* RIGID SKELETON: Fixed heights prevent CLS when switching tabs */}
            {/* Conditional styling: Hero mode = white box, Compact mode = transparent */}
            {/* overflow-visible ensures dropdowns render outside container bounds */}
            <div className={cn(
                // ALWAYS: Layout structure + overflow for dropdowns
                "relative transition-all overflow-visible",
                // HERO MODE (Home Page): Prominent white box with shadow
                !isCompact && "bg-white shadow-xl px-6 py-5",
                !isCompact && (showTabs ? "rounded-b-2xl rounded-tr-2xl" : "rounded-2xl"),
                // COMPACT MODE (Search Page): Transparent, no box styling
                isCompact && "bg-transparent shadow-none p-0"
            )}>
                {/* Inner flex container with fixed height - isolates dropdown triggers */}
                {/* GAP INCREASED TO 4 for better spacing on mobile */}
                <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:h-[60px]">
                    {renderFields()}

                    {/* Action Button */}
                    <Button
                        onClick={handleSearch}
                        className={cn(
                            "w-full lg:w-auto h-14 lg:h-auto px-8 text-base font-semibold rounded-xl lg:self-stretch",
                            // In compact mode, give button slightly more prominence
                            isCompact && "shadow-sm"
                        )}
                    >
                        Discover
                    </Button>
                </div>
            </div>
        </div>
    );
}
