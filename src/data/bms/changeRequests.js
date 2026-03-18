// Planner-submitted change requests awaiting owner approval.
// Each request targets a client profile field that has a direct billing impact
// and must be approved before the change is pushed to Moneybird.

export const changeRequests = [

  // ─── cr-001: Van den Berg Transport — Invoice Email ───────────────────────────
  {
    id: 'cr-001',
    requestedBy: 'Sophie Janssen',
    requestedAt: '2026-03-14T09:12:00Z',
    status: 'PENDING',
    clientId: 1,
    clientName: 'Van den Berg Transport B.V.',
    locationPath: '/clients/1',
    locationLabel: 'Clients → Van den Berg Transport B.V.',
    field: 'Invoice Email',
    currentValue: 'facturen@vandenbergtransport.nl',
    requestedValue: 'boekhouding@vandenbergtransport.nl',
    description: 'Client switched to an external accountant. All invoices must go to the new bookkeeping address from April onwards.',
    reviewedBy: null,
    reviewedAt: null,
    reviewNotes: null,
  },

  // ─── cr-002: De Rijn Logistics — Wash Frequency ───────────────────────────────
  {
    id: 'cr-002',
    requestedBy: 'Mark de Vries',
    requestedAt: '2026-03-13T14:30:00Z',
    status: 'PENDING',
    clientId: 2,
    clientName: 'De Rijn Logistics B.V.',
    locationPath: '/clients/2',
    locationLabel: 'Clients → De Rijn Logistics B.V.',
    field: 'Wash Frequency',
    currentValue: '2× per week',
    requestedValue: '3× per week',
    description: 'Fleet expansion (+6 vehicles). Client requested increased wash cadence to cover the added units. Billing volume will increase accordingly.',
    reviewedBy: null,
    reviewedAt: null,
    reviewNotes: null,
  },

  // ─── cr-003: Koelman Trucking — Price per Wash ────────────────────────────────
  {
    id: 'cr-003',
    requestedBy: 'Sophie Janssen',
    requestedAt: '2026-03-12T11:05:00Z',
    status: 'PENDING',
    clientId: 3,
    clientName: 'Koelman Trucking B.V.',
    locationPath: '/clients/3',
    locationLabel: 'Clients → Koelman Trucking B.V.',
    field: 'Price per Wash',
    currentValue: '€ 185,–',
    requestedValue: '€ 210,–',
    description: 'Annual rate review. New rate agreed verbally with Hendrik Koelman on 10 March. Written confirmation received via email.',
    reviewedBy: null,
    reviewedAt: null,
    reviewNotes: null,
  },

  // ─── cr-004: Hofstra Cargo — Number of Contracted Vehicles ───────────────────
  {
    id: 'cr-004',
    requestedBy: 'Mark de Vries',
    requestedAt: '2026-03-11T08:44:00Z',
    status: 'PENDING',
    clientId: 4,
    clientName: 'Hofstra Cargo',
    locationPath: '/clients/4',
    locationLabel: 'Clients → Hofstra Cargo',
    field: 'Contracted Vehicles',
    currentValue: '14 vehicles',
    requestedValue: '11 vehicles',
    description: 'Client sold 3 trucks following route restructuring. Monthly invoice must reflect the reduced fleet size from the next billing cycle.',
    reviewedBy: null,
    reviewedAt: null,
    reviewNotes: null,
  },

  // ─── cr-005: Maas & Waal Vervoer — Payment Terms ──────────────────────────────
  {
    id: 'cr-005',
    requestedBy: 'Sophie Janssen',
    requestedAt: '2026-03-10T16:20:00Z',
    status: 'PENDING',
    clientId: 5,
    clientName: 'Maas & Waal Vervoer',
    locationPath: '/clients/5',
    locationLabel: 'Clients → Maas & Waal Vervoer',
    field: 'Payment Terms',
    currentValue: '30 days',
    requestedValue: '14 days',
    description: 'Two consecutive late payments in Q1. Agreed with client to move to 14-day terms. Moneybird due-date setting must be updated.',
    reviewedBy: null,
    reviewedAt: null,
    reviewNotes: null,
  },

  // ─── cr-006: Dijkstra Transport — Invoice Reminder Contact ───────────────────
  {
    id: 'cr-006',
    requestedBy: 'Mark de Vries',
    requestedAt: '2026-03-09T10:15:00Z',
    status: 'PENDING',
    clientId: 7,
    clientName: 'Dijkstra Transport B.V.',
    locationPath: '/clients/7',
    locationLabel: 'Clients → Dijkstra Transport B.V.',
    field: 'Invoice Reminder Contact',
    currentValue: 'Ingrid Dijkstra — facturen@dijkstratransport.nl',
    requestedValue: 'Patrick van Vliet — fleet@dijkstratransport.nl',
    description: 'Ingrid Dijkstra is leaving the company end of March. Patrick takes over financial follow-up. Reminder emails must be rerouted before her last day.',
    reviewedBy: null,
    reviewedAt: null,
    reviewNotes: null,
  },

  // ─── cr-007: Rijnmond Bulk Services — VAT Number ─────────────────────────────
  {
    id: 'cr-007',
    requestedBy: 'Sophie Janssen',
    requestedAt: '2026-03-07T13:55:00Z',
    status: 'APPROVED',
    clientId: 9,
    clientName: 'Rijnmond Bulk Services',
    locationPath: '/clients/9',
    locationLabel: 'Clients → Rijnmond Bulk Services',
    field: 'VAT Number',
    currentValue: 'NL822456971B01',
    requestedValue: 'NL822456971B02',
    description: 'Legal entity restructured in February. Tax authority issued a new BTW suffix. All invoices from March 2026 must carry the updated VAT number.',
    reviewedBy: 'Martijn de Vries',
    reviewedAt: '2026-03-08T09:00:00Z',
    reviewNotes: null,
  },

];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getPendingChangeRequests() {
  return changeRequests.filter((r) => r.status === 'PENDING');
}

export function findChangeRequestById(id) {
  return changeRequests.find((r) => r.id === id) || null;
}
