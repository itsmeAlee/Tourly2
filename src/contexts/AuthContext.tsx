"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

// User type definition
export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}

// Auth context type
interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for demo purposes
const MOCK_USER: User = {
    id: "user-1",
    name: "Ali Hassan",
    email: "ali@example.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing session on mount
    useEffect(() => {
        const checkSession = () => {
            try {
                const savedUser = localStorage.getItem("tourly_user");
                if (savedUser) {
                    setUser(JSON.parse(savedUser));
                }
            } catch {
                // Ignore parse errors
            } finally {
                setIsLoading(false);
            }
        };

        checkSession();
    }, []);

    // Login function
    const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        setIsLoading(true);

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 800));

            // TODO: Replace with actual Appwrite authentication
            // const session = await account.createEmailSession(email, password);

            // For demo, accept any non-empty credentials
            if (!email || !password) {
                return { success: false, error: "Email and password are required" };
            }

            // Mock successful login
            const mockUser: User = {
                ...MOCK_USER,
                email,
                name: email.split("@")[0] || "User",
            };

            setUser(mockUser);
            localStorage.setItem("tourly_user", JSON.stringify(mockUser));

            return { success: true };
        } catch (error) {
            return { success: false, error: "Invalid credentials. Please try again." };
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Signup function
    const signup = useCallback(async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        setIsLoading(true);

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 800));

            // TODO: Replace with actual Appwrite account creation
            // const user = await account.create(ID.unique(), email, password, name);
            // const session = await account.createEmailSession(email, password);

            // Validation
            if (!name.trim()) {
                return { success: false, error: "Name is required" };
            }
            if (!email.trim()) {
                return { success: false, error: "Email is required" };
            }
            if (password.length < 8) {
                return { success: false, error: "Password must be at least 8 characters" };
            }

            // Mock successful signup
            const newUser: User = {
                id: `user-${Date.now()}`,
                name,
                email,
            };

            setUser(newUser);
            localStorage.setItem("tourly_user", JSON.stringify(newUser));

            return { success: true };
        } catch (error) {
            return { success: false, error: "Could not create account. Please try again." };
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Logout function
    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem("tourly_user");
        // TODO: Call Appwrite logout
        // await account.deleteSession('current');
    }, []);

    const value: AuthContextType = {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook to use auth context
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
