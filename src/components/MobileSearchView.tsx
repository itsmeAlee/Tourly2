"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
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
import { Bed, Car, Users, MapPin, Calendar, User, Compass, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSmartDateRange } from "@/hooks/use-smart-date-range";
import { TopRatedSection } from "./TopRatedSection";
import { ServiceTabs } from "@/components/ServiceTabs";
import { Skeleton } from "@/components/ui/skeleton";
import { getTopListings } from "@/services/listing.service";
import { mapListingToTopRatedItem, type TopRatedItem } from "@/lib/mappers";

// TODO: Remove mock data fallback once Appwrite listings are populated
import { mockGuides, mockHotels, mockTourOperators } from "@/data/topRated";

const services = [
  { id: "stays", label: "Stays", icon: Bed },
  { id: "transport", label: "Transport", icon: Car },
  { id: "guides", label: "Guides", icon: Users },
] as const;

type ServiceId = (typeof services)[number]["id"];

// The EXACT classes to completely remove input styling - lighter text for placeholder look
const inputClasses = "appearance-none border-none outline-none shadow-none ring-0 focus:ring-0 focus:outline-none focus:border-none bg-transparent p-0 w-full text-base font-semibold text-foreground/60 placeholder:text-foreground/50 leading-tight";

// The EXACT classes for select triggers - must override ALL default styles
const selectClasses = "!appearance-none !border-none !outline-none !shadow-none !ring-0 !ring-offset-0 focus:!ring-0 focus:!outline-none focus:!border-none focus-visible:!ring-0 focus-visible:!outline-none !bg-transparent !p-0 !h-auto w-full text-base font-semibold text-foreground/60 leading-tight [&>svg]:hidden [&>span]:truncate [&>span]:text-foreground/60";

// Label classes - larger, positioned near top
const labelClasses = "text-sm font-semibold text-muted-foreground leading-none";

// Boxed container - top-heavy padding to push label near top border
const boxClasses = "flex items-start gap-3 px-4 pt-2 pb-3 border border-border rounded-md bg-background w-full";

// Height of the sticky header bar
const STICKY_HEADER_HEIGHT = 44; // Compact height for sticky state

export function MobileSearchView() {
  const [activeService, setActiveService] = useState<ServiceId>("stays");
  const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const searchFormRef = useRef<HTMLDivElement>(null);

  // ── Real data state for top-rated sections ──
  const [hotelItems, setHotelItems] = useState<TopRatedItem[]>(mockHotels);
  const [transportItems, setTransportItems] = useState<TopRatedItem[]>(mockTourOperators);
  const [guideItems, setGuideItems] = useState<TopRatedItem[]>(mockGuides);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Fetch real data on mount — fall back to mocks on error
  useEffect(() => {
    async function fetchTopRated() {
      try {
        const [stays, transports, guides] = await Promise.all([
          getTopListings("stay", 6),
          getTopListings("transport", 6),
          getTopListings("guide", 6),
        ]);
        if (stays.length > 0) setHotelItems(stays.map(mapListingToTopRatedItem));
        if (transports.length > 0) setTransportItems(transports.map(mapListingToTopRatedItem));
        if (guides.length > 0) setGuideItems(guides.map(mapListingToTopRatedItem));
      } catch (err) {
        console.error("[MobileSearchView] Failed to fetch top rated:", err);
        // Keep mock data as fallback — already set as initial state
      } finally {
        setIsDataLoading(false);
      }
    }
    fetchTopRated();
  }, []);

  // Intersection Observer for sticky detection - triggers when search form leaves viewport
  useEffect(() => {
    const searchForm = searchFormRef.current;
    if (!searchForm) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        // When the bottom of search form is NOT visible, make sticky
        setIsSticky(!entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: "-10px 0px 0px 0px", // Small offset for smoother trigger
      }
    );

    observer.observe(searchForm);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Stays state
  const [staysLocation, setStaysLocation] = useState("");
  const [travelers, setTravelers] = useState(2);
  const [rooms, setRooms] = useState(1);

  // Smart date range for stays
  const {
    dateRange: staysDateRange,
    startDate: staysStartDate,
    endDate: staysEndDate,
    isSelectingEnd: staysIsSelectingEnd,
    handleRangeSelect: handleStaysRangeSelect
  } = useSmartDateRange();

  // Transport state
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");

  // Guides state
  const [guideDestination, setGuideDestination] = useState("");
  const [guideDate, setGuideDate] = useState<Date>();

  const renderStaysFields = () => (
    <div className="flex flex-col gap-3">
      {/* Where to? */}
      <div className={boxClasses}>
        <MapPin className="w-5 h-5 text-muted-foreground shrink-0" />
        <div className="flex flex-col flex-1 min-w-0 gap-1.5">
          <label className={labelClasses}>Where to?</label>
          <input
            type="text"
            placeholder="Istanbul, Türkiye (IST)"
            value={staysLocation}
            onChange={(e) => setStaysLocation(e.target.value)}
            className={inputClasses}
          />
        </div>
      </div>

      {/* Dates */}
      <Popover open={isDatePopoverOpen} onOpenChange={setIsDatePopoverOpen}>
        <PopoverTrigger asChild>
          <button className={cn(boxClasses, "text-left cursor-pointer")}>
            <Calendar className="w-5 h-5 text-muted-foreground shrink-0" />
            <div className="flex flex-col flex-1 min-w-0 gap-1.5">
              <span className={labelClasses}>Dates</span>
              <span className="text-base font-semibold text-foreground/60 leading-tight truncate">
                {staysStartDate && staysEndDate
                  ? `${format(staysStartDate, "MMM d")} - ${format(staysEndDate, "MMM d")}`
                  : staysStartDate
                    ? `${format(staysStartDate, "MMM d")} - Select end`
                    : "Add dates"}
              </span>
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-background z-50" align="start">
          <div className="p-3 border-b border-border">
            <span className="text-sm font-medium text-foreground">
              Select Dates
            </span>
          </div>
          <CalendarComponent
            mode="range"
            selected={staysDateRange}
            onSelect={(range) => {
              const isComplete = handleStaysRangeSelect(range);
              // Only close popover when a valid complete range is set
              if (isComplete) {
                setTimeout(() => setIsDatePopoverOpen(false), 150);
              }
            }}
            numberOfMonths={1}
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
            <div className="flex flex-col flex-1 min-w-0 gap-1.5">
              <span className={labelClasses}>Travelers</span>
              <span className="text-base font-semibold text-foreground/60 leading-tight truncate">
                {travelers} traveler{travelers > 1 ? "s" : ""}, {rooms} room{rooms > 1 ? "s" : ""}
              </span>
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-64 bg-background z-50" align="start">
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
    </div>
  );

  const renderTransportFields = () => (
    <div className="flex flex-col gap-3">
      {/* Pickup Location */}
      <div className={boxClasses}>
        <MapPin className="w-5 h-5 text-muted-foreground shrink-0" />
        <div className="flex flex-col flex-1 min-w-0 gap-1.5">
          <label className={labelClasses}>Pickup</label>
          <input
            type="text"
            placeholder="Enter pickup location"
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
            className={inputClasses}
          />
        </div>
      </div>

      {/* Drop-off Location */}
      <div className={boxClasses}>
        <MapPin className="w-5 h-5 text-muted-foreground shrink-0" />
        <div className="flex flex-col flex-1 min-w-0 gap-1.5">
          <label className={labelClasses}>Drop-off</label>
          <input
            type="text"
            placeholder="Enter drop-off location"
            value={dropoffLocation}
            onChange={(e) => setDropoffLocation(e.target.value)}
            className={inputClasses}
          />
        </div>
      </div>

      {/* Vehicle Type */}
      <div className={boxClasses}>
        <Car className="w-5 h-5 text-muted-foreground shrink-0" />
        <div className="flex flex-col flex-1 min-w-0 gap-1.5">
          <span className={labelClasses}>Vehicle Type</span>
          <Select>
            <SelectTrigger className={selectClasses}>
              <SelectValue placeholder="Select vehicle" />
            </SelectTrigger>
            <SelectContent className="bg-background border shadow-lg z-50">
              <SelectItem value="prado">Prado (4x4)</SelectItem>
              <SelectItem value="land-cruiser">Land Cruiser (4x4)</SelectItem>
              <SelectItem value="corolla">Corolla (City)</SelectItem>
              <SelectItem value="hi-roof">Hi-Roof (Group)</SelectItem>
              <SelectItem value="coaster">Coaster (Large Group)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderGuidesFields = () => (
    <div className="flex flex-col gap-3">
      {/* Destination */}
      <div className={boxClasses}>
        <MapPin className="w-5 h-5 text-muted-foreground shrink-0" />
        <div className="flex flex-col flex-1 min-w-0 gap-1.5">
          <label className={labelClasses}>Where to?</label>
          <input
            type="text"
            placeholder="Enter destination"
            value={guideDestination}
            onChange={(e) => setGuideDestination(e.target.value)}
            className={inputClasses}
          />
        </div>
      </div>

      {/* Date */}
      <Popover>
        <PopoverTrigger asChild>
          <button className={cn(boxClasses, "text-left cursor-pointer")}>
            <Calendar className="w-5 h-5 text-muted-foreground shrink-0" />
            <div className="flex flex-col flex-1 min-w-0 gap-1.5">
              <span className={labelClasses}>Date</span>
              <span className="text-base font-semibold text-foreground leading-tight truncate">
                {guideDate ? format(guideDate, "EEE, MMM d") : "Select date"}
              </span>
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-background z-50" align="start">
          <CalendarComponent
            mode="single"
            selected={guideDate}
            onSelect={setGuideDate}
            initialFocus
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>

      {/* Activity Type */}
      <div className={boxClasses}>
        <Compass className="w-5 h-5 text-muted-foreground shrink-0" />
        <div className="flex flex-col flex-1 min-w-0 gap-1.5">
          <span className={labelClasses}>Activity Type</span>
          <Select>
            <SelectTrigger className={selectClasses}>
              <SelectValue placeholder="Select activity" />
            </SelectTrigger>
            <SelectContent className="bg-background border shadow-lg z-50">
              <SelectItem value="trekking">Trekking</SelectItem>
              <SelectItem value="sightseeing">Sightseeing</SelectItem>
              <SelectItem value="cultural-tour">Cultural Tour</SelectItem>
              <SelectItem value="photography">Photography Tour</SelectItem>
              <SelectItem value="mountaineering">Mountaineering</SelectItem>
              <SelectItem value="food-tour">Food Tour</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );



  const renderFields = () => {
    switch (activeService) {
      case "stays":
        return renderStaysFields();
      case "transport":
        return renderTransportFields();
      case "guides":
        return renderGuidesFields();
      default:
        return renderStaysFields();
    }
  };

  const getButtonText = () => {
    switch (activeService) {

      case "transport":
        return "Find Vehicles";
      case "guides":
        return "Find Guides";
      default:
        return "Search";
    }
  };

  return (
    <div className="min-h-screen bg-muted/50 pb-24 overflow-x-hidden">
      {/* Header */}
      <header className="px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Tourly</h1>
      </header>

      {/* Sticky Service Tabs - Navigate to Search Page */}
      <div
        className={cn(
          "transition-all duration-300 z-50",
          isSticky
            ? "fixed top-0 left-0 right-0 bg-white py-3 px-4 opacity-100 translate-y-0 shadow-sm"
            : "opacity-0 pointer-events-none fixed top-0 left-0 right-0 -translate-y-full"
        )}
      >
        <Suspense fallback={<div className="h-8" />}>
          <ServiceTabs variant="underline" />
        </Suspense>
      </div>

      {/* Default Service Tabs - Icon + Text Cards */}
      <div className="px-5 mb-5">
        <div className="grid grid-cols-3 gap-3">
          {services.map((service) => {
            const Icon = service.icon;
            const isActive = activeService === service.id;

            return (
              <button
                key={service.id}
                onClick={() => setActiveService(service.id)}
                className={cn(
                  "flex flex-col items-center justify-center px-3 py-3 rounded-lg transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-background text-muted-foreground hover:bg-muted"
                )}
              >
                <Icon className="w-5 h-5 mb-1.5" />
                <span className="text-xs font-medium whitespace-nowrap">{service.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Search Card - attach ref for sticky trigger */}
      <div ref={searchFormRef} className="px-5">
        <div className="bg-background rounded-xl shadow-lg p-4">
          {renderFields()}

          {/* Search Button */}
          <div className="mt-4">
            <Button className="w-full h-14 text-base font-semibold rounded-lg">
              {getButtonText()}
            </Button>
          </div>
        </div>
      </div>

      {/* Top Rated Sections */}
      <div className="mt-8">
        {hotelItems.length > 0 && (
          <TopRatedSection
            title="Top Rated Hotels"
            subtitle="Handpicked accommodations loved by travelers"
            category="hotel"
            items={hotelItems}
            viewAllHref="/hotels"
          />
        )}

        {transportItems.length > 0 && (
          <TopRatedSection
            title="Top Rated Tour Operators"
            subtitle="Trusted agencies for your perfect adventure"
            category="tour-operator"
            items={transportItems}
            viewAllHref="/tour-operators"
          />
        )}

        {guideItems.length > 0 && (
          <TopRatedSection
            title="Top Rated Guides"
            subtitle="Expert local guides for unforgettable experiences"
            category="guide"
            items={guideItems}
            viewAllHref="/guides"
          />
        )}
      </div>
    </div>
  );
}
