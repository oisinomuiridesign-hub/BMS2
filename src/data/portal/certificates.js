// Certificate entities — generated after management approval of wash records
// cert-001 covers wash-018 through wash-022 (portal-client-002, 2026-02-24, 5 vehicles)
// cert-002 covers wash-023 through wash-025 (portal-client-001, 2026-02-24, 3 vehicles)
// cert-003 covers wash-011 through wash-015 (portal-client-002, 2026-03-03, 5 vehicles — CONFIRMED last week)

export const certificates = [

  // ─── cert-001: Van den Berg Transport — 2026-02-24 ────────────────────────
  {
    id: 'cert-001',
    certNumber: 'BTC-2026-001',
    portalId: 'portal-client-002',
    clientName: 'Van den Berg Transport B.V.',
    location: 'Waalhaven Oostzijde 55, Rotterdam',
    washDate: '2026-02-24',
    issuedAt: '2026-02-24T16:30:00Z',
    approvedBy: 1,
    approverName: 'Martijn de Vries',
    employeeId: 6,
    employeeName: 'Anke Willems',
    washRecordIds: ['wash-018', 'wash-019', 'wash-020', 'wash-021', 'wash-022'],
    vehicles: [
      { vehicleId: 'vehicle-009', plate: 'VB-001-TR', type: 'TRUCK',        washType: 'STANDARD',        haccpCompliant: false },
      { vehicleId: 'vehicle-010', plate: 'VB-114-HK', type: 'TANKER',       washType: 'HACCP_FOOD_GRADE', haccpCompliant: true  },
      { vehicleId: 'vehicle-011', plate: '33-DX-TZ',  type: 'TRUCK',        washType: 'HACCP_FOOD_GRADE', haccpCompliant: true  },
      { vehicleId: 'vehicle-013', plate: 'VB-512-QR', type: 'REFRIGERATED', washType: 'INTERIOR',        haccpCompliant: false },
      { vehicleId: 'vehicle-014', plate: '89-KP-VB',  type: 'TRAILER',      washType: 'STANDARD',        haccpCompliant: false },
    ],
    totalVehicles: 5,
    haccpCompliant: true,
    pdfUrl: null,
  },

  // ─── cert-002: Koelman Trucking B.V. — 2026-02-24 ─────────────────────────
  {
    id: 'cert-002',
    certNumber: 'BTC-2026-002',
    portalId: 'portal-client-001',
    clientName: 'Koelman Trucking B.V.',
    location: 'Kelvinstraat 18, 3029 JC Rotterdam',
    washDate: '2026-02-24',
    issuedAt: '2026-02-24T17:00:00Z',
    approvedBy: 1,
    approverName: 'Martijn de Vries',
    employeeId: 5,
    employeeName: 'Joost Hermans',
    washRecordIds: ['wash-023', 'wash-024', 'wash-025'],
    vehicles: [
      { vehicleId: 'vehicle-001', plate: 'KL-001-BT', type: 'TRUCK',   washType: 'FULL_SERVICE',    haccpCompliant: false },
      { vehicleId: 'vehicle-002', plate: 'KL-022-RT', type: 'TANKER',  washType: 'HACCP_FOOD_GRADE', haccpCompliant: true  },
      { vehicleId: 'vehicle-003', plate: '48-BN-ZP',  type: 'TRAILER', washType: 'STANDARD',        haccpCompliant: false },
    ],
    totalVehicles: 3,
    haccpCompliant: true,
    pdfUrl: null,
  },

  // ─── cert-003: Van den Berg Transport — 2026-03-03 ────────────────────────
  // Covers the CONFIRMED records from last week (wash-011 through wash-015)
  {
    id: 'cert-003',
    certNumber: 'BTC-2026-003',
    portalId: 'portal-client-002',
    clientName: 'Van den Berg Transport B.V.',
    location: 'Waalhaven Oostzijde 55, Rotterdam',
    washDate: '2026-03-03',
    issuedAt: '2026-03-03T16:00:00Z',
    approvedBy: 1,
    approverName: 'Martijn de Vries',
    employeeId: 6,
    employeeName: 'Anke Willems',
    washRecordIds: ['wash-011', 'wash-012', 'wash-013', 'wash-014', 'wash-015'],
    vehicles: [
      { vehicleId: 'vehicle-009', plate: 'VB-001-TR', type: 'TRUCK',        washType: 'STANDARD',        haccpCompliant: false },
      { vehicleId: 'vehicle-010', plate: 'VB-114-HK', type: 'TANKER',       washType: 'HACCP_FOOD_GRADE', haccpCompliant: true  },
      { vehicleId: 'vehicle-011', plate: '33-DX-TZ',  type: 'TRUCK',        washType: 'HACCP_FOOD_GRADE', haccpCompliant: true  },
      { vehicleId: 'vehicle-013', plate: 'VB-512-QR', type: 'REFRIGERATED', washType: 'INTERIOR',        haccpCompliant: false },
      { vehicleId: 'vehicle-014', plate: '89-KP-VB',  type: 'TRAILER',      washType: 'STANDARD',        haccpCompliant: false },
    ],
    totalVehicles: 5,
    haccpCompliant: true,
    pdfUrl: null,
  },
  // ─── cert-004: De Rijn Logistics — 2026-03-03 ─────────────────────────────
  {
    id: 'cert-004',
    certNumber: 'BTC-2026-004',
    portalId: 'portal-client-003',
    clientName: 'De Rijn Logistics B.V.',
    location: 'Waalhaven Oostzijde 55, Rotterdam',
    washDate: '2026-03-03',
    issuedAt: '2026-03-03T16:00:00Z',
    approvedBy: 1,
    approverName: 'Martijn de Vries',
    employeeId: 6,
    employeeName: 'Anke Willems',
    washRecordIds: ['wash-029', 'wash-030'],
    vehicles: [
      { vehicleId: 'vehicle-015', plate: 'DR-101-BK', type: 'TRUCK',  washType: 'STANDARD',        haccpCompliant: false },
      { vehicleId: 'vehicle-016', plate: 'DR-202-FG', type: 'TANKER', washType: 'HACCP_FOOD_GRADE', haccpCompliant: true },
    ],
    totalVehicles: 2,
    haccpCompliant: true,
    pdfUrl: null,
  },

  // ─── cert-005: Vreugdenhil Logistics — 2026-02-24 ───────────────────────
  {
    id: 'cert-005',
    certNumber: 'BTC-2026-005',
    portalId: 'portal-client-006',
    clientName: 'Vreugdenhil Logistics',
    location: 'Agrarisch Centrum 5, Barneveld',
    washDate: '2026-02-24',
    issuedAt: '2026-02-24T16:00:00Z',
    approvedBy: 1,
    approverName: 'Martijn de Vries',
    employeeId: 6,
    employeeName: 'Anke Willems',
    washRecordIds: [],
    vehicles: [
      { vehicleId: 'vehicle-029', plate: 'VL-001-MK', type: 'TRUCK',        washType: 'HACCP_FOOD_GRADE', haccpCompliant: true },
      { vehicleId: 'vehicle-030', plate: 'VL-088-PR', type: 'TANKER',       washType: 'HACCP_FOOD_GRADE', haccpCompliant: true },
      { vehicleId: 'vehicle-031', plate: '22-VL-NB',  type: 'TRUCK',        washType: 'STANDARD',         haccpCompliant: false },
    ],
    totalVehicles: 3,
    haccpCompliant: true,
    pdfUrl: null,
  },

  // ─── cert-006: Tilburg Express — 2026-03-03 ─────────────────────────────
  {
    id: 'cert-006',
    certNumber: 'BTC-2026-006',
    portalId: 'portal-client-011',
    clientName: 'Tilburg Express Logistics',
    location: 'Kempenbaan 55, Tilburg',
    washDate: '2026-03-03',
    issuedAt: '2026-03-03T17:00:00Z',
    approvedBy: 1,
    approverName: 'Martijn de Vries',
    employeeId: 7,
    employeeName: 'Lars Smeets',
    washRecordIds: ['wash-051', 'wash-052'],
    vehicles: [
      { vehicleId: 'vehicle-056', plate: 'TE-010-AB', type: 'TRUCK', washType: 'STANDARD', haccpCompliant: false },
      { vehicleId: 'vehicle-057', plate: 'TE-022-CD', type: 'TRUCK', washType: 'STANDARD', haccpCompliant: false },
    ],
    totalVehicles: 2,
    haccpCompliant: false,
    pdfUrl: null,
  },

  // ─── cert-007: Dijkstra Transport — 2026-02-24 ──────────────────────────
  {
    id: 'cert-007',
    certNumber: 'BTC-2026-007',
    portalId: 'portal-client-007',
    clientName: 'Dijkstra Transport B.V.',
    location: 'Vliegveldweg 30, Eindhoven',
    washDate: '2026-02-24',
    issuedAt: '2026-02-24T17:00:00Z',
    approvedBy: 1,
    approverName: 'Martijn de Vries',
    employeeId: 7,
    employeeName: 'Lars Smeets',
    washRecordIds: [],
    vehicles: [
      { vehicleId: 'vehicle-035', plate: 'DT-001-AB', type: 'TRUCK',  washType: 'STANDARD',        haccpCompliant: false },
      { vehicleId: 'vehicle-036', plate: 'DT-055-HK', type: 'TANKER', washType: 'HACCP_FOOD_GRADE', haccpCompliant: true },
      { vehicleId: 'vehicle-037', plate: '99-DT-ZK',  type: 'TRUCK',  washType: 'FULL_SERVICE',    haccpCompliant: false },
    ],
    totalVehicles: 3,
    haccpCompliant: true,
    pdfUrl: null,
  },

  // ─── cert-008: Rijnmond Bulk — 2026-02-24 ───────────────────────────────
  {
    id: 'cert-008',
    certNumber: 'BTC-2026-008',
    portalId: 'portal-client-009',
    clientName: 'Rijnmond Bulk Services',
    location: 'Botlekweg 181, Rotterdam',
    washDate: '2026-02-24',
    issuedAt: '2026-02-24T16:30:00Z',
    approvedBy: 1,
    approverName: 'Martijn de Vries',
    employeeId: 6,
    employeeName: 'Anke Willems',
    washRecordIds: [],
    vehicles: [
      { vehicleId: 'vehicle-045', plate: 'RB-001-TK', type: 'TANKER', washType: 'HACCP_FOOD_GRADE', haccpCompliant: true },
      { vehicleId: 'vehicle-046', plate: 'RB-044-BN', type: 'TANKER', washType: 'HACCP_FOOD_GRADE', haccpCompliant: true },
      { vehicleId: 'vehicle-047', plate: '33-RB-FZ',  type: 'TRUCK',  washType: 'STANDARD',         haccpCompliant: false },
    ],
    totalVehicles: 3,
    haccpCompliant: true,
    pdfUrl: null,
  },

  // ─── cert-009: Schuttersveld — 2026-02-24 ───────────────────────────────
  {
    id: 'cert-009',
    certNumber: 'BTC-2026-009',
    portalId: 'portal-client-010',
    clientName: 'Schuttersveld Tanktransport',
    location: 'Schuttersveld 12, Den Bosch',
    washDate: '2026-02-24',
    issuedAt: '2026-02-24T17:00:00Z',
    approvedBy: 1,
    approverName: 'Martijn de Vries',
    employeeId: 7,
    employeeName: 'Lars Smeets',
    washRecordIds: [],
    vehicles: [
      { vehicleId: 'vehicle-051', plate: 'ST-001-TN', type: 'TANKER', washType: 'HACCP_FOOD_GRADE', haccpCompliant: true },
      { vehicleId: 'vehicle-052', plate: 'ST-033-BV', type: 'TANKER', washType: 'HACCP_FOOD_GRADE', haccpCompliant: true },
    ],
    totalVehicles: 2,
    haccpCompliant: true,
    pdfUrl: null,
  },

  // ─── cert-010: Borger & Meester — 2026-02-24 ────────────────────────────
  {
    id: 'cert-010',
    certNumber: 'BTC-2026-010',
    portalId: 'portal-client-012',
    clientName: 'Borger & Meester Tankvracht',
    location: 'Nieuwe Hemweg 6, Amsterdam',
    washDate: '2026-02-24',
    issuedAt: '2026-02-24T16:00:00Z',
    approvedBy: 1,
    approverName: 'Martijn de Vries',
    employeeId: 6,
    employeeName: 'Anke Willems',
    washRecordIds: [],
    vehicles: [
      { vehicleId: 'vehicle-059', plate: 'BM-001-TK', type: 'TANKER', washType: 'HACCP_FOOD_GRADE', haccpCompliant: true },
      { vehicleId: 'vehicle-060', plate: 'BM-044-NR', type: 'TANKER', washType: 'HACCP_FOOD_GRADE', haccpCompliant: true },
      { vehicleId: 'vehicle-061', plate: '55-BM-FP',  type: 'TRUCK',  washType: 'STANDARD',         haccpCompliant: false },
    ],
    totalVehicles: 3,
    haccpCompliant: true,
    pdfUrl: null,
  },

  // ─── cert-011: Hofstra Cargo — 2026-02-24 ───────────────────────────────
  {
    id: 'cert-011',
    certNumber: 'BTC-2026-011',
    portalId: 'portal-client-004',
    clientName: 'Hofstra Cargo',
    location: 'Transportweg 8, Rotterdam',
    washDate: '2026-02-24',
    issuedAt: '2026-02-24T16:30:00Z',
    approvedBy: 1,
    approverName: 'Martijn de Vries',
    employeeId: 6,
    employeeName: 'Anke Willems',
    washRecordIds: [],
    vehicles: [
      { vehicleId: 'vehicle-020', plate: 'HC-010-TR', type: 'TRUCK',   washType: 'STANDARD', haccpCompliant: false },
      { vehicleId: 'vehicle-021', plate: 'HC-044-BR', type: 'TRUCK',   washType: 'STANDARD', haccpCompliant: false },
    ],
    totalVehicles: 2,
    haccpCompliant: false,
    pdfUrl: null,
  },

  // ─── cert-012: Maas & Waal — 2026-02-24 ─────────────────────────────────
  {
    id: 'cert-012',
    certNumber: 'BTC-2026-012',
    portalId: 'portal-client-005',
    clientName: 'Maas & Waal Vervoer',
    location: 'Nijverheidsstraat 21, Wijchen',
    washDate: '2026-02-24',
    issuedAt: '2026-02-24T17:00:00Z',
    approvedBy: 1,
    approverName: 'Martijn de Vries',
    employeeId: 7,
    employeeName: 'Lars Smeets',
    washRecordIds: [],
    vehicles: [
      { vehicleId: 'vehicle-024', plate: 'MW-001-TK', type: 'TRUCK',        washType: 'STANDARD', haccpCompliant: false },
      { vehicleId: 'vehicle-025', plate: 'MW-055-RG', type: 'REFRIGERATED', washType: 'INTERIOR', haccpCompliant: false },
    ],
    totalVehicles: 2,
    haccpCompliant: false,
    pdfUrl: null,
  },

  // ─── cert-013: Noord-Brabant Cargo — 2026-02-24 ─────────────────────────
  {
    id: 'cert-013',
    certNumber: 'BTC-2026-013',
    portalId: 'portal-client-008',
    clientName: 'Noord-Brabant Cargo B.V.',
    location: 'Meerenakkerweg 22, Eindhoven',
    washDate: '2026-02-24',
    issuedAt: '2026-02-24T17:30:00Z',
    approvedBy: 1,
    approverName: 'Martijn de Vries',
    employeeId: 7,
    employeeName: 'Lars Smeets',
    washRecordIds: [],
    vehicles: [
      { vehicleId: 'vehicle-041', plate: 'NB-010-TR', type: 'TRUCK', washType: 'STANDARD', haccpCompliant: false },
      { vehicleId: 'vehicle-042', plate: 'NB-033-GH', type: 'TRUCK', washType: 'STANDARD', haccpCompliant: false },
    ],
    totalVehicles: 2,
    haccpCompliant: false,
    pdfUrl: null,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getCertificatesByPortalId(portalId) {
  return certificates.filter((c) => c.portalId === portalId);
}

export function findCertificateById(id) {
  return certificates.find((c) => c.id === id) || null;
}

export function findCertificateByWashRecordId(washRecordId) {
  return certificates.find((c) => c.washRecordIds.includes(washRecordId)) || null;
}
