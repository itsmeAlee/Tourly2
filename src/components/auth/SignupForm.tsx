"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SignupForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { signup, isLoading } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    // Get redirect URL from query params
    const redirectTo = searchParams.get("next") || "/";

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[\d\s\-+()]{10,}$/;
        return emailRegex.test(email) || phoneRegex.test(email.replace(/\s/g, ""));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validation
        if (!name.trim()) {
            setError("Full name is required");
            return;
        }
        if (!email.trim()) {
            setError("Email or phone number is required");
            return;
        }
        if (!validateEmail(email)) {
            setError("Please enter a valid email or phone number");
            return;
        }
        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        const result = await signup(name, email, password);

        if (result.success) {
            // Redirect to intended destination or home
            router.push(redirectTo);
            router.refresh();
        } else {
            setError(result.error || "Signup failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-lg p-8">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block">
                        <span className="text-2xl font-bold text-primary">Tourly</span>
                    </Link>
                </div>

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-foreground mb-2">Create your account</h1>
                    <p className="text-muted-foreground">Join thousands of travelers exploring Pakistan</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Full Name Field */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                            Full name
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your full name"
                            className={cn(
                                "w-full px-4 py-3 rounded-xl border bg-white",
                                "text-foreground placeholder:text-muted-foreground",
                                "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                                "transition-colors"
                            )}
                            disabled={isLoading}
                        />
                    </div>

                    {/* Email/Phone Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                            Email or phone number
                        </label>
                        <input
                            id="email"
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email or phone"
                            className={cn(
                                "w-full px-4 py-3 rounded-xl border bg-white",
                                "text-foreground placeholder:text-muted-foreground",
                                "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                                "transition-colors"
                            )}
                            disabled={isLoading}
                        />
                    </div>

                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Create a password"
                                className={cn(
                                    "w-full px-4 py-3 pr-12 rounded-xl border bg-white",
                                    "text-foreground placeholder:text-muted-foreground",
                                    "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                                    "transition-colors"
                                )}
                                disabled={isLoading}
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
                        <p className="mt-1.5 text-xs text-muted-foreground">At least 8 characters</p>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 text-base font-semibold rounded-xl"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Creating account...
                            </>
                        ) : (
                            "Sign up"
                        )}
                    </Button>
                </form>

                {/* Terms */}
                <p className="text-center mt-4 text-xs text-muted-foreground">
                    By signing up, you agree to our{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                        Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-primary hover:underline">
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
