# Project Overview & Architectural Advice

## 1. Project Explanation

**Tourly (North Sky Journey)** is a comprehensive travel marketplace designed specifically for **Gilgit-Baltistan, Northern Pakistan**. It aims to connect travelers with local service providers in a region known for its breathtaking landscapes but fragmented tourism infrastructure.

### Core Purpose
To streamline the booking process for three key pillars of tourism in the region:
1.  **Stays:** Hotels, guest houses, and resorts.
2.  **Transport:** Rental vehicles (Jeeps, Prados) essential for mountainous terrain.
3.  **Guides:** Local experts for trekking, cultural tours, and expeditions.

### Key Features
*   **Unified Search:** A powerful search interface that adapts to the service type (e.g., specific vehicle types for transport, activity types for guides).
*   **AI Trip Planner:** An innovative "TripAI" feature that generates itineraries based on natural language descriptions.
*   **Provider Profiles:** Detailed profiles for service providers showcasing their experience, languages, and service areas.
*   **Mock Data Foundation:** The project currently uses a robust set of mock data (`src/data/`) to simulate a fully populated marketplace, allowing for rapid UI/UX iteration ("vibe coding").

### Tech Stack
*   **Framework:** Next.js 14+ (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS + shadcn/ui
*   **State Management:** React Context + Hooks
*   **Icons:** Lucide React

---

## 2. Behavioral Recommendation: The "Fiverr-Style" Model

You asked whether to follow a **"Fiverr-style"** behavior (One Account -> Multiple Gigs/Services) or a **"Profile-as-Service"** behavior (One Account -> One Service).

### **Recommendation: Go with the "Fiverr-Style" (One Provider, Multiple Listings)**

**Why?**
The tourism industry in Gilgit-Baltistan is highly interconnected and diversified.
*   **Reality of the Market:** A hotel owner in Hunza often owns a few Jeeps for guests. A tour guide in Skardu might also run a small guest house.
*   **User Experience (Provider):** If you force a "One Account = One Service" model, a business owner would need three different logins to manage their Hotel, their Jeep rental, and their Guiding service. This is a high friction point.
*   **Cross-Selling:** A unified provider profile allows for powerful cross-selling. "Stay at my hotel and get 20% off my Jeep rental."
*   **Scalability:** It allows a provider to start with one service (e.g., "I'm a Guide") and grow into others (e.g., "I bought a Jeep, now I rent it out") without creating a new account.

### **How it Works (Conceptual Model)**

1.  **User Layer:**
    *   Everyone starts as a generic **User** (Traveler).
    *   They can search, book, and chat.

2.  **Provider Layer (The "Seller" Profile):**
    *   A User can "Become a Provider".
    *   This creates a **Provider Profile** linked to their User account.
    *   **Provider Profile Fields:** Business Name (e.g., "Ali's Adventures"), Bio, Region, Verified Status.

3.  **Listing Layer (The "Gigs"):**
    *   A Provider can create multiple **Listings**.
    *   **Listing Types:**
        *   `StayListing` (Room, Amenities)
        *   `TransportListing` (Vehicle Model, Driver)
        *   `GuideListing` (Expertise, Daily Rate)
    *   Each listing belongs to the Provider Profile.

---

## 3. Implementation Guide for "Vibe Coding"

Since you are a small team moving fast, here is a pragmatic roadmap to implement this behavior without over-engineering.

### Step 1: Update the User Context
Modify `src/contexts/AuthContext.tsx` to include a `providerProfileId` in the `User` object.
```typescript
interface User {
  id: string;
  name: string;
  // ...
  providerProfileId?: string; // If this exists, they are a provider
}
```

### Step 2: Create a "Become a Provider" Onboarding Flow
Create a simple page at `/provider/onboarding` that asks for:
*   Business Name
*   Bio
*   Region (e.g., Hunza, Skardu)

On submit, this "upgrades" the user by creating a `Provider` object (mocked or in DB) and linking it to the user.

### Step 3: Build the Provider Dashboard
Create `/provider/dashboard`. This is the "Seller Mode".
*   **Header:** "Welcome back, [Business Name]"
*   **My Listings Section:** A grid showing their active services.
*   **"Add New Listing" Button:** A prominent button to create a new service.

### Step 4: Create the "Add Listing" Wizard
A simple form that first asks "What are you listing?" (Hotel, Transport, Guide).
Based on the selection, show the relevant fields (e.g., "Vehicle Type" for Transport vs "Number of Beds" for Hotel).

### Step 5: Update the Navbar
In `src/components/Navbar.tsx`, update the user dropdown:
*   **If `!user.providerProfileId`:** Show "Become a Provider".
*   **If `user.providerProfileId`:** Show "Switch to Hosting" or "Provider Dashboard".

This approach gives you the flexibility to support the complex reality of Northern Pakistan's tourism market while keeping the codebase clean and modular.
