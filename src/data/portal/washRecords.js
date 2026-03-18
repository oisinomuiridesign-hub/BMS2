// Wash record entities — one per vehicle-wash-session
// Linked to vehicles.js via vehicleId, and portals.js via portalId
// Dates:
//   Today:       2026-03-10  (mix of COMPLETED / SCHEDULED / EXCEPTION)
//   Last week:   2026-03-03  (all CONFIRMED)
//   Two weeks ago: 2026-02-24 (all CONFIRMED + certificateId)

export const washRecords = [

  // ─── TODAY: 2026-03-10 — portal-client-002 (Van den Berg) ───────────────────
  {
    id: 'wash-001',
    vehicleId: 'vehicle-009',
    portalId: 'portal-client-002',
    employeeId: 6,                 // Anke Willems — Rotterdam
    scheduledDate: '2026-03-10',
    completedAt: '2026-03-10T07:48:00Z',
    status: 'COMPLETED',
    exceptionType: null,
    notes: 'Completed without issues. Priority vehicle ready before 07:50.',
    approvedBy: null,
    approvedAt: null,
    certificateId: null,
  },
  {
    id: 'wash-002',
    vehicleId: 'vehicle-010',
    portalId: 'portal-client-002',
    employeeId: 6,
    scheduledDate: '2026-03-10',
    completedAt: '2026-03-10T08:22:00Z',
    status: 'COMPLETED',
    exceptionType: null,
    notes: 'HACCP protocol followed. Cleaning agent batch #FG-23 used. Rinse documentation attached.',
    approvedBy: null,
    approvedAt: null,
    certificateId: null,
  },
  {
    id: 'wash-003',
    vehicleId: 'vehicle-011',
    portalId: 'portal-client-002',
    employeeId: 6,
    scheduledDate: '2026-03-10',
    completedAt: null,
    status: 'EXCEPTION',
    exceptionType: 'VEHICLE_ABSENT',
    notes: 'Vehicle not present at scheduled bay. Driver confirmed delivery delay to Rotterdam port.',
    approvedBy: null,
    approvedAt: null,
    certificateId: null,
  },
  {
    id: 'wash-004',
    vehicleId: 'vehicle-013',
    portalId: 'portal-client-002',
    employeeId: 6,
    scheduledDate: '2026-03-10',
    completedAt: null,
    status: 'SCHEDULED',
    exceptionType: null,
    notes: '',
    approvedBy: null,
    approvedAt: null,
    certificateId: null,
  },
  {
    id: 'wash-005',
    vehicleId: 'vehicle-014',
    portalId: 'portal-client-002',
    employeeId: 6,
    scheduledDate: '2026-03-10',
    completedAt: null,
    status: 'SCHEDULED',
    exceptionType: null,
    notes: '',
    approvedBy: null,
    approvedAt: null,
    certificateId: null,
  },

  // ─── TODAY: 2026-03-10 — portal-client-001 (Koelman) ────────────────────────
  {
    id: 'wash-006',
    vehicleId: 'vehicle-001',
    portalId: 'portal-client-001',
    employeeId: 5,                 // Joost Hermans — Venlo
    scheduledDate: '2026-03-10',
    completedAt: '2026-03-10T08:05:00Z',
    status: 'COMPLETED',
    exceptionType: null,
    notes: 'Full service completed. Side skirts high-pressure rinsed.',
    approvedBy: null,
    approvedAt: null,
    certificateId: null,
  },
  {
    id: 'wash-007',
    vehicleId: 'vehicle-002',
    portalId: 'portal-client-001',
    employeeId: 5,
    scheduledDate: '2026-03-10',
    completedAt: '2026-03-10T09:10:00Z',
    status: 'COMPLETED',
    exceptionType: null,
    notes: 'HACCP food-grade wash done. Batch #FG-19 used per client requirement.',
    approvedBy: null,
    approvedAt: null,
    certificateId: null,
  },
  {
    id: 'wash-008',
    vehicleId: 'vehicle-003',
    portalId: 'portal-client-001',
    employeeId: 5,
    scheduledDate: '2026-03-10',
    completedAt: null,
    status: 'EXCEPTION',
    exceptionType: 'ACCESS_ISSUE',
    notes: 'Gate to bay 3 was locked. Contacted site manager — no response. Vehicle rescheduled for tomorrow.',
    approvedBy: null,
    approvedAt: null,
    certificateId: null,
  },
  {
    id: 'wash-009',
    vehicleId: 'vehicle-004',
    portalId: 'portal-client-001',
    employeeId: 5,
    scheduledDate: '2026-03-10',
    completedAt: null,
    status: 'SCHEDULED',
    exceptionType: null,
    notes: '',
    approvedBy: null,
    approvedAt: null,
    certificateId: null,
  },
  {
    id: 'wash-010',
    vehicleId: 'vehicle-005',
    portalId: 'portal-client-001',
    employeeId: 5,
    scheduledDate: '2026-03-10',
    completedAt: null,
    status: 'SCHEDULED',
    exceptionType: null,
    notes: '',
    approvedBy: null,
    approvedAt: null,
    certificateId: null,
  },

  // ─── LAST WEEK: 2026-03-03 — portal-client-002 (Van den Berg) — all CONFIRMED
  {
    id: 'wash-011',
    vehicleId: 'vehicle-009',
    portalId: 'portal-client-002',
    employeeId: 6,
    scheduledDate: '2026-03-03',
    completedAt: '2026-03-03T07:52:00Z',
    status: 'CONFIRMED',
    exceptionType: null,
    notes: '',
    approvedBy: 1,                 // Martijn de Vries
    approvedAt: '2026-03-03T16:00:00Z',
    certificateId: null,
  },
  {
    id: 'wash-012',
    vehicleId: 'vehicle-010',
    portalId: 'portal-client-002',
    employeeId: 6,
    scheduledDate: '2026-03-03',
    completedAt: '2026-03-03T08:35:00Z',
    status: 'CONFIRMED',
    exceptionType: null,
    notes: '',
    approvedBy: 1,
    approvedAt: '2026-03-03T16:00:00Z',
    certificateId: null,
  },
  {
    id: 'wash-013',
    vehicleId: 'vehicle-011',
    portalId: 'portal-client-002',
    employeeId: 6,
    scheduledDate: '2026-03-03',
    completedAt: '2026-03-03T09:10:00Z',
    status: 'CONFIRMED',
    exceptionType: null,
    notes: '',
    approvedBy: 1,
    approvedAt: '2026-03-03T16:00:00Z',
    certificateId: null,
  },
  {
    id: 'wash-014',
    vehicleId: 'vehicle-013',
    portalId: 'portal-client-002',
    employeeId: 6,
    scheduledDate: '2026-03-03',
    completedAt: '2026-03-03T09:55:00Z',
    status: 'CONFIRMED',
    exceptionType: null,
    notes: '',
    approvedBy: 1,
    approvedAt: '2026-03-03T16:00:00Z',
    certificateId: null,
  },
  {
    id: 'wash-015',
    vehicleId: 'vehicle-014',
    portalId: 'portal-client-002',
    employeeId: 6,
    scheduledDate: '2026-03-03',
    completedAt: '2026-03-03T10:20:00Z',
    status: 'CONFIRMED',
    exceptionType: null,
    notes: '',
    approvedBy: 1,
    approvedAt: '2026-03-03T16:00:00Z',
    certificateId: null,
  },

  // ─── LAST WEEK: 2026-03-03 — portal-client-001 (Koelman) — all CONFIRMED ────
  {
    id: 'wash-016',
    vehicleId: 'vehicle-001',
    portalId: 'portal-client-001',
    employeeId: 5,
    scheduledDate: '2026-03-03',
    completedAt: '2026-03-03T08:00:00Z',
    status: 'CONFIRMED',
    exceptionType: null,
    notes: '',
    approvedBy: 1,
    approvedAt: '2026-03-03T17:00:00Z',
    certificateId: null,
  },
  {
    id: 'wash-017',
    vehicleId: 'vehicle-002',
    portalId: 'portal-client-001',
    employeeId: 5,
    scheduledDate: '2026-03-03',
    completedAt: '2026-03-03T09:00:00Z',
    status: 'CONFIRMED',
    exceptionType: null,
    notes: '',
    approvedBy: 1,
    approvedAt: '2026-03-03T17:00:00Z',
    certificateId: null,
  },

  // ─── TWO WEEKS AGO: 2026-02-24 — portal-client-002 — CONFIRMED + certificates
  {
    id: 'wash-018',
    vehicleId: 'vehicle-009',
    portalId: 'portal-client-002',
    employeeId: 6,
    scheduledDate: '2026-02-24',
    completedAt: '2026-02-24T07:55:00Z',
    status: 'CONFIRMED',
    exceptionType: null,
    notes: '',
    approvedBy: 1,
    approvedAt: '2026-02-24T16:30:00Z',
    certificateId: 'cert-001',
  },
  {
    id: 'wash-019',
    vehicleId: 'vehicle-010',
    portalId: 'portal-client-002',
    employeeId: 6,
    scheduledDate: '2026-02-24',
    completedAt: '2026-02-24T08:40:00Z',
    status: 'CONFIRMED',
    exceptionType: null,
    notes: '',
    approvedBy: 1,
    approvedAt: '2026-02-24T16:30:00Z',
    certificateId: 'cert-001',
  },
  {
    id: 'wash-020',
    vehicleId: 'vehicle-011',
    portalId: 'portal-client-002',
    employeeId: 6,
    scheduledDate: '2026-02-24',
    completedAt: '2026-02-24T09:15:00Z',
    status: 'CONFIRMED',
    exceptionType: null,
    notes: '',
    approvedBy: 1,
    approvedAt: '2026-02-24T16:30:00Z',
    certificateId: 'cert-001',
  },
  {
    id: 'wash-021',
    vehicleId: 'vehicle-013',
    portalId: 'portal-client-002',
    employeeId: 6,
    scheduledDate: '2026-02-24',
    completedAt: '2026-02-24T10:05:00Z',
    status: 'CONFIRMED',
    exceptionType: null,
    notes: '',
    approvedBy: 1,
    approvedAt: '2026-02-24T16:30:00Z',
    certificateId: 'cert-001',
  },
  {
    id: 'wash-022',
    vehicleId: 'vehicle-014',
    portalId: 'portal-client-002',
    employeeId: 6,
    scheduledDate: '2026-02-24',
    completedAt: '2026-02-24T10:40:00Z',
    status: 'CONFIRMED',
    exceptionType: null,
    notes: '',
    approvedBy: 1,
    approvedAt: '2026-02-24T16:30:00Z',
    certificateId: 'cert-001',
  },

  // ─── TWO WEEKS AGO: 2026-02-24 — portal-client-001 — CONFIRMED + certificates
  {
    id: 'wash-023',
    vehicleId: 'vehicle-001',
    portalId: 'portal-client-001',
    employeeId: 5,
    scheduledDate: '2026-02-24',
    completedAt: '2026-02-24T08:10:00Z',
    status: 'CONFIRMED',
    exceptionType: null,
    notes: '',
    approvedBy: 1,
    approvedAt: '2026-02-24T17:00:00Z',
    certificateId: 'cert-002',
  },
  {
    id: 'wash-024',
    vehicleId: 'vehicle-002',
    portalId: 'portal-client-001',
    employeeId: 5,
    scheduledDate: '2026-02-24',
    completedAt: '2026-02-24T09:20:00Z',
    status: 'CONFIRMED',
    exceptionType: null,
    notes: '',
    approvedBy: 1,
    approvedAt: '2026-02-24T17:00:00Z',
    certificateId: 'cert-002',
  },
  {
    id: 'wash-025',
    vehicleId: 'vehicle-003',
    portalId: 'portal-client-001',
    employeeId: 5,
    scheduledDate: '2026-02-24',
    completedAt: '2026-02-24T10:00:00Z',
    status: 'CONFIRMED',
    exceptionType: null,
    notes: '',
    approvedBy: 1,
    approvedAt: '2026-02-24T17:00:00Z',
    certificateId: 'cert-002',
  },
  // ─── 2026-03-10 — portal-client-003 (De Rijn Logistics) ─────────────────────
  {
    id: 'wash-026', vehicleId: 'vehicle-015', portalId: 'portal-client-003', employeeId: 6,
    scheduledDate: '2026-03-10', completedAt: '2026-03-10T07:55:00Z', status: 'COMPLETED',
    exceptionType: null, notes: 'Standard wash completed.', approvedBy: null, approvedAt: null, certificateId: null,
  },
  {
    id: 'wash-027', vehicleId: 'vehicle-016', portalId: 'portal-client-003', employeeId: 6,
    scheduledDate: '2026-03-10', completedAt: '2026-03-10T08:40:00Z', status: 'COMPLETED',
    exceptionType: null, notes: 'HACCP protocol followed.', approvedBy: null, approvedAt: null, certificateId: null,
  },
  {
    id: 'wash-028', vehicleId: 'vehicle-017', portalId: 'portal-client-003', employeeId: 6,
    scheduledDate: '2026-03-10', completedAt: null, status: 'SCHEDULED',
    exceptionType: null, notes: '', approvedBy: null, approvedAt: null, certificateId: null,
  },

  // ─── 2026-03-03 — portal-client-003 (De Rijn) — CONFIRMED ────────────────
  {
    id: 'wash-029', vehicleId: 'vehicle-015', portalId: 'portal-client-003', employeeId: 6,
    scheduledDate: '2026-03-03', completedAt: '2026-03-03T08:00:00Z', status: 'CONFIRMED',
    exceptionType: null, notes: '', approvedBy: 1, approvedAt: '2026-03-03T16:00:00Z', certificateId: 'cert-004',
  },
  {
    id: 'wash-030', vehicleId: 'vehicle-016', portalId: 'portal-client-003', employeeId: 6,
    scheduledDate: '2026-03-03', completedAt: '2026-03-03T08:45:00Z', status: 'CONFIRMED',
    exceptionType: null, notes: '', approvedBy: 1, approvedAt: '2026-03-03T16:00:00Z', certificateId: 'cert-004',
  },

  // ─── 2026-03-10 — portal-client-004 (Hofstra Cargo) ──────────────────────
  {
    id: 'wash-031', vehicleId: 'vehicle-020', portalId: 'portal-client-004', employeeId: 6,
    scheduledDate: '2026-03-10', completedAt: '2026-03-10T09:30:00Z', status: 'COMPLETED',
    exceptionType: null, notes: 'Completed on schedule.', approvedBy: null, approvedAt: null, certificateId: null,
  },
  {
    id: 'wash-032', vehicleId: 'vehicle-021', portalId: 'portal-client-004', employeeId: 6,
    scheduledDate: '2026-03-10', completedAt: null, status: 'SCHEDULED',
    exceptionType: null, notes: '', approvedBy: null, approvedAt: null, certificateId: null,
  },

  // ─── 2026-03-10 — portal-client-005 (Maas & Waal) ────────────────────────
  {
    id: 'wash-033', vehicleId: 'vehicle-024', portalId: 'portal-client-005', employeeId: 7,
    scheduledDate: '2026-03-10', completedAt: '2026-03-10T08:15:00Z', status: 'COMPLETED',
    exceptionType: null, notes: 'Standard wash completed.', approvedBy: null, approvedAt: null, certificateId: null,
  },
  {
    id: 'wash-034', vehicleId: 'vehicle-025', portalId: 'portal-client-005', employeeId: 7,
    scheduledDate: '2026-03-10', completedAt: '2026-03-10T09:00:00Z', status: 'COMPLETED',
    exceptionType: null, notes: 'Interior sanitised. Reefer off during wash.', approvedBy: null, approvedAt: null, certificateId: null,
  },
  {
    id: 'wash-035', vehicleId: 'vehicle-026', portalId: 'portal-client-005', employeeId: 7,
    scheduledDate: '2026-03-10', completedAt: null, status: 'SCHEDULED',
    exceptionType: null, notes: '', approvedBy: null, approvedAt: null, certificateId: null,
  },

  // ─── 2026-03-10 — portal-client-006 (Vreugdenhil) ────────────────────────
  {
    id: 'wash-036', vehicleId: 'vehicle-029', portalId: 'portal-client-006', employeeId: 6,
    scheduledDate: '2026-03-10', completedAt: '2026-03-10T07:30:00Z', status: 'COMPLETED',
    exceptionType: null, notes: 'HACCP food-grade wash completed. Dairy transport.',
    approvedBy: null, approvedAt: null, certificateId: null,
  },
  {
    id: 'wash-037', vehicleId: 'vehicle-030', portalId: 'portal-client-006', employeeId: 6,
    scheduledDate: '2026-03-10', completedAt: '2026-03-10T08:20:00Z', status: 'COMPLETED',
    exceptionType: null, notes: 'Milk tanker — full HACCP protocol.', approvedBy: null, approvedAt: null, certificateId: null,
  },
  {
    id: 'wash-038', vehicleId: 'vehicle-031', portalId: 'portal-client-006', employeeId: 6,
    scheduledDate: '2026-03-10', completedAt: null, status: 'SCHEDULED',
    exceptionType: null, notes: '', approvedBy: null, approvedAt: null, certificateId: null,
  },

  // ─── 2026-03-10 — portal-client-007 (Dijkstra Transport) ─────────────────
  {
    id: 'wash-039', vehicleId: 'vehicle-035', portalId: 'portal-client-007', employeeId: 7,
    scheduledDate: '2026-03-10', completedAt: '2026-03-10T07:40:00Z', status: 'COMPLETED',
    exceptionType: null, notes: 'Standard wash.', approvedBy: null, approvedAt: null, certificateId: null,
  },
  {
    id: 'wash-040', vehicleId: 'vehicle-036', portalId: 'portal-client-007', employeeId: 7,
    scheduledDate: '2026-03-10', completedAt: '2026-03-10T08:30:00Z', status: 'COMPLETED',
    exceptionType: null, notes: 'HACCP beverage transport wash completed.', approvedBy: null, approvedAt: null, certificateId: null,
  },
  {
    id: 'wash-041', vehicleId: 'vehicle-037', portalId: 'portal-client-007', employeeId: 7,
    scheduledDate: '2026-03-10', completedAt: null, status: 'EXCEPTION',
    exceptionType: 'VEHICLE_ABSENT', notes: 'Vehicle not at scheduled bay. Driver confirmed late arrival.',
    approvedBy: null, approvedAt: null, certificateId: null,
  },
  {
    id: 'wash-042', vehicleId: 'vehicle-038', portalId: 'portal-client-007', employeeId: 7,
    scheduledDate: '2026-03-10', completedAt: null, status: 'SCHEDULED',
    exceptionType: null, notes: '', approvedBy: null, approvedAt: null, certificateId: null,
  },

  // ─── 2026-03-10 — portal-client-008 (Noord-Brabant Cargo) ────────────────
  {
    id: 'wash-043', vehicleId: 'vehicle-041', portalId: 'portal-client-008', employeeId: 7,
    scheduledDate: '2026-03-10', completedAt: '2026-03-10T09:10:00Z', status: 'COMPLETED',
    exceptionType: null, notes: 'Standard wash completed.', approvedBy: null, approvedAt: null, certificateId: null,
  },
  {
    id: 'wash-044', vehicleId: 'vehicle-042', portalId: 'portal-client-008', employeeId: 7,
    scheduledDate: '2026-03-10', completedAt: null, status: 'SCHEDULED',
    exceptionType: null, notes: '', approvedBy: null, approvedAt: null, certificateId: null,
  },

  // ─── 2026-03-10 — portal-client-009 (Rijnmond Bulk) ──────────────────────
  {
    id: 'wash-045', vehicleId: 'vehicle-045', portalId: 'portal-client-009', employeeId: 6,
    scheduledDate: '2026-03-10', completedAt: '2026-03-10T07:35:00Z', status: 'COMPLETED',
    exceptionType: null, notes: 'Food-grade bulk wash.', approvedBy: null, approvedAt: null, certificateId: null,
  },
  {
    id: 'wash-046', vehicleId: 'vehicle-046', portalId: 'portal-client-009', employeeId: 6,
    scheduledDate: '2026-03-10', completedAt: '2026-03-10T08:25:00Z', status: 'COMPLETED',
    exceptionType: null, notes: 'Chemical wash completed.', approvedBy: null, approvedAt: null, certificateId: null,
  },
  {
    id: 'wash-047', vehicleId: 'vehicle-047', portalId: 'portal-client-009', employeeId: 6,
    scheduledDate: '2026-03-10', completedAt: null, status: 'SCHEDULED',
    exceptionType: null, notes: '', approvedBy: null, approvedAt: null, certificateId: null,
  },

  // ─── 2026-03-10 — portal-client-010 (Schuttersveld) ──────────────────────
  {
    id: 'wash-048', vehicleId: 'vehicle-051', portalId: 'portal-client-010', employeeId: 7,
    scheduledDate: '2026-03-10', completedAt: '2026-03-10T08:00:00Z', status: 'COMPLETED',
    exceptionType: null, notes: 'Tank interior cleaned. Residue sampling done.', approvedBy: null, approvedAt: null, certificateId: null,
  },
  {
    id: 'wash-049', vehicleId: 'vehicle-052', portalId: 'portal-client-010', employeeId: 7,
    scheduledDate: '2026-03-10', completedAt: '2026-03-10T09:00:00Z', status: 'COMPLETED',
    exceptionType: null, notes: 'HACCP protocol followed. Sampling completed.', approvedBy: null, approvedAt: null, certificateId: null,
  },
  {
    id: 'wash-050', vehicleId: 'vehicle-053', portalId: 'portal-client-010', employeeId: 7,
    scheduledDate: '2026-03-10', completedAt: null, status: 'SCHEDULED',
    exceptionType: null, notes: '', approvedBy: null, approvedAt: null, certificateId: null,
  },

  // ─── 2026-03-03 — portal-client-011 (Tilburg Express) — CONFIRMED ────────
  {
    id: 'wash-051', vehicleId: 'vehicle-056', portalId: 'portal-client-011', employeeId: 7,
    scheduledDate: '2026-03-03', completedAt: '2026-03-03T09:30:00Z', status: 'CONFIRMED',
    exceptionType: null, notes: '', approvedBy: 1, approvedAt: '2026-03-03T17:00:00Z', certificateId: 'cert-006',
  },
  {
    id: 'wash-052', vehicleId: 'vehicle-057', portalId: 'portal-client-011', employeeId: 7,
    scheduledDate: '2026-03-03', completedAt: '2026-03-03T10:15:00Z', status: 'CONFIRMED',
    exceptionType: null, notes: '', approvedBy: 1, approvedAt: '2026-03-03T17:00:00Z', certificateId: 'cert-006',
  },

  // ─── 2026-03-10 — portal-client-012 (Borger & Meester) ───────────────────
  {
    id: 'wash-053', vehicleId: 'vehicle-059', portalId: 'portal-client-012', employeeId: 6,
    scheduledDate: '2026-03-10', completedAt: '2026-03-10T07:50:00Z', status: 'COMPLETED',
    exceptionType: null, notes: 'Food-grade tanker wash.', approvedBy: null, approvedAt: null, certificateId: null,
  },
  {
    id: 'wash-054', vehicleId: 'vehicle-060', portalId: 'portal-client-012', employeeId: 6,
    scheduledDate: '2026-03-10', completedAt: '2026-03-10T08:45:00Z', status: 'COMPLETED',
    exceptionType: null, notes: 'ADR tanker degassed and washed.', approvedBy: null, approvedAt: null, certificateId: null,
  },
  {
    id: 'wash-055', vehicleId: 'vehicle-061', portalId: 'portal-client-012', employeeId: 6,
    scheduledDate: '2026-03-10', completedAt: null, status: 'SCHEDULED',
    exceptionType: null, notes: '', approvedBy: null, approvedAt: null, certificateId: null,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getWashRecordsByPortalId(portalId) {
  return washRecords.filter((r) => r.portalId === portalId);
}

export function getWashRecordsByPortalAndDate(portalId, date) {
  return washRecords.filter((r) => r.portalId === portalId && r.scheduledDate === date);
}

export function getWashRecordsByVehicleId(vehicleId) {
  return washRecords.filter((r) => r.vehicleId === vehicleId);
}

export function findWashRecordById(id) {
  return washRecords.find((r) => r.id === id) || null;
}
