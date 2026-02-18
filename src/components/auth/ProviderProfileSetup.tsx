"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, Info } from "lucide-react";
import { ID, Query, AppwriteException } from "appwrite";
import { databases } from "@/lib/appwrite";
import { DATABASE_ID, COLLECTIONS } from "@/lib/appwrite-config";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

// ─── Constants ──────────────────────────────────────────

const REGIONS = [
    "Hunza",
    "Gilgit",
    "Skardu",
    "Nagar",
    "Chilas",
    "Ghizer",
    "Diamer",
    "Astore",
    "Khunjerab",
] as const;

const LANGUAGES = [
    "English",
    "Urdu",
    "Shina",
    "Burushaski",
    "Balti",
    "Wakhi",
    "Khowar",
] as const;

// ─── Types ──────────────────────────────────────────────

interface FormErrors {
    businessName?: string;
    region?: string;
    bio?: string;
}

// ─── Component ──────────────────────────────────────────

export function ProviderProfileSetup() {
    const router = useRouter();
    const { user, isLoading: authLoading, isAuthenticated, refreshUser } = useAuth();

    const [businessName, setBusinessName] = useState("");
    const [region, setRegion] = useState("");
    const [bio, setBio] = useState("");
    const [languages, setLanguages] = useState<string[]>([]);
    const [phone, setPhone] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [serverError, setServerError] = useState("");
    const [isCheckingProvider, setIsCheckingProvider] = useState(true);

    // ── Access Control ──────────────────────────────────

    const checkAccess = useCallback(async () => {
        if (authLoading) return;

        // Not authenticated → redirect
        if (!isAuthenticated || !user) {
            router.push("/");
            return;
        }

        // Not a provider → redirect
        if (user.role !== "provider") {
            router.push("/");
            return;
        }

        // Already has a provider profile → redirect to dashboard
        try {
            const existing = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.PROVIDERS,
                [Query.equal("user_id", user.id), Query.limit(1)]
            );
            if (existing.documents.length > 0) {
                router.push("/dashboard");
                return;
            }
        } catch {
            // If query fails, let them continue — they can retry submit
        }

        setIsCheckingProvider(false);
    }, [authLoading, isAuthenticated, user, router]);

    useEffect(() => {
        checkAccess();
    }, [checkAccess]);

    // ── Validation ──────────────────────────────────────

    const validate = (): FormErrors => {
        const errs: FormErrors = {};
        if (!businessName.trim()) {
            errs.businessName = "Business name is required";
        } else if (businessName.trim().length < 3) {
            errs.businessName = "Business name must be at least 3 characters";
        }
        if (!region) {
            errs.region = "Please select a region";
        }
        if (bio.length > 500) {
            errs.bio = "Bio must be 500 characters or fewer";
        }
        return errs;
    };

    const clearError = (field: keyof FormErrors) => {
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
        if (serverError) setServerError("");
    };

    // ── Language Toggle ─────────────────────────────────

    const toggleLanguage = (lang: string) => {
        setLanguages((prev) =>
            prev.includes(lang)
                ? prev.filter((l) => l !== lang)
                : [...prev, lang]
        );
    };

    // ── Submit Handler ──────────────────────────────────

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerError("");

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        if (!user) return;

        setIsSubmitting(true);

        try {
            await databases.createDocument(
                DATABASE_ID,
                COLLECTIONS.PROVIDERS,
                ID.unique(),
                {
                    user_id: user.id,
                    business_name: businessName.trim(),
                    bio: bio.trim() || undefined,
                    region,
                    languages: languages.length > 0 ? languages : undefined,
                    phone: phone.trim() || undefined,
                    is_verified: false,
                    rating: 0,
                    review_count: 0,
                    created_at: new Date().toISOString(),
                }
            );

            // Refresh auth so providerId is populated
            await refreshUser();

            toast.success("Profile created! Welcome to Tourly.");
            router.push("/dashboard");
            router.refresh();
        } catch (err: unknown) {
            if (err instanceof AppwriteException) {
                setServerError(
                    err.message || "Failed to create profile. Please try again."
                );
            } else {
                setServerError(
                    "Failed to create profile. Please try again."
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // ── Loading / Gate ──────────────────────────────────

    if (authLoading || isCheckingProvider) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-muted-foreground">
                        Checking your account…
                    </p>
                </div>
            </div>
        );
    }

    // ── Render ───────────────────────────────────────────

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-[520px] bg-white rounded-2xl shadow-lg p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <svg
                            viewBox="0 0 24 24"
                            className="w-7 h-7 text-primary"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                            <rect x="1" y="10" width="22" height="10" rx="2" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-foreground mb-2">
                        Set up your provider profile
                    </h1>
                    <p className="text-muted-foreground">
                        Tell travelers about your business
                    </p>
                </div>

                {/* Progress indicator */}
                <div className="flex items-center gap-2 mb-8">
                    <div className="h-1 flex-1 rounded-full bg-primary" />
                    <div className="h-1 flex-1 rounded-full bg-primary/30" />
                </div>

                {/* Server Error */}
                {serverError && (
                    <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                        <span>{serverError}</span>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Business Name */}
                    <div>
                        <label
                            htmlFor="provider-business"
                            className="block text-sm font-medium text-foreground mb-2"
                        >
                            Business or Service Name
                        </label>
                        <input
                            id="provider-business"
                            type="text"
                            value={businessName}
                            onChange={(e) => {
                                setBusinessName(e.target.value);
                                clearError("businessName");
                            }}
                            placeholder="e.g. Ali's Mountain Retreat, Karim Transport Services"
                            className={cn(
                                "w-full px-4 py-3 rounded-xl border bg-white",
                                "text-foreground placeholder:text-muted-foreground",
                                "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                                "transition-colors",
                                errors.businessName &&
                                "border-red-300 focus:ring-red-200 focus:border-red-400"
                            )}
                            disabled={isSubmitting}
                        />
                        {errors.businessName && (
                            <p className="mt-1.5 text-xs text-red-500">
                                {errors.businessName}
                            </p>
                        )}
                    </div>

                    {/* Region */}
                    <div>
                        <label
                            htmlFor="provider-region"
                            className="block text-sm font-medium text-foreground mb-2"
                        >
                            Region
                        </label>
                        <select
                            id="provider-region"
                            value={region}
                            onChange={(e) => {
                                setRegion(e.target.value);
                                clearError("region");
                            }}
                            className={cn(
                                "w-full px-4 py-3 rounded-xl border bg-white",
                                "text-foreground",
                                "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                                "transition-colors appearance-none",
                                !region && "text-muted-foreground",
                                errors.region &&
                                "border-red-300 focus:ring-red-200 focus:border-red-400"
                            )}
                            disabled={isSubmitting}
                        >
                            <option value="" disabled>
                                Select your region
                            </option>
                            {REGIONS.map((r) => (
                                <option key={r} value={r}>
                                    {r}
                                </option>
                            ))}
                        </select>
                        {errors.region && (
                            <p className="mt-1.5 text-xs text-red-500">
                                {errors.region}
                            </p>
                        )}
                    </div>

                    {/* Bio */}
                    <div>
                        <label
                            htmlFor="provider-bio"
                            className="block text-sm font-medium text-foreground mb-2"
                        >
                            About your service{" "}
                            <span className="text-muted-foreground font-normal">
                                (optional)
                            </span>
                        </label>
                        <textarea
                            id="provider-bio"
                            value={bio}
                            onChange={(e) => {
                                setBio(e.target.value);
                                clearError("bio");
                            }}
                            rows={4}
                            maxLength={500}
                            placeholder="Describe your service, experience, and what makes you unique..."
                            className={cn(
                                "w-full px-4 py-3 rounded-xl border bg-white resize-none",
                                "text-foreground placeholder:text-muted-foreground",
                                "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                                "transition-colors",
                                errors.bio &&
                                "border-red-300 focus:ring-red-200 focus:border-red-400"
                            )}
                            disabled={isSubmitting}
                        />
                        <div className="flex justify-between mt-1.5">
                            {errors.bio ? (
                                <p className="text-xs text-red-500">
                                    {errors.bio}
                                </p>
                            ) : (
                                <span />
                            )}
                            <p
                                className={cn(
                                    "text-xs",
                                    bio.length > 450
                                        ? "text-amber-500"
                                        : "text-muted-foreground"
                                )}
                            >
                                {bio.length} / 500
                            </p>
                        </div>
                    </div>

                    {/* Languages */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-3">
                            Languages spoken{" "}
                            <span className="text-muted-foreground font-normal">
                                (optional)
                            </span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {LANGUAGES.map((lang) => (
                                <button
                                    key={lang}
                                    type="button"
                                    onClick={() => toggleLanguage(lang)}
                                    className={cn(
                                        "px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-150",
                                        languages.includes(lang)
                                            ? "border-primary bg-primary/10 text-primary"
                                            : "border-gray-200 bg-white text-muted-foreground hover:border-gray-300"
                                    )}
                                    disabled={isSubmitting}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Phone */}
                    <div>
                        <div className="flex items-center gap-1.5 mb-2">
                            <label
                                htmlFor="provider-phone"
                                className="block text-sm font-medium text-foreground"
                            >
                                Contact Number{" "}
                                <span className="text-muted-foreground font-normal">
                                    (optional)
                                </span>
                            </label>
                            <div className="relative group">
                                <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                    Your phone number will never be shown to tourists
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-gray-900 rotate-45" />
                                </div>
                            </div>
                        </div>
                        <input
                            id="provider-phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+92 3XX XXXXXXX"
                            className={cn(
                                "w-full px-4 py-3 rounded-xl border bg-white",
                                "text-foreground placeholder:text-muted-foreground",
                                "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                                "transition-colors"
                            )}
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Submit */}
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-12 text-base font-semibold rounded-xl"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Creating profile...
                            </>
                        ) : (
                            "Complete Setup & Go to Dashboard"
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
}
