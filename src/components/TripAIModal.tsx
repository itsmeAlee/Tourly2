"use client";

import * as React from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerFooter,
    DrawerClose,
} from "@/components/ui/drawer";
import { Textarea } from "@/components/ui/textarea";

export interface TripAIModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function TripAIModal({ open, onOpenChange }: TripAIModalProps) {
    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <div className="flex justify-center mb-4">
                            <div className="p-3 bg-primary/10 rounded-full">
                                <Sparkles className="w-8 h-8 text-primary" />
                            </div>
                        </div>
                        <DrawerTitle className="text-2xl font-bold text-center">TripAI Planner</DrawerTitle>
                        <DrawerDescription className="text-center">
                            Describe your dream trip and let AI plan it for you.
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4 pb-0">
                        <div className="space-y-4">
                            <Textarea
                                placeholder="Plan a 5-day honeymoon in Hunza with luxury stays..."
                                className="min-h-[120px] text-base resize-none focus-visible:ring-primary"
                            />
                        </div>
                    </div>
                    <DrawerFooter>
                        <Button className="w-full h-12 text-base font-semibold rounded-xl" onClick={() => onOpenChange(false)}>
                            Generate Itinerary
                        </Button>
                        <DrawerClose asChild>
                            <Button variant="outline" className="w-full rounded-xl">Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
