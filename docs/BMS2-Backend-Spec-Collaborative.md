# BMS v1 → BMS2: Collaborative Backend Spec

**Purpose:** This document shows what the BMS2 frontend prototype expects from the backend. It describes every data shape, API call, and integration the frontend is built around — so Akshat can decide how to implement it.

**How to use this document:** Sections marked with checkboxes (`- [ ]`) and `> **Akshat to confirm:**` blocks are open for Akshat to fill in. The frontend can adapt to different field names or response structures — what matters is the data content and the enum values (which are baked into UI components).

**Prototype:** Live on Vercel (React 18 + Vite, hardcoded JSON fixtures, no backend)
**Team:** Akshat = backend · Oisin = frontend · AI agent = QA (proposed)

---

## Table of Contents

1. [Delta Map: v1 vs BMS2](#1-delta-map)
2. [New Modules Overview](#2-new-modules)
3. [Data Requirements (by domain)](#3-data-requirements)
4. [Frontend API Contract](#4-frontend-api-contract)
5. [External Integrations](#5-external-integrations)
6. [Phase Sequencing](#6-phase-sequencing)
7. [QA Approach (Proposal)](#7-qa-approach-proposal)
8. [Open Questions for Meeting](#8-open-questions)
9. [Decision Log](#9-decision-log)

---

## 1. Delta Map

### Existing Modules (backend exists — need enhancement)

| Module | v1 (Current) | What BMS2 Adds | Backend Impact |
|---|---|---|---|
| **Home Dashboard** | Placeholder "Coming Soon" | KPI cards (total clients/employees/departments), recent activity feed, clients-by-department chart, pending wash approvals widget | New aggregation endpoints |
| **Clients** | Grid overview, profile with tabs (Timeline, Files, Manuals, Agreements) | +**Portal** tab, +**Shifts** tab, threaded replies on timeline, change request integration, contacts array, portalId/KVK/VAT fields | Schema expansion + enhanced endpoints |
| **Departments** | Full CRUD | No changes | **Reuse as-is** |
| **Employees** | CRUD + skills | +**Shifts** tab (Shiftbase data) | Shiftbase proxy/integration |
| **Settings** | Profile, users/permissions | No changes | **Reuse as-is** |

### New Modules (no existing backend)

| Module | Description |
|---|---|
| **Leads (Sales CRM)** | Full pipeline with 8 statuses, 2-stage form process, lead-to-client conversion, activity timeline |
| **Client Portal** | Separate auth, 5-stage progressive access, 8 sub-pages (manual, agreement, vehicles, wash status, certificates, invoices, employee dashboard) |
| **Task Manager** | Approval queue for field changes + agreement attention notifications |

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

## 3. Data Requirements

> This section describes **what the frontend expects to receive and send** — not how the backend should store it. JSON shapes are extracted directly from the prototype's fixture data. Akshat decides table structure, naming conventions, and storage strategy.
>
> **Enum values are locked** — the frontend has UI states, badge colors, and filter logic mapped to these exact string values.

---

### 3A. Clients (enhanced)

**What the frontend reads:**
```json
{
  "id": 1,
  "name": "Van den Berg Transport B.V.",
  "companyName": "Van den Berg Transport B.V.",
  "avatarInitials": "VB",
  "avatarColor": "#0082ca",
  "address": "Industrieweg 44, 5916 PK Venlo",
  "city": "Venlo",
  "phone": "+31 77 351 22 44",
  "email": "info@vandenbergtransport.nl",
  "departments": ["Venlo"],
  "status": "active",
  "createdDate": "2022-03-15",
  "moneybirdCN": "VB0048, VB0203",
  "vatNumber": "NL854612381B01",
  "kvkNumber": "12345678",
  "portalId": "portal-client-002",
  "contacts": [
    {
      "id": 101,
      "role": "Owner",
      "name": "Jan van den Berg",
      "phone": "+31 6 11 22 33 44",
      "email": "jan@vandenbergtransport.nl",
      "starred": true
    }
  ]
}
```

**New fields vs v1:** `portalId`, `contacts[]`, `moneybirdCN`, `vatNumber`, `kvkNumber`

**What the frontend writes (new contact):**
```json
{
  "role": "Fleet Manager",
  "name": "Rob Claessens",
  "phone": "+31 6 22 33 44 55",
  "email": "fleet@vandenbergtransport.nl",
  "starred": false
}
```

**Locked enums:**
- Client status: `"active"` | `"inactive"`
- Contact roles: `"Owner"` | `"Administration"` | `"Invoices"` | `"Fleet Manager"` | `"Planner"` | `"Driver"` | `"Technical Service"` | `"Invoice reminder"` | `"Other"`

**Relationships the frontend assumes:**
- Each client optionally links to one portal (via `portalId`)
- Each client has zero or more contacts (embedded in the response)
- Each client belongs to one or more departments (by name)

> **Akshat to confirm:**
> - [ ] How do contacts relate to the existing v1 client structure? Separate table or embedded?
> - [ ] Is `portalId` a new column on the existing clients table?
> - [ ] Are `moneybirdCN`, `vatNumber`, `kvkNumber` already stored somewhere in v1?

---

### 3B. Activities (client timeline)

**What the frontend reads:**
```json
{
  "id": 1,
  "clientId": 1,
  "type": "note",
  "title": "Quarterly service check confirmed",
  "content": "Spoke with Jan van den Berg regarding...",
  "authorName": "Martijn de Vries",
  "authorAvatar": "MV",
  "createdAt": "2026-02-14T09:22:00Z",
  "replies": [
    {
      "id": 101,
      "content": "Confirmed with the Venlo team. Slot reserved from 07:00–13:30.",
      "authorName": "Joost Hermans",
      "createdAt": "2026-02-14T11:05:00Z"
    }
  ]
}
```

**What the frontend writes (new activity or reply):**
```json
{ "type": "note", "title": "...", "content": "..." }
```
Replies: `{ "content": "..." }` posted to the parent activity

**Locked enums:**
- Activity type: `"note"` | `"complaint"`

**New vs v1:** Threaded replies (the `replies[]` array)

> **Akshat to confirm:**
> - [ ] Does v1 already have an activities/timeline table? What's its structure?
> - [ ] Preferred approach for replies — self-referencing FK, or separate replies table?

---

### 3C. Leads

**What the frontend reads (list view):**
```json
{
  "id": "lead-001",
  "companyName": "Vermeer Tanktransport B.V.",
  "contactPerson": "Kees Vermeer",
  "contactEmail": "k.vermeer@vermeertank.nl",
  "contactPhone": "+31 6 14 22 33 44",
  "location": "Ambachtsweg 18, 5253 RB Nieuwkuijk",
  "leadSource": "WEBSITE_FORM",
  "status": "CAPTURED",
  "assignedTo": 2,
  "createdAt": "2026-03-14T09:12:00Z",
  "updatedAt": "2026-03-14T09:12:00Z",
  "lastActivity": "2026-03-14T09:12:00Z",
  "avatarInitials": "VT",
  "avatarColor": "#0082ca",
  "convertedAt": null,
  "convertedTo": null
}
```

**What the frontend reads (detail view — includes forms):**
```json
{
  "...all list fields above...",
  "enquiryForm": {
    "fleetSize": 35,
    "serviceInterest": "Looking for a reliable partner to handle full exterior wash..."
  },
  "serviceDetailsForm": null,
  "plannerApprovedAt": null,
  "plannerApprovedBy": null,
  "form2SentAt": null
}
```

**Form 2 shape (when submitted):**
```json
{
  "serviceDetailsForm": {
    "kvkNumber": "67823410",
    "street": "Beemsterhoek",
    "houseNumber": "4",
    "postalCode": "5706 DN",
    "city": "Helmond",
    "country": "Netherlands",
    "vatNumber": "NL678234100B01",
    "bankNumber": "NL88RABO0342819075",
    "contactDepartment": "Fleet Manager",
    "contactFullName": "Femke van Breugel",
    "contactTelephone": "+31 6 36 44 55 66",
    "contactEmail": "f.vanbreugel@breugellogistics.nl",
    "shuntingOption": "Client handles shunting",
    "washLocation": "BTC facility",
    "vehicleTable": [
      {
        "vehicleNumber": "BL-001",
        "vehicleType": "Oplegger (Semi-trailer)",
        "frequencyWeeks": 2,
        "treatments": ["Buitenwas", "Binnenspuiten"],
        "pricePerVehicle": 88
      }
    ],
    "winterFrequency": false,
    "additionalAgreements": "...",
    "discount": true,
    "discountPercent": 5,
    "serviceType": "Mobile cleaning — BTC team visits client site",
    "preferredSchedule": "Tuesday and Thursday mornings"
  }
}
```

**What the frontend writes (planner approve):**
```json
POST /api/leads/:id/approve
// No body needed — backend sets plannerApprovedAt/By from auth context
```

**What the frontend writes (convert lead to client):**
```json
POST /api/leads/:id/convert
// No body needed — backend creates client + portal from lead data
```

**Locked enums:**
- Lead status: `"CAPTURED"` | `"APPROVED"` | `"DETAILS_SUBMITTED"` | `"UNDER_REVIEW"` | `"PROPOSAL_SENT"` | `"AWAITING_ACCEPTANCE"` | `"CONVERTED"` | `"LOST"`
- Lead source: `"WEBSITE_FORM"` | `"REFERRAL"` | `"PHONE"` | `"EMAIL"` | `"MANUAL"`
- Vehicle types (Form 2): `"Oplegger (Semi-trailer)"` | `"Bulkoplegger"` | `"Tankwagen (Tank truck)"` | `"Koeloplegger (Reefer trailer)"` | `"Containeroplegger"`
- Treatments (Form 2): `"Buitenwas"` | `"Binnenspuiten"` | `"Chemisch reinigen"` | `"Stoomreiniging"`
- Shunting options: `"Client handles shunting"` | `"Basiq with C/E license (paid)"`

**Relationships the frontend assumes:**
- A lead optionally links to a portal (portal has `entityType: "LEAD"` + `entityId: lead.id`)
- A lead has zero or more lead activities
- On conversion, lead data flows into a new client + portal record
- `assignedTo` references an employee ID

> **Akshat to confirm:**
> - [ ] Preferred storage for Form 2 data — JSON column or normalized tables?
> - [ ] The `vehicleTable` array in Form 2 could be 1-50+ rows. JSON blob or separate table?
> - [ ] Lead-to-client conversion: what data needs to carry over? (Frontend currently copies company details, creates portal, links agreement)
> - [ ] State machine enforcement — should backend validate status transitions, or trust the frontend?

---

### 3D. Lead Activities

**What the frontend reads:**
```json
{
  "id": "la-001",
  "leadId": "lead-001",
  "type": "system",
  "title": "Enquiry form received via website",
  "content": "Kees Vermeer submitted the online enquiry form...",
  "authorName": "System",
  "authorAvatar": "SY",
  "createdAt": "2026-03-14T09:12:00Z",
  "replies": []
}
```

**Locked enums:**
- Type: `"system"` | `"note"`

> **Akshat to confirm:**
> - [ ] Same structure as client activities, or separate? Frontend treats them identically.

---

### 3E. Portals

**What the frontend reads:**
```json
{
  "id": "portal-lead-001",
  "entityType": "LEAD",
  "entityId": "lead-001",
  "stage": "INTAKE",
  "locationManualId": null,
  "agreementId": null,
  "companyName": "Vermeer Tanktransport B.V.",
  "contactPerson": "Kees Vermeer",
  "loginEmail": "k.vermeer@vermeertank.nl",
  "portalUrl": "/portal/portal-lead-001",
  "createdAt": "2026-02-10T08:30:00Z",
  "lastActivity": "2026-02-10T08:30:00Z"
}
```

**Locked enums:**
- Entity type: `"LEAD"` | `"CLIENT"` | `"EMPLOYEE"`
- Stage: `"INTAKE"` | `"CONTRACT_REVIEW"` | `"VEHICLE_ASSIGNMENT"` | `"OPERATIONAL"` | `"ACTIVE"`

**Relationships the frontend assumes:**
- A portal links to either a lead, client, or employee (polymorphic via `entityType` + `entityId`)
- A portal optionally links to one location manual and one agreement
- Vehicles, wash records, certificates, and invoices all reference a portal
- Stage determines which portal pages are accessible (frontend enforces this in UI)

> **Akshat to confirm:**
> - [ ] Polymorphic association (`entityType` + `entityId`) or separate FK columns per type?
> - [ ] Portal auth: separate auth system from BMS admin? JWT or session-based?
> - [ ] Who triggers stage transitions — backend automatically, or frontend requests it?
> - [ ] Should the backend also enforce stage-gating on API access, or just the frontend?

---

### 3F. Location Manuals

**What the frontend reads:**
```json
{
  "id": "manual-003",
  "leadId": "lead-003",
  "portalId": "portal-lead-003",
  "status": "APPROVED",
  "submittedAt": "2026-02-14T10:45:00Z",
  "approvedAt": "2026-02-18T09:30:00Z",
  "approvedBy": 3,
  "siteAddress": "Beemsterhoek 4, 5706 DN Helmond",
  "accessInstructions": "Main entrance via Beemsterhoek. Gate code: 7741...",
  "operatingHours": {
    "monday": "06:00–20:00",
    "tuesday": "06:00–20:00",
    "wednesday": "06:00–20:00",
    "thursday": "06:00–20:00",
    "friday": "06:00–18:00",
    "saturday": "08:00–14:00",
    "sunday": "Closed"
  },
  "contacts": [
    { "role": "Site Manager", "name": "Femke van Breugel", "phone": "+31 6 36 44 55 66", "email": "f.vanbreugel@breugellogistics.nl" }
  ],
  "parkingSpecs": "Capacity for 6 trucks simultaneously...",
  "waterSupply": "Municipal mains water. Static pressure: 5.5 bar...",
  "powerSupply": "400 V three-phase, 32 A per bay...",
  "wasteDisposal": "Grease interceptor pit on-site (3,000 L capacity)...",
  "safetyRequirements": "Hi-vis vest and safety boots mandatory...",
  "specialInstructions": "Do NOT use the east gate before 08:00..."
}
```

**What the frontend writes (submit/update manual):**
All fields above except `id`, `status`, `submittedAt`, `approvedAt`, `approvedBy` — those are set by the backend.

**Locked enums:**
- Status: `"NOT_STARTED"` | `"IN_PROGRESS"` | `"SUBMITTED"` | `"APPROVED"` | `"REJECTED"`

> **Akshat to confirm:**
> - [ ] `operatingHours` and `contacts` — JSON column or normalized?
> - [ ] Approval triggers portal stage transition to `CONTRACT_REVIEW`. Backend handles this automatically?

---

### 3G. Agreements

**What the frontend reads:**
```json
{
  "id": "agreement-004",
  "leadId": "lead-004",
  "portalId": "portal-lead-004",
  "status": "AWAITING_ACCEPTANCE",
  "vehicleCount": 8,
  "washFrequency": "Monthly",
  "serviceType": "Standard + HACCP Food-Grade",
  "pricePerWash": 320.00,
  "currency": "EUR",
  "contractDuration": "12 months",
  "startDate": "2026-04-01",
  "endDate": "2027-03-31",
  "paymentTerms": "Net 30 days, monthly invoice",
  "sentAt": "2026-02-28T16:00:00Z",
  "acceptedAt": null,
  "acceptedBy": null,
  "moneybirdQuoteRef": "MB-2026-0138",
  "amendments": [
    {
      "id": "amend-001",
      "term": "washFrequency",
      "comment": "We'd prefer bi-weekly to reduce costs during Q2.",
      "status": "APPROVED",
      "submittedAt": "2026-03-02T10:00:00Z",
      "resolvedAt": "2026-03-04T14:30:00Z"
    }
  ]
}
```

**What the frontend writes (digital acceptance):**
```json
POST /portal/:portalId/agreement/accept
// Confirmation — no body. Backend sets acceptedAt + acceptedBy from portal auth context.
```

**What the frontend writes (amendment request):**
```json
{ "term": "washFrequency", "comment": "We'd prefer bi-weekly to reduce costs during Q2." }
```

**Locked enums:**
- Status: `"DRAFT"` | `"SENT"` | `"AWAITING_ACCEPTANCE"` | `"ACCEPTED"` | `"REJECTED"` | `"AMENDED"`
- Wash frequency: `"Weekly"` | `"Bi-weekly"` | `"Monthly"`
- Amendment status: `"PENDING"` | `"APPROVED"` | `"REJECTED"`

> **Akshat to confirm:**
> - [ ] Amendments: embedded array or separate table?
> - [ ] Acceptance triggers portal stage transition to `VEHICLE_ASSIGNMENT`. Backend handles?
> - [ ] Moneybird quote ref — is this generated by backend or entered manually?

---

### 3H. Vehicles

**What the frontend reads:**
```json
{
  "id": "vehicle-001",
  "portalId": "portal-client-001",
  "licensePlate": "KL-001-BT",
  "vehicleType": "TRUCK",
  "washType": "FULL_SERVICE",
  "notes": "Side skirts require high-pressure rinse. Park trailer separately.",
  "status": "ACTIVE",
  "assignedAt": "2026-02-03T08:00:00Z",
  "swappedAt": null,
  "replacedBy": null
}
```

**What the frontend writes (assign new vehicle):**
```json
{
  "licensePlate": "KL-001-BT",
  "vehicleType": "TRUCK",
  "washType": "FULL_SERVICE",
  "notes": "Side skirts require high-pressure rinse."
}
```

**What the frontend writes (swap vehicle):**
```json
PATCH /portal/:portalId/vehicles/:id/swap
{
  "licensePlate": "NEW-PLATE",
  "vehicleType": "TRUCK",
  "washType": "FULL_SERVICE",
  "notes": "Replacement for KL-001-BT"
}
// Backend marks old vehicle as SWAPPED, creates new one, links via replacedBy
```

**Locked enums:**
- Vehicle type: `"TRUCK"` | `"TANKER"` | `"TRAILER"` | `"REFRIGERATED"`
- Wash type: `"STANDARD"` | `"FULL_SERVICE"` | `"INTERIOR"` | `"HACCP_FOOD_GRADE"`
- Status: `"ACTIVE"` | `"SWAPPED"` | `"RETIRED"`

**Relationships the frontend assumes:**
- Vehicles belong to a portal
- A swapped vehicle links to its replacement via `replacedBy`
- Wash records reference a vehicle

> **Akshat to confirm:**
> - [ ] Swap chain (self-referencing `replacedBy`) — any concerns with this approach?
> - [ ] Vehicle count slots come from the agreement's `vehicleCount`. Should backend enforce this limit?

---

### 3I. Wash Records

**What the frontend reads:**
```json
{
  "id": "wash-001",
  "vehicleId": "vehicle-009",
  "portalId": "portal-client-002",
  "employeeId": 6,
  "scheduledDate": "2026-03-10",
  "completedAt": "2026-03-10T07:48:00Z",
  "status": "COMPLETED",
  "exceptionType": null,
  "notes": "Completed without issues. Priority vehicle ready before 07:50.",
  "approvedBy": null,
  "approvedAt": null,
  "certificateId": null
}
```

**What the frontend writes (employee submits wash report):**
```json
{
  "vehicleId": "vehicle-009",
  "status": "COMPLETED",
  "notes": "Completed without issues.",
  "exceptionType": null
}
```
Or for exceptions:
```json
{
  "vehicleId": "vehicle-011",
  "status": "EXCEPTION",
  "exceptionType": "VEHICLE_ABSENT",
  "notes": "Vehicle not at location — driver reported delay."
}
```

**Locked enums:**
- Status: `"SCHEDULED"` | `"COMPLETED"` | `"CONFIRMED"` | `"EXCEPTION"`
- Exception type: `"VEHICLE_ABSENT"` | `"DAMAGE_OBSERVED"` | `"ACCESS_ISSUE"` | `"EQUIPMENT_FAILURE"` | `"RESCHEDULE"` | `"OTHER"`

**Relationships the frontend assumes:**
- Each wash record references a vehicle, a portal, and an employee
- After management approval, a wash record links to a certificate via `certificateId`

> **Akshat to confirm:**
> - [ ] Are wash records created by the backend (pre-scheduled) or only when employees submit?
> - [ ] Approval flow: the approval queue (Section 3K) groups wash records by day/portal. Who creates the approval queue entries — backend automatically?

---

### 3J. Certificates

**What the frontend reads:**
```json
{
  "id": "cert-001",
  "certNumber": "BTC-2026-001",
  "portalId": "portal-client-002",
  "clientName": "Van den Berg Transport B.V.",
  "location": "Waalhaven Oostzijde 55, Rotterdam",
  "washDate": "2026-02-24",
  "issuedAt": "2026-02-24T16:30:00Z",
  "approvedBy": 1,
  "approverName": "Martijn de Vries",
  "employeeId": 6,
  "employeeName": "Anke Willems",
  "washRecordIds": ["wash-018", "wash-019", "wash-020", "wash-021", "wash-022"],
  "vehicles": [
    {
      "vehicleId": "vehicle-009",
      "plate": "VB-001-TR",
      "type": "TRUCK",
      "washType": "STANDARD",
      "haccpCompliant": false
    },
    {
      "vehicleId": "vehicle-010",
      "plate": "VB-114-HK",
      "type": "TANKER",
      "washType": "HACCP_FOOD_GRADE",
      "haccpCompliant": true
    }
  ],
  "totalVehicles": 5,
  "haccpCompliant": true,
  "pdfUrl": null
}
```

**The frontend does NOT write certificates** — they are generated by the backend when a wash approval is approved.

**Relationships the frontend assumes:**
- A certificate references a portal, one or more wash records, and an approver
- The `vehicles` array is a snapshot at time of issuance (denormalized)
- `pdfUrl` points to a downloadable PDF (HACCP compliance document)

> **Akshat to confirm:**
> - [ ] PDF generation approach — server-side (Puppeteer/wkhtmltopdf) or other?
> - [ ] Certificate numbering (`BTC-YYYY-###`) — auto-incrementing on backend?
> - [ ] The `vehicles` array is a snapshot. Is that reasonable, or should it reference live vehicle data?

---

### 3K. Approval Queue (Wash Approvals)

**What the frontend reads:**
```json
{
  "id": "approval-001",
  "portalId": "portal-client-002",
  "clientName": "Van den Berg Transport B.V.",
  "location": "Waalhaven Oostzijde 55, Rotterdam",
  "date": "2026-03-10",
  "employeeId": 6,
  "employeeName": "Anke Willems",
  "vehiclesCompleted": 2,
  "vehiclesTotal": 5,
  "vehiclesException": 1,
  "exceptionSummary": "Vehicle 33-DX-TZ absent at time of scheduled wash...",
  "washRecordIds": ["wash-001", "wash-002", "wash-003", "wash-004", "wash-005"],
  "status": "PENDING",
  "reviewedBy": null,
  "reviewedAt": null,
  "reviewNotes": null,
  "generatedCertId": null
}
```

**What the frontend writes:**
```json
PATCH /api/approvals/:id/approve
{ "reviewNotes": "Looks good. Certificate generated." }

PATCH /api/approvals/:id/reject
{ "reviewNotes": "Exception for vehicle 33-DX-TZ needs follow-up before approval." }
```

**Locked enums:**
- Status: `"PENDING"` | `"APPROVED"` | `"REJECTED"`

**Relationships the frontend assumes:**
- Approval → groups wash records for a single day/portal/employee
- On approval → backend generates a certificate and links it via `generatedCertId`

> **Akshat to confirm:**
> - [ ] Are approval queue entries auto-generated when an employee submits a day report, or manually created?
> - [ ] On approval, does the backend automatically generate the certificate + PDF?

---

### 3L. Invoices

**What the frontend reads:**
```json
{
  "id": "inv-001-dec25",
  "portalId": "portal-client-001",
  "invoiceNumber": "INV-2025-0401",
  "moneybirdRef": "MB-2025-INV-0401",
  "invoiceDate": "2026-01-01",
  "dueDate": "2026-01-31",
  "periodFrom": "2025-12-01",
  "periodTo": "2025-12-31",
  "status": "PAID",
  "paidAt": "2026-01-28T09:00:00Z",
  "amountExVat": 1640.00,
  "vatRate": 0.21,
  "vatAmount": 344.40,
  "amountIncVat": 1984.40,
  "description": "Weekly truck wash service — December 2025",
  "lineItems": [
    {
      "description": "4 wash sessions × €410.00",
      "quantity": 4,
      "unitPrice": 410.00,
      "total": 1640.00
    }
  ]
}
```

**The frontend only reads invoices** — it does not create or edit them. They come from Moneybird or are generated by the backend.

**Locked enums:**
- Status: `"PENDING"` | `"PAID"` | `"OVERDUE"`

> **Akshat to confirm:**
> - [ ] Are invoices synced from Moneybird, or does the backend generate them locally?
> - [ ] If Moneybird is the source of truth, do we just proxy the API or cache locally?
> - [ ] `lineItems` — always included in the response, or a separate call?

---

### 3M. Change Requests

**What the frontend reads:**
```json
{
  "id": "cr-001",
  "type": "FIELD_CHANGE",
  "requestedBy": "Sophie Janssen",
  "requestedAt": "2026-03-14T09:12:00Z",
  "status": "PENDING",
  "clientId": 1,
  "clientName": "Van den Berg Transport B.V.",
  "locationPath": "/clients/1",
  "locationLabel": "Clients → Van den Berg Transport B.V.",
  "field": "Invoice Email",
  "currentValue": "facturen@vandenbergtransport.nl",
  "requestedValue": "boekhouding@vandenbergtransport.nl",
  "description": "Client switched to an external accountant...",
  "reviewedBy": null,
  "reviewedAt": null,
  "reviewNotes": null
}
```

**Agreement attention type:**
```json
{
  "id": "nt-001",
  "type": "AGREEMENT_ATTENTION",
  "requestedBy": "Sophie Janssen",
  "requestedAt": "2026-03-17T10:00:00Z",
  "status": "PENDING",
  "clientName": "De Groot Tankvervoer B.V.",
  "locationPath": "/leads/lead-004",
  "locationLabel": "Leads → De Groot Tankvervoer B.V.",
  "agreementStatus": "AWAITING_ACCEPTANCE",
  "description": "Agreement sent 28 Feb — awaiting client signature."
}
```

**What the frontend writes (approve/reject):**
```json
PATCH /api/change-requests/:id/approve
{ "reviewNotes": "Approved. Moneybird updated." }
```

**Locked enums:**
- Status: `"PENDING"` | `"APPROVED"` | `"REJECTED"`
- Type: `"AGREEMENT_ATTENTION"` (plus field-specific types are just the field name string)

> **Akshat to confirm:**
> - [ ] Should approval of a field change automatically update the client record?
> - [ ] Should it also sync to Moneybird?
> - [ ] Is this a new concept, or does v1 have any kind of change approval workflow?

---

### 3N. Shifts (Shiftbase Integration)

**What the frontend reads:**
```json
{
  "id": "shift-001",
  "clientId": 1,
  "date": "2026-01-12",
  "day": "Monday",
  "startTime": "06:00",
  "endTime": "14:00",
  "breakDuration": "30 min",
  "totalHours": "7h 30m",
  "status": "completed",
  "employeeName": "Joost Hermans",
  "userId": "usr-001",
  "employeeNumber": "EMP-001",
  "location": "Venlo Depot",
  "locationId": "loc-venlo-01",
  "shiftName": "Early Morning Wash",
  "department": "Cleaning",
  "departmentId": "dept-001",
  "team": "Team Alpha",
  "teamId": "team-001",
  "description": "Exterior + chassis wash, pre-inspection checklist",
  "scheduleId": "sch-2026-W03",
  "shiftbaseUrl": "https://app.shiftbase.com/shifts/shift-001"
}
```

**The frontend only reads shifts** — they are managed in Shiftbase. The frontend just displays them on client and employee profile tabs.

**Locked enums:**
- Status: `"completed"` | `"upcoming"` | `"cancelled"`

> **Akshat to confirm:**
> - [ ] Current Shiftbase API integration status in v1?
> - [ ] Proxy live or cache? The frontend needs shifts filterable by clientId and employeeId.
> - [ ] Is the `shiftbaseUrl` deep link format correct?

---

## 4. Frontend API Contract

> These are the routes and HTTP methods the frontend is built to call. Path structure, query parameters, and response shapes are based on the prototype — **Akshat to confirm or propose alternatives.** The frontend can adapt to different paths or response wrappers (e.g., `{ data: [...], meta: { total, page } }`).

### 4A. Leads API
*Called by: LeadsOverview, LeadProfile*

| What the frontend calls | Description |
|---|---|
| `GET /api/leads` | List leads. Frontend filters by: `status`, `assignedTo`, `source`, `search` (text) |
| `GET /api/leads/:id` | Single lead with forms + activities |
| `POST /api/leads` | Create lead (from n8n Form 1 webhook) |
| `PATCH /api/leads/:id` | Update lead fields / attach Form 2 data |
| `POST /api/leads/:id/approve` | Planner approves Form 1 → status becomes `APPROVED` |
| `POST /api/leads/:id/send-form2` | Trigger Form 2 email to lead |
| `POST /api/leads/:id/convert` | Convert lead to client + portal |
| `GET /api/leads/:id/activities` | Lead activity timeline |
| `POST /api/leads/:id/activities` | Add note / reply to lead timeline |

> **Akshat's notes:**
> - [ ] Preferred path structure for leads?
> - [ ] Pagination approach (offset vs cursor)?
> - [ ] Webhook auth for n8n → `POST /api/leads`?

---

### 4B. Portal Auth API
*Called by: PortalLogin*

| What the frontend calls | Description |
|---|---|
| `POST /api/portal/login` | Email + password → returns session/token + portal data |
| `GET /api/portal/me` | Current portal user session |

> **Akshat's notes:**
> - [ ] JWT or session-based?
> - [ ] Password reset flow needed?
> - [ ] Separate from BMS admin auth?

---

### 4C. Portal Resources API
*Called by: PortalHome, PortalLocationManual, PortalAgreement, PortalVehicles, PortalWashStatus, PortalCertificates, PortalEmployeeDashboard, PortalInvoices*

| What the frontend calls | Description |
|---|---|
| `GET /api/portal/:portalId` | Portal entity with stage + linked resources |
| `GET /api/portal/:portalId/manual` | Location manual data |
| `PUT /api/portal/:portalId/manual` | Submit / update location manual |
| `GET /api/portal/:portalId/agreement` | Agreement details + amendments |
| `POST /api/portal/:portalId/agreement/accept` | Digital acceptance (binding) |
| `POST /api/portal/:portalId/agreement/amendments` | Request amendment to contract terms |
| `GET /api/portal/:portalId/vehicles` | List assigned vehicles |
| `POST /api/portal/:portalId/vehicles` | Assign new vehicle |
| `PATCH /api/portal/:portalId/vehicles/:id/swap` | Swap vehicle (creates replacement) |
| `GET /api/portal/:portalId/wash-records` | Wash records (frontend filters by: `date`, `status`) |
| `POST /api/portal/:portalId/wash-records` | Employee submits wash report |
| `GET /api/portal/:portalId/certificates` | Certificates (frontend filters by: `date`, `vehicleId`) |
| `GET /api/portal/:portalId/certificates/:id/pdf` | Download certificate PDF |
| `GET /api/portal/:portalId/invoices` | Invoices (frontend filters by: `status`, `period`) |

> **Akshat's notes:**
> - [ ] Preferred nesting pattern? (`/portal/:portalId/vehicles` vs `/vehicles?portalId=X`)
> - [ ] Should portal routes be auth-gated per stage on the backend?
> - [ ] Bulk wash record submission (all vehicles in one day) or one-at-a-time?

---

### 4D. Change Requests API
*Called by: ChangeRequests (Task Manager)*

| What the frontend calls | Description |
|---|---|
| `GET /api/change-requests` | List requests. Frontend filters by: `status` |
| `POST /api/change-requests` | Submit new change request |
| `PATCH /api/change-requests/:id/approve` | Approve with review notes |
| `PATCH /api/change-requests/:id/reject` | Reject with review notes |

> **Akshat's notes:**
> - [ ] Any existing approval workflow in v1 to build on?

---

### 4E. Approval Queue API
*Called by: Home dashboard wash approvals widget*

| What the frontend calls | Description |
|---|---|
| `GET /api/approvals` | Pending wash approvals |
| `PATCH /api/approvals/:id/approve` | Approve → triggers certificate generation |
| `PATCH /api/approvals/:id/reject` | Reject with notes |

> **Akshat's notes:**
> - [ ] Should this be a separate resource or part of wash records?

---

### 4F. Dashboard API
*Called by: Home*

| What the frontend calls | Description |
|---|---|
| `GET /api/dashboard/kpis` | Aggregated counts (clients, employees, departments, active clients) |
| `GET /api/dashboard/recent-activity` | Cross-entity activity feed (latest notes + complaints) |
| `GET /api/dashboard/pending-approvals` | Count of pending approval queue items |

> **Akshat's notes:**
> - [ ] Preferred approach for aggregation endpoints? Separate or combined?

---

### 4G. Enhanced Existing APIs

| What the frontend calls | Description |
|---|---|
| `GET /api/clients/:id` | **Enhanced:** Must include `portalId`, `contacts[]`, `kvkNumber`, `vatNumber` |
| `POST /api/clients/:id/contacts` | **New:** Add contact to client |
| `PATCH /api/clients/:id/contacts/:contactId` | **New:** Update contact |
| `DELETE /api/clients/:id/contacts/:contactId` | **New:** Remove contact |
| `GET /api/clients/:id/activities` | **Enhanced:** Must include threaded `replies[]` |
| `POST /api/clients/:id/activities` | **Enhanced:** Support reply to existing activity |
| `GET /api/clients/:id/shifts` | **New:** Shifts for this client (from Shiftbase) |
| `GET /api/employees/:id/shifts` | **New:** Shifts for this employee (from Shiftbase) |

> **Akshat's notes:**
> - [ ] Which of these v1 endpoints already exist and what's their current shape?
> - [ ] Contacts — nested in client response, or separate call?

---

## 5. External Integrations

### Shiftbase (Shift Scheduling)
- **Direction:** Read-only from BMS
- **Used by:** Client Profile → Shifts tab, Employee View → Shifts tab
- **What the frontend needs:** Shifts filterable by clientId and employeeId, with Shiftbase deep link URL
- **The prototype has** 40+ shift records with `shiftbaseUrl` fields pointing to `app.shiftbase.com`

> **Akshat to confirm:**
> - [ ] Current v1 Shiftbase integration status?
> - [ ] Preferred approach — live proxy or nightly cache?
> - [ ] Estimated complexity?

### Moneybird (Invoicing & Quotes)
- **Direction:** Bidirectional
- **Write:** Quote reference stored on agreements (`moneybirdQuoteRef`)
- **Read:** Invoice data displayed in portal (invoiceNumber, amounts, payment status)
- **Also:** Client profile stores `moneybirdCN` (customer number)

> **Akshat to confirm:**
> - [ ] Current v1 Moneybird integration scope?
> - [ ] Do we need read access (for portal invoices), write access (for quotes), or both?
> - [ ] Preferred approach — sync invoices to local DB, or proxy Moneybird API?
> - [ ] Estimated complexity?

### n8n (Workflow Automation)
- **Direction:** n8n → BMS (webhook)
- **Used by:** Lead creation from Form 1 on BTC website
- **Flow:** Website form → n8n → `POST /api/leads` → lead created with status `CAPTURED`

> **Akshat to confirm:**
> - [ ] Who builds/maintains the n8n flow — Akshat or Oisin?
> - [ ] Webhook authentication approach?
> - [ ] Estimated complexity?

---

## 6. Phase Sequencing

> This section describes **why** work should happen in a particular order (dependency chain), what the frontend delivers in each phase, and what the backend needs to deliver. **Time estimates are left for Akshat to fill in.**

### Phase 1: Leads + Client Schema Migration

**Why first:** The leads pipeline is the entry point for new business. Lead-to-client conversion creates portal records, so this must exist before portal work begins.

**Frontend delivers:** LeadsOverview page, LeadProfile page, updated ClientProfile with contacts array and portal tab

**Backend needs:**
- Leads CRUD with state machine (8 statuses)
- n8n webhook receiver for Form 1
- Form 2 data storage
- Lead-to-client conversion logic (creates client + portal)
- Client schema expansion (portalId, contacts, KVK, VAT)
- Lead activities CRUD

**Dependencies / blockers:** _____

> **Akshat's estimate:** _____ weeks

---

### Phase 2: Portal Core — Auth, Manuals, Agreements

**Why second:** Converted leads need a portal to continue onboarding. Location manual → agreement → vehicle assignment is the critical path.

**Frontend delivers:** PortalLogin, PortalHome (stage-gated), PortalLocationManual, PortalAgreement

**Backend needs:**
- Portal auth system (separate from BMS admin)
- Portal entity with stage-gate logic
- Location manual CRUD + submit/approve workflow
- Agreement display + digital acceptance + amendment requests
- Stage transition triggers (manual approved → CONTRACT_REVIEW, agreement accepted → VEHICLE_ASSIGNMENT)

**Dependencies / blockers:** _____

> **Akshat's estimate:** _____ weeks

---

### Phase 3: Operational Portal — Vehicles, Washes, Certs, Invoices

**Why third:** This is the daily operational layer — what clients and BTC employees use once onboarding is complete.

**Frontend delivers:** PortalVehicles, PortalWashStatus, PortalEmployeeDashboard, PortalCertificates, PortalInvoices

**Backend needs:**
- Vehicle CRUD + swap chain logic
- Wash records — employee submission + exception handling
- Approval queue — management review of daily wash reports
- Certificate generation on approval (including PDF)
- Invoice API (from Moneybird or local)

**Dependencies / blockers:** _____

> **Akshat's estimate:** _____ weeks

---

### Phase 4: Change Requests + Dashboard + Integrations

**Why last:** Admin/management features — not client-blocking. Can ship earlier phases to production while this is in progress.

**Frontend delivers:** ChangeRequests (Task Manager) page, Home dashboard with KPIs + activity feed + approval widget, Shifts tabs on client/employee profiles

**Backend needs:**
- Change requests CRUD + approve/reject workflow
- Dashboard aggregation endpoints (KPIs, recent activity, pending count)
- Shiftbase API proxy for client/employee shifts

**Dependencies / blockers:** _____

> **Akshat's estimate:** _____ weeks

---

### Phase 5: Integration Testing + Hardening

**Why:** Inevitable integration issues between frontend ↔ backend ↔ external APIs (Moneybird, Shiftbase, n8n).

**Frontend delivers:** Bug fixes, API integration adjustments, error handling

**Backend needs:** End-to-end testing, edge cases, performance, production deployment

**Dependencies / blockers:** _____

> **Akshat's estimate:** _____ weeks

---

### Total Estimate

| Phase | Akshat's Estimate |
|---|---|
| 1. Leads + Client Migration | _____ weeks |
| 2. Portal Core | _____ weeks |
| 3. Operational Portal | _____ weeks |
| 4. Change Requests + Dashboard | _____ weeks |
| 5. Integration + Deploy | _____ weeks |
| **Total** | **_____ weeks** |

---

## 7. QA Approach (Proposal)

We're exploring using an AI-assisted QA agent for automated testing against the API. This is a **proposal for discussion** — not a scope assignment.

**What the AI QA agent could cover:**
- Automated smoke tests for every API endpoint after deployment
- Playwright end-to-end tests (frontend integration against real API)
- Regression suite run on every PR
- Data integrity checks (e.g., lead conversion creates correct client + portal + links)
- HACCP certificate content validation
- Status transition validation (no illegal state jumps)

**What would still need human/developer testing:**
- Backend unit tests and business logic edge cases
- Database migration verification
- External integration testing (Moneybird, Shiftbase)
- Performance and load testing

**Discussion point:** How does this fit with Akshat's existing testing approach? What split makes sense?

> **Akshat's preference:** _____

---

## 8. Open Questions for Meeting

1. **Shiftbase integration:** Proxy live or cache nightly? The prototype has 40+ shift records with direct Shiftbase URLs.

2. **Moneybird integration:** What does the current v1 integration cover? BMS2 needs read access for portal invoices + write access for quote refs on agreements.

3. **n8n ownership:** Who builds and maintains the n8n webhook flow?

4. **Portal authentication:** Completely separate from BMS admin auth? JWT or session-based? Password reset flow?

5. **PDF certificate generation:** Server-side (Puppeteer/wkhtmltopdf) or client-side (jsPDF)?

6. **Database:** What's the current v1 database engine? What ORM? This affects migration strategy.

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

Every frontend route and the API calls it makes:

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
