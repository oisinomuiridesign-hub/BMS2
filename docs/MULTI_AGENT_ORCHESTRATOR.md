# BTC Client Portal — Multi-Agent Implementation Plan

> **Context:** You are orchestrating the implementation of a Client Portal feature into an existing BMS (Business Management System) prototype. The full specification is in `CLAUDE_CODE_PORTAL_BRIEF.md` — read it completely before assigning any work.

---

## Pre-Flight (Do This First)

Before spawning any agents:

1. **Read `CLAUDE_CODE_PORTAL_BRIEF.md`** end to end. This is the source of truth for what we're building.
2. **Audit the existing codebase.** Map out: the project structure (framework, routing, state management), the existing sidebar navigation and how modules are registered, the existing Klanten (Clients) module — its overview page, profile page, and tab structure, the existing design system (component library, color tokens, typography, spacing), and the existing data layer (API structure, database schema, mock data if prototype).
3. **Create a shared understanding file** at the repo root called `PORTAL_IMPLEMENTATION_STATUS.md` that tracks: which agents own which scope, what's done, what's blocked, and shared conventions (file naming, component patterns, data schemas).

Only after completing the audit should you assign agents.

---

## Agent Assignments

### Agent 1 — Leads Module (BMS Internal)

**Owns:** Everything inside the BMS admin interface related to leads.

**Scope:**
- Add "Leads" nav item to the left sidebar, positioned above "Klanten", matching existing icon style and active states
- Build the Leads Overview page mirroring the Clients overview: table with columns (Company name, Contact person, Location, Status, Date created, Last activity), status badges (New, Location Manual Pending, Location Manual Submitted, Under Review, Proposal Sent, Awaiting Acceptance, Converted, Lost), search and filter controls, "Add Lead" button
- Build the Lead Profile page mirroring the Client profile layout with tabs: Overview, Location Manual, Agreement, Activity, Portal
- Create the Lead data entity and all CRUD operations
- Add "Open Portal" button on the lead profile's Portal tab
- Implement the "Convert to Client" manual trigger button on the lead profile

**Does NOT touch:** The portal itself, the client module, authentication, or certificate logic.

**Key constraint:** Study the existing Clients module first. Every layout choice, component pattern, spacing value, and interaction pattern should be replicated. The leads module should be indistinguishable in quality and style from the clients module. If the clients overview uses a specific table component, use the same one. If profiles use a specific tab component, use it.

**Deliverable:** A fully navigable Leads module with dummy/seed data showing 5-6 leads at various pipeline stages.

---

### Agent 2 — Portal Shell & Authentication

**Owns:** The portal as a separate authenticated view, routing logic, and role-based access control.

**Scope:**
- Create the portal route structure (e.g. `/portal/:portalId`) separate from the BMS admin routes
- Build the login/authentication flow for portal users (lead, client, employee)
- Implement role-based routing: after login, render the correct view based on user role (lead sees lead portal, employee sees employee portal, management gets redirected via BMS)
- Build the portal shell/layout: header with company name and portal stage indicator, navigation appropriate to the current stage, responsive layout (mobile-first — employees use phones on site)
- Implement the portal stage engine: the portal entity tracks its current stage (INTAKE → CONTRACT_REVIEW → VEHICLE_ASSIGNMENT → OPERATIONAL → ACTIVE) and the UI conditionally renders sections based on stage
- Wire the "Open Portal" button in BMS (from Agent 1) to open the portal in management view without requiring separate login

**Does NOT touch:** The content of individual portal sections (forms, vehicle tables, wash lists). Only the shell, routing, auth, and stage logic.

**Key constraint:** The portal must feel like a different product from BMS — it's client-facing, so it should be cleaner and simpler — but it uses the same design tokens (colors, typography). Think of it as the public-facing side of the same system.

**Deliverable:** A portal that you can log into with different roles, see the correct shell for the current stage, and navigate between portal sections (even if those sections are placeholder/empty).

---

### Agent 3 — Portal Content: Lead Intake & Contract

**Owns:** Portal Stages 1 and 2 — the location manual form and agreement review/acceptance.

**Scope:**
- Build the Location Manual form inside the portal (Stage 1): structured fields for site address, access instructions, operating hours, contact persons, parking/bay specs, water & power, waste disposal, safety requirements, special instructions. Form validation. Submit action that updates the portal stage and notifies BMS.
- Build the Agreement Viewer inside the portal (Stage 2): displays contract terms (vehicle count, wash frequency, service type, pricing, duration, payment terms) in a readable format. Digital acceptance button with confirmation dialog. Acceptance logs timestamp and triggers lead-to-client conversion.
- Build the lead-to-client conversion logic: on digital acceptance, flip the portal's entity_type from LEAD to CLIENT, migrate the record from the Leads module to the Clients module, carry over all data (location manual, agreement, portal reference, activity history). Post-conversion the client profile gains the additional tabs (Vehicles, Wash History, Certificates).
- Build the amendment request flow: client can flag specific terms for negotiation, creating a structured thread visible to both parties.

**Does NOT touch:** Vehicle management, wash execution, certificates, or the portal shell/routing (Agent 2 owns that).

**Key constraint:** The location manual form is the first thing a lead interacts with. It must be clean, professional, and not overwhelming — progressive disclosure is ideal (section by section rather than one massive form). The agreement viewer should highlight key terms prominently so the client can see at a glance what they're agreeing to.

**Deliverable:** A lead can log into their portal, fill in the complete location manual, submit it, then (after BTC review) see their agreement and digitally accept it — at which point they become a client.

---

### Agent 4 — Portal Content: Vehicle Management & Wash Execution

**Owns:** Portal Stages 3 and 4 — vehicle assignment and operational execution.

**Scope:**
- Build the Vehicle Assignment interface (Stage 3): table showing contracted vehicle slots alongside assignment inputs. Per-slot fields: license plate, vehicle type (truck/trailer/tanker/refrigerated/other), wash type (standard/HACCP food-grade/interior/full-service), notes. Capacity indicator (slots used vs. contracted). Vehicle swap flow (replace a vehicle, old one marked as SWAPPED, new one ACTIVE). All changes logged with timestamps.
- Build the Employee Wash View (Stage 4): employee logs in and sees today's wash list filtered by their assigned location. Each vehicle shows plate, type, special instructions, wash type. Per-vehicle confirmation checkbox with optional notes. Exception reporting (vehicle absent, damage observed, access issue, equipment failure, other).
- Build the Client Status View: real-time display of which vehicles have been washed and which are pending. Historical wash log — chronological, filterable by vehicle and date.

**Does NOT touch:** Portal shell/routing (Agent 2), lead intake forms (Agent 3), certificates (Agent 5), or the BMS internal leads/clients modules (Agent 1).

**Key constraint:** The employee wash view must be mobile-optimised above all else. Large tap targets, clear vehicle identification, minimal scrolling to confirm a wash. Employees are standing at a wash bay with wet hands — the interface must be usable under those conditions.

**Deliverable:** A client can assign vehicles to their contract slots. An employee can log in, see today's wash list, and confirm completed washes. The client can see wash status in real time.

---

### Agent 5 — Certification & Management Approval

**Owns:** Portal Stage 5 — management approval flow and certificate generation/display.

**Scope:**
- Build the Management Approval interface inside BMS: when an employee submits wash confirmations, management sees a review queue. Each item shows: location, date, vehicles washed, employee, any exceptions flagged. Approve/reject with optional notes.
- Build certificate generation: on approval, auto-generate a certificate containing: date of service, location, vehicles cleaned (by plate), wash type per vehicle, employee name, management approver, HACCP compliance status. Certificate stored as a record (and optionally as a generated PDF).
- Build the Certificate Library on the client portal: chronological list of all certificates. Filterable by vehicle, date range, wash type. Each certificate is viewable and downloadable.
- Wire the notification: when a certificate is published, the client sees it on their portal (and optionally receives an email notification).

**Does NOT touch:** Vehicle assignment (Agent 4), lead intake (Agent 3), portal shell (Agent 2), or the leads module (Agent 1).

**Key constraint:** Certificates are the proof-of-service that makes this entire system commercially valuable. They must look professional, contain all required HACCP-relevant data, and be instantly accessible to the client. The management approval step should be fast — one click to approve a clean wash report, with the option to drill into details only when exceptions exist.

**Deliverable:** Management can approve wash reports from BMS. Certificates are generated and appear on the client portal. Clients can browse, filter, and download their certificates.

---

## Coordination Rules

1. **Shared data schemas:** Agent 1 and Agent 3 both touch Lead data. Agent 2 defines the portal entity. Before any agent writes a schema or data model, check `PORTAL_IMPLEMENTATION_STATUS.md` to make sure another agent hasn't already defined it. If there's a conflict, the agent who owns the entity (per the brief's data model section) takes precedence.

2. **Integration seams:** Each agent should expose their work through clean interfaces:
   - Agent 1 exposes: lead CRUD API, lead profile route, sidebar registration pattern
   - Agent 2 exposes: portal route structure, auth context/hooks, stage engine API
   - Agent 3 exposes: location manual submission handler, conversion trigger function
   - Agent 4 exposes: vehicle assignment API, wash confirmation handler
   - Agent 5 exposes: approval handler, certificate generation function

3. **Build order matters:** Agent 1 and Agent 2 can work in parallel (they don't depend on each other). Agent 3 depends on both Agent 1 (lead entity) and Agent 2 (portal shell). Agent 4 depends on Agent 2 (portal shell) and Agent 3 (conversion creates the client). Agent 5 depends on Agent 4 (wash records to approve).

4. **Dependency graph:**
   ```
   Agent 1 (Leads Module) ──────────┐
                                     ├──→ Agent 3 (Intake & Contract) ──→ Agent 4 (Vehicles & Wash) ──→ Agent 5 (Certificates)
   Agent 2 (Portal Shell & Auth) ───┘
   ```

5. **Seed data:** Every agent should create realistic seed/dummy data for their domain so the prototype is demonstrable end to end. Use Dutch company names and Dutch license plate formats (e.g. AB-123-CD). Include leads at various pipeline stages and clients at various portal stages.

6. **Status updates:** Each agent updates `PORTAL_IMPLEMENTATION_STATUS.md` when they complete a deliverable or encounter a blocker.

---

## Design Reference

All agents must follow the existing BMS design system:
- **Sidebar:** Dark navy (#12213D)
- **Cards:** 1px border (#DFE7F6), white background, 8px border-radius
- **Primary blues:** #004D78 (dark), #0082CA (primary), #52BCF7 (light), #E2F3F8 (pale)
- **Alert colors:** Warning #E09915, Error #EF6461, Success #27AE60
- **Typography:** Archivo SemiExpanded (headers), Bai Jamjuree (subheaders), Montserrat (body)
- **Status badges:** Use the existing badge component with the established color coding

Study the existing components before building new ones. If a component exists that does what you need, use it.
