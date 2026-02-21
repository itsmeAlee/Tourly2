"use client";

import React, { useRef, KeyboardEvent, ClipboardEvent } from "react";
import { cn } from "@/lib/utils";

interface OtpInputProps {
    length?: number;
    value: string;
    onChange: (value: string) => void;
    isDisabled?: boolean;
    hasError?: boolean;
    autoFocus?: boolean;
}

export function OtpInput({
    length = 6,
    value,
    onChange,
    isDisabled = false,
    hasError = false,
    autoFocus = true,
}: OtpInputProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const val = e.target.value.replace(/\D/g, ""); // Only allow digits
        if (!val) return;

        // Take only the last character entered
        const char = val[val.length - 1];

        const chars = value.split("");
        chars[index] = char;

        // Pad with spaces if the string was shorter
        while (chars.length < length) {
            chars.push(" ");
        }

        const newValue = chars.join("").substring(0, length);
        onChange(newValue);

        // Auto focus next
        if (index < length - 1) {
            const nextInput = containerRef.current?.querySelector(
                `.otp-input-${index + 1}`
            ) as HTMLInputElement;
            if (nextInput) nextInput.focus();
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace") {
            e.preventDefault();

            const chars = value.split("");
            // Replace with space up to the length
            while (chars.length < length) chars.push(" ");

            if (chars[index] && chars[index] !== " ") {
                // Clear current
                chars[index] = " ";
                onChange(chars.join("").substring(0, length).trimEnd());
            } else if (index > 0) {
                // Focus previous and clear
                chars[index - 1] = " ";
                onChange(chars.join("").substring(0, length).trimEnd());
                const prevInput = containerRef.current?.querySelector(
                    `.otp-input-${index - 1}`
                ) as HTMLInputElement;
                if (prevInput) prevInput.focus();
            }
        } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            if (index > 0) {
                const prevInput = containerRef.current?.querySelector(
                    `.otp-input-${index - 1}`
                ) as HTMLInputElement;
                if (prevInput) prevInput.focus();
            }
        } else if (e.key === "ArrowRight") {
            e.preventDefault();
            if (index < length - 1) {
                const nextInput = containerRef.current?.querySelector(
                    `.otp-input-${index + 1}`
                ) as HTMLInputElement;
                if (nextInput) nextInput.focus();
            }
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text/plain").replace(/\D/g, "");
        if (!pastedData) return;

        const newValue = pastedData.substring(0, length);
        onChange(newValue);

        // Focus the input matching the last character pasted, or the last input
        const targetIndex = Math.min(newValue.length, length) - 1;
        const targetInput = containerRef.current?.querySelector(
            `.otp-input-${targetIndex}`
        ) as HTMLInputElement;
        if (targetInput) targetInput.focus();
    };

    return (
        <div
            ref={containerRef}
            className="flex justify-between items-center w-full max-w-[320px] mx-auto gap-2"
            role="group"
            aria-label="Verification code"
        >
            {Array.from({ length }).map((_, index) => {
                const char = value[index] && value[index] !== " " ? value[index] : "";

                return (
                    <input
                        key={index}
                        autoFocus={autoFocus && index === 0}
                        type="text"
                        inputMode="numeric"
                        maxLength={2}
                        value={char}
                        disabled={isDisabled}
                        onChange={(e) => handleChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onPaste={handlePaste}
                        className={cn(
                            `otp-input-${index}`,
                            "w-12 h-14 text-center text-xl font-bold bg-white border rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 disabled:opacity-50",
                            hasError
                                ? "border-red-500 focus:ring-red-200"
                                : "border-gray-200 focus:border-primary focus:ring-primary/20",
                            hasError && "animate-[shake_0.4s_ease-in-out]"
                        )}
                        aria-label={`Digit ${index + 1} of ${length}`}
                    />
                );
            })}
        </div>
    );
}
