"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    ArrowLeft, ArrowRight, Save, Image as ImageIcon, X, Loader2, Check,
    Bed, Car, Compass, Trash2, Eye, EyeOff, AlertCircle, Upload,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createListing, getListingById, updateListing, toggleListingActive, deleteListing } from "@/services/listing.service";
import { uploadListingImage, deleteFile } from "@/services/storage.service";
import { BUCKETS } from "@/lib/appwrite-config";
import { getListingImageUrl } from "@/lib/storage";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import type { CreateListingInput, ListingType, ListingWithDetails, StayDetailsDocument, TransportDetailsDocument, GuideDetailsDocument } from "@/types/listing.types";

// ─── Constants ──────────────────────────────────────────

const REGIONS = ["Hunza", "Gilgit", "Skardu", "Nagar", "Chilas", "Ghizer", "Diamer", "Astore", "Khunjerab"] as const;

const STAY_AMENITIES = [
    "WiFi", "Hot Water", "Heating", "Air Conditioning", "Kitchen", "Parking",
    "Generator", "TV", "Laundry", "Breakfast Included", "Mountain View", "Garden",
] as const;

const PRICE_UNITS: Record<ListingType, { value: string; label: string }[]> = {
    stay: [{ value: "night", label: "Per Night" }, { value: "person", label: "Per Person" }],
    transport: [{ value: "day", label: "Per Day" }, { value: "trip", label: "Per Trip" }],
    guide: [{ value: "day", label: "Per Day" }, { value: "person", label: "Per Person" }, { value: "group", label: "Per Group" }],
};

const TYPE_CONFIG: Record<ListingType, { icon: typeof Bed; label: string; desc: string; placeholder: string }> = {
    stay: { icon: Bed, label: "Stay / Hotel", desc: "Hotels, hostels, guest houses & homestays", placeholder: "e.g. Mountain View Suite" },
    transport: { icon: Car, label: "Transport", desc: "Vehicles with drivers for travel", placeholder: "e.g. Toyota Prado 4x4" },
    guide: { icon: Compass, label: "Guide", desc: "Local guides for treks & cultural tours", placeholder: "e.g. Hunza Valley Trekking Guide" },
};

// ─── Types ──────────────────────────────────────────────

interface Props { listingId?: string; }
interface FormErrors { [key: string]: string; }

// ─── Tag Input Component ────────────────────────────────

function TagInput({ id, tags, onChange, placeholder, max = 10, disabled }: {
    id: string; tags: string[]; onChange: (t: string[]) => void;
    placeholder: string; max?: number; disabled?: boolean;
}) {
    const [input, setInput] = useState("");
    const add = (val: string) => {
        const v = val.trim();
        if (v && !tags.includes(v) && tags.length < max) onChange([...tags, v]);
        setInput("");
    };
    return (
        <div>
            <div className="flex gap-2">
                <Input id={id} value={input} disabled={disabled || tags.length >= max}
                    onChange={(e) => setInput(e.target.value)} placeholder={tags.length >= max ? `Maximum ${max} items` : placeholder}
                    className="rounded-xl border-gray-200 flex-1"
                    onKeyDown={(e) => { if ((e.key === "Enter" || e.key === ",") && input.trim()) { e.preventDefault(); add(input); } }}
                />
                <Button type="button" variant="outline" size="sm" disabled={!input.trim() || tags.length >= max || disabled}
                    onClick={() => add(input)} className="rounded-xl shrink-0">Add</Button>
            </div>
            {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                    {tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="gap-1 pr-1 rounded-lg">
                            {tag}
                            <button type="button" onClick={() => onChange(tags.filter((t) => t !== tag))}
                                className="ml-0.5 hover:bg-gray-300 rounded-full p-0.5" disabled={disabled}>
                                <X className="w-3 h-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Main Component ─────────────────────────────────────

export function ProviderCreateListingClient({ listingId }: Props = {}) {
    const router = useRouter();
    const { user } = useAuth();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const isEditMode = !!listingId;

    // Wizard
    const [step, setStep] = useState<1 | 2 | 3>(1);

    // Step 1
    const [type, setType] = useState<ListingType | null>(null);

    // Step 2 — Common
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [priceUnit, setPriceUnit] = useState("night");
    const [location, setLocation] = useState("");
    const [region, setRegion] = useState("");
    const [highlights, setHighlights] = useState<string[]>([]);

    // Step 2 — Stay
    const [stayGuests, setStayGuests] = useState("");
    const [stayBedrooms, setStayBedrooms] = useState("");
    const [stayBeds, setStayBeds] = useState("");
    const [stayBathrooms, setStayBathrooms] = useState("");
    const [stayAmenities, setStayAmenities] = useState<string[]>([]);
    const [stayLandmark, setStayLandmark] = useState("");
    const [stayHowToReach, setStayHowToReach] = useState("");

    // Step 2 — Transport
    const [transportMake, setTransportMake] = useState("");
    const [transportModel, setTransportModel] = useState("");
    const [transportYear, setTransportYear] = useState("");
    const [transportSeats, setTransportSeats] = useState("");
    const [transportTransmission, setTransportTransmission] = useState("Manual");
    const [transportFourWd, setTransportFourWd] = useState(false);
    const [transportFuelIncluded, setTransportFuelIncluded] = useState(false);
    const [transportRoutes, setTransportRoutes] = useState<string[]>([]);
    const [transportTerrains, setTransportTerrains] = useState<string[]>([]);
    const [transportDriverExp, setTransportDriverExp] = useState("");

    // Step 2 — Guide
    const [guideExpYears, setGuideExpYears] = useState("");
    const [guideMaxGroup, setGuideMaxGroup] = useState("");
    const [guideCerts, setGuideCerts] = useState<string[]>([]);
    const [guideTrekRoutes, setGuideTrekRoutes] = useState<string[]>([]);
    const [guideEquipment, setGuideEquipment] = useState<string[]>([]);

    // Step 3 — Photos
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [existingImageIds, setExistingImageIds] = useState<string[]>([]);
    const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);

    // State
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingExisting, setIsLoadingExisting] = useState(false);
    const [isToggling, setIsToggling] = useState(false);
    const [currentActive, setCurrentActive] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    // ── Edit Mode: Load existing listing ────────────────
    const loadListing = useCallback(async () => {
        if (!listingId || !user?.providerId) return;
        setIsLoadingExisting(true);
        setLoadError(null);
        try {
            const listing = await getListingById(listingId);
            if (!listing) { setLoadError("Listing not found."); return; }
            if (listing.provider_id !== user.providerId) {
                setLoadError("You don't have permission to edit this listing.");
                return;
            }
            // Populate common fields
            setType(listing.type);
            setTitle(listing.title);
            setDescription(listing.description);
            setPrice(String(listing.price));
            setPriceUnit(listing.price_unit);
            setLocation(listing.location);
            setRegion(listing.region);
            setHighlights(listing.highlights ?? []);
            setCurrentActive(listing.is_active);
            setExistingImageIds(listing.images ?? []);
            setPreviews((listing.images ?? []).map((id) => getListingImageUrl(id, 400)));

            // Populate type-specific
            const d = listing.details;
            if (listing.type === "stay" && d) {
                const s = d as StayDetailsDocument;
                setStayGuests(String(s.guests ?? ""));
                setStayBedrooms(String(s.bedrooms ?? ""));
                setStayBeds(String(s.beds ?? ""));
                setStayBathrooms(String(s.bathrooms ?? ""));
                setStayAmenities(s.amenities ?? []);
                setStayLandmark(s.landmark ?? "");
                setStayHowToReach(s.how_to_reach ?? "");
            } else if (listing.type === "transport" && d) {
                const t = d as TransportDetailsDocument;
                setTransportMake(t.make ?? "");
                setTransportModel(t.model ?? "");
                setTransportYear(String(t.year ?? ""));
                setTransportSeats(String(t.seats ?? ""));
                setTransportTransmission(t.transmission ?? "Manual");
                setTransportFourWd(t.four_wd ?? false);
                setTransportFuelIncluded(t.fuel_included ?? false);
                setTransportRoutes(t.routes ?? []);
                setTransportTerrains(t.terrains ?? []);
                setTransportDriverExp(t.driver_experience ?? "");
            } else if (listing.type === "guide" && d) {
                const g = d as GuideDetailsDocument;
                setGuideExpYears(String(g.experience_years ?? ""));
                setGuideMaxGroup(String(g.max_group_size ?? ""));
                setGuideCerts(g.certifications ?? []);
                setGuideTrekRoutes(g.trek_routes ?? []);
                setGuideEquipment(g.equipment_provided ?? []);
            }
            setPriceUnit(listing.price_unit || PRICE_UNITS[listing.type][0].value);
            setStep(2); // Skip type selection in edit mode
        } catch (err: any) {
            setLoadError(err?.message || "Failed to load listing.");
        } finally {
            setIsLoadingExisting(false);
        }
    }, [listingId, user?.providerId]);

    useEffect(() => {
        if (isEditMode) loadListing();
    }, [isEditMode, loadListing]);

    // ── No provider profile ─────────────────────────────
    if (user && user.role === "provider" && !user.providerId) {
        return (
            <div className="max-w-2xl mx-auto py-24 text-center animate-fade-in">
                <AlertCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">Provider profile not found</h2>
                <p className="text-muted-foreground mb-6">Please complete your provider profile first.</p>
                <Link href="/signup/provider-profile"><Button className="rounded-xl">Complete Profile</Button></Link>
            </div>
        );
    }

    // ── Loading state for edit ───────────────────────────
    if (isLoadingExisting) {
        return (
            <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-[400px] w-full rounded-2xl" />
            </div>
        );
    }

    // ── Load error ──────────────────────────────────────
    if (loadError) {
        return (
            <div className="max-w-2xl mx-auto py-24 text-center animate-fade-in">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">{loadError}</h2>
                <Link href="/provider/listings"><Button variant="outline" className="rounded-xl mt-4">← Back to Listings</Button></Link>
            </div>
        );
    }

    // ── File handling ───────────────────────────────────
    const totalImages = existingImageIds.length + files.length;

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        const newFiles = Array.from(e.target.files);
        const validFiles: File[] = [];
        newFiles.forEach((file) => {
            if (totalImages + validFiles.length >= 8) { toast({ title: "Maximum 8 images", variant: "destructive" }); return; }
            if (file.size > 10 * 1024 * 1024) { toast({ title: "File too large", description: `${file.name} exceeds 10MB.`, variant: "destructive" }); return; }
            if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) { toast({ title: "Invalid type", description: `${file.name} must be JPEG, PNG, or WebP.`, variant: "destructive" }); return; }
            validFiles.push(file);
        });
        setFiles((p) => [...p, ...validFiles]);
        validFiles.forEach((f) => setPreviews((p) => [...p, URL.createObjectURL(f)]));
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const removeImage = (index: number) => {
        const existingCount = existingImageIds.length;
        if (index < existingCount) {
            // Removing an existing image
            const removedId = existingImageIds[index];
            setExistingImageIds((p) => p.filter((_, i) => i !== index));
            setRemovedImageIds((p) => [...p, removedId]);
        } else {
            // Removing a new file
            const fileIndex = index - existingCount;
            setFiles((p) => p.filter((_, i) => i !== fileIndex));
        }
        setPreviews((p) => {
            const n = [...p];
            if (index >= existingCount) URL.revokeObjectURL(n[index]);
            n.splice(index, 1);
            return n;
        });
    };

    // ── Validation ──────────────────────────────────────
    const validateStep2 = (): boolean => {
        const errs: FormErrors = {};
        if (!title.trim() || title.trim().length < 5) errs.title = "Title must be at least 5 characters";
        if (!description.trim() || description.trim().length < 30) errs.description = "Description must be at least 30 characters";
        if (!price || parseInt(price) < 1) errs.price = "Price must be a positive number";
        if (!location.trim()) errs.location = "Location is required";
        if (!region) errs.region = "Region is required";

        if (type === "stay") {
            if (!stayGuests || parseInt(stayGuests) < 1) errs.stayGuests = "Required";
            if (stayBedrooms === "") errs.stayBedrooms = "Required";
            if (!stayBeds || parseInt(stayBeds) < 1) errs.stayBeds = "Required";
            if (stayBathrooms === "") errs.stayBathrooms = "Required";
        } else if (type === "transport") {
            if (!transportMake.trim()) errs.transportMake = "Required";
            if (!transportModel.trim()) errs.transportModel = "Required";
            if (!transportYear || parseInt(transportYear) < 2000 || parseInt(transportYear) > 2030) errs.transportYear = "Year must be 2000–2030";
            if (!transportSeats || parseInt(transportSeats) < 1) errs.transportSeats = "Required";
        } else if (type === "guide") {
            if (guideExpYears === "" || parseInt(guideExpYears) < 0) errs.guideExpYears = "Required";
            if (!guideMaxGroup || parseInt(guideMaxGroup) < 1) errs.guideMaxGroup = "Required";
        }
        setErrors(errs);
        if (Object.keys(errs).length > 0) {
            const firstKey = Object.keys(errs)[0];
            document.getElementById(firstKey)?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return Object.keys(errs).length === 0;
    };

    // ── Build payload ───────────────────────────────────
    const buildDetails = (): Record<string, unknown> => {
        if (type === "stay") return {
            guests: parseInt(stayGuests), bedrooms: parseInt(stayBedrooms),
            beds: parseInt(stayBeds), bathrooms: parseInt(stayBathrooms),
            amenities: stayAmenities,
            ...(stayLandmark.trim() && { landmark: stayLandmark.trim() }),
            ...(stayHowToReach.trim() && { how_to_reach: stayHowToReach.trim() }),
        };
        if (type === "transport") return {
            make: transportMake.trim(), model: transportModel.trim(),
            year: parseInt(transportYear), seats: parseInt(transportSeats),
            transmission: transportTransmission, four_wd: transportFourWd,
            fuel_included: transportFuelIncluded, routes: transportRoutes,
            terrains: transportTerrains,
            ...(transportDriverExp.trim() && { driver_experience: transportDriverExp.trim() }),
        };
        if (type === "guide") return {
            experience_years: parseInt(guideExpYears), max_group_size: parseInt(guideMaxGroup),
            certifications: guideCerts, trek_routes: guideTrekRoutes, equipment_provided: guideEquipment,
        };
        return {};
    };

    // ── Submit ───────────────────────────────────────────
    const handleSubmit = async () => {
        if (!user || !user.providerId || !type) return;
        const finalImageCount = existingImageIds.length + files.length;
        if (finalImageCount === 0) { toast({ title: "At least 1 image required", variant: "destructive" }); return; }

        setIsSubmitting(true);
        const uploadedIds: string[] = [];

        try {
            // Upload new images in parallel
            if (files.length > 0) {
                const results = await Promise.all(files.map((f) => uploadListingImage(f, user.providerId!)));
                uploadedIds.push(...results);
            }
            const allImageIds = [...existingImageIds, ...uploadedIds];

            if (isEditMode && listingId) {
                // Update
                await updateListing(listingId, {
                    title: title.trim(), description: description.trim(),
                    price: parseInt(price), price_unit: priceUnit,
                    location: location.trim(), region,
                    images: allImageIds, highlights,
                    details: buildDetails(),
                });
                // Clean up removed images
                if (removedImageIds.length > 0) {
                    await Promise.allSettled(removedImageIds.map((id) => deleteFile(BUCKETS.LISTING_IMAGES, id)));
                }
                toast({ title: "Listing updated!" });
            } else {
                // Create
                const payload: CreateListingInput = {
                    type, provider_id: user.providerId,
                    title: title.trim(), description: description.trim(),
                    price: parseInt(price), price_unit: priceUnit,
                    location: location.trim(), region,
                    images: allImageIds, highlights,
                    is_active: true, created_at: new Date().toISOString(),
                    details: buildDetails(),
                } as CreateListingInput;
                await createListing(payload, user.id);
                toast({ title: "Listing published successfully!" });
            }
            router.push("/provider/listings");
        } catch (err: any) {
            // Rollback new uploads on failure
            if (uploadedIds.length > 0 && !isEditMode) {
                await Promise.allSettled(uploadedIds.map((id) => deleteFile(BUCKETS.LISTING_IMAGES, id)));
            }
            toast({ title: isEditMode ? "Failed to save changes" : "Failed to create listing", description: err?.message || "Please try again.", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    // ── Toggle active ───────────────────────────────────
    const handleToggleActive = async () => {
        if (!listingId) return;
        setIsToggling(true);
        try {
            await toggleListingActive(listingId, !currentActive);
            setCurrentActive(!currentActive);
            toast({ title: !currentActive ? "Listing is now active" : "Listing is now hidden" });
        } catch {
            toast({ title: "Failed to update visibility", variant: "destructive" });
        } finally {
            setIsToggling(false);
        }
    };

    // ── Delete listing ──────────────────────────────────
    const handleDelete = async () => {
        if (!listingId || !user?.providerId) return;
        setIsSubmitting(true);
        try {
            await deleteListing(listingId, user.providerId);
            toast({ title: "Listing deleted." });
            router.push("/provider/listings");
        } catch {
            toast({ title: "Failed to delete listing", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    // ── Clear error helper ──────────────────────────────
    const clearErr = (field: string) => { if (errors[field]) setErrors((p) => { const n = { ...p }; delete n[field]; return n; }); };

    // ── Inline error label ──────────────────────────────
    const ErrMsg = ({ field }: { field: string }) => errors[field] ? <p className="text-xs text-red-500 mt-1">{errors[field]}</p> : null;
    const errCls = (field: string) => errors[field] ? "border-red-300 focus:ring-red-200 focus:border-red-400" : "";

    // ─── Progress Bar ───────────────────────────────────
    const ProgressBar = () => (
        <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
                <div key={s} className={cn("h-1.5 flex-1 rounded-full transition-colors", s <= step ? "bg-primary" : "bg-gray-200")} />
            ))}
        </div>
    );

    const StepLabel = () => (
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span className={step >= 1 ? "text-primary font-medium" : ""}>Service Type</span>
            <span className={step >= 2 ? "text-primary font-medium" : ""}>Details</span>
            <span className={step >= 3 ? "text-primary font-medium" : ""}>Photos</span>
        </div>
    );

    // ═══════════════════════════════════════════════════
    // RENDER
    // ═══════════════════════════════════════════════════

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-fade-in pb-12">
            {/* Header */}
            <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                <Link href="/provider/listings">
                    <Button variant="ghost" size="icon" className="rounded-full"><ArrowLeft className="w-5 h-5 text-muted-foreground" /></Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">{isEditMode ? "Edit Listing" : "Create New Listing"}</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {isEditMode ? "Update your listing details." : "Step " + step + " of 3 — " + (step === 1 ? "Choose your service type" : step === 2 ? "Fill in the details" : "Add photos")}
                    </p>
                </div>
            </div>

            <StepLabel />
            <ProgressBar />

            {/* ══ STEP 1 — Service Type ══════════════════ */}
            {step === 1 && (
                <Card className="rounded-2xl shadow-sm border-gray-100">
                    <CardHeader className="text-center pb-2">
                        <CardTitle className="text-xl">What service are you offering?</CardTitle>
                        <CardDescription>Choose the category that best fits your service.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid gap-4 sm:grid-cols-3">
                            {(Object.keys(TYPE_CONFIG) as ListingType[]).map((t) => {
                                const cfg = TYPE_CONFIG[t];
                                const Icon = cfg.icon;
                                const selected = type === t;
                                return (
                                    <button key={t} type="button" onClick={() => setType(t)}
                                        className={cn(
                                            "flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all text-center",
                                            selected ? "border-primary bg-primary/5 shadow-sm" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                        )}>
                                        <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center", selected ? "bg-primary/15 text-primary" : "bg-gray-100 text-gray-500")}>
                                            <Icon className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-foreground">{cfg.label}</p>
                                            <p className="text-xs text-muted-foreground mt-1">{cfg.desc}</p>
                                        </div>
                                        {selected && <Check className="w-5 h-5 text-primary" />}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="flex justify-end mt-6">
                            <Button disabled={!type} onClick={() => setStep(2)} className="rounded-xl gap-2">Continue <ArrowRight className="w-4 h-4" /></Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* ══ STEP 2 — Details ═══════════════════════ */}
            {step === 2 && type && (
                <div className="space-y-6">
                    {/* Common Fields */}
                    <Card className="rounded-2xl shadow-sm border-gray-100">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                            <CardTitle className="text-lg">Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" value={title} onChange={(e) => { setTitle(e.target.value); clearErr("title"); }}
                                    placeholder={TYPE_CONFIG[type].placeholder} className={cn("rounded-xl border-gray-200", errCls("title"))} />
                                <ErrMsg field="title" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" value={description} onChange={(e) => { setDescription(e.target.value); clearErr("description"); }}
                                    placeholder="Describe your service in detail..." className={cn("min-h-[120px] rounded-xl border-gray-200", errCls("description"))} maxLength={3000} />
                                <div className="flex justify-between"><ErrMsg field="description" /><span className="text-xs text-muted-foreground">{description.length}/3000</span></div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price (PKR)</Label>
                                    <Input id="price" type="number" min="1" value={price} onChange={(e) => { setPrice(e.target.value); clearErr("price"); }}
                                        placeholder="e.g. 15000" className={cn("rounded-xl border-gray-200", errCls("price"))} />
                                    <ErrMsg field="price" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="priceUnit">Price Unit</Label>
                                    <Select value={priceUnit} onValueChange={setPriceUnit}>
                                        <SelectTrigger id="priceUnit" className="rounded-xl border-gray-200"><SelectValue /></SelectTrigger>
                                        <SelectContent>{PRICE_UNITS[type].map((u) => <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="location">Location</Label>
                                    <Input id="location" value={location} onChange={(e) => { setLocation(e.target.value); clearErr("location"); }}
                                        placeholder="e.g. Karimabad, Hunza" className={cn("rounded-xl border-gray-200", errCls("location"))} />
                                    <ErrMsg field="location" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="region">Region</Label>
                                    <Select value={region} onValueChange={(v) => { setRegion(v); clearErr("region"); }}>
                                        <SelectTrigger id="region" className={cn("rounded-xl border-gray-200", errCls("region"))}><SelectValue placeholder="Select region" /></SelectTrigger>
                                        <SelectContent>{REGIONS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                                    </Select>
                                    <ErrMsg field="region" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="highlights">Highlights</Label>
                                <TagInput id="highlights" tags={highlights} onChange={setHighlights} placeholder="Type a highlight and press Enter" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stay Details */}
                    {type === "stay" && (
                        <Card className="rounded-2xl shadow-sm border-gray-100">
                            <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg"><Bed className="w-5 h-5 text-primary" /> Property Details</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                                    {[
                                        { id: "stayGuests", label: "Guests", val: stayGuests, set: setStayGuests, min: "1" },
                                        { id: "stayBedrooms", label: "Bedrooms", val: stayBedrooms, set: setStayBedrooms, min: "0" },
                                        { id: "stayBeds", label: "Beds", val: stayBeds, set: setStayBeds, min: "1" },
                                        { id: "stayBathrooms", label: "Bathrooms", val: stayBathrooms, set: setStayBathrooms, min: "0" },
                                    ].map((f) => (
                                        <div key={f.id} className="space-y-2">
                                            <Label htmlFor={f.id}>{f.label}</Label>
                                            <Input id={f.id} type="number" min={f.min} value={f.val}
                                                onChange={(e) => { f.set(e.target.value); clearErr(f.id); }}
                                                className={cn("rounded-xl border-gray-200", errCls(f.id))} />
                                            <ErrMsg field={f.id} />
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-2">
                                    <Label>Amenities</Label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {STAY_AMENITIES.map((a) => (
                                            <label key={a} className={cn(
                                                "flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer transition-colors text-sm",
                                                stayAmenities.includes(a) ? "border-primary bg-primary/5 text-primary" : "border-gray-200 hover:border-gray-300"
                                            )}>
                                                <input type="checkbox" className="sr-only" checked={stayAmenities.includes(a)}
                                                    onChange={() => setStayAmenities((p) => p.includes(a) ? p.filter((x) => x !== a) : [...p, a])} />
                                                <div className={cn("w-4 h-4 rounded border flex items-center justify-center shrink-0",
                                                    stayAmenities.includes(a) ? "bg-primary border-primary" : "border-gray-300")}>
                                                    {stayAmenities.includes(a) && <Check className="w-3 h-3 text-white" />}
                                                </div>
                                                {a}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="stayLandmark">Landmark <span className="text-muted-foreground font-normal">(optional)</span></Label>
                                    <Input id="stayLandmark" value={stayLandmark} onChange={(e) => setStayLandmark(e.target.value)}
                                        placeholder="e.g. 5 min walk from Baltit Fort" className="rounded-xl border-gray-200" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="stayHowToReach">How to Reach <span className="text-muted-foreground font-normal">(optional)</span></Label>
                                    <Textarea id="stayHowToReach" value={stayHowToReach} onChange={(e) => setStayHowToReach(e.target.value)}
                                        placeholder="Directions for travelers..." className="rounded-xl border-gray-200" maxLength={500} />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Transport Details */}
                    {type === "transport" && (
                        <Card className="rounded-2xl shadow-sm border-gray-100">
                            <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg"><Car className="w-5 h-5 text-primary" /> Vehicle Details</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2"><Label htmlFor="transportMake">Make</Label>
                                        <Input id="transportMake" value={transportMake} onChange={(e) => { setTransportMake(e.target.value); clearErr("transportMake"); }}
                                            placeholder="e.g. Toyota" className={cn("rounded-xl border-gray-200", errCls("transportMake"))} /><ErrMsg field="transportMake" /></div>
                                    <div className="space-y-2"><Label htmlFor="transportModel">Model</Label>
                                        <Input id="transportModel" value={transportModel} onChange={(e) => { setTransportModel(e.target.value); clearErr("transportModel"); }}
                                            placeholder="e.g. Land Cruiser Prado" className={cn("rounded-xl border-gray-200", errCls("transportModel"))} /><ErrMsg field="transportModel" /></div>
                                    <div className="space-y-2"><Label htmlFor="transportYear">Year</Label>
                                        <Input id="transportYear" type="number" min="2000" max="2030" value={transportYear}
                                            onChange={(e) => { setTransportYear(e.target.value); clearErr("transportYear"); }}
                                            className={cn("rounded-xl border-gray-200", errCls("transportYear"))} /><ErrMsg field="transportYear" /></div>
                                    <div className="space-y-2"><Label htmlFor="transportSeats">Seats</Label>
                                        <Input id="transportSeats" type="number" min="1" max="50" value={transportSeats}
                                            onChange={(e) => { setTransportSeats(e.target.value); clearErr("transportSeats"); }}
                                            className={cn("rounded-xl border-gray-200", errCls("transportSeats"))} /><ErrMsg field="transportSeats" /></div>
                                </div>
                                <div className="space-y-2"><Label htmlFor="transportTrans">Transmission</Label>
                                    <Select value={transportTransmission} onValueChange={setTransportTransmission}>
                                        <SelectTrigger id="transportTrans" className="rounded-xl border-gray-200"><SelectValue /></SelectTrigger>
                                        <SelectContent><SelectItem value="Manual">Manual</SelectItem><SelectItem value="Automatic">Automatic</SelectItem></SelectContent>
                                    </Select>
                                </div>
                                <div className="flex gap-8">
                                    <div className="flex items-center gap-3"><Switch checked={transportFourWd} onCheckedChange={setTransportFourWd} /><Label>4WD</Label></div>
                                    <div className="flex items-center gap-3"><Switch checked={transportFuelIncluded} onCheckedChange={setTransportFuelIncluded} /><Label>Fuel Included</Label></div>
                                </div>
                                <div className="space-y-2"><Label htmlFor="transportRoutes">Routes</Label>
                                    <TagInput id="transportRoutes" tags={transportRoutes} onChange={setTransportRoutes} placeholder="e.g. Gilgit → Hunza" /></div>
                                <div className="space-y-2"><Label htmlFor="transportTerrains">Terrains</Label>
                                    <TagInput id="transportTerrains" tags={transportTerrains} onChange={setTransportTerrains} placeholder="e.g. Mountain, Off-road" /></div>
                                <div className="space-y-2"><Label htmlFor="transportDriverExp">Driver Experience <span className="text-muted-foreground font-normal">(optional)</span></Label>
                                    <Textarea id="transportDriverExp" value={transportDriverExp} onChange={(e) => setTransportDriverExp(e.target.value)}
                                        placeholder="Years of experience, specialties..." className="rounded-xl border-gray-200" maxLength={300} /></div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Guide Details */}
                    {type === "guide" && (
                        <Card className="rounded-2xl shadow-sm border-gray-100">
                            <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg"><Compass className="w-5 h-5 text-primary" /> Guide Details</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2"><Label htmlFor="guideExpYears">Experience (years)</Label>
                                        <Input id="guideExpYears" type="number" min="0" max="50" value={guideExpYears}
                                            onChange={(e) => { setGuideExpYears(e.target.value); clearErr("guideExpYears"); }}
                                            className={cn("rounded-xl border-gray-200", errCls("guideExpYears"))} /><ErrMsg field="guideExpYears" /></div>
                                    <div className="space-y-2"><Label htmlFor="guideMaxGroup">Max Group Size</Label>
                                        <Input id="guideMaxGroup" type="number" min="1" max="50" value={guideMaxGroup}
                                            onChange={(e) => { setGuideMaxGroup(e.target.value); clearErr("guideMaxGroup"); }}
                                            className={cn("rounded-xl border-gray-200", errCls("guideMaxGroup"))} /><ErrMsg field="guideMaxGroup" /></div>
                                </div>
                                <div className="space-y-2"><Label htmlFor="guideCerts">Certifications</Label>
                                    <TagInput id="guideCerts" tags={guideCerts} onChange={setGuideCerts} placeholder="e.g. UIAA Mountain Guide" /></div>
                                <div className="space-y-2"><Label htmlFor="guideTrekRoutes">Trek Routes</Label>
                                    <TagInput id="guideTrekRoutes" tags={guideTrekRoutes} onChange={setGuideTrekRoutes} placeholder="e.g. Nanga Parbat Base Camp - 7 days" /></div>
                                <div className="space-y-2"><Label htmlFor="guideEquipment">Equipment Provided</Label>
                                    <TagInput id="guideEquipment" tags={guideEquipment} onChange={setGuideEquipment} placeholder="e.g. Tent, Sleeping Bag, Crampons" /></div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 2 Actions */}
                    <div className="flex items-center justify-between pt-2">
                        {!isEditMode ? (
                            <Button type="button" variant="outline" className="rounded-xl gap-2"
                                onClick={() => { if (window.confirm("Going back will keep your details. Change service type?")) setStep(1); }}>
                                <ArrowLeft className="w-4 h-4" /> Back
                            </Button>
                        ) : <div />}
                        <Button className="rounded-xl gap-2" onClick={() => { if (validateStep2()) setStep(3); }}>
                            Continue <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}

            {/* ══ STEP 3 — Photos ════════════════════════ */}
            {step === 3 && (
                <div className="space-y-6">
                    <Card className="rounded-2xl shadow-sm border-gray-100">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg"><ImageIcon className="w-5 h-5 text-primary" /> Photos</CardTitle>
                            <CardDescription>Upload up to 8 images. At least 1 required. JPEG, PNG, or WebP (max 10MB each).</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            {/* Preview grid */}
                            {previews.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                                    {previews.map((preview, i) => (
                                        <div key={i} className="relative aspect-video rounded-xl overflow-hidden border border-gray-200 group">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                            <button type="button" onClick={() => removeImage(i)}
                                                className="absolute top-1.5 right-1.5 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600 transition opacity-0 group-hover:opacity-100">
                                                <X className="w-3 h-3" />
                                            </button>
                                            {i < existingImageIds.length && (
                                                <span className="absolute bottom-1.5 left-1.5 text-[10px] bg-black/50 text-white px-1.5 py-0.5 rounded">Existing</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {/* Upload area */}
                            {totalImages < 8 && (
                                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                                    onClick={() => fileInputRef.current?.click()}>
                                    <Upload className="w-8 h-8 text-primary mx-auto mb-3" />
                                    <p className="font-medium text-foreground">Click to upload images</p>
                                    <p className="text-xs text-muted-foreground mt-1">{totalImages}/8 images uploaded</p>
                                    <input type="file" className="hidden" multiple accept="image/jpeg,image/png,image/webp"
                                        ref={fileInputRef} onChange={handleFileSelect} />
                                </div>
                            )}
                            {totalImages >= 8 && <p className="text-sm text-muted-foreground text-center py-2">Maximum 8 images reached.</p>}
                        </CardContent>
                    </Card>

                    {/* Step 3 Actions */}
                    <div className="flex items-center justify-between pt-2">
                        <Button type="button" variant="outline" className="rounded-xl gap-2" onClick={() => setStep(2)} disabled={isSubmitting}>
                            <ArrowLeft className="w-4 h-4" /> Back
                        </Button>
                        <Button className="rounded-xl gap-2 px-8" onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? (<><Loader2 className="w-4 h-4 animate-spin" /> {isEditMode ? "Saving..." : "Publishing..."}</>)
                                : (<><Save className="w-4 h-4" /> {isEditMode ? "Save Changes" : "Publish Listing"}</>)}
                        </Button>
                    </div>
                </div>
            )}

            {/* ══ EDIT MODE: Visibility & Danger Zone ═══ */}
            {isEditMode && listingId && step !== 1 && (
                <div className="space-y-4 pt-4 border-t border-gray-100 mt-8">
                    {/* Toggle Active */}
                    <Card className="rounded-2xl shadow-sm border-gray-100">
                        <CardContent className="p-5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {currentActive ? <Eye className="w-5 h-5 text-green-600" /> : <EyeOff className="w-5 h-5 text-gray-400" />}
                                <div>
                                    <p className="font-medium text-foreground">Listing Visibility</p>
                                    <p className="text-xs text-muted-foreground">{currentActive ? "Visible to travelers" : "Hidden from travelers"}</p>
                                </div>
                            </div>
                            <Switch checked={currentActive} onCheckedChange={handleToggleActive} disabled={isToggling} />
                        </CardContent>
                    </Card>

                    {/* Danger Zone */}
                    <Card className="rounded-2xl shadow-sm border-red-200">
                        <CardContent className="p-5 flex items-center justify-between">
                            <div>
                                <p className="font-medium text-red-700">Danger Zone</p>
                                <p className="text-xs text-muted-foreground">Permanently delete this listing and all images.</p>
                            </div>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm" className="rounded-xl gap-2"><Trash2 className="w-4 h-4" /> Delete</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Delete this listing?</AlertDialogTitle>
                                        <AlertDialogDescription>This action cannot be undone. The listing and all its images will be permanently deleted.</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleDelete} className="rounded-xl bg-red-600 hover:bg-red-700">Yes, Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
