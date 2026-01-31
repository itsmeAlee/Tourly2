"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
    ArrowLeft,
    ChevronRight,
    User,
    Mail,
    Lock,
    Globe,
    DollarSign,
    Bell,
    LogOut,
    Trash2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { LogoutConfirmModal } from "@/components/auth/LogoutConfirmModal";
import { cn } from "@/lib/utils";

interface SettingRow {
    id: string;
    label: string;
    value?: string;
    icon: React.ComponentType<{ className?: string }>;
    action?: "edit" | "change" | "select" | "toggle";
    onClick?: () => void;
}

export function SettingsPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading } = useAuth();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(false);

    const handleBack = () => {
        router.push("/account");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        router.push("/login?next=/settings");
        return null;
    }

    const accountSettings: SettingRow[] = [
        {
            id: "name",
            label: "Name",
            value: user.name,
            icon: User,
            action: "edit",
        },
        {
            id: "email",
            label: "Email",
            value: user.email,
            icon: Mail,
            action: "edit",
        },
        {
            id: "password",
            label: "Password",
            value: "••••••••",
            icon: Lock,
            action: "change",
        },
    ];

    const preferenceSettings: SettingRow[] = [
        {
            id: "language",
            label: "Language",
            value: "English",
            icon: Globe,
            action: "select",
        },
        {
            id: "currency",
            label: "Currency",
            value: "PKR",
            icon: DollarSign,
            action: "select",
        },
    ];

    const SettingSection = ({
        title,
        rows,
    }: {
        title: string;
        rows: SettingRow[];
    }) => (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            <div className="px-4 py-3 border-b border-gray-100">
                <h2 className="font-semibold text-foreground">{title}</h2>
            </div>
            <div className="divide-y divide-gray-100">
                {rows.map((row) => {
                    const Icon = row.icon;
                    return (
                        <button
                            key={row.id}
                            onClick={row.onClick}
                            className="w-full flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                        >
                            <Icon className="w-5 h-5 text-muted-foreground" />
                            <span className="flex-1 text-foreground">{row.label}</span>
                            {row.value && (
                                <span className="text-muted-foreground">{row.value}</span>
                            )}
                            {row.action && (
                                <span className="text-primary text-sm font-medium">
                                    {row.action === "edit" && "Edit"}
                                    {row.action === "change" && "Change"}
                                </span>
                            )}
                            {row.action === "select" && (
                                <ChevronRight className="w-5 h-5 text-muted-foreground" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleBack}
                            className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
                            aria-label="Go back"
                        >
                            <ArrowLeft className="w-5 h-5 text-foreground" />
                        </button>
                        <h1 className="text-xl font-bold text-foreground">Settings</h1>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 max-w-lg">
                {/* Account Section */}
                <SettingSection title="Account" rows={accountSettings} />

                {/* Preferences Section */}
                <SettingSection title="Preferences" rows={preferenceSettings} />

                {/* Notifications Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                    <div className="px-4 py-3 border-b border-gray-100">
                        <h2 className="font-semibold text-foreground">Notifications</h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {/* Email Updates */}
                        <div className="flex items-center gap-4 px-4 py-3">
                            <Bell className="w-5 h-5 text-muted-foreground" />
                            <span className="flex-1 text-foreground">Email updates</span>
                            <button
                                onClick={() => setEmailNotifications(!emailNotifications)}
                                className={cn(
                                    "relative w-11 h-6 rounded-full transition-colors",
                                    emailNotifications ? "bg-primary" : "bg-gray-300"
                                )}
                            >
                                <span
                                    className={cn(
                                        "absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform",
                                        emailNotifications ? "left-6" : "left-1"
                                    )}
                                />
                            </button>
                        </div>
                        {/* Push Notifications */}
                        <div className="flex items-center gap-4 px-4 py-3">
                            <Bell className="w-5 h-5 text-muted-foreground" />
                            <span className="flex-1 text-foreground">Push notifications</span>
                            <button
                                onClick={() => setPushNotifications(!pushNotifications)}
                                className={cn(
                                    "relative w-11 h-6 rounded-full transition-colors",
                                    pushNotifications ? "bg-primary" : "bg-gray-300"
                                )}
                            >
                                <span
                                    className={cn(
                                        "absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform",
                                        pushNotifications ? "left-6" : "left-1"
                                    )}
                                />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="space-y-3">
                    <button
                        onClick={() => setShowLogoutModal(true)}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors font-medium"
                    >
                        <LogOut className="w-5 h-5" />
                        Log out
                    </button>

                    <button className="w-full text-center text-sm text-red-500 hover:text-red-600 transition-colors py-2">
                        <Trash2 className="w-4 h-4 inline mr-2" />
                        Delete account
                    </button>
                </div>
            </main>

            {/* Logout Confirmation Modal */}
            <LogoutConfirmModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
            />
        </div>
    );
}
