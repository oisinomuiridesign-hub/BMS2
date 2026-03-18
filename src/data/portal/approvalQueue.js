// Management approval queue — wash reports awaiting BTC management sign-off
// In production these are auto-generated when an employee submits a day report.
// For the prototype, 3 pending items are seeded: 2 from today's sessions.

export const approvalQueue = [

  // ─── approval-001: Van den Berg Transport — today 2026-03-10 ────────────────
  {
    id: 'approval-001',
    portalId: 'portal-client-002',
    clientName: 'Van den Berg Transport B.V.',
    location: 'Waalhaven Oostzijde 55, Rotterdam',
    date: '2026-03-10',
    employeeId: 6,
    employeeName: 'Anke Willems',
    vehiclesCompleted: 2,
    vehiclesTotal: 5,
    vehiclesException: 1,
    exceptionSummary: 'Vehicle 33-DX-TZ absent at time of scheduled wash — driver reported port delivery delay.',
    washRecordIds: ['wash-001', 'wash-002', 'wash-003', 'wash-004', 'wash-005'],
    status: 'PENDING',   // PENDING|APPROVED|REJECTED
    reviewedBy: null,
    reviewedAt: null,
    reviewNotes: null,
    generatedCertId: null,
  },

  // ─── approval-002: Koelman Trucking B.V. — today 2026-03-10 ─────────────────
  {
    id: 'approval-002',
    portalId: 'portal-client-001',
    clientName: 'Koelman Trucking B.V.',
    location: 'Industrieweg 12, 5928 BM Venlo',
    date: '2026-03-10',
    employeeId: 5,
    employeeName: 'Joost Hermans',
    vehiclesCompleted: 2,
    vehiclesTotal: 5,
    vehiclesException: 1,
    exceptionSummary: 'Vehicle ZX-445-LN inaccessible — bay 3 gate locked, site manager unreachable. Rescheduled.',
    washRecordIds: ['wash-006', 'wash-007', 'wash-008', 'wash-009', 'wash-010'],
    status: 'PENDING',
    reviewedBy: null,
    reviewedAt: null,
    reviewNotes: null,
    generatedCertId: null,
  },

  // ─── approval-003: Koelman Trucking — last week 2026-03-03 ──────────────────
  // Intentionally not yet approved to demo a backlog item
  {
    id: 'approval-003',
    portalId: 'portal-client-001',
    clientName: 'Koelman Trucking B.V.',
    location: 'Industrieweg 12, 5928 BM Venlo',
    date: '2026-03-03',
    employeeId: 5,
    employeeName: 'Joost Hermans',
    vehiclesCompleted: 2,
    vehiclesTotal: 2,
    vehiclesException: 0,
    exceptionSummary: null,
    washRecordIds: ['wash-016', 'wash-017'],
    status: 'PENDING',
    reviewedBy: null,
    reviewedAt: null,
    reviewNotes: null,
    generatedCertId: null,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getPendingApprovals() {
  return approvalQueue.filter((a) => a.status === 'PENDING');
}

export function getApprovalsByPortalId(portalId) {
  return approvalQueue.filter((a) => a.portalId === portalId);
}

export function findApprovalById(id) {
  return approvalQueue.find((a) => a.id === id) || null;
}
