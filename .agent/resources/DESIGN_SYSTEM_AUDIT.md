# Tourly2 Design System Audit
**Status:** Ready-to-Use
**Last Updated:** 2026-01-30

## 1. Visual Identity & Tokens

### Color Palette (HSL)
*   **Primary (Brand Color):** `hsl(199 89% 48%)` (Tourly Azure Blue)
    *   Used for: Primary buttons, active tab states, map pins, review stars fill (amber-400 used distinctively).
*   **Backgrounds:**
    *   **Canvas:** `hsl(0 0% 100%)` (White)
    *   **Sidebar/Secondary:** `hsl(0 0% 98%)`
    *   **Muted/Inputs:** `hsl(214 32% 91%)` (Border/Input bg)
*   **Typography Colors:**
    *   **Headings:** `hsl(220 20% 10%)` (Deep Blue-Black)
    *   **Body/Subtext:** `hsl(215 16% 47%)` (Slate Gray)

### Typography
*   **Font Family:** `"DM Sans", system-ui, sans-serif`
*   **Scale:**
    *   **Page Titles:** `text-2xl md:text-3xl font-bold` (e.g., Stay Details)
    *   **Section Headers:** `text-xl md:text-2xl font-bold`
    *   **Input Text:** `text-base font-semibold`
    *   **Labels:** `text-sm font-semibold text-muted-foreground`

### Component Architecture

#### Rounding (Border Radius)
The system uses "Fat" rounding for a modern, friendly aesthetic.
*   **Containers/Cards:** `rounded-2xl` (approx. 16px - 20px)
    *   *Usage:* Search Widget main container, Listing Cards, Booking Card.
*   **Interactive Elements:** `rounded-xl`
    *   *Usage:* Search input boxes, primary buttons, dropdown contents.
*   **Pills/Filters:** `rounded-full`
    *   *Usage:* Filter toggles, category icons, "Favorite" buttons.

#### Shadows
*   **Floating Widgets:** `shadow-xl` (Search Widget Hero)
*   **Cards:** `shadow-sm` (Default) -> `hover:shadow-lg` (Interaction)
*   **Sticky Elements:** `shadow-sm` (Mobile Sticky Header)

#### Spacing & Layout
*   **Search Widget Gaps:** `gap-4` (Horizontal inputs on Desktop), `gap-3` (Vertical inputs on Mobile).
*   **Card Padding:** `p-4` or `p-6`.
*   **Container Width:** `max-w-5xl` (Search Widget), `container mx-auto px-4` (Page Layout).

## 2. Interactive Logic & Behaviors

### Active Mode Logic
*   **State Management:** Controlled via `SearchContext` (`activeTab`: Stays | Transport | Guides).
*   **Persistance:** URL parameters (`?type=transport`) override local state.
*   **Tab Switching:** 
    *   *Desktop:* "Folder-tab" design. Active tab connects to the main white box (`bg-white`), inactive tabs are `bg-primary`.
    *   *Mobile:* Sticky underline tabs or Pill-based icons.

### User Input Patterns
*   **Search Inputs:** "Rigid" dimensions (fixed height `h-14`) to prevent Layout Shift (CLS).
*   **Popovers:**
    *   Used for Dates, Travelers, and Vehicle Selection.
    *   **Behavior:** Auto-close logic exists for Date Range selection (`isRangeComplete` -> `setTimeout`).
    *   **Reset:** Switching service tabs resets internal popover states.

### Mobile Specifics
*   **Sticky Header:** Triggers via `IntersectionObserver` when the main Hero Search Form leaves the viewport.
*   **Bottom Navigation:** Used for core app navigation, separating "Search" from "Profile".

## 3. Stitch MCP Integration Notes
When generating new UI via Stitch, strict adherence to the following is required:
1.  **Always** import `Button` from `@/components/ui/button` and apply `rounded-xl` if large.
2.  **Always** use `lucide-react` for icons.
3.  **Never** write raw hex colors. Use Tailwind classes `bg-primary`, `text-muted-foreground`.
4.  **Preserve** the `rounded-2xl` container aesthetic for all major sections.
