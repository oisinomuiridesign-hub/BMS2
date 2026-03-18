export const leadActivities = [
  {
    id: 'la-001',
    leadId: 'lead-001',
    type: 'system',
    title: 'Enquiry form received via website',
    content:
      'Kees Vermeer submitted the online enquiry form on 14 March. Fleet size ~35 vehicles, looking for regular exterior washing of semi-trailers and tank trucks. Lead record created automatically by n8n. Assigned to Martijn de Vries for review.',
    authorName: 'System',
    authorAvatar: 'SY',
    createdAt: '2026-03-14T09:12:00Z',
    replies: [],
  },
  {
    id: 'la-002',
    leadId: 'lead-002',
    type: 'note',
    title: 'Lead approved — service details form sent',
    content:
      'Olaf Hendriksen was referred by De Rijn Logistics. Reviewed the enquiry — 18 vehicles, mix of opleggers and koelopleggers, interested in weekly on-site service. Looks like a good fit. Approved and service details form sent automatically by n8n on 10 March.',
    authorName: 'Sandra Koopman',
    authorAvatar: 'SK',
    createdAt: '2026-03-10T14:00:00Z',
    replies: [
      {
        id: 'la-002-r1',
        content: 'Sent a quick WhatsApp to Olaf to let him know the email is on its way. He confirmed receipt.',
        authorName: 'Martijn de Vries',
        createdAt: '2026-03-10T15:30:00Z',
      },
    ],
  },
  {
    id: 'la-003',
    leadId: 'lead-003',
    type: 'system',
    title: 'Service details form submitted by lead',
    content:
      'Femke van Breugel submitted the service details form on 4 March. Full company details, 6 vehicles including 2 tank trucks requiring food-grade certification, preferred Wednesday slot at BTC facility. Review assigned to Pieter van Loon.',
    authorName: 'System',
    authorAvatar: 'SY',
    createdAt: '2026-03-04T11:30:00Z',
    replies: [],
  },
  {
    id: 'la-004',
    leadId: 'lead-003',
    type: 'note',
    title: 'Reviewing Form 2 — certification flag noted',
    content:
      'Femke flagged that BL-005 and BL-006 require food-grade certification for interior cleaning. Need to confirm with ops team that HACCP-certified staff can be assigned for every Wednesday slot before we generate the quote.',
    authorName: 'Pieter van Loon',
    authorAvatar: 'PL',
    createdAt: '2026-03-06T10:00:00Z',
    replies: [],
  },
  {
    id: 'la-005',
    leadId: 'lead-004',
    type: 'system',
    title: 'Service details form submitted by lead',
    content:
      'Sjoerd de Groot submitted the service details form on 20 February. 5 vehicles (3 tank trucks + 2 semi-trailers), HACCP-certified staff required, Monday priority slot, 5% discount requested. Review in progress.',
    authorName: 'System',
    authorAvatar: 'SY',
    createdAt: '2026-02-20T14:45:00Z',
    replies: [],
  },
  {
    id: 'la-006',
    leadId: 'lead-004',
    type: 'note',
    title: 'Under review — Monday slot availability confirmed',
    content:
      'Confirmed with ops team that Monday 05:00–07:00 slot is available at the BTC facility for De Groot. HACCP-certified staff can be assigned. 5% discount approved by Martijn. Preparing Moneybird quote now.',
    authorName: 'Sandra Koopman',
    authorAvatar: 'SK',
    createdAt: '2026-02-24T16:00:00Z',
    replies: [
      {
        id: 'la-006-r1',
        content: 'Quote draft ready — waiting on final sign-off before sending to Sjoerd.',
        authorName: 'Martijn de Vries',
        createdAt: '2026-02-25T08:45:00Z',
      },
    ],
  },
  {
    id: 'la-007',
    leadId: 'lead-005',
    type: 'note',
    title: 'Proposal sent — Moneybird quote MB-2026-0038',
    content:
      'Moneybird quote MB-2026-0038 sent to Daan Rijssen on 28 February. Covers 6 vehicles (3 koelopleggers weekly + 3 opleggers fortnightly). Total monthly value ~€1,890. Awaiting acceptance.',
    authorName: 'Martijn de Vries',
    authorAvatar: 'MV',
    createdAt: '2026-02-28T10:00:00Z',
    replies: [],
  },
  {
    id: 'la-008',
    leadId: 'lead-006',
    type: 'note',
    title: 'Agreement sent — awaiting signature from Anke Vos',
    content:
      'Draft service agreement sent to Anke Vos on 18 February. Covers 8 vehicles with dedicated Tuesday/Friday slots at Rotterdam facility. Bulk discount of 8% applied per negotiation. Vos confirmed she is reviewing with her legal team.',
    authorName: 'Sandra Koopman',
    authorAvatar: 'SK',
    createdAt: '2026-02-18T15:30:00Z',
    replies: [
      {
        id: 'la-008-r1',
        content: 'Anke replied — slight delay on their end, legal review expected done by 25 Feb. Will follow up.',
        authorName: 'Martijn de Vries',
        createdAt: '2026-02-20T09:00:00Z',
      },
    ],
  },
  {
    id: 'la-009',
    leadId: 'lead-007',
    type: 'note',
    title: 'Lead converted to client',
    content:
      'Westland Bulk Vervoer accepted the proposal on 20 January 2026. Lead has been converted to a full client record. Onboarding package sent. First cleaning scheduled for 3 February at BTC facility.',
    authorName: 'Martijn de Vries',
    authorAvatar: 'MV',
    createdAt: '2026-01-20T10:00:00Z',
    replies: [],
  },
  {
    id: 'la-010',
    leadId: 'lead-008',
    type: 'note',
    title: 'Lead lost — signed with competitor',
    content:
      'Pieter-Jan Hagenaar confirmed by email that Havenstad Tankcleaning B.V. has decided to go with CleanTruck Rotterdam. Cited 12% lower per-visit pricing. Lead marked as lost. Closed 15 Dec 2025. Flagged for potential follow-up in Q3 2026.',
    authorName: 'Sandra Koopman',
    authorAvatar: 'SK',
    createdAt: '2025-12-15T11:00:00Z',
    replies: [],
  },
];
