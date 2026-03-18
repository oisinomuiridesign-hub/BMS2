# BTC Client Portal — Implementation Status

> **Last updated:** 2026-03-10
> **Orchestrator:** Claude Code (claude-sonnet-4-6)

---

## Agent Ownership

| Agent | Scope | Status |
|-------|-------|--------|
| Agent 1 | Leads Module (BMS internal) | ✅ Complete |
| Agent 2 | Portal Shell & Authentication | ✅ Complete |
| Agent 3 | Portal Content: Lead Intake & Contract | ✅ Complete |
| Agent 4 | Portal Content: Vehicles & Wash Execution | ✅ Complete |
| Agent 5 | Certification & Management Approval | ✅ Complete |

---

## Pre-Flight Audit: Codebase Summary

### Framework & Tooling
- **React 18** with JSX, **Vite** bundler
- **React Router v6** — all routes in `src/App.jsx`
- **CSS Modules** — every component has its own `.module.css`
- **No backend** — all data from `src/data/*.js` as JS arrays
- **Icons:** `lucide-react`

### Route Registration (App.jsx)
Add new routes inside the `<Routes>` block in `src/App.jsx`. Pattern:
```jsx
<Route path="/leads" element={<LeadsOverview />} />
<Route path="/leads/new" element={<NewLead />} />
<Route path="/leads/:id" element={<LeadProfile />} />
<Route path="/portal/:portalId" element={<PortalShell />} />
```

### Sidebar Registration (Sidebar.jsx)
Add to the `NAV_ITEMS` array **above** the Clients entry:
```javascript
const NAV_ITEMS = [
  { label: 'Home', icon: LayoutDashboard, to: '/' },
  { label: 'Leads', icon: Target, to: '/leads' },      // ← ADD HERE
  { label: 'Clients', icon: Users, to: '/clients' },
  { label: 'Department', icon: Building2, to: '/departments' },
  { label: 'Employees', icon: UserSquare, to: '/employees' },
];
```
Icons available from `lucide-react`. Use `Target` or `Crosshair` for Leads.

### StatusBadge Component
Current: supports `'active' | 'inactive' | 'pending'`.
**Agent 1 must extend** StatusBadge to support lead statuses. New statuses to add:
- `new` → Blue (primary) — NEW lead
- `location_manual_pending` → Orange (warning) — Awaiting location manual
- `location_manual_submitted` → Blue (info) — Manual submitted, under review
- `under_review` → Purple — Under review
- `proposal_sent` → Blue (primary) — Proposal sent
- `awaiting_acceptance` → Orange — Awaiting digital acceptance
- `converted` → Green (success) — Converted to client
- `lost` → Red (error) — Lost lead

OR create a separate `LeadStatusBadge` component to avoid breaking existing StatusBadge.

### Shared Components API (for agents to reuse)
| Component | Props |
|-----------|-------|
| `CustomButton` | `variant` (primary/secondary/ghost), `size` (sm/md), `icon`, `onClick`, `children` |
| `CustomDropdown` | `value`, `onChange`, `options [{value, label}]`, `placeholder` |
| `CustomSearchBar` | `value`, `onChange`, `placeholder` |
| `Pagination` | `currentPage`, `totalPages`, `perPage`, `onPageChange`, `onPerPageChange` |
| `AvatarInitials` | `initials`, `color`, `size` (sm/md/lg) |
| `StatusBadge` | `status` (active/inactive/pending) |
| `Modal` | `isOpen`, `onClose`, `title`, `children` |
| `Tabs` | `tabs [{id, label}]`, `activeTab`, `onChange` |
| `Breadcrumbs` | `items [{label, path?}]` |
| `TopBar` | `title`, `breadcrumbs`, `actions` |

### Data Layer Shape Reference

**Client object** (`src/data/clients.js`):
```js
{ id, name, companyName, avatarInitials, address, city, phone, email,
  department, status, createdDate, avatarColor, contacts[] }
```

**Employee object** (`src/data/employees.js`):
```js
{ id, firstName, lastName, email, phone, role, department, skills[], status, createdDate, avatarColor }
```

**Activity object** (`src/data/activities.js`):
```js
{ id, clientId, type, title, content, authorName, authorAvatar, createdAt, replies[] }
```

---

## Shared Data Schemas (defined here to avoid conflicts)

### Lead Entity (`src/data/leads.js`) — **Owned by Agent 1**
```js
{
  id: 'lead-001',                        // String UUID-style
  companyName: 'Van den Berg Transport',
  contactPerson: 'Jan van den Berg',
  contactEmail: 'j.vandenberg@vdb.nl',
  contactPhone: '+31 6 12 34 56 78',
  location: 'Industrieweg 12, 5928 BM Venlo',
  leadSource: 'WEBSITE_FORM',            // WEBSITE_FORM|PHONE|EMAIL|REFERRAL|MANUAL
  status: 'NEW',                         // NEW|LOCATION_MANUAL_PENDING|LOCATION_MANUAL_SUBMITTED|UNDER_REVIEW|PROPOSAL_SENT|AWAITING_ACCEPTANCE|CONVERTED|LOST
  assignedTo: 2,                         // employee ID
  portalId: 'portal-001',               // reference to portal entity
  createdAt: '2026-01-15T09:00:00Z',
  updatedAt: '2026-01-15T09:00:00Z',
  convertedAt: null,                     // null until conversion
  convertedTo: null,                     // null until conversion (client ID after)
  avatarInitials: 'VB',
  avatarColor: '#0082ca',
  lastActivity: '2026-03-01T14:30:00Z', // last note/action timestamp
}
```

### Portal Entity (`src/data/portals.js`) — **Owned by Agent 2**
```js
{
  id: 'portal-001',
  entityType: 'LEAD',                    // LEAD|CLIENT
  entityId: 'lead-001',                 // reference to lead or client ID
  stage: 'INTAKE',                       // INTAKE|CONTRACT_REVIEW|VEHICLE_ASSIGNMENT|OPERATIONAL|ACTIVE
  locationManualId: null,               // null until submitted
  agreementId: null,                    // null until contract stage
  createdAt: '2026-01-15T09:00:00Z',
  // Portal login credentials (simulated)
  loginEmail: 'j.vandenberg@vdb.nl',
  loginPassword: 'portal-demo-pass',
  portalUrl: '/portal/portal-001',
}
```

### Vehicle Assignment (`src/data/vehicles.js`) — **Owned by Agent 4**
```js
{
  id: 'vehicle-001',
  portalId: 'portal-001',
  licensePlate: 'AB-123-CD',
  vehicleType: 'TRUCK',                  // TRUCK|TRAILER|TANKER|REFRIGERATED|OTHER
  washType: 'STANDARD',                  // STANDARD|HACCP_FOOD_GRADE|INTERIOR|FULL_SERVICE
  notes: '',
  status: 'ACTIVE',                      // ACTIVE|SWAPPED|REMOVED
  assignedAt: '2026-02-01T10:00:00Z',
}
```

### Wash Record (`src/data/washRecords.js`) — **Owned by Agent 4**
```js
{
  id: 'wash-001',
  assignmentId: 'vehicle-001',
  employeeId: 1,
  scheduledDate: '2026-03-10',
  completedAt: null,
  status: 'SCHEDULED',                   // SCHEDULED|COMPLETED|CONFIRMED|EXCEPTION
  exceptionType: null,                   // VEHICLE_ABSENT|DAMAGE_OBSERVED|ACCESS_ISSUE|EQUIPMENT_FAILURE|OTHER|null
  notes: '',
  approvedBy: null,
  approvedAt: null,
  certificateId: null,
}
```

### Certificate (`src/data/certificates.js`) — **Owned by Agent 5**
```js
{
  id: 'cert-001',
  portalId: 'portal-001',
  washRecords: ['wash-001'],
  issuedAt: '2026-03-10T16:00:00Z',
  approvedBy: 1,                         // employee ID
  location: 'Industrieweg 12, Venlo',
  vehicles: [{ plate: 'AB-123-CD', type: 'TRUCK', washType: 'STANDARD' }],
  haccpCompliant: false,
  pdfUrl: null,
}
```

---

## Deliverable Completion Log

### Agent 1 — Leads Module
- [x] "Leads" nav item added to sidebar (above Clients) — `src/components/layout/Sidebar.jsx`
- [x] Lead status badge component (8 statuses) — `src/components/shared/LeadStatusBadge.jsx` + `.module.css`
- [x] Leads Overview page (table layout, search/filter, Add Lead button) — `src/pages/LeadsOverview.jsx` + `.module.css`
- [x] Lead Profile page (5 tabs: Overview, Location Manual, Agreement, Activity, Portal) — `src/pages/LeadProfile.jsx` + `.module.css`
- [x] Lead data entity (`src/data/leads.js`) with 6 seed entries (spread across all statuses, 1 CONVERTED, 1 LOST)
- [x] Lead activity data (`src/data/leadActivities.js`) with 8 activity entries
- [x] CRUD operations — Add Lead modal with full form on Leads Overview
- [x] "Open Portal" button on Portal tab (links to `/portal/:portalId`)
- [x] "Convert to Client" button on Portal tab with confirmation modal + success banner
- [x] Routes added to `src/App.jsx`: `/leads` and `/leads/:id`

### Agent 2 — Portal Shell & Auth — COMPLETE
- [x] Portal route structure (`/portal/:portalId`) — nested routes in App.jsx outside AppShell
- [x] Login page (`/portal/login`) with role-based routing — pre-fill from query, demo accounts
- [x] Portal auth context (role: lead/client/employee/management) — `src/context/PortalAuthContext.jsx`
- [x] Portal shell layout (header, nav, stage indicator) — `src/components/portal/PortalShell.jsx`
- [x] Stage engine (renders correct sections per stage) — `isStageAvailable()` + locked states on nav + pages
- [x] "Open Portal" button integration — LeadProfile Portal tab links to `/portal/:id?mgmt=true` (no login needed)
- [x] Portal data entity (`src/data/portals.js`) — 6 lead portals + 2 client portals + 3 employee portals (11 total)
- [x] Responsive layout (mobile-first) — sidebar (desktop 768px+) + mobile header + bottom-nav tabs
- [x] All 6 section placeholder pages with polished locked/unlocked states + agent handoff markers
- [x] PortalHome dashboard — role-aware section cards with stage-based locking

### Agent 3 — Lead Intake & Contract — COMPLETE
- [x] Location manual form (8 sections, sticky section nav, progressive disclosure) — `src/pages/portal/PortalLocationManual.jsx` + `PortalLocationManual.module.css`
- [x] Form submission → portal status update (NOT_STARTED → IN_PROGRESS → SUBMITTED → APPROVED)
- [x] Confirmation modal on submit ("Once submitted, you cannot make changes")
- [x] SUBMITTED read-only state + APPROVED green banner
- [x] Management Review panel (Approve / Request Changes buttons + notes textarea)
- [x] Agreement viewer (key terms summary card with hero numbers + detail rows) — `src/pages/portal/PortalAgreement.jsx` + `PortalAgreement.module.css`
- [x] Digital acceptance checkbox + Accept Agreement button (disabled until checked)
- [x] Confirmation modal ("By clicking Confirm you are digitally accepting…")
- [x] Lead-to-client conversion banner on acceptance (stage advances to VEHICLE_ASSIGNMENT)
- [x] ACCEPTED state with timestamp, signer name, cosmetic Download PDF button
- [x] Amendment request flow (select term, comment textarea, submission, list with PENDING/APPROVED/REJECTED statuses)
- [x] Management amendment resolution (Approve / Reject buttons in mgmt view)
- [x] Seed data: `src/data/locationManuals.js` (4 entries: APPROVED/manual-003, APPROVED/manual-004, SUBMITTED/manual-006, IN_PROGRESS/manual-002-draft)
- [x] Seed data: `src/data/agreements.js` (3 entries: AWAITING_ACCEPTANCE/agreement-004, ACCEPTED/agreement-koelman, ACCEPTED/agreement-vdb)
- [x] `portals.js` updated — portal IDs corrected to match `leads.js` portalId field (portal-lead-001 through portal-lead-006), locationManualId and agreementId refs added
- [x] `LeadProfile.jsx` Location Manual tab — now loads real data from `locationManuals.js` (status badge, key details, management approve/request-changes with state updates)
- [x] `LeadProfile.jsx` Agreement tab — now loads real data from `agreements.js` (actual terms, acceptance status, amendment count)
- [x] Build confirmed: zero errors (`npm run build` ✅)

### Agent 4 — Vehicles & Wash Execution — COMPLETE
- [x] Seed data: `src/data/vehicles.js` — 14 vehicles across portal-client-001 (8) and portal-client-002 (6), 2 SWAPPED entries each with replacement chains
- [x] Seed data: `src/data/washRecords.js` — 25 records across today (COMPLETED/SCHEDULED/EXCEPTION), last week (all CONFIRMED), and 2 weeks ago (all CONFIRMED + certificateId)
- [x] Vehicle assignment table (contracted slots + Dutch plate display, status badges, type/washtype cells) — `src/pages/portal/PortalVehicles.jsx` + `PortalVehicles.module.css`
- [x] Capacity bar — slots used vs. agreement vehicleCount, turns red when full
- [x] Add Vehicle modal — license plate, type, wash type, notes, submits to local state
- [x] Vehicle swap flow — Swap modal with "Replacing: [plate]" header, reason field, transitions old→SWAPPED / new→ACTIVE with replacedBy link
- [x] Management "Remove Vehicle" button (sets status REMOVED, management view only)
- [x] SWAPPED rows grayed out with replacement plate linked beneath
- [x] Dutch license plate styling: #FFC916 background, monospace, 3 sizes (xs/sm/md)
- [x] Client wash status view — today's summary card (progress bar, completed/pending/exception counts), vehicle status grid cards, historical log table — `src/pages/portal/PortalWashStatus.jsx` + `PortalWashStatus.module.css`
- [x] Historical log filters — vehicle dropdown, date from/to range, clear filters
- [x] Certificate badge linked from historical rows (cert-001, cert-002)
- [x] Employee wash dashboard (mobile-first, 375px base) — dark header card with progress, large vehicle cards with Dutch plates, per-vehicle Confirm Wash button with loading state, Report Issue bottom sheet with 5 exception types as large-tap radio buttons — `src/pages/portal/PortalEmployeeDashboard.jsx` + `PortalEmployeeDashboard.module.css`
- [x] Submit Day Report button activates only when all vehicles confirmed or excepted
- [x] Success screen on submit with bounce animation and summary stats
- [x] Build confirmed: zero errors (`npm run build` ✅)

### Agent 5 — Certification & Management Approval — COMPLETE
- [x] Certificate data entity (`src/data/certificates.js`) — 3 certificates (cert-001 VdB 2026-02-24, cert-002 Koelman 2026-02-24, cert-003 VdB 2026-03-03). Helpers: `getCertificatesByPortalId`, `findCertificateById`, `findCertificateByWashRecordId`
- [x] Approval queue data entity (`src/data/approvalQueue.js`) — 3 PENDING items (two from today, one from last week). Helpers: `getPendingApprovals`, `getApprovalsByPortalId`, `findApprovalById`
- [x] Shared `CertificateModal` component (`src/components/portal/CertificateModal.jsx` + `.module.css`) — document-style modal with HACCP banner, Dutch plate styling, vehicle table, service details, approval section with digital signature placeholder, cosmetic Download PDF button with toast
- [x] `PortalCertificates.jsx` fully replaced — summary row (total certs, HACCP count, most recent date), filter bar (vehicle dropdown, wash type, date range, useMemo filtering), certificate cards with certNumber, HACCP badge, issued status, View Certificate button opening modal, Download PDF button
- [x] `PortalCertificates.module.css` created — full styles for summary cards, filter panel, cert cards, HACCP badge (purple #f0ebff/#6b4fbb), status badge
- [x] Management Approval Queue in `Home.jsx` — "Pending Wash Approvals" section with count badge, approval cards with 4px left accent border, exception summary, Approve & Generate Certificate button (opens confirm modal → marks APPROVED, shows cert number toast), Request Changes button (opens text area modal → marks REJECTED with notes), empty state
- [x] `HomeApprovals.module.css` created — all approval queue styles, confirm modals, toast stack with slide-in animation
- [x] `PortalWashStatus.jsx` updated — imports `getCertificatesByPortalId`, cert badge in historical log rows is now a clickable button opening `CertificateModal`, cert number format (BTC-2026-NNN) displayed instead of raw cert-id
- [x] Build confirmed: zero errors (`npm run build` ✅)

---

## Blockers & Notes

*All 5 agents complete. Last updated: 2026-03-10*

## Overall Project Status: ✅ COMPLETE

All 5 stages of the BTC Client Portal are implemented and the build passes with zero errors.
The prototype covers the full lead-to-client lifecycle: lead intake, contract review, vehicle assignment, wash execution, and certification.

### Notes for Agent 4

- `portals.js` IDs are now `portal-lead-001` through `portal-lead-006` for lead portals (matches `leads.js` portalId fields). The old `portal-001` through `portal-006` IDs are gone.
- `src/data/locationManuals.js` and `src/data/agreements.js` are new files — import from these when needed.
- `findAgreementByPortalId(portalId)` and `findManualByPortalId(portalId)` are exported helper functions.
- Portal `portal-lead-004` (De Groot Tankvervoer) is at stage `CONTRACT_REVIEW` with `agreementId: 'agreement-004'` — status `AWAITING_ACCEPTANCE`. Use this portal to demo the full acceptance flow.
- Portal `portal-client-001` (Koelman Trucking) is at stage `VEHICLE_ASSIGNMENT` — this is the starting point for Agent 4 vehicle assignment work.
- Portal `portal-client-002` (Van den Berg Transport) is at stage `OPERATIONAL` — starting point for Agent 4 wash execution work.

### Notes for Agent 5

- `src/data/vehicles.js` — exported helpers: `getVehiclesByPortalId`, `getActiveVehiclesByPortalId`, `findVehicleById`
- `src/data/washRecords.js` — exported helpers: `getWashRecordsByPortalId`, `getWashRecordsByPortalAndDate`, `getWashRecordsByVehicleId`, `findWashRecordById`
- `cert-001` covers wash-018 through wash-022 (portal-client-002, 2026-02-24, 5 vehicles, all CONFIRMED)
- `cert-002` covers wash-023 through wash-025 (portal-client-001, 2026-02-24, 3 vehicles, all CONFIRMED)
- HACCP-relevant vehicles: `vehicle-002` (TANKER, HACCP_FOOD_GRADE), `vehicle-010` (TANKER, HACCP_FOOD_GRADE), `vehicle-011` (TRUCK, HACCP_FOOD_GRADE)
- Management user email: `management@btc.nl` (set by `enterManagementView` in PortalAuthContext)
- Portal stages for Agent 5 work: `ACTIVE` stage is gated by the Certificates nav item in PortalShell
- Certificate route already registered in App.jsx as `path="certificates"` → `PortalCertificates`
- `employees.js` id 1 (Martijn de Vries) is the approver in all CONFIRMED historical records (`approvedBy: 1`)

---

## Shared Conventions

**File naming:** `camelCase.jsx` for components, `PascalCase.jsx` for pages
**CSS:** CSS Modules (`.module.css` per component), `var()` for all tokens
**Icons:** `lucide-react` only, `size={18}`, `strokeWidth={1.8}`
**Data imports:** Always from `src/data/*.js`, no inline constants for entity data
**Routing:** React Router v6, `<Routes>` in `App.jsx`, `useNavigate` for imperative navigation
**Dutch data:** Company names, +31 phone numbers, Dutch addresses, Dutch license plates (XX-000-XX format)
