"use client";

import { useRouter } from "next/navigation";
import { LogOut, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface LogoutConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function LogoutConfirmModal({ isOpen, onClose }: LogoutConfirmModalProps) {
    const router = useRouter();
    const { logout } = useAuth();

    if (!isOpen) return null;

    const handleLogout = () => {
        logout();
        onClose();
        router.push("/");
        router.refresh();
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-[100] animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
                <div
                    className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 animate-in zoom-in-95 duration-200"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5 text-muted-foreground" />
                    </button>

                    {/* Icon */}
                    <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                            <LogOut className="w-6 h-6 text-red-600" />
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-foreground text-center mb-2">
                        Log out?
                    </h2>

                    {/* Message */}
                    <p className="text-muted-foreground text-center mb-6">
                        Are you sure you want to log out?
                    </p>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="flex-1 h-11 rounded-xl"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleLogout}
                            className="flex-1 h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white"
                        >
                            Log out
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
