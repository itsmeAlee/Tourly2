"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, MapPin, Tag, Image as ImageIcon, Users, Bed, Bath, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createListing } from "@/services/listing.service";
import { uploadListingImage, deleteFile } from "@/services/storage.service";
import { BUCKETS } from "@/lib/appwrite-config";
import { useToast } from "@/components/ui/use-toast";
import type { CreateListingInput, ListingType } from "@/types/listing.types";

export function ProviderCreateListingClient() {
    const router = useRouter();
    const { user } = useAuth();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [title, setTitle] = useState("");
    const [type, setType] = useState<ListingType>("stay");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [region, setRegion] = useState("");
    const [price, setPrice] = useState("");
    const [priceUnit, setPriceUnit] = useState("night");
    const [highlights, setHighlights] = useState("");

    // Files state
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    // Stay details state
    const [stayGuests, setStayGuests] = useState("");
    const [stayBedrooms, setStayBedrooms] = useState("");
    const [stayBeds, setStayBeds] = useState("");
    const [stayBathrooms, setStayBathrooms] = useState("");
    const [stayAmenities, setStayAmenities] = useState("");

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;

        const newFiles = Array.from(e.target.files);
        const validFiles: File[] = [];

        newFiles.forEach((file) => {
            if (file.size > 10 * 1024 * 1024) {
                toast({
                    title: "File too large",
                    description: `${file.name} exceeds the 10MB limit.`,
                    variant: "destructive"
                });
                return;
            }
            if (!file.type.startsWith("image/")) {
                toast({
                    title: "Invalid file type",
                    description: `${file.name} is not an image.`,
                    variant: "destructive"
                });
                return;
            }
            validFiles.push(file);
        });

        setFiles((prev) => [...prev, ...validFiles]);
        validFiles.forEach((file) => {
            setPreviews((prev) => [...prev, URL.createObjectURL(file)]);
        });

        // Reset input to allow selecting same files again if needed
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
        setPreviews((prev) => {
            const newPreviews = [...prev];
            URL.revokeObjectURL(newPreviews[index]); // Free memory
            newPreviews.splice(index, 1);
            return newPreviews;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user || !user.providerId) {
            toast({
                title: "Authentication required",
                description: "You must be a verified provider to create a listing.",
                variant: "destructive"
            });
            return;
        }

        if (files.length === 0) {
            toast({
                title: "Images missing",
                description: "Please upload at least one image.",
                variant: "destructive"
            });
            return;
        }

        if (type !== "stay") {
            toast({
                title: "Not supported",
                description: "Currently, only 'stay' listings are supported for creation via UI.",
                variant: "destructive"
            });
            return;
        }

        setIsSubmitting(true);
        const uploadedFileIds: string[] = [];

        try {
            // 1. Upload Images individually
            for (const file of files) {
                const fileId = await uploadListingImage(file, user.providerId);
                uploadedFileIds.push(fileId);
            }

            // 2. Parse basic arrays from comma-separated inputs
            const highlightsList = highlights.split(",").map(s => s.trim()).filter(Boolean);
            const amenitiesList = stayAmenities.split(",").map(s => s.trim()).filter(Boolean);

            // 3. Construct Payload
            const payload: CreateListingInput = {
                type: "stay",
                provider_id: user.providerId,
                title,
                description,
                location,
                region,
                price: Number(price),
                price_unit: priceUnit,
                images: uploadedFileIds,
                highlights: highlightsList,
                is_active: true, // Auto-publish for now
                details: {
                    guests: Number(stayGuests),
                    bedrooms: Number(stayBedrooms),
                    beds: Number(stayBeds),
                    bathrooms: Number(stayBathrooms),
                    amenities: amenitiesList,
                }
            };

            // 4. Send to Appwrite via service layer
            await createListing(payload);

            toast({
                title: "Success!",
                description: "Your listing has been published.",
            });

            // Redirect
            router.push("/provider/listings");
        } catch (error: any) {
            console.error("[CreateListing] Failed to create:", error);

            // Rollback uploaded images if creation failed
            if (uploadedFileIds.length > 0) {
                console.log("Rolling back images...");
                await Promise.allSettled(
                    uploadedFileIds.map((id) => deleteFile(BUCKETS.LISTING_IMAGES, id))
                );
            }

            toast({
                title: "Error creating listing",
                description: error.message || "An unexpected error occurred. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                <Link href="/provider/listings">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Create New Listing</h1>
                    <p className="text-sm text-muted-foreground mt-1">Fill in the details to publish your service.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <Card className="rounded-2xl shadow-sm border-gray-100 overflow-hidden">
                    <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Tag className="w-5 h-5 text-primary" />
                            Basic Information
                        </CardTitle>
                        <CardDescription>What kind of service are you offering?</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="title">Listing Title</Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Serena Hotel Double Suite"
                                    required
                                    className="rounded-xl border-gray-200"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="type">Service Type</Label>
                                <Select value={type} onValueChange={(val: any) => setType(val)} required>
                                    <SelectTrigger id="type" className="rounded-xl border-gray-200">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="stay">Stay / Hotel</SelectItem>
                                        <SelectItem value="tour" disabled>Tour Package (Coming soon)</SelectItem>
                                        <SelectItem value="transport" disabled>Transport (Coming soon)</SelectItem>
                                        <SelectItem value="guide" disabled>Local Guide (Coming soon)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description (Markdown supported)</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe your service, amenities, and what tourists can expect..."
                                className="min-h-[120px] rounded-xl border-gray-200"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="highlights">Highlights (Comma separated)</Label>
                            <Input
                                id="highlights"
                                value={highlights}
                                onChange={(e) => setHighlights(e.target.value)}
                                placeholder="e.g. WiFi, Parking, Breakfast included"
                                className="rounded-xl border-gray-200"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Location & Pricing */}
                <Card className="rounded-2xl shadow-sm border-gray-100 overflow-hidden">
                    <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <MapPin className="w-5 h-5 text-primary" />
                            Location & Pricing
                        </CardTitle>
                        <CardDescription>Where is it, and how much does it cost?</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="location">Specific Location</Label>
                                <Input
                                    id="location"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="e.g. Upper Kachura, Skardu"
                                    required
                                    className="rounded-xl border-gray-200"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="region">Geographic Region</Label>
                                <Input
                                    id="region"
                                    value={region}
                                    onChange={(e) => setRegion(e.target.value)}
                                    placeholder="e.g. Skardu, Hunza"
                                    required
                                    className="rounded-xl border-gray-200"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="price">Base Price (PKR)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    min="0"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="e.g. 15000"
                                    required
                                    className="rounded-xl border-gray-200"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="priceUnit">Price Unit</Label>
                                <Select value={priceUnit} onValueChange={setPriceUnit} required>
                                    <SelectTrigger id="priceUnit" className="rounded-xl border-gray-200">
                                        <SelectValue placeholder="Select unit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="night">Per Night</SelectItem>
                                        <SelectItem value="person">Per Person</SelectItem>
                                        <SelectItem value="day">Per Day</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Stay specifics */}
                {type === "stay" && (
                    <Card className="rounded-2xl shadow-sm border-gray-100 overflow-hidden">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Bed className="w-5 h-5 text-primary" />
                                Stay Specifics
                            </CardTitle>
                            <CardDescription>Details about the accommodation.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                                <div className="space-y-2">
                                    <Label htmlFor="stayGuests">Max Guests</Label>
                                    <Input id="stayGuests" type="number" min="1" value={stayGuests} onChange={(e) => setStayGuests(e.target.value)} required className="rounded-xl border-gray-200" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="stayBedrooms">Bedrooms</Label>
                                    <Input id="stayBedrooms" type="number" min="0" value={stayBedrooms} onChange={(e) => setStayBedrooms(e.target.value)} required className="rounded-xl border-gray-200" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="stayBeds">Beds</Label>
                                    <Input id="stayBeds" type="number" min="1" value={stayBeds} onChange={(e) => setStayBeds(e.target.value)} required className="rounded-xl border-gray-200" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="stayBathrooms">Bathrooms</Label>
                                    <Input id="stayBathrooms" type="number" min="1" value={stayBathrooms} onChange={(e) => setStayBathrooms(e.target.value)} required className="rounded-xl border-gray-200" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="stayAmenities">Amenities (Comma separated)</Label>
                                <Input
                                    id="stayAmenities"
                                    value={stayAmenities}
                                    onChange={(e) => setStayAmenities(e.target.value)}
                                    placeholder="e.g. WiFi, Air Conditioning, TV"
                                    required
                                    className="rounded-xl border-gray-200"
                                />
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Images */}
                <Card className="rounded-2xl shadow-sm border-gray-100 overflow-hidden">
                    <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <ImageIcon className="w-5 h-5 text-primary" />
                            Images
                        </CardTitle>
                        <CardDescription>Upload high-quality images of your offering. At least one required.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        {previews.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                                {previews.map((preview, i) => (
                                    <div key={i} className="relative aspect-video rounded-xl overflow-hidden border">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={preview} alt="Upload preview" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeFile(i)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600 transition"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div
                            className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-3">
                                <ImageIcon className="w-6 h-6 text-primary" />
                            </div>
                            <p className="font-medium text-foreground">Click to upload images</p>
                            <p className="text-xs text-muted-foreground mt-1">PNG, JPG or WebP (max. 10MB)</p>
                            <Input
                                type="file"
                                className="hidden"
                                multiple
                                accept="image/jpeg,image/png,image/webp"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex items-center justify-end gap-4 pt-4">
                    <Link href="/provider/listings">
                        <Button type="button" variant="outline" className="rounded-xl">
                            Cancel
                        </Button>
                    </Link>
                    <Button type="submit" disabled={isSubmitting} className="rounded-xl flex items-center gap-2 px-8">
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Publishing...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Save & Publish
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
