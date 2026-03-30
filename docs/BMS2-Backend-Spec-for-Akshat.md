# BMS v1 → BMS2: Backend Requirements Spec

**Purpose:** Technical gap analysis between the current BMS (v1) and the new BMS2 frontend prototype. This document identifies every database table, API endpoint, and integration Akshat needs to build to support the new frontend.

**Prototype:** Live on Vercel (React 18 + Vite, hardcoded JSON fixtures, no backend)
**Team:** Akshat = backend (full-time) · Oisin = frontend · AI agent = QA

---

## Table of Contents

1. [Delta Map: v1 vs BMS2](#1-delta-map)
2. [New Modules Overview](#2-new-modules)
3. [Database Schema (16 Tables)](#3-database-schema)
4. [API Endpoints (~38 endpoints)](#4-api-endpoints)
5. [External Integrations](#5-external-integrations)
6. [Phased Rollout (~13 weeks full-time)](#6-phased-rollout)
7. [QA Agent Scope](#7-qa-agent-scope)
8. [Open Questions for Meeting](#8-open-questions)
9. [Decision Log](#9-decision-log)

---

## 1. Delta Map

### Existing Modules (backend exists — need enhancement)

| Module | v1 (Current) | What BMS2 Adds | Backend Work |
|---|---|---|---|
| **Home Dashboard** | Placeholder "Coming Soon" | KPI cards (total clients/employees/departments), recent activity feed, clients-by-department chart, pending wash approvals widget | 3 new aggregation endpoints |
| **Clients** | Grid overview, profile with tabs (Timeline, Files, Manuals, Agreements) | +**Portal** tab, +**Shifts** tab, threaded replies on timeline, change request integration, contacts array, portalId/KVK/VAT fields | Schema migration + 3 enhanced endpoints |
| **Departments** | Full CRUD | No changes | **Reuse as-is** |
| **Employees** | CRUD + skills | +**Shifts** tab (Shiftbase data) | 1 Shiftbase proxy endpoint |
| **Settings** | Profile, users/permissions | No changes | **Reuse as-is** |

### New Modules (no existing backend)

| Module | Description | Scale |
|---|---|---|
| **Leads (Sales CRM)** | Full pipeline with 8 statuses, 2-stage form process, lead-to-client conversion, activity timeline | 9 endpoints, 2 tables |
| **Client Portal** | Separate auth, 5-stage progressive access, 8 sub-pages (manual, agreement, vehicles, wash status, certificates, invoices, employee dashboard) | 15 endpoints, 8 tables |
| **Task Manager** | Approval queue for field changes + agreement attention notifications | 4 endpoints, 2 tables |

---

## 2. New Modules — Detailed

### 2A. Leads (Sales CRM)

**What it does:** Captures leads from the BTC website (via n8n webhook), runs them through an 8-stage pipeline, and converts them to clients with portal access.

**Pipeline:**
```
CAPTURED → APPROVED → DETAILS_SUBMITTED → UNDER_REVIEW → PROPOSAL_SENT → AWAITING_ACCEPTANCE → CONVERTED
                                                                                              ↘ LOST
```

**Two-stage form process:**
- **Form 1 (Enquiry):** Submitted via website → n8n webhook → creates lead with status `CAPTURED`. Fields: fleetSize, serviceInterest
- **Form 2 (Service Details):** Sent via email after planner approval. Rich form with: company details (KVK, VAT, IBAN), contact info, shunting options, wash location, vehicle table (repeating rows: vehicleNumber, vehicleType, frequencyWeeks, treatments[], pricePerVehicle), winter frequency, discounts, service type, preferred schedule

**Lead-to-client conversion:** When status reaches `CONVERTED`, the system creates a new Client record + Portal record from the lead data.

**Frontend pages:** LeadsOverview (filterable pipeline view), LeadProfile (detail + activity timeline)

---

### 2B. Client Portal (Separate App)

**What it does:** A client-facing application with its own authentication. Access is progressively unlocked through 5 stages as the client onboarding advances.

**Stages & what unlocks at each:**

| Stage | Unlocked Pages | Trigger |
|---|---|---|
| `INTAKE` | Location Manual submission | Portal created |
| `CONTRACT_REVIEW` | Agreement review + digital signature | Manual approved by BTC |
| `VEHICLE_ASSIGNMENT` | Vehicle assignment + management | Agreement accepted |
| `OPERATIONAL` | Wash tracking, employee dashboard | Vehicles assigned |
| `ACTIVE` | Certificates, invoices, full dashboard | First wash completed |

**Portal sub-pages:**
1. **Home** — Stage-gated dashboard showing progress + available actions
2. **Location Manual** — Client submits facility details (address, access instructions, operating hours per day, parking/water/power specs, safety requirements)
3. **Agreement** — Review contract terms, digitally accept, request amendments
4. **Vehicles** — Assign vehicles (license plate, type, wash type), swap vehicles
5. **Wash Status** — View scheduled/completed/exception wash records per vehicle
6. **Employee Dashboard** — BTC employees submit daily wash reports per vehicle with exception reporting
7. **Certificates** — Download HACCP compliance certificates (PDF)
8. **Invoices** — View monthly invoices with line items, payment status

**Auth:** Separate from BMS admin auth. Email + password per portal entity.

---

### 2C. Task Manager / Change Requests

**What it does:** Internal approval queue where BTC staff review and approve/reject:
- **Field change requests** (e.g., client wants to update invoice email, wash frequency)
- **Agreement attention** notifications (e.g., agreement awaiting acceptance, needs follow-up)

**UI:** Three-tab view (Pending | Approved | Rejected) with approve/reject actions + review notes.

---

## 3. Database Schema

### Group A — Existing Tables (schema changes only)

#### `clients` (MODIFY)
Add these fields to existing table:
```
portalId          FK → portals.id (nullable)
moneybirdCN       VARCHAR — Moneybird customer number(s)
vatNumber         VARCHAR — NL VAT format
kvkNumber         VARCHAR — Dutch KVK registration
```

#### `client_contacts` (NEW — extract from clients)
```
id                PK
clientId          FK → clients.id
role              ENUM: Owner | Administration | Invoices | Fleet Manager |
                        Planner | Driver | Technical Service | Invoice reminder | Other
name              VARCHAR
phone             VARCHAR
email             VARCHAR
starred           BOOLEAN (default false)
```

#### `activities` (MODIFY)
Add reply support:
```
parentId          FK → activities.id (nullable, self-referencing for replies)
```
Existing fields: id, clientId, type (note|complaint), title, content, authorName, createdAt

#### `employees` — No schema changes (shifts come from Shiftbase API)

#### `departments` — No changes

---

### Group B — Leads Domain (all new)

#### `leads` (NEW)
```
id                PK (VARCHAR, e.g. 'lead-001')
companyName       VARCHAR
contactPerson     VARCHAR
contactEmail      VARCHAR
contactPhone      VARCHAR
location          VARCHAR (full address)
leadSource        ENUM: WEBSITE_FORM | REFERRAL | PHONE | EMAIL | MANUAL
status            ENUM: CAPTURED | APPROVED | DETAILS_SUBMITTED | UNDER_REVIEW |
                        PROPOSAL_SENT | AWAITING_ACCEPTANCE | CONVERTED | LOST
assignedTo        FK → employees.id
createdAt         TIMESTAMP
updatedAt         TIMESTAMP
convertedAt       TIMESTAMP (nullable)
convertedTo       FK → clients.id (nullable)
lostReason        TEXT (nullable)

-- Form 1
enquiryFleetSize        INT
enquiryServiceInterest  TEXT

-- Form 2 (nullable until submitted)
f2_kvkNumber            VARCHAR
f2_vatNumber            VARCHAR
f2_bankNumber           VARCHAR
f2_street               VARCHAR
f2_houseNumber          VARCHAR
f2_postalCode           VARCHAR
f2_city                 VARCHAR
f2_country              VARCHAR (default 'Netherlands')
f2_contactDepartment    VARCHAR
f2_contactFullName      VARCHAR
f2_contactTelephone     VARCHAR
f2_contactEmail         VARCHAR
f2_shuntingOption       VARCHAR
f2_washLocation         VARCHAR
f2_winterFrequency      BOOLEAN
f2_additionalAgreements TEXT
f2_discount             BOOLEAN
f2_discountPercent      DECIMAL (nullable)
f2_serviceType          VARCHAR
f2_preferredSchedule    VARCHAR
f2_submittedAt          TIMESTAMP (nullable)

-- Planner actions
plannerApprovedAt       TIMESTAMP (nullable)
plannerApprovedBy       VARCHAR (nullable)
form2SentAt             TIMESTAMP (nullable)
```

#### `lead_vehicle_table` (NEW — Form 2 vehicle rows)
```
id                PK
leadId            FK → leads.id
vehicleNumber     VARCHAR
vehicleType       ENUM: Oplegger | Bulkoplegger | Tankwagen | Koeloplegger | Containeroplegger
frequencyWeeks    INT
treatments        VARCHAR[] (array of: Buitenwas | Binnenspuiten | Chemisch reinigen | Stoomreiniging)
pricePerVehicle   DECIMAL
```

#### `lead_activities` (NEW)
```
id                PK
leadId            FK → leads.id
type              ENUM: system | note
title             VARCHAR
content           TEXT
authorName        VARCHAR
createdAt         TIMESTAMP
parentId          FK → lead_activities.id (nullable, for replies)
```

---

### Group C — Portal Domain (all new)

#### `portals` (NEW)
```
id                PK (VARCHAR, e.g. 'portal-lead-001')
entityType        ENUM: LEAD | CLIENT | EMPLOYEE
entityId          VARCHAR — polymorphic FK (leads.id or clients.id or employees.id)
stage             ENUM: INTAKE | CONTRACT_REVIEW | VEHICLE_ASSIGNMENT | OPERATIONAL | ACTIVE
locationManualId  FK → location_manuals.id (nullable)
agreementId       FK → agreements.id (nullable)
companyName       VARCHAR
contactPerson     VARCHAR
loginEmail        VARCHAR (unique)
loginPasswordHash VARCHAR
portalUrl         VARCHAR
createdAt         TIMESTAMP
lastActivity      TIMESTAMP
```

#### `location_manuals` (NEW)
```
id                PK
leadId            FK → leads.id (nullable)
portalId          FK → portals.id
status            ENUM: NOT_STARTED | IN_PROGRESS | SUBMITTED | APPROVED | REJECTED
submittedAt       TIMESTAMP (nullable)
approvedAt        TIMESTAMP (nullable)
approvedBy        FK → employees.id (nullable)
siteAddress       VARCHAR
accessInstructions TEXT
operatingHours    JSON — { monday: "06:00–22:00", tuesday: "06:00–22:00", ... }
contacts          JSON — [{ role, name, phone, email }]
parkingSpecs      TEXT
waterSupply       TEXT
powerSupply       TEXT
wasteDisposal     TEXT
safetyRequirements TEXT
specialInstructions TEXT
```

#### `agreements` (NEW)
```
id                PK
leadId            FK → leads.id (nullable)
portalId          FK → portals.id
status            ENUM: DRAFT | SENT | AWAITING_ACCEPTANCE | ACCEPTED | REJECTED | AMENDED
vehicleCount      INT
washFrequency     ENUM: Weekly | Bi-weekly | Monthly
serviceType       VARCHAR
pricePerWash      DECIMAL
currency          VARCHAR (default 'EUR')
contractDuration  VARCHAR (e.g. '12 months')
startDate         DATE
endDate           DATE
paymentTerms      VARCHAR
sentAt            TIMESTAMP (nullable)
acceptedAt        TIMESTAMP (nullable)
acceptedBy        VARCHAR (nullable — contact name)
moneybirdQuoteRef VARCHAR (nullable)
```

#### `agreement_amendments` (NEW)
```
id                PK
agreementId       FK → agreements.id
term              VARCHAR (what's being amended)
comment           TEXT
status            ENUM: PENDING | APPROVED | REJECTED
submittedAt       TIMESTAMP
resolvedAt        TIMESTAMP (nullable)
```

#### `vehicles` (NEW)
```
id                PK
portalId          FK → portals.id
licensePlate      VARCHAR (Dutch format: XX-111-XX)
vehicleType       ENUM: TRUCK | TANKER | TRAILER | REFRIGERATED
washType          ENUM: STANDARD | FULL_SERVICE | INTERIOR | HACCP_FOOD_GRADE
notes             TEXT
status            ENUM: ACTIVE | SWAPPED | RETIRED
assignedAt        TIMESTAMP
swappedAt         TIMESTAMP (nullable)
replacedBy        FK → vehicles.id (nullable — self-referencing swap chain)
```

#### `wash_records` (NEW)
```
id                PK
vehicleId         FK → vehicles.id
portalId          FK → portals.id
employeeId        FK → employees.id
scheduledDate     DATE
completedAt       TIMESTAMP (nullable)
status            ENUM: SCHEDULED | COMPLETED | CONFIRMED | EXCEPTION
exceptionType     ENUM: VEHICLE_ABSENT | DAMAGE_OBSERVED | ACCESS_ISSUE |
                        EQUIPMENT_FAILURE | RESCHEDULE | OTHER (nullable)
notes             TEXT
approvedBy        FK → employees.id (nullable)
approvedAt        TIMESTAMP (nullable)
certificateId     FK → certificates.id (nullable)
```

#### `certificates` (NEW)
```
id                PK
certNumber        VARCHAR (format: BTC-YYYY-###)
portalId          FK → portals.id
clientName        VARCHAR
location          VARCHAR
washDate          DATE
issuedAt          TIMESTAMP
approvedBy        FK → employees.id
approverName      VARCHAR
employeeId        FK → employees.id
employeeName      VARCHAR
washRecordIds     INT[] (array of wash_records.id)
vehicleSnapshot   JSON — [{ vehicleId, plate, type, washType, haccpCompliant }]
totalVehicles     INT
haccpCompliant    BOOLEAN
pdfUrl            VARCHAR (nullable — generated PDF path)
```

#### `invoices` (NEW)
```
id                PK
portalId          FK → portals.id
invoiceNumber     VARCHAR (format: INV-YYYY-####)
moneybirdRef      VARCHAR
invoiceDate       DATE
dueDate           DATE
periodFrom        DATE
periodTo          DATE
status            ENUM: PENDING | PAID | OVERDUE
paidAt            TIMESTAMP (nullable)
amountExVat       DECIMAL
vatRate           DECIMAL (0.21)
vatAmount         DECIMAL
amountIncVat      DECIMAL
description       VARCHAR
```

#### `invoice_line_items` (NEW)
```
id                PK
invoiceId         FK → invoices.id
description       VARCHAR
quantity           INT
unitPrice         DECIMAL
total             DECIMAL
```

---

### Group D — BMS Domain (new)

#### `change_requests` (NEW)
```
id                PK
type              VARCHAR (e.g. 'AGREEMENT_ATTENTION', or field name like 'invoiceEmail')
requestedBy       VARCHAR
requestedAt       TIMESTAMP
status            ENUM: PENDING | APPROVED | REJECTED
clientId          FK → clients.id (nullable)
clientName        VARCHAR
locationPath      VARCHAR (frontend nav path)
locationLabel     VARCHAR
field             VARCHAR (nullable — which field is changing)
currentValue      VARCHAR (nullable)
requestedValue    VARCHAR (nullable)
description       TEXT
reviewedBy        VARCHAR (nullable)
reviewedAt        TIMESTAMP (nullable)
reviewNotes       TEXT (nullable)
```

#### `approval_queue` (NEW)
```
id                PK
portalId          FK → portals.id
clientName        VARCHAR
location          VARCHAR
date              DATE
employeeId        FK → employees.id
employeeName      VARCHAR
vehiclesCompleted INT
vehiclesTotal     INT
vehiclesException INT
exceptionSummary  TEXT (nullable)
washRecordIds     INT[]
status            ENUM: PENDING | APPROVED | REJECTED
reviewedBy        VARCHAR (nullable)
reviewedAt        TIMESTAMP (nullable)
reviewNotes       TEXT (nullable)
generatedCertId   FK → certificates.id (nullable)
```

---

## 4. API Endpoints

### A. Leads API
*Serves: LeadsOverview, LeadProfile*

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/leads` | List leads (filter: status, assignedTo, source, search) |
| `GET` | `/api/leads/:id` | Get lead with forms + activities |
| `POST` | `/api/leads` | Create lead (from n8n Form 1 webhook) |
| `PATCH` | `/api/leads/:id` | Update lead fields / attach Form 2 data |
| `POST` | `/api/leads/:id/approve` | Planner approves Form 1 → status: APPROVED |
| `POST` | `/api/leads/:id/send-form2` | Trigger Form 2 email → set form2SentAt |
| `POST` | `/api/leads/:id/convert` | Convert to client (creates client + portal records) |
| `GET` | `/api/leads/:id/activities` | List lead activities |
| `POST` | `/api/leads/:id/activities` | Add note / reply to lead timeline |

### B. Portal Auth API
*Serves: PortalLogin*

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/portal/login` | Email + password → JWT token + portal session |
| `GET` | `/api/portal/me` | Current portal user session info |

### C. Portal Resources API
*Serves: PortalHome, PortalLocationManual, PortalAgreement, PortalVehicles, PortalWashStatus, PortalCertificates, PortalEmployeeDashboard, PortalInvoices*

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/portal/:portalId` | Portal entity with stage + linked resources |
| `GET` | `/api/portal/:portalId/manual` | Get location manual |
| `PUT` | `/api/portal/:portalId/manual` | Submit / update location manual |
| `GET` | `/api/portal/:portalId/agreement` | Get agreement details |
| `POST` | `/api/portal/:portalId/agreement/accept` | Digital acceptance (binding) |
| `POST` | `/api/portal/:portalId/agreement/amendments` | Request amendment to terms |
| `GET` | `/api/portal/:portalId/vehicles` | List assigned vehicles |
| `POST` | `/api/portal/:portalId/vehicles` | Add new vehicle |
| `PATCH` | `/api/portal/:portalId/vehicles/:id/swap` | Swap vehicle (creates replacement link) |
| `GET` | `/api/portal/:portalId/wash-records` | List wash records (filter: date, status) |
| `POST` | `/api/portal/:portalId/wash-records` | Employee submits wash report |
| `GET` | `/api/portal/:portalId/certificates` | List certificates (filter: date, vehicle) |
| `GET` | `/api/portal/:portalId/certificates/:id/pdf` | Download certificate PDF |
| `GET` | `/api/portal/:portalId/invoices` | List invoices (filter: status, period) |

### D. Change Requests API
*Serves: ChangeRequests (Task Manager)*

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/change-requests` | List requests (filter: status) |
| `POST` | `/api/change-requests` | Submit new change request |
| `PATCH` | `/api/change-requests/:id/approve` | Approve + add review notes |
| `PATCH` | `/api/change-requests/:id/reject` | Reject + add review notes |

### E. Approval Queue API
*Serves: Home dashboard wash approvals widget*

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/approvals` | List pending wash approvals |
| `PATCH` | `/api/approvals/:id/approve` | Approve → triggers certificate generation |
| `PATCH` | `/api/approvals/:id/reject` | Reject with notes |

### F. Dashboard API
*Serves: Home*

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/dashboard/kpis` | Aggregated counts (clients, employees, departments, active) |
| `GET` | `/api/dashboard/recent-activity` | Cross-entity activity feed |
| `GET` | `/api/dashboard/pending-approvals` | Count of pending items |

### G. Enhanced Existing APIs

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/clients/:id` | **Enhance:** Include portalId, contacts[], KVK/VAT fields |
| `POST` | `/api/clients/:id/contacts` | **New:** Add contact to client |
| `PATCH` | `/api/clients/:id/contacts/:contactId` | **New:** Update contact |
| `DELETE` | `/api/clients/:id/contacts/:contactId` | **New:** Remove contact |
| `GET` | `/api/clients/:id/activities` | **Enhance:** Include threaded replies |
| `POST` | `/api/clients/:id/activities` | **Enhance:** Support reply (parentId) |
| `GET` | `/api/clients/:id/shifts` | **New:** Proxy to Shiftbase API |
| `GET` | `/api/employees/:id/shifts` | **New:** Proxy to Shiftbase API |

**Total: ~38 endpoints** (9 Leads + 2 Auth + 14 Portal + 4 Change Requests + 3 Approvals + 3 Dashboard + ~8 Enhanced)

---

## 5. External Integrations

### Shiftbase (Shift Scheduling)
- **Direction:** Read-only from BMS
- **Used by:** Client Profile → Shifts tab, Employee View → Shifts tab
- **Data:** shift id, date, start/end time, employee, location, department, Shiftbase URL (deep link back to Shiftbase)
- **Decision needed:** Live proxy vs nightly cache?

### Moneybird (Invoicing & Quotes)
- **Direction:** Bidirectional
- **Write:** Push quote references when agreement is sent (moneybirdQuoteRef)
- **Read:** Pull invoice data for portal display (invoiceNumber, moneybirdRef, amounts, status)
- **Used by:** Agreements (quote ref), Portal Invoices page, Client profile (moneybirdCN)
- **Decision needed:** What's the current v1 integration scope? Need to add read access.

### n8n (Workflow Automation)
- **Direction:** n8n → BMS (webhook)
- **Used by:** Lead creation from Form 1 on BTC website
- **Flow:** Website form → n8n → `POST /api/leads` → lead created with status CAPTURED
- **Decision needed:** Who builds/maintains the n8n flow?

---

## 6. Phased Rollout

Estimates assume Akshat working full-time (~40 hrs/week). Includes DB schema, API endpoints, business logic, tests, and deployment.

### Phase 1: Leads CRM + Client Schema Migration (3 weeks)

| Task | Est. Days |
|---|---|
| DB: leads, lead_activities, lead_vehicle_table tables + migrations | 2 |
| Leads CRUD API (9 endpoints) | 3 |
| Lead state machine + validation (status transitions) | 2 |
| n8n webhook receiver (POST /api/leads) | 1 |
| Lead-to-client conversion endpoint (complex: creates client + portal) | 2 |
| Client schema migration (add portalId, contacts, KVK, VAT) | 1 |
| client_contacts CRUD endpoints | 1 |
| Activity replies support (parentId) | 1 |
| Testing + bug fixes | 2 |

**Why first:** Leads is the sales pipeline — direct revenue impact. Conversion endpoint creates Portal entries, so this must exist before Portal work begins.

### Phase 2: Portal Core — Auth, Manuals, Agreements (3 weeks)

| Task | Est. Days |
|---|---|
| DB: portals, location_manuals, agreements, agreement_amendments tables | 2 |
| Portal auth system (login, JWT, middleware) | 3 |
| Portal entity API + stage-gate logic (progressive access control) | 2 |
| Location manual CRUD + submit/approve/reject workflow | 2 |
| Agreement API + digital acceptance endpoint | 2 |
| Amendment request workflow | 1 |
| Stage transition triggers (manual approved → CONTRACT_REVIEW, etc.) | 1 |
| Testing + bug fixes | 2 |

**Why second:** Portal is the client-facing product needed for converted leads. Stage-gate logic is the most complex business rule in the system.

### Phase 3: Operational Portal — Vehicles, Washes, Certs, Invoices (3.5 weeks)

| Task | Est. Days |
|---|---|
| DB: vehicles, wash_records, certificates, invoices, invoice_line_items, approval_queue tables | 2 |
| Vehicle CRUD + swap chain logic | 2 |
| Wash records API + exception handling | 3 |
| Approval queue API + approve/reject workflow | 2 |
| Certificate generation (PDF) on approval | 3 |
| Invoice API (read from Moneybird or local) | 2 |
| Employee portal dashboard API (wash report submission) | 1 |
| Testing + bug fixes | 2.5 |

**Why third:** This is the daily operational layer — the core product once a client is onboarded.

### Phase 4: Change Requests + Dashboard + Integrations (2 weeks)

| Task | Est. Days |
|---|---|
| DB: change_requests table | 0.5 |
| Change requests CRUD + approve/reject | 1.5 |
| Dashboard aggregation API (KPIs, recent activity, pending count) | 2 |
| Shiftbase API integration (proxy endpoints for client + employee shifts) | 2 |
| Moneybird read integration hardening | 1.5 |
| Testing + bug fixes | 2.5 |

**Why last:** Admin/management features — not client-blocking. Can ship earlier phases to production while this is in progress.

### Phase 5: Integration Testing + Hardening + Deploy (1.5 weeks)

| Task | Est. Days |
|---|---|
| End-to-end integration testing (frontend ↔ backend ↔ external APIs) | 3 |
| Edge cases, error handling, performance | 2 |
| Production deployment + monitoring setup | 2.5 |

### Summary

| Phase | Weeks | Cumulative |
|---|---|---|
| 1. Leads + Client Migration | 3 | 3 |
| 2. Portal Core | 3 | 6 |
| 3. Operational Portal | 3.5 | 9.5 |
| 4. Change Requests + Dashboard | 2 | 11.5 |
| 5. Integration + Deploy | 1.5 | **~13 weeks** |

---

## 7. QA Agent Scope

### What the AI QA agent covers:
- Automated smoke tests for every API endpoint after deployment
- Playwright end-to-end tests (frontend integration against real API)
- Regression suite run on every PR
- Data integrity checks (e.g., lead conversion actually creates client + portal + links correctly)
- HACCP certificate content validation
- Status transition validation (no illegal state jumps)

### What Akshat still owns:
- API unit tests (business logic, edge cases)
- Database migration testing
- External integration test stubs (Moneybird, Shiftbase mocks)
- Performance/load testing if needed

---

## 8. Open Questions for Meeting

1. **Shiftbase integration:** Should we proxy API calls live (simpler, but adds latency + Shiftbase dependency) or cache shift data nightly (more reliable, but stale data)? The prototype has 40+ shift records with direct Shiftbase URLs.

2. **Moneybird integration:** What does the current v1 integration cover? BMS2 needs read access for portal invoice display + write access for quote refs on agreements. Is the Moneybird API already authenticated?

3. **n8n ownership:** The leads Form 1 arrives via n8n webhook to `POST /api/leads`. Who builds and maintains the n8n flow — Akshat or Oisin?

4. **Portal authentication:** Should this be completely separate from BMS admin auth? The prototype uses email + static password per portal entity. In production: JWT-based? Session-based? Password reset flow needed?

5. **PDF certificate generation:** Certificates need PDF generation for HACCP compliance documents. Options: server-side (Puppeteer/wkhtmltopdf — heavier but reliable) or client-side (jsPDF — lighter but less control). What does Akshat prefer?

6. **Database:** What's the current v1 database? PostgreSQL? MySQL? What ORM? This affects migration strategy.

7. **Deployment:** Where is v1 hosted? Same infrastructure for portal, or separate deployment?

---

## 9. Decision Log

*Fill in during meeting:*

| # | Question | Option A | Option B | Decision | Notes |
|---|---|---|---|---|---|
| 1 | Shiftbase strategy | Live proxy | Nightly cache | | |
| 2 | Moneybird scope | Read + write | Read only (write later) | | |
| 3 | n8n ownership | Akshat | Oisin | | |
| 4 | Portal auth | Separate JWT | Shared with BMS | | |
| 5 | PDF generation | Server-side | Client-side | | |
| 6 | Database engine | PostgreSQL | Other | | |
| 7 | Deployment | Same infra | Separate portal deploy | | |
| | | | | | |

---

## Appendix: Route Map (Frontend → Backend)

Every frontend route and the API endpoints it needs:

```
BMS Admin (AppShell layout)
├── /                        → GET /api/dashboard/kpis, /recent-activity, /pending-approvals
├── /leads                   → GET /api/leads
├── /leads/:id               → GET /api/leads/:id, GET /api/leads/:id/activities
├── /clients                 → GET /api/clients
├── /clients/new             → POST /api/clients
├── /clients/:id             → GET /api/clients/:id (with contacts, portalId)
│   ├── tab: timeline        → GET /api/clients/:id/activities
│   ├── tab: files           → (existing file API)
│   ├── tab: manuals         → GET /api/portal/:portalId/manual
│   ├── tab: agreements      → GET /api/portal/:portalId/agreement
│   ├── tab: portal          → GET /api/portal/:portalId
│   └── tab: shifts          → GET /api/clients/:id/shifts (Shiftbase proxy)
├── /departments             → GET /api/departments (existing)
├── /departments/new         → POST /api/departments (existing)
├── /departments/:id         → GET /api/departments/:id (existing)
├── /employees               → GET /api/employees (existing)
├── /employees/new           → POST /api/employees (existing)
├── /employees/:id           → GET /api/employees/:id (existing)
│   └── tab: shifts          → GET /api/employees/:id/shifts (Shiftbase proxy)
├── /settings                → (existing)
└── /change-requests         → GET /api/change-requests

Portal (PortalShell layout — separate auth)
├── /portal/login            → POST /api/portal/login
└── /portal/:portalId
    ├── /                    → GET /api/portal/:portalId
    ├── /manual              → GET/PUT /api/portal/:portalId/manual
    ├── /agreement           → GET /api/portal/:portalId/agreement
    ├── /vehicles            → GET/POST /api/portal/:portalId/vehicles
    ├── /wash-status         → GET /api/portal/:portalId/wash-records
    ├── /washes              → POST /api/portal/:portalId/wash-records
    ├── /certificates        → GET /api/portal/:portalId/certificates
    └── /invoices            → GET /api/portal/:portalId/invoices
```
