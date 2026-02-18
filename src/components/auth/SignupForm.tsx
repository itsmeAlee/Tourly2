"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Eye,
    EyeOff,
    Loader2,
    Compass,
    Briefcase,
    AlertCircle,
} from "lucide-react";
import { ID, AppwriteException } from "appwrite";
import { account, databases } from "@/lib/appwrite";
import { DATABASE_ID, COLLECTIONS } from "@/lib/appwrite-config";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────

type UserRole = "tourist" | "provider";

interface FormErrors {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    role?: string;
}

// ─── Validation ─────────────────────────────────────────

function validateForm(fields: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: UserRole | null;
}): FormErrors {
    const errors: FormErrors = {};

    // Name
    if (!fields.name.trim()) {
        errors.name = "Full name is required";
    } else if (fields.name.trim().length < 2) {
        errors.name = "Name must be at least 2 characters";
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!fields.email.trim()) {
        errors.email = "Email is required";
    } else if (!emailRegex.test(fields.email)) {
        errors.email = "Please enter a valid email address";
    }

    // Password
    if (!fields.password) {
        errors.password = "Password is required";
    } else if (fields.password.length < 8) {
        errors.password = "Password must be at least 8 characters";
    } else if (!/\d/.test(fields.password)) {
        errors.password = "Password must contain at least 1 number";
    }

    // Confirm Password
    if (!fields.confirmPassword) {
        errors.confirmPassword = "Please confirm your password";
    } else if (fields.confirmPassword !== fields.password) {
        errors.confirmPassword = "Passwords do not match";
    }

    // Role
    if (!fields.role) {
        errors.role = "Please select an account type";
    }

    return errors;
}

// ─── Component ──────────────────────────────────────────

export function SignupForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { refreshUser } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState<UserRole | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [serverError, setServerError] = useState("");

    const redirectTo = searchParams.get("next") || "/";

    // Clear field error on change
    const clearError = (field: keyof FormErrors) => {
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
        if (serverError) setServerError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerError("");

        // Validate
        const validationErrors = validateForm({
            name,
            email,
            password,
            confirmPassword,
            role,
        });
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);

        try {
            // 1. Create the Appwrite account
            const newAccount = await account.create(
                ID.unique(),
                email,
                password,
                name.trim()
            );

            // 2. Create a session (auto-login)
            await account.createEmailPasswordSession(email, password);

            // 3. Send verification email
            try {
                const verifyUrl = `${window.location.origin}/verify-email`;
                await account.createVerification(verifyUrl);
            } catch {
                // Non-critical — don't block signup if verification email fails
                console.warn("[SignupForm] Failed to send verification email");
            }

            // 4. Create the users collection document
            const now = new Date().toISOString();
            await databases.createDocument(
                DATABASE_ID,
                COLLECTIONS.USERS,
                ID.unique(),
                {
                    user_id: newAccount.$id,
                    name: name.trim(),
                    email,
                    role: role!,
                    is_email_verified: false,
                    created_at: now,
                }
            );

            // 5. Refresh auth context
            await refreshUser();

            // 6. Route based on role
            if (role === "provider") {
                router.push("/signup/provider-profile");
            } else {
                toast.success(
                    "Account created! Please check your email to verify your account."
                );
                router.push(redirectTo);
            }

            router.refresh();
        } catch (err: unknown) {
            if (err instanceof AppwriteException) {
                switch (err.code) {
                    case 409:
                        setServerError(
                            "An account with this email already exists."
                        );
                        break;
                    case 429:
                        setServerError(
                            "Too many attempts. Please wait a moment."
                        );
                        break;
                    default:
                        setServerError(
                            err.message || "Something went wrong. Please try again."
                        );
                }
            } else {
                setServerError(
                    "Something went wrong. Please check your connection."
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-[480px] bg-white rounded-2xl shadow-lg p-8">
                {/* Logo */}
                <div className="text-center mb-6">
                    <Link href="/" className="inline-block">
                        <span className="text-2xl font-bold text-primary">
                            Tourly
                        </span>
                    </Link>
                </div>

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-foreground mb-2">
                        Create your account
                    </h1>
                    <p className="text-muted-foreground">
                        Join Tourly and start your journey
                    </p>
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
                    {/* Full Name */}
                    <div>
                        <label
                            htmlFor="signup-name"
                            className="block text-sm font-medium text-foreground mb-2"
                        >
                            Full name
                        </label>
                        <input
                            id="signup-name"
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                clearError("name");
                            }}
                            placeholder="Enter your full name"
                            className={cn(
                                "w-full px-4 py-3 rounded-xl border bg-white",
                                "text-foreground placeholder:text-muted-foreground",
                                "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                                "transition-colors",
                                errors.name && "border-red-300 focus:ring-red-200 focus:border-red-400"
                            )}
                            disabled={isSubmitting}
                        />
                        {errors.name && (
                            <p className="mt-1.5 text-xs text-red-500">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label
                            htmlFor="signup-email"
                            className="block text-sm font-medium text-foreground mb-2"
                        >
                            Email address
                        </label>
                        <input
                            id="signup-email"
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                clearError("email");
                            }}
                            placeholder="you@example.com"
                            className={cn(
                                "w-full px-4 py-3 rounded-xl border bg-white",
                                "text-foreground placeholder:text-muted-foreground",
                                "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                                "transition-colors",
                                errors.email && "border-red-300 focus:ring-red-200 focus:border-red-400"
                            )}
                            disabled={isSubmitting}
                        />
                        {errors.email && (
                            <p className="mt-1.5 text-xs text-red-500">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label
                            htmlFor="signup-password"
                            className="block text-sm font-medium text-foreground mb-2"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="signup-password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    clearError("password");
                                }}
                                placeholder="Create a password"
                                className={cn(
                                    "w-full px-4 py-3 pr-12 rounded-xl border bg-white",
                                    "text-foreground placeholder:text-muted-foreground",
                                    "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                                    "transition-colors",
                                    errors.password && "border-red-300 focus:ring-red-200 focus:border-red-400"
                                )}
                                disabled={isSubmitting}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                tabIndex={-1}
                            >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                        {errors.password ? (
                            <p className="mt-1.5 text-xs text-red-500">
                                {errors.password}
                            </p>
                        ) : (
                            <p className="mt-1.5 text-xs text-muted-foreground">
                                At least 8 characters with 1 number
                            </p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label
                            htmlFor="signup-confirm"
                            className="block text-sm font-medium text-foreground mb-2"
                        >
                            Confirm password
                        </label>
                        <div className="relative">
                            <input
                                id="signup-confirm"
                                type={showConfirm ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    clearError("confirmPassword");
                                }}
                                placeholder="Re-enter your password"
                                className={cn(
                                    "w-full px-4 py-3 pr-12 rounded-xl border bg-white",
                                    "text-foreground placeholder:text-muted-foreground",
                                    "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                                    "transition-colors",
                                    errors.confirmPassword && "border-red-300 focus:ring-red-200 focus:border-red-400"
                                )}
                                disabled={isSubmitting}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                tabIndex={-1}
                            >
                                {showConfirm ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="mt-1.5 text-xs text-red-500">
                                {errors.confirmPassword}
                            </p>
                        )}
                    </div>

                    {/* Role Selector */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-3">
                            I want to join as
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {/* Tourist Card */}
                            <button
                                type="button"
                                onClick={() => {
                                    setRole("tourist");
                                    clearError("role");
                                }}
                                className={cn(
                                    "relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200",
                                    "hover:border-primary/50 hover:bg-primary/5",
                                    role === "tourist"
                                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                                        : "border-gray-200 bg-white",
                                    errors.role &&
                                    !role &&
                                    "border-red-300",
                                    isSubmitting && "opacity-60 pointer-events-none"
                                )}
                            >
                                <div
                                    className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                                        role === "tourist"
                                            ? "bg-primary/10 text-primary"
                                            : "bg-gray-100 text-gray-500"
                                    )}
                                >
                                    <Compass className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-semibold text-foreground">
                                    I&apos;m a Traveler
                                </span>
                                <span className="text-[11px] text-muted-foreground text-center leading-tight">
                                    Discover hotels, transport &amp; guides across
                                    Northern Pakistan
                                </span>
                            </button>

                            {/* Provider Card */}
                            <button
                                type="button"
                                onClick={() => {
                                    setRole("provider");
                                    clearError("role");
                                }}
                                className={cn(
                                    "relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200",
                                    "hover:border-primary/50 hover:bg-primary/5",
                                    role === "provider"
                                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                                        : "border-gray-200 bg-white",
                                    errors.role &&
                                    !role &&
                                    "border-red-300",
                                    isSubmitting && "opacity-60 pointer-events-none"
                                )}
                            >
                                <div
                                    className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                                        role === "provider"
                                            ? "bg-primary/10 text-primary"
                                            : "bg-gray-100 text-gray-500"
                                    )}
                                >
                                    <Briefcase className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-semibold text-foreground">
                                    I&apos;m a Provider
                                </span>
                                <span className="text-[11px] text-muted-foreground text-center leading-tight">
                                    List your hotel, vehicle, or guiding
                                    services
                                </span>
                            </button>
                        </div>
                        {errors.role && (
                            <p className="mt-2 text-xs text-red-500">
                                {errors.role}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-12 text-base font-semibold rounded-xl"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Creating account...
                            </>
                        ) : (
                            "Create Account"
                        )}
                    </Button>
                </form>

                {/* Terms */}
                <p className="text-center mt-4 text-xs text-muted-foreground">
                    By signing up, you agree to our{" "}
                    <Link
                        href="/terms"
                        className="text-primary hover:underline"
                    >
                        Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                        href="/privacy"
                        className="text-primary hover:underline"
                    >
                        Privacy Policy
                    </Link>
                </p>

                {/* Login Link */}
                <p className="text-center mt-6 text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                        href={`/login${redirectTo !== "/" ? `?next=${encodeURIComponent(redirectTo)}` : ""}`}
                        className="text-primary font-medium hover:text-primary/80 transition-colors"
                    >
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}
