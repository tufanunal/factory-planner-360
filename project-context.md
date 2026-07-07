# Factory Planner 360 — Project Context

> Handover document for continuing development in another AI coding environment.
> Last updated: 2026-07-07

---

## 1. Overview

**Factory Planner 360** is a client-side factory production planning application. It manages **Machines**, **Parts**, **Consumables**, **Raw Materials**, a **Production Calendar** (shifts + holidays), and computes **OEE**, **Forecast**, and **Cost Breakdown** views.

The app was scaffolded on Lovable (Vite + React + shadcn/ui). All data currently persists client-side via **IndexedDB (primary) + localStorage (fallback)**. A PostgreSQL path exists in code but is **not wired up in the browser build**.

---

## 2. Tech Stack & Architecture

### Frontend
- **React 18.3** + **TypeScript 5.5**
- **Vite 5** (SWC plugin) — dev server on port `8080`
- **React Router v6** — client-side routing
- **TanStack React Query v5** — query client is set up but most reads/writes go through the `DataContext`, not RQ
- **React Hook Form + Zod** — form handling/validation (available, used sparingly)

### Styling / UI
- **Tailwind CSS 3.4** with `tailwindcss-animate` and `@tailwindcss/typography`
- **shadcn/ui** (Radix primitives) — full component set under `src/components/ui/`
- **lucide-react** — icons
- **Dark mode**: class-based, managed by `src/hooks/use-theme.tsx` (custom `ThemeProvider`, not `next-themes` despite the package being installed). Toggle button lives in `Navbar`.

### Data / Persistence
- **Primary**: `idb` (IndexedDB wrapper) — database name `factory-planner-db`, store `appData`, key `factory-planner-data`.
- **Fallback / mirror**: `localStorage` under the same key.
- **PostgreSQL (production, not active)**: `pg` package is installed and `src/services/db/PostgresService.ts` + `src/config/database.ts` + `src/config/database-setup.sql` exist as a **server-only** reference. It cannot run in the browser (`process is not defined`). The adapter (`DatabaseServiceAdapter.ts`) is hardcoded to use `SqlDatabaseService` (IndexedDB).

### Notifications
- **sonner** (`toast.success/error`) and shadcn `Toaster` — both mounted in `App.tsx`.

---

## 3. Project Structure

```
src/
├── App.tsx                     # Router + providers (QueryClient, Theme, Data, Tooltip, Toasters)
├── main.tsx                    # createRoot bootstrap
├── index.css                   # Tailwind layers + semantic CSS tokens (light/dark)
│
├── pages/                      # Route components (one per top-nav item)
│   ├── Index.tsx               # Dashboard
│   ├── Machines.tsx
│   ├── Parts.tsx
│   ├── OEE.tsx
│   ├── Consumables.tsx
│   ├── RawMaterials.tsx
│   ├── Calendar.tsx
│   ├── Forecast.tsx
│   ├── CostBreakdown.tsx
│   └── NotFound.tsx
│
├── components/
│   ├── layout/                 # Navbar (with dark-mode toggle), DashboardLayout
│   ├── ui/                     # shadcn primitives (do not edit)
│   ├── common/                 # UnitManager (shared unit editor)
│   ├── machines/               # MachineCard, MachineFilter, MachineStats,
│   │                           # MachineEditModal, CategoryManager, DbStructureViewer
│   ├── parts/                  # PartTable, PartCard, PartFilters, PartMetrics,
│   │   ├── PartEditModal.tsx   # Modal shell with tabs
│   │   ├── edit-modal/         # DetailTab, ConsumablesTab, RawMaterialsTab
│   │   ├── PartCategoryManager.tsx
│   │   └── category/           # CategoryForm, CategoryItem, PartCategoryManager
│   ├── consumables/            # ConsumableEditModal
│   ├── rawMaterials/           # RawMaterialEditModal
│   └── calendar/               # WeeklyShiftView, OverviewCalendar,
│                               # DayHeader, ShiftToggleCell, ShiftEditDialog,
│                               # ShiftTimeManager, HolidayManager, shiftColors.ts
│
├── contexts/
│   ├── DataContext.tsx         # Context + `useData` hook (thin — just the createContext)
│   └── DataContextProvider.tsx # Real provider: wires up hooks, exposes CRUD API
│
├── hooks/                      # Domain operation hooks used by the provider
│   ├── use-theme.tsx           # ThemeProvider + useTheme (dark/light/system)
│   ├── useDataInitialization.ts
│   ├── useMachineOperations.ts
│   ├── usePartOperations.ts
│   ├── useInventoryOperations.ts    # consumables + raw materials + relationships
│   ├── useCalendarOperations.ts
│   ├── useCategoriesAndUnits.ts
│   ├── use-toast.ts
│   └── use-mobile.tsx
│
├── services/db/                # Persistence layer
│   ├── DatabaseServiceAdapter.ts    # Public entry-point used by the app
│   ├── SqlDatabaseService.ts        # Aggregates all *Service classes, saves on write
│   ├── DatabaseManager.ts           # Initializes DB shape, delegates to StorageService
│   ├── StorageService.ts            # IndexedDB (idb) + localStorage mirror
│   ├── MachineService.ts            # CRUD on db.machines
│   ├── PartService.ts               # CRUD on db.parts + updatePartCategories, revertCategoryToDefault
│   ├── ConsumableService.ts
│   ├── RawMaterialService.ts
│   ├── PartConsumableService.ts     # Join table CRUD
│   ├── PartRawMaterialService.ts    # Join table CRUD
│   ├── CalendarService.ts           # Persists CalendarState blob
│   ├── UnitService.ts
│   ├── PostgresService.ts           # SERVER-ONLY reference, not runtime-loaded
│   ├── DatabaseService.ts           # Legacy — verify usage before edits
│   └── README.md                    # Notes on browser vs server strategy
│
├── config/
│   ├── database.ts              # PG connection config (server use)
│   └── database-setup.sql       # DDL for the PG production schema (commented reference)
│
├── types/                       # Domain types, re-exported from all.ts
│   ├── machine.ts, part.ts, consumable.ts, rawMaterial.ts
│   ├── partConsumable.ts, partRawMaterial.ts, calendar.ts, unit.ts
│   └── contextTypes.ts          # DataContextType — the full context surface
│
└── utils/idGenerator.ts         # id() helper for new entities
```

---

## 4. Data Models

All domain types live in `src/types/*` and are re-exported from `src/types/all.ts`.

### Machine (`types/machine.ts`)
```ts
interface Machine {
  id: string;
  name: string;
  status: 'Operational' | 'Maintenance' | 'Offline';
  availability: number;          // percent 0-100
  setupTime: string;
  lastMaintenance: string;       // ISO date
  nextMaintenance: string;       // ISO date
  category?: string;             // links to a machine category
  hourlyCost?: number;           // used in cost analyses
  labourPersonHour?: number;
  description?: string;
}
```

### Part (`types/part.ts`)
```ts
interface Part {
  id: string;
  sku: string;
  name: string;
  category: string;              // links to machine category (same-category machines can produce it)
  qualityRate: number;
  stock: number;
  status: 'Active' | 'Low Stock' | 'Discontinued';
  description?: string;
  unit?: string;
  cycleTime?: number;
  piecesPerCycle?: number;
  consumables:  { consumableId: string; amount: number }[];
  rawMaterials: { rawMaterialId: string; amount: number }[];
}
```

### Consumable (`types/consumable.ts`)
```ts
interface Consumable {
  id: string;
  name: string;
  unit: string;
  stock: number;
  costPerUnit: number;
  description?: string;
  unitCost?: number;             // duplicate of costPerUnit — see "Known issues"
}
```

### RawMaterial (`types/rawMaterial.ts`)
Same shape family as Consumable (name, unit, stock, costPerUnit, description).

### Calendar (`types/calendar.ts`)
```ts
type ShiftTime      = { id; name; startTime "HH:MM"; endTime "HH:MM"; color };
type DayShiftToggle = { id; date "YYYY-MM-DD"; shiftTimeId; isActive };
type Holiday        = { id; name; date "YYYY-MM-DD"; isRecurringYearly };
interface CalendarState {
  shiftTimes: ShiftTime[];
  dayShiftToggles: DayShiftToggle[];
  holidays: Holiday[];
  viewDate: string;              // YYYY-MM-DD
}
```

### Persisted DB blob (single JSON stored under key `factory-planner-data`)
```ts
{
  machines:          Machine[];
  parts:             Part[];
  consumables:       Consumable[];
  rawMaterials:      RawMaterial[];
  units:             Unit[];
  partConsumables:   PartConsumable[];
  partRawMaterials:  PartRawMaterial[];
  calendar:          CalendarState | null;
}
```

### Cross-entity linking (business rule)
- **Machine categories == Part categories.** A part with category `X` can be produced on any machine whose category is `X`.
- **Consumable / energy costs (electricity, steam, etc.) are attached to the machine category**, not the individual machine — machines in the same category share consumable rates for cost analysis. *(Rule is declared but not fully implemented — see §7 Next Steps.)*

---

## 5. State Management

### Context surface (`types/contextTypes.ts` → `DataContextType`)
- **Read state**: `isLoading`, `machines`, `parts`, `consumables`, `rawMaterials`, `partConsumables`, `partRawMaterials`, `calendarState`, `units`, `machineCategories`, `partCategories`.
- **Setters** (direct): `setMachines`, `setParts`, `setConsumables`, `setRawMaterials`, `setUnits`, `setMachineCategories`, `setPartCategories`.
- **Async CRUD**:
  - Machines: `addMachine`, `updateMachine(id, machine)`, `removeMachine(id)`
  - Parts: `addPart`, `updatePart`, `removePart`
  - Consumables: `addConsumable`, `updateConsumable`, `removeConsumable`
  - Raw materials: `addRawMaterial`, `updateRawMaterial`, `removeRawMaterial`
  - Relationships: `addPartConsumable`, `updatePartConsumable`, `removePartConsumable`, and the raw-material equivalents
  - Calendar: `addHoliday`, `removeHoliday`, `addShiftTime`, `updateShiftTime`, `removeShiftTime`, `toggleShift(date, shiftTimeId)`, `setViewDate(date)`

### Wiring
1. `App.tsx` → `ThemeProvider` → `DataProvider` (from `DataContextProvider.tsx`).
2. `DataContextProvider` composes the domain hooks (`useDataInitialization`, `useMachineOperations`, `usePartOperations`, `useInventoryOperations`, `useCalendarOperations`, `useCategoriesAndUnits`).
3. Hooks call `DatabaseServiceAdapter` → `SqlDatabaseService` → per-entity `*Service` classes → `DatabaseManager.saveToStorage()` → `StorageService` (IndexedDB + localStorage).
4. Every mutation persists immediately (no batching). Reads happen once on init via `useDataInitialization`.

### Theme state
`use-theme.tsx` — `theme` stored under `localStorage["ui-theme"]`, supports `light | dark | system`, exposes `setTheme` and `toggleTheme`. Applies `light`/`dark` class to `<html>`.

---

## 6. Current State — Completed Work

- ✅ Full CRUD for **Machines**, **Parts**, **Consumables**, **Raw Materials**.
- ✅ **Category managers** for machines and parts, including reassign/revert on delete.
- ✅ **Part ↔ Consumable** and **Part ↔ Raw Material** relationships with amounts (join tables).
- ✅ **Part edit modal** refactored into `DetailTab`, `ConsumablesTab`, `RawMaterialsTab`.
- ✅ **Calendar module**: holidays (one-off + yearly recurring), shift times with per-shift color, weekly toggle grid, overview calendar.
- ✅ **WeeklyShiftView** refactored into `DayHeader`, `ShiftToggleCell`, `ShiftEditDialog`, `shiftColors.ts`. Shift colors now render on active toggles in both light and dark mode.
- ✅ **Dark mode toggle** in `Navbar` (Sun/Moon icon), persisted to `localStorage`.
- ✅ **Persistent storage** via IndexedDB with localStorage fallback + auto-migration from any pre-existing localStorage blob.
- ✅ **Debug tool**: `DbStructureViewer` on the Machines page can dump the current DB blob.
- ✅ Loading screen while data initializes.
- ✅ Semantic Tailwind tokens in `index.css`; components respect light/dark tokens.

---

## 7. Work in Progress & Next Steps

### Where we left off
The last completed task was refactoring `WeeklyShiftView.tsx` into smaller components (`DayHeader`, `ShiftToggleCell`, `ShiftEditDialog`, `shiftColors.ts`). Prior to that, we fixed shift colors not reflecting in the weekly view and shipped the dark-mode toggle plus the IndexedDB persistence layer.

### Immediate next tasks (user-requested, not yet implemented)
1. **True cross-module linking for cost analysis.**
   The user explicitly stated: *"Categories under machines will be linked to part … same category machines consume same electricity and steam which will be used in cost analyses."*
   Needed:
   - Attach `electricityRate`, `steamRate` (and any other utility rates) to **machine categories**, not individual machines. Extend the category model beyond a bare string — introduce a `MachineCategory` object type.
   - Expose these rates in `CostBreakdown.tsx` to compute per-part production cost (machine hourly cost + labour + utilities from category + consumable/raw-material amounts × their unit costs × piecesPerCycle / cycleTime).
2. **Server-backed persistence (real production DB).**
   - `PostgresService.ts` + `src/config/database.ts` + `src/config/database-setup.sql` are already scaffolded. They must NOT be imported into the browser build (they crash with `process is not defined`).
   - Path forward on Lovable: enable **Lovable Cloud** (managed Supabase) and replace `DatabaseServiceAdapter` with a Supabase-backed implementation. Keep the same public method surface so hooks don't change.
   - If moving off Lovable: build a small Node/Express (or Nest) API that wraps `PostgresService`, and swap `DatabaseServiceAdapter` to call it via `fetch`. Credentials belong in server env vars, not `src/config/database.ts`.

### Known bugs / blockers
- **`Consumable.unitCost` vs `costPerUnit`** — both exist on the type; the codebase inconsistently reads one or the other. Consolidate to `costPerUnit` and drop `unitCost` (or vice versa) before cost math ships.
- **`pg` in the browser build** — currently avoided because the adapter never imports `PostgresService`. Do not add that import from any file reachable from `src/main.tsx`; Vite will try to bundle `pg` and fail. If you need type sharing, `import type` only.
- **Runtime noise**: `ResizeObserver loop completed with undelivered notifications` warnings from Radix components — harmless, ignore.
- **`DatabaseService.ts`** in `src/services/db/` is a legacy/duplicate file. Verify it's unused before deleting.
- **`next-themes`** is installed but not used — the app has its own `ThemeProvider`. Safe to remove from `package.json`.
- **No tests.** No test runner is configured.

---

## 8. Routing

Defined in `App.tsx` inside `<AppRoutes>`:

| Path              | Component        | Purpose                          |
| ----------------- | ---------------- | -------------------------------- |
| `/`               | `Index`          | Dashboard                        |
| `/machines`       | `Machines`       | Machine list + CRUD + categories |
| `/parts`          | `Parts`          | Parts table + edit modal         |
| `/oee`            | `OEE`            | OEE metrics                      |
| `/consumables`    | `Consumables`    | Consumables inventory            |
| `/raw-materials`  | `RawMaterials`   | Raw materials inventory          |
| `/calendar`       | `Calendar`       | Shifts, holidays, weekly view    |
| `/forecast`       | `Forecast`       | Production forecast              |
| `/cost-breakdown` | `CostBreakdown`  | Cost analysis (needs §7 linking) |
| `*`               | `NotFound`       | 404                              |

Navbar in `src/components/layout/Navbar.tsx` mirrors this list and includes the dark-mode toggle.

---

## 9. Conventions & Gotchas

- **Do not hard-code colors** (`text-white`, `bg-black`, hex values) in components — use semantic tokens from `index.css` / Tailwind config so dark mode works.
- **All mutations must go through `DataContext`**, never call service classes directly from components.
- **IDs**: use `src/utils/idGenerator.ts` (`id()`) — do not `Date.now()` or `Math.random()` inline.
- **shadcn/ui components** in `src/components/ui/` are considered vendored — extend by composition, don't edit them directly.
- **File length**: several components/services were refactored specifically because they crossed ~250 lines. Keep new components small.
- **Every write persists synchronously** — expect one IndexedDB round-trip per mutation. Batch in a hook if this becomes a perf issue.
- **Vite dev server** runs on port `8080` (not the Vite default 5173).

---

## 10. Handoff Checklist for the Next AI

1. Read `src/contexts/DataContextProvider.tsx` and the six hooks in `src/hooks/use*Operations.ts` — that's the entire data-flow spine.
2. Read `src/services/db/SqlDatabaseService.ts` + `DatabaseManager.ts` + `StorageService.ts` to understand persistence.
3. Read `src/types/all.ts` and the files it re-exports.
4. Before touching persistence, decide: stay on IndexedDB, move to Lovable Cloud (Supabase), or wire up the existing `PostgresService` behind a real API.
5. First feature to ship: attach utility rates to machine categories and use them in `CostBreakdown` (see §7).
