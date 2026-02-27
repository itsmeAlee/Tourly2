"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Camera, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import { updateUserName, updateUserAvatar } from "@/services/user.service";
import { getProviderByUserId, updateProvider } from "@/services/provider.service";
import type { ProviderDocument } from "@/types/provider.types";

// ─── Constants ──────────────────────────────────────────

const REGIONS = [
    "Hunza", "Gilgit", "Skardu", "Nagar",
    "Chilas", "Ghizer", "Diamer", "Astore", "Khunjerab",
] as const;

const LANGUAGES = [
    "English", "Urdu", "Burushaski", "Shina",
    "Wakhi", "Balti", "Khowar", "Pashto",
] as const;

const MAX_AVATAR_SIZE = 3 * 1024 * 1024; // 3 MB
const MAX_BIO_LENGTH = 500;

// ─── Component ──────────────────────────────────────────

export function EditProfileClient() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading: authLoading, refreshUser } = useAuth();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // ── Form state ──
    const [name, setName] = useState("");
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarError, setAvatarError] = useState("");

    // ── Provider state ──
    const [providerDoc, setProviderDoc] = useState<ProviderDocument | null>(null);
    const [providerLoading, setProviderLoading] = useState(false);
    const [businessName, setBusinessName] = useState("");
    const [bio, setBio] = useState("");
    const [region, setRegion] = useState("");
    const [languages, setLanguages] = useState<string[]>([]);

    // ── Submission state ──
    const [isSaving, setIsSaving] = useState(false);

    // ── Validation errors ──
    const [errors, setErrors] = useState<Record<string, string>>({});

    // ── Initial values (for dirty check) ──
    const initialValues = useRef({
        name: "",
        businessName: "",
        bio: "",
        region: "",
        languages: [] as string[],
    });

    // ── Hydrate form with current user data ──
    useEffect(() => {
        if (user) {
            setName(user.name);
            setAvatarPreview(user.avatar || null);
            initialValues.current.name = user.name;
        }
    }, [user]);

    // ── Fetch provider data if provider role ──
    useEffect(() => {
        if (!user || user.role !== "provider") return;

        let cancelled = false;
        setProviderLoading(true);

        getProviderByUserId(user.id)
            .then((doc) => {
                if (!cancelled && doc) {
                    setProviderDoc(doc);
                    setBusinessName(doc.business_name || "");
                    setBio(doc.bio || "");
                    setRegion(doc.region || "");
                    setLanguages(doc.languages || []);

                    initialValues.current.businessName = doc.business_name || "";
                    initialValues.current.bio = doc.bio || "";
                    initialValues.current.region = doc.region || "";
                    initialValues.current.languages = doc.languages || [];
                }
            })
            .catch((err) => {
                console.error("[EditProfile] Failed to fetch provider:", err);
            })
            .finally(() => {
                if (!cancelled) setProviderLoading(false);
            });

        return () => { cancelled = true; };
    }, [user]);

    // ── Dirty check ──
    const isDirty = useCallback(() => {
        if (avatarFile) return true;
        if (name !== initialValues.current.name) return true;
        if (user?.role === "provider") {
            if (businessName !== initialValues.current.businessName) return true;
            if (bio !== initialValues.current.bio) return true;
            if (region !== initialValues.current.region) return true;
            if (JSON.stringify(languages.sort()) !== JSON.stringify(initialValues.current.languages.sort())) return true;
        }
        return false;
    }, [name, businessName, bio, region, languages, avatarFile, user?.role]);

    // ── Unsaved changes guard ──
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty()) {
                e.preventDefault();
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [isDirty]);

    // ── Avatar file selection ──
    const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAvatarError("");

        if (!file.type.startsWith("image/")) {
            setAvatarError("Please select an image file.");
            return;
        }

        if (file.size > MAX_AVATAR_SIZE) {
            setAvatarError("Photo must be under 3 MB.");
            return;
        }

        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    // ── Validation ──
    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        const trimmedName = name.trim();
        if (!trimmedName) newErrors.name = "Name is required.";
        else if (trimmedName.length < 2) newErrors.name = "Name must be at least 2 characters.";
        else if (trimmedName.length > 100) newErrors.name = "Name must be under 100 characters.";

        if (user?.role === "provider") {
            const trimmedBiz = businessName.trim();
            if (!trimmedBiz) newErrors.businessName = "Business name is required.";
            else if (trimmedBiz.length < 3) newErrors.businessName = "Business name must be at least 3 characters.";

            if (!region) newErrors.region = "Please select a region.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ── Navigate back with dirty check ──
    const handleBack = () => {
        if (isDirty()) {
            if (!window.confirm("You have unsaved changes. Leave anyway?")) return;
        }
        if (window.history.length > 1) {
            router.back();
        } else {
            router.push("/account");
        }
    };

    // ── Save handler ──
    const handleSave = async () => {
        if (!user) return;
        if (!validate()) return;

        setIsSaving(true);

        try {
            const updates: Promise<unknown>[] = [];

            // 1) Name update
            if (name.trim() !== initialValues.current.name) {
                updates.push(
                    updateUserName(user.id, name.trim()).catch((err) => {
                        throw new Error(`name:${err instanceof Error ? err.message : "Couldn't update your name."}`);
                    })
                );
            }

            // 2) Avatar upload
            if (avatarFile) {
                updates.push(
                    updateUserAvatar(user.id, avatarFile).catch((err) => {
                        throw new Error(`avatar:${err instanceof Error ? err.message : "Couldn't upload photo."}`);
                    })
                );
            }

            // 3) Provider profile update
            if (user.role === "provider" && providerDoc) {
                const providerChanged =
                    businessName.trim() !== initialValues.current.businessName ||
                    bio.trim() !== initialValues.current.bio ||
                    region !== initialValues.current.region ||
                    JSON.stringify(languages.sort()) !== JSON.stringify(initialValues.current.languages.sort());

                if (providerChanged) {
                    updates.push(
                        updateProvider(providerDoc.$id, {
                            business_name: businessName.trim(),
                            bio: bio.trim(),
                            region,
                            languages,
                        }).catch((err) => {
                            throw new Error(`provider:${err instanceof Error ? err.message : "Couldn't update provider profile."}`);
                        })
                    );
                }
            }

            if (updates.length === 0) {
                toast({ title: "No changes", description: "Nothing was modified." });
                setIsSaving(false);
                return;
            }

            await Promise.all(updates);

            // Refresh auth context to reflect new name/avatar
            await refreshUser();

            toast({ title: "Profile updated!", description: "Your changes have been saved." });
            router.push("/account");
        } catch (err) {
            const message = err instanceof Error ? err.message : "Something went wrong.";
            const prefix = message.split(":")[0];

            if (prefix === "name") {
                toast({ title: "Name update failed", description: message.slice(5), variant: "destructive" });
            } else if (prefix === "avatar") {
                toast({ title: "Avatar upload failed", description: "Couldn't upload photo. Max size is 3MB.", variant: "destructive" });
            } else if (prefix === "provider") {
                toast({ title: "Provider update failed", description: message.slice(9), variant: "destructive" });
            } else {
                toast({ title: "Update failed", description: message, variant: "destructive" });
            }
        } finally {
            setIsSaving(false);
        }
    };

    // ── Auth guard ──
    if (authLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        router.push("/login?next=/account/edit");
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ─── Sticky Header ─── */}
            <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-14">
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors -ml-2 p-2 rounded-lg hover:bg-gray-50"
                            aria-label="Go back"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="hidden sm:inline text-sm font-medium">Back</span>
                        </button>

                        <h1 className="text-base font-semibold text-foreground">
                            Edit Profile
                        </h1>

                        <Button
                            onClick={handleSave}
                            disabled={isSaving || !isDirty()}
                            size="sm"
                            className="rounded-xl min-w-[72px]"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                                    Saving
                                </>
                            ) : (
                                "Save"
                            )}
                        </Button>
                    </div>
                </div>
            </header>

            {/* ─── Content ─── */}
            <main className="container mx-auto px-4 py-8 max-w-lg">
                {/* ── Avatar Section ── */}
                <div className="text-center mb-8">
                    <div
                        className="relative inline-block cursor-pointer group"
                        onClick={() => fileInputRef.current?.click()}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === "Enter") fileInputRef.current?.click(); }}
                        aria-label="Change profile photo"
                    >
                        {avatarPreview ? (
                            <img
                                src={avatarPreview}
                                alt={name}
                                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg group-hover:opacity-80 transition-opacity"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-white shadow-lg group-hover:opacity-80 transition-opacity">
                                <span className="text-3xl font-bold text-primary">
                                    {name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        )}
                        <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-md">
                            <Camera className="w-4 h-4" />
                        </div>
                    </div>

                    <p className="text-sm text-muted-foreground mt-3">
                        Tap to change photo
                    </p>

                    {avatarFile && (
                        <span className="inline-block text-xs text-primary bg-primary/10 px-3 py-1 rounded-full mt-2">
                            New photo selected — will save when you tap Save
                        </span>
                    )}

                    {avatarError && (
                        <div className="flex items-center justify-center gap-1.5 mt-2 text-red-500 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            {avatarError}
                        </div>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handleAvatarSelect}
                    />
                </div>

                {/* ── Basic Info ── */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                        Basic Info
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name" className="text-sm font-medium">
                                Full Name
                            </Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                                }}
                                placeholder="Your full name"
                                className={cn(
                                    "mt-1.5 rounded-xl",
                                    errors.name && "border-red-400 focus-visible:ring-red-400"
                                )}
                                maxLength={100}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                                Email
                            </Label>
                            <Input
                                value={user.email}
                                disabled
                                className="mt-1.5 rounded-xl bg-gray-50 text-muted-foreground"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Email cannot be changed
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── Provider Section ── */}
                {user.role === "provider" && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                            Provider Profile
                        </h3>

                        {providerLoading ? (
                            <div className="space-y-4">
                                <Skeleton className="h-10 w-full rounded-xl" />
                                <Skeleton className="h-10 w-full rounded-xl" />
                                <Skeleton className="h-24 w-full rounded-xl" />
                                <Skeleton className="h-10 w-full rounded-xl" />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Business Name */}
                                <div>
                                    <Label htmlFor="businessName" className="text-sm font-medium">
                                        Business Name
                                    </Label>
                                    <Input
                                        id="businessName"
                                        value={businessName}
                                        onChange={(e) => {
                                            setBusinessName(e.target.value);
                                            if (errors.businessName) setErrors((prev) => ({ ...prev, businessName: "" }));
                                        }}
                                        placeholder="Your business name"
                                        className={cn(
                                            "mt-1.5 rounded-xl",
                                            errors.businessName && "border-red-400 focus-visible:ring-red-400"
                                        )}
                                    />
                                    {errors.businessName && (
                                        <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                                            <AlertCircle className="w-3.5 h-3.5" />
                                            {errors.businessName}
                                        </p>
                                    )}
                                </div>

                                {/* Region */}
                                <div>
                                    <Label htmlFor="region" className="text-sm font-medium">
                                        Region
                                    </Label>
                                    <Select
                                        value={region}
                                        onValueChange={(val) => {
                                            setRegion(val);
                                            if (errors.region) setErrors((prev) => ({ ...prev, region: "" }));
                                        }}
                                    >
                                        <SelectTrigger
                                            className={cn(
                                                "mt-1.5 rounded-xl",
                                                errors.region && "border-red-400"
                                            )}
                                        >
                                            <SelectValue placeholder="Select your region" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border shadow-lg z-50">
                                            {REGIONS.map((r) => (
                                                <SelectItem key={r} value={r}>
                                                    {r}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.region && (
                                        <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                                            <AlertCircle className="w-3.5 h-3.5" />
                                            {errors.region}
                                        </p>
                                    )}
                                </div>

                                {/* Bio */}
                                <div>
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="bio" className="text-sm font-medium">
                                            Bio
                                        </Label>
                                        <span className={cn(
                                            "text-xs",
                                            bio.length > MAX_BIO_LENGTH
                                                ? "text-red-500 font-medium"
                                                : "text-muted-foreground"
                                        )}>
                                            {bio.length}/{MAX_BIO_LENGTH}
                                        </span>
                                    </div>
                                    <Textarea
                                        id="bio"
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value.slice(0, MAX_BIO_LENGTH))}
                                        placeholder="Tell travelers about yourself and your services..."
                                        rows={4}
                                        className="mt-1.5 rounded-xl resize-none"
                                        maxLength={MAX_BIO_LENGTH}
                                    />
                                </div>

                                {/* Languages */}
                                <div>
                                    <Label className="text-sm font-medium mb-2 block">
                                        Languages
                                    </Label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {LANGUAGES.map((lang) => (
                                            <label
                                                key={lang}
                                                className={cn(
                                                    "flex items-center gap-2.5 px-3 py-2.5 rounded-xl border cursor-pointer transition-all",
                                                    languages.includes(lang)
                                                        ? "border-primary bg-primary/5 text-primary"
                                                        : "border-gray-200 hover:border-gray-300 text-foreground"
                                                )}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={languages.includes(lang)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setLanguages([...languages, lang]);
                                                        } else {
                                                            setLanguages(languages.filter((l) => l !== lang));
                                                        }
                                                    }}
                                                    className="sr-only"
                                                />
                                                <div
                                                    className={cn(
                                                        "w-4 h-4 rounded border-2 flex items-center justify-center transition-colors",
                                                        languages.includes(lang)
                                                            ? "bg-primary border-primary"
                                                            : "border-gray-300"
                                                    )}
                                                >
                                                    {languages.includes(lang) && (
                                                        <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                                                            <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <span className="text-sm font-medium">{lang}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Bottom spacer for mobile nav */}
                <div className="h-8" />
            </main>
        </div>
    );
}
