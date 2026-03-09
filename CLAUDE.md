# BMS Prototype — Claude Code Context

## Project Purpose
Recreate the Basiq Management System (BMS) as a high-fidelity interactive React prototype for a client pitch to the BTC (Basiq Truck Cleaning) team. This prototype must look and feel like the real production application. It is NOT a wireframe or mockup — it's a clickable, navigable web app with realistic dummy data.

## Reference Material
Screenshots of the current Azure-hosted BMS are in `/Users/oo/Documents/OO/BTC/BMS2/References/As Is/`. These are the source of truth for every screen. Match them as closely as possible in layout, spacing, colors, typography, and component design.

## Tech Stack (Matching Production)
- **Framework:** React 18+ with JSX
- **Bundler:** Vite
- **Routing:** React Router v6 (file-based page components)
- **Styling:** CSS Modules or scoped CSS (the production app uses a custom component library, not MUI/Ant/Chakra)
- **State:** React useState/useContext (no Redux needed for a prototype)
- **Language:** JavaScript (not TypeScript — keep it fast to iterate)
- **No backend:** All data is hardcoded JSON fixtures simulating API responses

## Project Structure
```
/bms-prototype
├── CLAUDE.md                    # This file
├── index.html
├── package.json
├── vite.config.js
├── /Users/oo/Documents/OO/BTC/BMS2/References/As Is/   # Screenshots of current BMS (read-only reference)
├── /public
│   └── /assets                  # Static assets (logo, icons)
├── /src
│   ├── main.jsx                 # Entry point
│   ├── App.jsx                  # Root component + router
│   ├── /assets                  # SVGs, images
│   ├── /components
│   │   ├── /layout
│   │   │   ├── Sidebar.jsx      # Main navigation sidebar
│   │   │   ├── TopBar.jsx       # Page header with breadcrumbs + actions
│   │   │   └── AppShell.jsx     # Sidebar + content area wrapper
│   │   ├── /shared
│   │   │   ├── CustomButton.jsx
│   │   │   ├── CustomTable.jsx
│   │   │   ├── CustomSearchBar.jsx
│   │   │   ├── CustomDatePicker.jsx
│   │   │   ├── CustomInputField.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   ├── AvatarInitials.jsx
│   │   │   ├── CardGrid.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Tabs.jsx
│   │   │   └── Breadcrumbs.jsx
│   │   └── /domain
│   │       ├── ClientCard.jsx
│   │       ├── ContactList.jsx
│   │       ├── ActivityFeed.jsx
│   │       ├── NoteForm.jsx
│   │       └── EmployeeCard.jsx
│   ├── /pages
│   │   ├── Home.jsx
│   │   ├── ClientsOverview.jsx
│   │   ├── ClientProfile.jsx    # Tabbed: Timeline | Files | Location Manuals | Agreements
│   │   ├── NewClient.jsx
│   │   ├── DepartmentOverview.jsx
│   │   ├── DepartmentCreate.jsx
│   │   ├── EmployeesOverview.jsx
│   │   ├── NewEmployee.jsx
│   │   └── Settings.jsx
│   ├── /data
│   │   ├── clients.js           # Mock client data (9-12 entries)
│   │   ├── employees.js         # Mock employee data
│   │   ├── departments.js       # Mock department data
│   │   └── activities.js        # Mock timeline/notes data
│   └── /styles
│       ├── tokens.css           # Design system tokens (CSS custom properties)
│       ├── global.css           # Reset + base styles
│       └── /components          # Per-component CSS modules
└── README.md
```

## Design System Tokens
These are extracted from the production BMS. Use these EXACT values.

```css
:root {
  /* === Brand Colors — Primary === */
  --primary-0: #004d78;
  --primary-10: #0082ca;
  --primary-20: #52bcf7;
  --primary-50: #e2f3f8;
  --primary-60: #f3fafc;

  /* === Neutrals === */
  --neutral-0: #060b14;
  --neutral-10: #12213d;       /* Sidebar background */
  --neutral-20: #344667;
  --neutral-30: #8ca0c4;
  --neutral-40: #cbd8f0;
  --neutral-50: #dfe7f6;
  --neutral-60: #f3f5f9;       /* Page background */
  --neutral-70: #f9fafc;
  --neutral-80: #fcfcfd;
  --neutral-100: #ffffff;      /* Cards, panels */

  /* === Alerts === */
  --alert-warning-primary: #e09915;
  --alert-warning-secondary: #fff6e5;
  --alert-error-primary: #ef6461;
  --alert-error-secondary: #fdf2f2;
  --alert-success-primary: #27ae60;
  --alert-success-secondary: #e8f8ef;

  /* === Secondary === */
  --secondary-red-10: #ef6461;
  --secondary-red-30: #fdf2f2;
  --secondary-orange: #e09915;

  /* === Text === */
  --text-light-primary: #f9fafc;
  --text-dark-primary: #060b14;
  --text-dark-secondary: rgba(0, 0, 0, 0.5);

  /* === Border Radius === */
  --radius-s: 4px;
  --radius-m: 8px;
  --radius-l: 12px;
  --radius-100: 100px;         /* Pills, badges */

  /* === Shadows === */
  --shadow-float: 0px 0px 20px 0px rgba(7, 36, 89, 0.05);
  --shadow-card: 0 2px 8px rgba(7, 36, 89, 0.06);
  --shadow-card-hover: 0 4px 16px rgba(7, 36, 89, 0.10);

  /* === Typography === */
  --font-heading: 'Archivo', sans-serif;    /* Bold, boxy headings */
  --font-body: 'Montserrat', sans-serif;    /* Clean body text */
  --font-accent: 'Open Sans', sans-serif;   /* UI elements, labels */

  --text-xs: 11px;
  --text-sm: 14px;
  --text-md: 16px;
  --text-lg: 18px;
  --text-xl: 22px;
  --text-xxl: 28px;
}
```

## Component Patterns (from production source analysis)

### Sidebar
- Dark navy background (`--neutral-10`)
- Logo at top: "BASIQ MANAGEMENT SYSTEM" with tagline "WE SIMPLIFY THE JOB YOU HATE"
- Organisation switcher pill below logo: "Basiq Truckcleaning B.V." with a dropdown chevron
- Nav items: Home, Clients, Department, Employees — each with an icon
- Bottom items: Settings, Logout
- "Shrink Menu" toggle at very bottom
- Active state: highlighted background, white text
- Inactive: muted text (`--neutral-30`)

### Client Cards (Grid View)
- 3-column grid of cards
- Each card: avatar initials (colored circle), company name (bold), truncated address, status icons (orange speech bubble, three-dot menu)
- Below company info: contact role + name, phone number with icon
- Bottom colored accent bar (blue = active)
- Pagination: "Cards per page: 12" dropdown + page numbers

### Client Profile
- Top: company name, breadcrumbs
- Tab bar: Timeline | Files | Location Manuals | Agreements
- Left panel: Contact list grouped by role (Owner, Administration, Invoices, Technical Service, Fleet Manager, Planner, Driver, Other)
- Centre: Activity feed with note/complaint creation form
- Right: Filters for activity type + date range

### Top Bar Pattern
- Page title (large, uppercase, Archivo font)
- Breadcrumbs below title
- Action buttons top-right (Export, + New Client, etc.)
- Filter bar below: search input, status dropdown, department dropdown, date range picker

### Filter Bar
- Search input with magnifying glass icon
- "Selected Filters: N" counter
- Status dropdown (Active/Inactive/All)
- Department dropdown
- Created Date range picker

## Navigation Map
```
Sidebar
├── Home                        → /
├── Clients
│   ├── Overview (default)      → /clients
│   └── + New Client            → /clients/new
│       └── Client Profile      → /clients/:id
│           ├── Timeline tab    → /clients/:id (default)
│           ├── Files tab       → /clients/:id/files
│           ├── Manuals tab     → /clients/:id/manuals
│           └── Agreements tab  → /clients/:id/agreements
├── Department
│   ├── Overview                → /departments
│   └── Create                  → /departments/new
├── Employees
│   ├── Overview                → /employees
│   └── New Employee            → /employees/new
├── Settings                    → /settings
└── Logout                      → (no route, just action)
```

## Mock Data Guidelines
- Use realistic Dutch truck cleaning company names: "Van den Berg Transport", "De Rijn Logistics B.V.", "Koelman Trucking", "Hofstra Cargo", etc.
- Dutch phone numbers: +31 format
- Dutch addresses: real-sounding streets in cities like Venlo, Rotterdam, Utrecht, Eindhoven
- Contact roles: Owner, Fleet Manager, Planner, Driver
- 9-12 client entries (enough to fill the grid and show pagination)
- 6-8 employee entries
- 3-4 departments: "Venlo", "Rotterdam", "Eindhoven" (representing wash locations)

## Build Order
1. **Tokens + Global CSS** — get the design system foundation right first
2. **AppShell + Sidebar + Routing** — navigation working before any pages
3. **Clients Overview** — the most visually complex page, validates the component library
4. **Client Profile** — tabbed layout, contact list, activity feed
5. **Employees Overview** — reuses CardGrid/table patterns
6. **Department pages** — simpler, reuses components
7. **Home dashboard** — summary stats pulling from mock data
8. **Settings** — minimal, last priority
9. **Polish pass** — animations, hover states, transitions, responsive touches

## Quality Bar
- Every screen must be visually indistinguishable from a production app at first glance
- Sidebar navigation must work — clicking "Clients" goes to clients, etc.
- Client cards must be clickable, opening the profile view
- Tab switching on client profile must work
- Filters don't need to actually filter (cosmetic is fine) but dropdowns should open
- Forms don't need to submit, but inputs should be interactive
- Data should look realistic, not "Lorem ipsum" or "Test Client 1"

## Fonts
Import via Google Fonts in index.html:
```html
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=Montserrat:wght@400;500;600;700&family=Open+Sans:wght@300;400;600;700&display=swap" rel="stylesheet">
```

## Agent Skills (install before building)
Run these commands in the project root to install React best practices for Claude Code:
```bash
npx skills add vercel-labs/agent-skills --skill react-best-practices -a claude-code -y
npx skills add vercel-labs/agent-skills --skill web-design-guidelines -a claude-code -y
npx skills add vercel-labs/agent-skills --skill react-composition-patterns -a claude-code -y
```
These provide 40+ React performance and composition rules from Vercel Engineering that Claude Code will follow automatically.

## What NOT to Build
- No authentication/login screen (start at Home, assume logged in)
- No real API calls (everything is hardcoded mock data)
- No form validation logic
- No responsive/mobile layout (desktop only, 1280px+ viewport)
- No dark mode toggle
- No i18n (all text in English for the pitch, even though production is Dutch)
