# BTC Client Portal — Claude Code Implementation Brief

> **Purpose:** This is a condensed implementation prompt for Claude Code to update the existing BMS prototype. The full architecture spec (`BTC_Client_Portal_Architecture_Spec.docx`) contains rationale, data models, and strategic context. This file contains what to build.

---

## What You're Building

A **Client Portal** — a single, persistent, login-protected web interface that evolves across the lead-to-client lifecycle. It is NOT a separate app; it's a client/employee-facing view layer on top of the existing BMS data.

Three user types access the same portal with different permissions:
1. **Lead/Client** — sees their own data, fills forms, assigns vehicles, views certificates
2. **BTC Employee** — sees assigned locations, today's wash list, confirms completed washes
3. **BTC Management** — accesses any portal via BMS with full visibility and approval powers

---

## BMS Leads Module (New)

The BMS currently has a **Klanten (Clients)** module in the left sidebar. You need to add a **Leads** module directly above it that mirrors the same structure and style.

### Sidebar Navigation
- Add "Leads" as a new nav item in the left sidebar panel, positioned above "Klanten"
- Use the same icon style and hover/active states as the other sidebar items
- The nav item should show a count badge of active leads (same pattern as other modules if they have badges)

### Leads Overview Page
Mirror the Clients overview page exactly in layout and style:
- **Table/list view** of all leads with columns: Company name, Contact person, Location, Status (pipeline stage), Date created, Last activity
- **Status badges** using the existing badge system: New, Location Manual Pending, Location Manual Submitted, Under Review, Proposal Sent, Awaiting Acceptance, Converted, Lost
- **Search and filter** — same filter pattern as the Clients overview (search by name, filter by status)
- **"Add Lead" button** — same positioning and style as the client creation flow
- Clicking a lead row opens the Lead Profile page

### Lead Profile Page
Mirror the Client profile page layout with the same tab structure, but adapted for lead-specific data:
- **Overview tab** — Company info, contact details, lead source, pipeline stage, created date, assigned BTC contact
- **Location Manual tab** — Shows the location manual form status (not started / in progress / submitted / approved). Links to the portal where the lead fills this in. Management can review and approve here.
- **Agreement tab** — Shows draft proposal status. Once a Moneybird quote is generated, it appears here. Shows acceptance status.
- **Activity tab** — Timeline of all interactions: portal logins, form submissions, status changes, notes added by BTC staff
- **Portal tab** — "Open Portal" button that opens the lead's portal in management view. Shows portal stage and last activity.

### Lead-to-Client Conversion
- When a lead's agreement is digitally accepted (via portal), the system must convert the lead to a client
- **What conversion means:** The lead record moves from the Leads module to the Klanten module. All data carries over — company info, contacts, location manual, agreement, portal. The portal's `entity_type` flips from LEAD to CLIENT. The lead disappears from the Leads overview and appears in the Clients overview.
- **Conversion trigger:** Digital acceptance on the portal (automated). Management can also manually trigger conversion from the lead profile via a "Convert to Client" button.
- **Post-conversion:** The client profile page retains all tabs from the lead profile, plus gains the additional client-specific tabs (Vehicles, Wash History, Certificates) that unlock at the appropriate portal stages.
- The lead's row in the Leads overview should show status "Converted" briefly before being archived/hidden from the active leads list. A "Show converted" toggle lets management view historical conversions.

### Data: Lead Entity
```
lead_id         UUID        Auto-generated
company_name    String      Required
contact_person  String      Primary contact name
contact_email   String      Primary contact email
contact_phone   String      Primary contact phone
location        String      Site address
lead_source     WEBSITE_FORM|PHONE|EMAIL|REFERRAL|MANUAL
status          NEW|LOCATION_MANUAL_PENDING|LOCATION_MANUAL_SUBMITTED|UNDER_REVIEW|PROPOSAL_SENT|AWAITING_ACCEPTANCE|CONVERTED|LOST
assigned_to     FK          BTC staff member managing this lead
portal_id       FK          Reference to the lead's portal
created_at      Timestamp
updated_at      Timestamp
converted_at    Timestamp|null   When converted to client (null if not yet)
converted_to    FK|null          Reference to client record after conversion
```

---

## Portal Lifecycle (5 Stages)

The portal URL and credentials stay the same. Only the available features change based on stage.

### Stage 1: Lead Intake
- **Trigger:** Lead is created in BMS (manually or via website form)
- **Auto-provisions:** Portal instance, login credentials, email with portal URL
- **Portal shows:** Location Manual Form + lead status indicator
- **Location Manual Form fields:** Site address & access instructions, operating hours, contact persons (site manager, fleet manager, driver coordinator), parking/washing bay specs, water & power supply, waste disposal, safety requirements, special instructions
- **Gate:** BTC will not draft a contract until this form is submitted and approved

### Stage 2: Contract Review
- **Trigger:** Location manual submitted + reviewed by BTC management
- **Portal shows:** Agreement viewer (key terms highlighted: vehicle count, wash frequency, service type, pricing, duration, payment terms) + digital acceptance button + amendment request flow
- **Digital acceptance:** Logged with timestamp, creates binding record
- **On acceptance:** Triggers lead → client conversion in BMS

### Stage 3: Vehicle Assignment
- **Trigger:** Agreement accepted, lead converted to client
- **Portal shows:** Vehicle management table with contracted slots
- **Per vehicle:** License plate, vehicle type (truck/trailer/tanker/refrigerated/other), wash type (standard/HACCP food-grade/interior/full-service), special notes
- **Features:** Capacity indicator (slots used vs. contracted), vehicle swap management (replace without contacting BTC), license plate validation (RDW API where possible)
- **Portal now lives in Client module** of BMS (was in Lead module before)

### Stage 4: Operational Execution
- **Trigger:** Vehicles assigned, scheduled wash date arrives
- **Employee view:** Today's wash list filtered by location — shows each vehicle's plate, type, special instructions, wash type required. Per-vehicle confirmation checkbox. Exception reporting (vehicle absent, damage, access issue, equipment failure).
- **Client view:** Real-time wash status (which vehicles done, which pending). Historical wash log.

### Stage 5: Certification
- **Trigger:** Employee submits wash confirmations → management reviews and approves
- **On approval:** System auto-generates cleaning certificate (date, location, vehicles washed, wash type, employee, management sign-off, HACCP status)
- **Portal shows:** Certificate library — chronological, filterable by vehicle/date/wash type, downloadable
- **Optional:** Email notification to client when new certificate is published

---

## Access & Authentication

| Role | Sees | Can Do | Cannot Do |
|------|------|--------|-----------|
| Lead | Own portal | Fill location manual, view proposal, accept agreement | Assign vehicles, view certificates |
| Client | Own portal | Assign/swap vehicles, view certs, view wash history | Confirm washes, see other clients |
| Employee | Assigned locations | View wash list, confirm washes, report exceptions | Edit vehicles, view financials |
| Management | All portals via BMS | Everything + approvals | N/A |

- **Lead/Client auth:** Email + password, issued at portal creation
- **Employee auth:** Centrally managed by BTC, location-filtered access
- **Management auth:** Accessed through BMS client profile → "Open Portal" button (no separate login)

---

## BMS Integration Points

The portal is a VIEW LAYER on BMS data, not a separate database:

1. **Lead/Client profile → "Open Portal" button** — opens portal in management view
2. **Location Manuals tab** → becomes the portal's location manual view (read/write)
3. **Agreements tab** → becomes the contract review/acceptance interface
4. **Contact roles already in BMS** (Owner, Fleet Manager, Planner, Driver) → map to portal permissions
5. **Portal stage changes** update lead/client status in BMS
6. **Vehicle assignments** stored in BMS, exposed through portal
7. **Wash records** stored in BMS, exposed through portal
8. **Certificates** generated by system, stored in BMS, published to portal

---

## Data Entities to Add/Extend

### Portal
```
portal_id       UUID        Auto-generated at lead creation
entity_type     LEAD|CLIENT Which BMS module hosts it
entity_id       FK          Reference to lead/client record
stage           INTAKE|CONTRACT_REVIEW|VEHICLE_ASSIGNMENT|OPERATIONAL|ACTIVE
location_manual_id  FK      Completed location manual
agreement_id    FK          Active agreement (null until contract stage)
created_at      Timestamp
```

### Vehicle Assignment
```
assignment_id   UUID
portal_id       FK          Which portal this belongs to
license_plate   String      Validated format
vehicle_type    TRUCK|TRAILER|TANKER|REFRIGERATED|OTHER
wash_type       STANDARD|HACCP_FOOD_GRADE|INTERIOR|FULL_SERVICE
notes           Text        Client special instructions
status          ACTIVE|SWAPPED|REMOVED
assigned_at     Timestamp
```

### Wash Record
```
wash_id         UUID
assignment_id   FK          Which vehicle assignment
employee_id     FK          Who performed the wash
scheduled_date  Date
completed_at    Timestamp
status          SCHEDULED|COMPLETED|CONFIRMED|EXCEPTION
exception_type  VEHICLE_ABSENT|DAMAGE_OBSERVED|ACCESS_ISSUE|EQUIPMENT_FAILURE|OTHER|null
notes           Text        Employee notes
approved_by     FK|null     Management approver
approved_at     Timestamp|null
certificate_id  FK|null     Generated certificate reference
```

### Certificate
```
certificate_id  UUID
portal_id       FK
wash_records    FK[]        Which wash records this covers
issued_at       Timestamp
approved_by     FK
location        String
vehicles        JSON        Array of {plate, type, wash_type}
haccp_compliant Boolean
pdf_url         String      Generated PDF path
```

---

## Automation Summary (What's Automated vs. Human)

**Fully automated (n8n / system):**
- Portal provisioning on lead creation
- Credential delivery email
- Lead → client conversion on agreement acceptance
- Certificate generation on management approval
- Certificate publication to portal

**Human touchpoints (only 5 in the entire lifecycle):**
1. Management reviews location manual
2. Management approves Moneybird quote
3. Planner confirms auto-generated wash schedule
4. Employee confirms washes on-site
5. Management approves wash report → triggers certification

---

## Implementation Order (for prototype)

**Phase A — Leads Module + Portal Shell + Lead Intake**
- **Leads module in BMS sidebar** (overview page, profile page, tab structure mirroring Clients)
- Lead entity + CRUD operations (create, edit, status updates)
- Portal entity + auto-provisioning (portal created when lead is created)
- Login system with role-based routing
- Location manual form (structured, validated)
- Lead status display
- BMS "Open Portal" button on lead/client profiles

**Phase B — Contract + Vehicle Management + Lead-to-Client Conversion**
- Agreement viewer in portal
- Digital acceptance with audit logging
- **Lead-to-client conversion flow** (automated on acceptance + manual "Convert to Client" button)
- **Data migration from Lead module to Client module** (all tabs, portal, history carry over)
- Vehicle assignment interface (CRUD + swap)
- Capacity tracking vs. contract terms

**Phase C — Operational Execution**
- Employee login with location-filtered views
- Today's wash list per location
- Per-vehicle wash confirmation
- Exception reporting
- Client real-time status view + historical log

**Phase D — Certification**
- Management review/approval interface
- Auto certificate generation
- Certificate library on portal (filter, download)
- Email notification (optional)

---

## Design Notes

- Follow the existing BMS design system: dark navy sidebar (#12213D), card-based content with 1px borders (#DFE7F6), primary blues (#004D78, #0082CA, #52BCF7), Archivo SemiExpanded for headers, Bai Jamjuree for subheaders, Montserrat for body text
- The portal should feel like a natural extension of BMS, not a separate application
- Mobile-responsive is critical — employees access this on phones at wash sites
- The client-facing portal should be clean, professional, and confidence-inspiring — this is how BTC presents itself to its customers
