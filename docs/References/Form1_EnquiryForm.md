# Form 1 — Enquiry Form (Website)

**Purpose:** Low-friction entry point on the BTC website. Captures the minimum information needed to create a lead record in BMS. On submission, an n8n workflow automatically creates the lead record in BMS and the planner reviews it for approval or discard.

---

## Fields Captured

| # | Field | Type | Notes |
|---|-------|------|-------|
| 1 | **Company name** | Text | Legal company name |
| 2 | **Contact person name** | Text | Full name of the submitting contact |
| 3 | **Email address** | Email | Primary contact email |
| 4 | **Phone number** | Tel | Direct phone or mobile |
| 5 | **Rough fleet size** | Number | Approximate number of vehicles |
| 6 | **Service interest** | Textarea | What they're looking for (free text) |

---

## Flow

1. Lead submits form on BTC website
2. n8n workflow fires → creates lead record in BMS with status **`CAPTURED`**
3. Planner reviews in BMS → **Approves** or **Discards** (Human Decision #1)
4. If approved → lead status changes to **`APPROVED`** and n8n sends automated email with Form 2 link

---

## BMS Lead Record Created At This Stage

- `companyName`
- `contactPerson`
- `contactEmail`
- `contactPhone`
- `enquiryForm.fleetSize`
- `enquiryForm.serviceInterest`
- `leadSource` = `WEBSITE_FORM`
- `status` = `CAPTURED`
- `createdAt` (timestamp)
