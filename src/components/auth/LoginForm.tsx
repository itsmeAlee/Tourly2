"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { isAppwriteClientConfigured } from "@/lib/appwrite";
import { AuthServiceUnavailable } from "@/components/auth/AuthServiceUnavailable";

export function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login, isLoading } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    // Get redirect URL from query params
    const redirectTo = searchParams.get("next") || "/";

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validation
        if (!email.trim()) {
            setError("Email is required");
            return;
        }
        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }
        if (!password) {
            setError("Password is required");
            return;
        }

        const result = await login(email, password);

        if (result.success) {
            // Determine redirect
            let finalRedirect = redirectTo;
            if (result.role === "provider" && redirectTo === "/") {
                finalRedirect = "/provider/dashboard";
            }
            router.push(finalRedirect);
            router.refresh();
        } else {
            setError(result.error || "Login failed. Please try again.");
        }
    };

    if (!isAppwriteClientConfigured) {
        return <AuthServiceUnavailable />;
    }

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
                    <h1 className="text-2xl font-bold text-foreground mb-2">Welcome back</h1>
                    <p className="text-muted-foreground">Log in to continue your adventure</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email/Phone Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                            Email
                        </label>
                        <input
                            id="email"
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
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
                                placeholder="Enter your password"
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
                    </div>

                    {/* Forgot Password */}
                    <div className="text-right">
                        <Link
                            href="/forgot-password"
                            className="text-sm text-primary hover:text-primary/80 transition-colors"
                        >
                            Forgot password?
                        </Link>
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
                                Logging in...
                            </>
                        ) : (
                            "Log in"
                        )}
                    </Button>
                </form>

                {/* Sign Up Link */}
                <p className="text-center mt-6 text-muted-foreground">
                    Don't have an account?{" "}
                    <Link
                        href={`/signup${redirectTo !== "/" ? `?next=${encodeURIComponent(redirectTo)}` : ""}`}
                        className="text-primary font-medium hover:text-primary/80 transition-colors"
                    >
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
