# Form 2 — Service Details Form (Post-Approval)

**Purpose:** Qualifying step sent via automated email once the planner approves a lead. Captures everything needed to generate a draft service agreement in BMS and a Moneybird quote. On submission, an n8n workflow updates the lead record and changes status to **`DETAILS_SUBMITTED`**.

---

## Section A — Company & Contact Details
*(Used for Moneybird contact creation)*

| # | Field | Type | Notes |
|---|-------|------|-------|
| 1 | **KVK number** | Text | Dutch Chamber of Commerce registration number |
| 2 | **Street** | Text | Street name |
| 3 | **House number** | Text | Including additions (e.g. 14A) |
| 4 | **Postal code** | Text | Dutch format (e.g. 5953 NB) |
| 5 | **City** | Text | |
| 6 | **Country** | Text | Defaults to Netherlands |
| 7 | **VAT number (BTW)** | Text | e.g. NL123456789B01 |
| 8 | **Bank account number (IBAN)** | Text | For invoicing |
| 9 | **Contact person department** | Dropdown | Defaults to Fleet Manager |
| 10 | **Contact person full name** | Text | May differ from Form 1 contact |
| 11 | **Contact person telephone** | Tel | |
| 12 | **Contact person email** | Email | |

---

## Section B — Service Agreement Details

| # | Field | Type | Notes |
|---|-------|------|-------|
| 13 | **Keuzeopties rangeren** (Shunting options) | Dropdown | Does the client handle vehicle shunting, or does Basiq? Options: Client handles shunting / Basiq with C/E license (paid) / Basiq without C/E license (unpaid) |
| 14 | **Wasplaats** (Wash location) | Dropdown | Who provides the washing facility? Options: BTC facility / Client's own site (mobile service) |
| 15 | **Voertuig en frequentie** (Vehicle & frequency table) | Repeatable table | Rows: vehicle number, vehicle type, frequency in weeks, treatments, price per vehicle |
| 16 | **Winter frequency toggle** | Toggle | Enable if summer/winter schedules differ |
| 17 | **Additional agreements** | Textarea | Free text for special conditions or custom arrangements |
| 18 | **Discount** | Toggle + % | Whether a discount applies and the percentage |
| 19 | **Service type** | Radio | Mobile on-site (Basiq comes to client) vs. client comes to BTC |
| 20 | **Preferred schedule / day** | Dropdown | Preferred day(s) of the week for service |

---

## Section C — Document Metadata
*(System-generated, not visible to the lead)*

| # | Field | Type | Notes |
|---|-------|------|-------|
| 21 | **Document type** | Fixed | Always "Contract" |
| 22 | **Department** | Auto | BTC department based on client location |
| 23 | **Start date** | Date | Contract start date |
| 24 | **End date** | Date | Contract end/renewal date |
| 25 | **Contract language** | Fixed | Dutch (NL) |

---

## Vehicle & Frequency Table — Field Detail

Each row in the vehicle table captures:

| Column | Example |
|--------|---------|
| Vehicle number | TK-847-L |
| Vehicle type | Oplegger (Semi-trailer) / Tankwagen (Tank truck) / Koeloplegger (Reefer) / Bulkoplegger / Containeroplegger |
| Frequency (weeks) | 1 = weekly, 2 = fortnightly, 4 = monthly |
| Treatments | Buitenwas, Binnenspuiten, Chemisch reinigen, Stoomreiniging |
| Price per vehicle | EUR amount |

---

## Flow

1. Lead receives automated email with Form 2 link (triggered by planner approval)
2. Lead submits Form 2
3. n8n workflow fires → updates lead record in BMS with `serviceDetailsForm` data
4. Lead status changes to **`DETAILS_SUBMITTED`**
5. BTC team reviews → status changes to **`UNDER_REVIEW`**
6. BTC drafts agreement + Moneybird quote → status changes to **`PROPOSAL_SENT`**

---

## BMS Lead Record Updated At This Stage

All fields in `serviceDetailsForm`:
- `kvkNumber`, `street`, `houseNumber`, `postalCode`, `city`, `country`
- `vatNumber`, `bankNumber`
- `contactDepartment`, `contactFullName`, `contactTelephone`, `contactEmail`
- `shuntingOption`, `washLocation`
- `vehicleTable` (array of rows)
- `winterFrequency` (boolean)
- `additionalAgreements`
- `discount` (boolean + `discountPercent`)
- `serviceType`
- `preferredSchedule`
- `status` = `DETAILS_SUBMITTED`
- `form2SubmittedAt` (timestamp)
