"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, List as ListIcon, CalendarCheck, DollarSign, PlusCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Mock data (TODO: Replace with real fetches from Appwrite service functions)
const MOCK_STATS = {
    views: 1240,
    activeListings: 5,
    upcomingBookings: 12,
    revenue: 45000, // PKR or USD
};

const MOCK_RECENT_BOOKINGS = [
    { id: "b1", touristName: "Ali Khan", listingName: "Serena Hotel Suite", date: "Oct 12, 2026", status: "confirmed", amount: 15000 },
    { id: "b2", touristName: "Sarah Doe", listingName: "Hunza Valley Tour", date: "Oct 15, 2026", status: "pending", amount: 25000 },
    { id: "b3", touristName: "John Smith", listingName: "Prado TZ Rental", date: "Oct 18, 2026", status: "completed", amount: 5000 },
];

const MOCK_TOP_LISTINGS = [
    { id: "l1", name: "Serena Hotel Suite", views: 450, bookings: 8, rating: 4.8 },
    { id: "l2", name: "Hunza Valley Tour", views: 320, bookings: 5, rating: 4.9 },
    { id: "l3", name: "Prado TZ Rental", views: 200, bookings: 12, rating: 4.5 },
];

export function ProviderDashboardClient() {
    const { user } = useAuth();

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Welcome back, {user?.name?.split(" ")[0]}!
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Here's what's happening with your listings today.
                    </p>
                </div>
                <Link href="/provider/listings/create">
                    <Button className="w-full sm:w-auto rounded-xl flex items-center gap-2">
                        <PlusCircle className="w-4 h-4" />
                        Create Listing
                    </Button>
                </Link>
            </div>

            {/* Stats Row */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="rounded-2xl shadow-sm border-gray-100">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Views</CardTitle>
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Eye className="w-4 h-4 text-primary" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{MOCK_STATS.views.toLocaleString()}</div>
                        <p className="text-xs text-green-600 mt-1 flex items-center">
                            +12% from last month
                        </p>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl shadow-sm border-gray-100">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Active Listings</CardTitle>
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <ListIcon className="w-4 h-4 text-primary" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{MOCK_STATS.activeListings}</div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center">
                            Manage your portfolio
                        </p>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl shadow-sm border-gray-100">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Bookings</CardTitle>
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <CalendarCheck className="w-4 h-4 text-primary" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{MOCK_STATS.upcomingBookings}</div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center">
                            Next 30 days
                        </p>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl shadow-sm border-gray-100">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <DollarSign className="w-4 h-4 text-primary" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">Rs {MOCK_STATS.revenue.toLocaleString()}</div>
                        <p className="text-xs text-green-600 mt-1 flex items-center">
                            +8% from last month
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Recent Bookings */}
                <Card className="rounded-2xl shadow-sm border-gray-100 col-span-1">
                    <CardHeader className="pb-3 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg">Recent Bookings</CardTitle>
                                <CardDescription>Latest reservations for your services.</CardDescription>
                            </div>
                            <Link href="/provider/bookings" className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1">
                                View All
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-gray-50/50">
                                <TableRow>
                                    <TableHead className="w-[150px]">Tourist</TableHead>
                                    <TableHead>Listing</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {MOCK_RECENT_BOOKINGS.map((booking) => (
                                    <TableRow key={booking.id}>
                                        <TableCell className="font-medium">
                                            <div>{booking.touristName}</div>
                                            <div className="text-xs text-muted-foreground font-normal">{booking.date}</div>
                                        </TableCell>
                                        <TableCell>{booking.listingName}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    "capitalize",
                                                    booking.status === "confirmed" && "bg-green-50 text-green-700 border-green-200",
                                                    booking.status === "pending" && "bg-yellow-50 text-yellow-700 border-yellow-200",
                                                    booking.status === "completed" && "bg-blue-50 text-blue-700 border-blue-200"
                                                )}
                                            >
                                                {booking.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Top Listings */}
                <Card className="rounded-2xl shadow-sm border-gray-100 col-span-1">
                    <CardHeader className="pb-3 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg">Top Performing Listings</CardTitle>
                                <CardDescription>Your most popular listings this month.</CardDescription>
                            </div>
                            <Link href="/provider/listings" className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1">
                                View All
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-gray-50/50">
                                <TableRow>
                                    <TableHead>Listing</TableHead>
                                    <TableHead className="text-right">Views</TableHead>
                                    <TableHead className="text-right">Bookings</TableHead>
                                    <TableHead className="text-right">Rating</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {MOCK_TOP_LISTINGS.map((listing) => (
                                    <TableRow key={listing.id}>
                                        <TableCell className="font-medium">{listing.name}</TableCell>
                                        <TableCell className="text-right">{listing.views}</TableCell>
                                        <TableCell className="text-right">{listing.bookings}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <span className="text-yellow-500 text-xs">★</span>
                                                {listing.rating.toFixed(1)}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
