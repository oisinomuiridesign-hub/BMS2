# BMS Design System Reference

> **Purpose**: This document is the onboarding guide for any developer taking over BMS2 frontend code. It maps every design token, shared component, and layout pattern so you don't have to reverse-engineer them from CSS files.
>
> **Tech stack**: React 18 + Vite + React Router v6 + CSS Modules + JavaScript (no TypeScript). Icons from `lucide-react`.

---

## Quick Start

1. All design tokens live in **`src/styles/tokens.css`** as CSS custom properties
2. Global resets and base styles live in **`src/styles/global.css`**
3. Every component has a co-located `.module.css` file (CSS Modules — classes are locally scoped)
4. Shared/reusable components live in **`src/components/shared/`**
5. Layout shell components live in **`src/components/layout/`**
6. Domain-specific components live in **`src/components/domain/`**

---

## 1. Design Tokens (`src/styles/tokens.css`)

### Brand Colors — Primary

| Token            | Value     | Usage                                              |
| ---------------- | --------- | -------------------------------------------------- |
| `--primary-0`    | `#004d78` | Darkest brand blue — hover states on primary buttons |
| `--primary-10`   | `#0082ca` | **Main brand blue** — primary buttons, links, accents |
| `--primary-20`   | `#52bcf7` | Light brand blue — active indicators, highlights    |
| `--primary-50`   | `#e2f3f8` | Very light blue wash — hover on secondary buttons   |
| `--primary-60`   | `#f3fafc` | Near-white blue — subtle backgrounds                |

### Neutrals

| Token            | Value     | Usage                                              |
| ---------------- | --------- | -------------------------------------------------- |
| `--neutral-0`    | `#060b14` | Near-black — body text (`--text-dark-primary`)      |
| `--neutral-10`   | `#12213d` | **Dark navy** — sidebar background                  |
| `--neutral-20`   | `#344667` | Dark gray-blue — secondary text, sidebar hover      |
| `--neutral-30`   | `#8ca0c4` | Mid gray-blue — placeholders, muted text, ghost btn |
| `--neutral-40`   | `#cbd8f0` | Light gray-blue — borders, dividers, scrollbar thumb |
| `--neutral-50`   | `#dfe7f6` | Lighter — card borders, subtle separators           |
| `--neutral-60`   | `#f3f5f9` | **Page background**, scrollbar track                |
| `--neutral-70`   | `#f9fafc` | Slightly off-white — card background alternative    |
| `--neutral-80`   | `#fcfcfd` | Near-white                                          |
| `--neutral-100`  | `#ffffff` | Pure white — card backgrounds, button text on blue  |

### Alert / Status Colors

| Token                        | Value     | Usage                    |
| ---------------------------- | --------- | ------------------------ |
| `--alert-success-primary`    | `#27ae60` | Green text — active/success badges |
| `--alert-success-secondary`  | `#e8f8ef` | Green background — active badge bg |
| `--alert-warning-primary`    | `#e09915` | Amber text — pending badges        |
| `--alert-warning-secondary`  | `#fff6e5` | Amber background — pending badge bg |
| `--alert-error-primary`      | `#ef6461` | Red text — inactive/error badges   |
| `--alert-error-secondary`    | `#fdf2f2` | Red background — inactive badge bg |

### Secondary (aliases)

| Token                  | Value     | Notes                              |
| ---------------------- | --------- | ---------------------------------- |
| `--secondary-red-10`   | `#ef6461` | Same as `--alert-error-primary`    |
| `--secondary-red-30`   | `#fdf2f2` | Same as `--alert-error-secondary`  |
| `--secondary-orange`   | `#e09915` | Same as `--alert-warning-primary`  |

### Text

| Token                    | Value                  | Usage                       |
| ------------------------ | ---------------------- | --------------------------- |
| `--text-light-primary`   | `#f9fafc`              | Light text on dark bg (sidebar) |
| `--text-dark-primary`    | `#060b14`              | Default body text color     |
| `--text-dark-secondary`  | `rgba(0,0,0,0.5)`     | Muted/secondary text        |

### Typography

| Token            | Value                       | Usage                              |
| ---------------- | --------------------------- | ---------------------------------- |
| `--font-heading` | `'Archivo', sans-serif`     | Page titles, card headings, avatar text |
| `--font-body`    | `'Montserrat', sans-serif`  | **Default** — all body text, buttons, inputs |
| `--font-accent`  | `'Open Sans', sans-serif`   | Sparingly used accents             |

| Token        | Value  | Equivalent           |
| ------------ | ------ | -------------------- |
| `--text-xs`  | `11px` | Badge labels, fine print |
| `--text-sm`  | `14px` | **Default body size** |
| `--text-md`  | `16px` | Slightly larger body  |
| `--text-lg`  | `18px` | Sub-headings          |
| `--text-xl`  | `22px` | Section headings      |
| `--text-xxl` | `28px` | Page titles           |

### Border Radius

| Token          | Value   | Usage                                     |
| -------------- | ------- | ----------------------------------------- |
| `--radius-s`   | `4px`   | Inputs, small elements                    |
| `--radius-m`   | `8px`   | **Default** — cards, buttons, dropdowns   |
| `--radius-l`   | `12px`  | Larger cards, modal panels                |
| `--radius-100` | `100px` | Fully rounded — pills, badges, avatar     |

### Shadows

| Token                | Value                                     | Usage                          |
| -------------------- | ----------------------------------------- | ------------------------------ |
| `--shadow-float`     | `0 0 20px rgba(7,36,89,0.05)`            | Floating panels, dropdowns     |
| `--shadow-card`      | `0 2px 8px rgba(7,36,89,0.06)`           | Default card elevation         |
| `--shadow-card-hover`| `0 4px 16px rgba(7,36,89,0.10)`          | Card hover state               |

### Spacing Scale

| Token        | Value  | Usage                           |
| ------------ | ------ | ------------------------------- |
| `--space-xs` | `4px`  | Tight gaps (icon + text)        |
| `--space-sm` | `8px`  | Small gaps (between badges)     |
| `--space-md` | `16px` | **Default** — section padding   |
| `--space-lg` | `24px` | Card padding, page content gap  |
| `--space-xl` | `32px` | Large section spacing           |
| `--space-xxl`| `48px` | Page-level vertical spacing     |

### Layout

| Token                | Value   | Usage                 |
| -------------------- | ------- | --------------------- |
| `--sidebar-width`    | `280px` | Sidebar expanded      |
| `--sidebar-collapsed`| `72px`  | Sidebar collapsed     |
| `--topbar-height`    | `auto`  | TopBar (content-sized) |

---

## 2. Shared Components (`src/components/shared/`)

### CustomButton

**File**: `CustomButton.jsx` + `CustomButton.module.css`

| Prop       | Type      | Default     | Values                               |
| ---------- | --------- | ----------- | ------------------------------------ |
| `variant`  | `string`  | `'primary'` | `'primary'`, `'secondary'`, `'ghost'` |
| `size`     | `string`  | `'md'`      | `'sm'` (30px), `'md'` (38px)         |
| `icon`     | `node`    | —           | Lucide icon element, renders left of text |
| `onClick`  | `func`    | —           |                                      |
| `children` | `node`    | —           | Button label text                    |
| `disabled` | `bool`    | `false`     | Dims to 45% opacity                  |

**Visual variants:**
- `primary` — solid blue (`--primary-10`) bg, white text. Hover: darker blue (`--primary-0`).
- `secondary` — white bg, blue text + blue border. Hover: light blue wash (`--primary-50`).
- `ghost` — transparent bg, gray text. Hover: light gray bg (`--neutral-60`).

```jsx
import CustomButton from '@/components/shared/CustomButton';
import { Plus } from 'lucide-react';

<CustomButton variant="primary" icon={<Plus size={16} />}>Add Client</CustomButton>
<CustomButton variant="secondary">Cancel</CustomButton>
<CustomButton variant="ghost" size="sm">Reset</CustomButton>
```

---

### StatusBadge

**File**: `StatusBadge.jsx` + `StatusBadge.module.css`

| Prop     | Type     | Default    | Values                                |
| -------- | -------- | ---------- | ------------------------------------- |
| `status` | `string` | `'active'` | `'active'`, `'inactive'`, `'pending'` |

Renders a pill-shaped badge with color-coded background:
- `active` — green (`--alert-success-*`)
- `inactive` — red (`--alert-error-*`)
- `pending` — amber (`--alert-warning-*`)

```jsx
<StatusBadge status="active" />    // Green "Active"
<StatusBadge status="inactive" />  // Red "Inactive"
<StatusBadge status="pending" />   // Amber "Pending"
```

---

### LeadStatusBadge

**File**: `LeadStatusBadge.jsx` + `LeadStatusBadge.module.css`

| Prop     | Type     | Default      | Values |
| -------- | -------- | ------------ | ------ |
| `status` | `string` | `'CAPTURED'` | `'CAPTURED'`, `'APPROVED'`, `'DETAILS_SUBMITTED'`, `'UNDER_REVIEW'`, `'PROPOSAL_SENT'`, `'AWAITING_ACCEPTANCE'`, `'CONVERTED'`, `'LOST'` |

Same pill shape as `StatusBadge` but with lead pipeline-specific statuses and colors.

```jsx
<LeadStatusBadge status="PROPOSAL_SENT" />  // "Proposal Sent"
<LeadStatusBadge status="CONVERTED" />       // "Converted"
```

---

### AvatarInitials

**File**: `AvatarInitials.jsx` + `AvatarInitials.module.css`

| Prop       | Type     | Default     | Values                       |
| ---------- | -------- | ----------- | ---------------------------- |
| `initials` | `string` | `'?'`       | 1-2 characters, auto-uppercased |
| `color`    | `string` | `'#0082ca'` | Any CSS color for the circle bg |
| `size`     | `string` | `'md'`      | `'sm'` (32px), `'md'` (40px), `'lg'` (48px) |

Circular colored avatar with white initials. Uses `--font-heading` (Archivo) for the text.

```jsx
<AvatarInitials initials="JD" color="#0082ca" size="md" />
<AvatarInitials initials="BT" color="#27ae60" size="lg" />
```

---

### Tabs

**File**: `Tabs.jsx` + `Tabs.module.css`

| Prop        | Type                              | Default | Notes                    |
| ----------- | --------------------------------- | ------- | ------------------------ |
| `tabs`      | `Array<{ id: string, label: string }>` | `[]`   | Tab definitions          |
| `activeTab` | `string`                          | —       | `id` of the active tab   |
| `onChange`   | `func(tabId)`                    | —       | Called when tab is clicked |

Renders a horizontal tab bar with `role="tablist"` and `aria-selected`.

```jsx
<Tabs
  tabs={[
    { id: 'timeline', label: 'Timeline' },
    { id: 'files', label: 'Files' },
    { id: 'agreements', label: 'Agreements' },
  ]}
  activeTab="timeline"
  onChange={(tabId) => setActiveTab(tabId)}
/>
```

---

### Modal

**File**: `Modal.jsx` + `Modal.module.css`

| Prop       | Type     | Default | Notes                         |
| ---------- | -------- | ------- | ----------------------------- |
| `isOpen`   | `bool`   | —       | Controls visibility           |
| `onClose`  | `func`   | —       | Called on Escape, overlay click, or X button |
| `title`    | `string` | —       | Modal header text             |
| `children` | `node`   | —       | Modal body content            |

Centered overlay modal with backdrop click-to-close and Escape key support. Uses `lucide-react` X icon for close button.

```jsx
<Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Confirm Delete">
  <p>Are you sure?</p>
  <CustomButton variant="primary" onClick={handleDelete}>Delete</CustomButton>
</Modal>
```

---

### CustomSearchBar

**File**: `CustomSearchBar.jsx` + `CustomSearchBar.module.css`

| Prop          | Type     | Default      | Notes                    |
| ------------- | -------- | ------------ | ------------------------ |
| `value`       | `string` | `''`         | Controlled input value   |
| `onChange`     | `func(string)` | —      | Receives the raw string  |
| `placeholder` | `string` | `'Search...'` |                         |

Search input with a leading magnifying glass icon.

```jsx
<CustomSearchBar value={query} onChange={setQuery} placeholder="Search clients..." />
```

---

### CustomDropdown

**File**: `CustomDropdown.jsx` + `CustomDropdown.module.css`

| Prop          | Type                                  | Default      | Notes                    |
| ------------- | ------------------------------------- | ------------ | ------------------------ |
| `value`       | `string`                              | —            | Controlled select value  |
| `onChange`     | `func(string)`                       | —            | Receives selected value  |
| `options`     | `Array<{ value: string, label: string }>` | `[]`     | Dropdown options         |
| `placeholder` | `string`                              | `'Select...'` | Disabled first option   |
| `label`       | `string`                              | —            | Optional label above     |

Native `<select>` wrapper with a chevron icon overlay.

```jsx
<CustomDropdown
  label="Status"
  value={statusFilter}
  onChange={setStatusFilter}
  options={[
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ]}
  placeholder="All statuses"
/>
```

---

### Breadcrumbs

**File**: `Breadcrumbs.jsx` + `Breadcrumbs.module.css`

| Prop    | Type                                  | Notes                               |
| ------- | ------------------------------------- | ----------------------------------- |
| `items` | `Array<{ label: string, path?: string }>` | Last item renders as plain text (current page). Others render as React Router `<Link>`. |

Horizontal breadcrumb trail with a Home icon as the first item and `>` separators. Uses React Router `<Link>` for navigation.

```jsx
<Breadcrumbs items={[
  { label: 'Clients', path: '/clients' },
  { label: 'Basiq Truckcleaning' },
]} />
```

---

### Pagination

**File**: `Pagination.jsx` + `Pagination.module.css`

| Prop             | Type          | Default | Notes                            |
| ---------------- | ------------- | ------- | -------------------------------- |
| `currentPage`    | `number`      | `1`     |                                  |
| `totalPages`     | `number`      | `1`     |                                  |
| `perPage`        | `number`      | `12`    | Items per page                   |
| `onPageChange`   | `func(page)`  | —       | Called with new page number      |
| `onPerPageChange`| `func(count)` | —       | Called when per-page select changes |

Renders "Cards per page" dropdown (6/12/24) on the left and page numbers with prev/next arrows on the right. Automatically inserts ellipsis for large page counts.

```jsx
<Pagination
  currentPage={page}
  totalPages={10}
  perPage={12}
  onPageChange={setPage}
  onPerPageChange={setPerPage}
/>
```

---

### ShiftCard

**File**: `ShiftCard.jsx` + `ShiftCard.module.css`

| Prop     | Type     | Notes                                      |
| -------- | -------- | ------------------------------------------ |
| `shift`  | `object` | Shift data object (id, date, location, status, etc.) |
| `isPast` | `bool`   | Dims the card for past shifts              |

Expandable card for employee shift records. Shows date badge + location + status in collapsed state. Expands to show full shift details (times, department, team, IDs). Links to Shiftbase.

---

## 3. Layout Components (`src/components/layout/`)

### AppShell

**File**: `AppShell.jsx` + `AppShell.module.css`

The root layout wrapper. Renders `<Sidebar>` on the left and main content on the right (`<Outlet>` from React Router).

```
+---+--------------------------------------+
| S |  TopBar (per page)                   |
| i |--------------------------------------|
| d |                                      |
| e |  Page Content (React Router Outlet)  |
| b |                                      |
| a |                                      |
| r |                                      |
+---+--------------------------------------+
```

### Sidebar

**File**: `Sidebar.jsx` + `Sidebar.module.css`

- Dark navy background (`--neutral-10`)
- Logo wordmark at top
- Org switcher pill (e.g. "BT | Basiq Truckcleaning B.V.")
- Navigation items with Lucide icons: Home, Leads, Clients, Department, Employees, Notifications
- Bottom section: Settings, Logout
- Collapsible via "Shrink Menu" toggle (280px -> 72px)
- Active nav item uses `NavLink` from React Router with active class styling

### TopBar

**File**: `TopBar.jsx` + `TopBar.module.css`

| Prop          | Type     | Notes                               |
| ------------- | -------- | ----------------------------------- |
| `title`       | `string` | Large uppercase page title (Archivo font) |
| `breadcrumbs` | `array`  | `[{ label, path }]` — same format as Breadcrumbs component |
| `actions`     | `node`   | Slot for buttons/controls (top-right) |

Each page provides its own TopBar with page-specific title, breadcrumbs, and action buttons.

---

## 4. Domain Components (`src/components/domain/`)

### ClientCard

**File**: `ClientCard.jsx` + `ClientCard.module.css`

Card used in the 3-column grid on ClientsOverview. Shows:
- Avatar initials circle (top)
- Company name
- Address
- Status icons
- Contact info
- Blue accent bar at bottom

### NotificationCard

**File**: `NotificationCard.jsx` + `NotificationCard.module.css`

Card for the notifications page.

---

## 5. Common Patterns

### Page Layout Pattern

Every page follows this structure:

```jsx
import TopBar from '@/components/layout/TopBar';
import CustomButton from '@/components/shared/CustomButton';
import styles from './MyPage.module.css';

export default function MyPage() {
  return (
    <>
      <TopBar
        title="PAGE TITLE"
        breadcrumbs={[{ label: 'Parent', path: '/parent' }, { label: 'Current Page' }]}
        actions={<CustomButton variant="primary" icon={<Plus size={16} />}>Add Thing</CustomButton>}
      />
      <div className={styles.content}>
        {/* Page content here */}
      </div>
    </>
  );
}
```

### Filter Bar Pattern

Most overview/list pages include a filter bar below the TopBar:

```jsx
<div className={styles.filterBar}>
  <CustomSearchBar value={query} onChange={setQuery} placeholder="Search..." />
  <CustomDropdown value={statusFilter} onChange={setStatusFilter} options={statusOptions} />
  {/* Optional: date range picker, additional dropdowns */}
</div>
```

### Card Grid Pattern

Used on ClientsOverview and similar pages:

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-lg);  /* 24px */
}
```

### CSS Module Convention

Every component `Foo` has:
- `Foo.jsx` — component logic
- `Foo.module.css` — scoped styles

Styles are imported as `import styles from './Foo.module.css'` and applied via `className={styles.someClass}`.

All CSS files reference tokens from `tokens.css` via `var(--token-name)` — **never hardcode colors, fonts, radii, or shadows**.

---

## 6. Tailwind Equivalents

For developers migrating to or thinking in Tailwind, here are approximate mappings:

| BMS Token              | Tailwind Equivalent          |
| ---------------------- | ---------------------------- |
| `--primary-10`         | `blue-600` (custom: `brand`) |
| `--neutral-60`         | `slate-100`                  |
| `--neutral-10`         | `slate-900`                  |
| `--neutral-30`         | `slate-400`                  |
| `--text-sm` (14px)     | `text-sm`                    |
| `--text-xs` (11px)     | `text-xs` (approx)           |
| `--text-xxl` (28px)    | `text-2xl` (approx)          |
| `--radius-m` (8px)     | `rounded-lg`                 |
| `--radius-100`         | `rounded-full`               |
| `--space-md` (16px)    | `p-4` / `gap-4`              |
| `--space-lg` (24px)    | `p-6` / `gap-6`              |
| `--shadow-card`        | `shadow-sm`                  |
| `--shadow-card-hover`  | `shadow-md`                  |
| `--font-heading`       | `font-archivo` (custom)      |
| `--font-body`          | `font-montserrat` (custom)   |

If converting to Tailwind, the custom colors and fonts would go in `tailwind.config.js`:

```js
// tailwind.config.js (for reference — not currently used in this project)
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0082ca',
          dark: '#004d78',
          light: '#52bcf7',
          wash: '#e2f3f8',
          faint: '#f3fafc',
        },
      },
      fontFamily: {
        heading: ['Archivo', 'sans-serif'],
        body: ['Montserrat', 'sans-serif'],
      },
    },
  },
};
```

---

## 7. Icons

All icons come from **`lucide-react`**. Common usage:

```jsx
import { Plus, Search, ChevronDown, X, Home } from 'lucide-react';

<Plus size={16} />           // In buttons
<Search size={16} />         // In search bars
<ChevronDown size={16} />    // In dropdowns
<X size={18} />              // In modal close buttons
```

Standard sizes: `14` (breadcrumbs, small UI), `16` (buttons, inputs), `18` (modal close).

---

## 8. Visual Reference (Screenshots)

Reference screenshots from the original Figma designs live in `docs/References/As Is/`. Use these to understand the intended look and feel when implementing or modifying components.

### Full App Layout (Sidebar + TopBar + Content)

**Login**
![Login](References/As%20Is/0.0-login.png)

**Home Dashboard** — Shows sidebar (dark navy), TopBar with large title, card-based content area.
![Home Dashboard](References/As%20Is/01-home-dashboard.png.png)

### Card Grid + Filter Bar

**Clients Overview** — 3-column card grid with search bar + dropdown filters. Each card shows AvatarInitials, company name, StatusBadge, contact info, and blue accent bar.
![Clients Overview](References/As%20Is/02-clients-overview.png.png)

### Tabbed Detail Page

**Client Profile (Timeline)** — Left contact list, centre activity feed, Tabs component across the top (Timeline | Files | Manuals | Agreements | Portal).
![Client Profile Timeline](References/As%20Is/03-client-profile-timeline.png.png)

**Client Profile (Files)** — Same layout, different tab content.
![Client Profile Files](References/As%20Is/04-client-profile-files.png.png)

**Client Profile (Manuals)** — Document list view.
![Client Profile Manuals](References/As%20Is/05-client-profile-manuals.png.png)

**Client Profile (Agreements)** — Agreement cards with status.
![Client Profile Agreements](References/As%20Is/06-client-profile-agreements.png.png)

### Forms

**New Client Form** — Standard form layout with labeled inputs and dropdowns.
![New Client Form 1](References/As%20Is/07.1-new-client-form.png.png)
![New Client Form 2](References/As%20Is/07.2-new-client-form.png.png)

### Department & Employee Views

**Department Overview** — Grid/list of departments.
![Department Overview](References/As%20Is/08-department-overview.png.png)

**Department Detail** — Single department view.
![Department View](References/As%20Is/08.1-department-view.png.png)

**Department Create** — Form for new department.
![Department Create](References/As%20Is/09-department-create.png.png)

**Employees Overview** — Employee listing with filters.
![Employees Overview](References/As%20Is/10-employees-overview.png.png)

**Employee Detail** — Single employee profile view.
![Employee View](References/As%20Is/10.1-employee-view.png.png)

**New Employee Form**
![New Employee](References/As%20Is/11-employees-new.png.png)

### Settings

**Settings Pages** — Multi-section settings with tabs/sections.
![Settings 1](References/As%20Is/12.1-settings.png.png)
![Settings 2](References/As%20Is/12.2-settings.png.png)
![Settings 3](References/As%20Is/12.3-settings.png.png)

### Key Visual Patterns to Note

| Pattern | What to look for in the screenshots |
| ------- | ----------------------------------- |
| **Sidebar** | Dark navy (#12213d), white text, Lucide icons, org switcher pill at top |
| **TopBar** | Large uppercase Archivo title, breadcrumbs underneath, action buttons top-right |
| **Cards** | White bg, 8px radius, subtle shadow, blue accent bar at bottom of client cards |
| **Badges** | Small rounded pills — green/amber/red for active/pending/inactive |
| **Filter bar** | Search input + dropdowns in a row below the TopBar |
| **Forms** | Left-aligned labels, consistent input heights, grouped sections |
| **Tabs** | Horizontal tab bar with underline on active tab |

---

## 9. File Quick-Reference

| Path | What |
| ---- | ---- |
| `src/styles/tokens.css` | All design tokens (colors, fonts, spacing, shadows, radii) |
| `src/styles/global.css` | CSS reset, base typography, app layout grid, scrollbar styles |
| `src/components/shared/` | Reusable UI components (buttons, badges, inputs, modal, tabs, pagination) |
| `src/components/layout/` | AppShell, Sidebar, TopBar — the page skeleton |
| `src/components/domain/` | Business-specific components (ClientCard, NotificationCard) |
| `src/data/` | Hardcoded JSON fixture data (no backend) |
| `src/pages/` | Route-level page components |
| `src/context/` | React context providers (auth) |
