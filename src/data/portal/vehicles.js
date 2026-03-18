// Vehicle assignment entities — one per vehicle slot registered in a client portal
// 8-10 vehicles across portal-client-001 (Koelman) and portal-client-002 (Van den Berg)

export const vehicles = [

  // ─── portal-client-001: Koelman Trucking B.V. (agreement: 14 slots) ──────────
  {
    id: 'vehicle-001',
    portalId: 'portal-client-001',
    licensePlate: 'KL-001-BT',
    vehicleType: 'TRUCK',
    washType: 'FULL_SERVICE',
    notes: 'Side skirts require high-pressure rinse. Park trailer separately.',
    status: 'ACTIVE',
    assignedAt: '2026-02-03T08:00:00Z',
    swappedAt: null,
    replacedBy: null,
  },
  {
    id: 'vehicle-002',
    portalId: 'portal-client-001',
    licensePlate: 'KL-022-RT',
    vehicleType: 'TANKER',
    washType: 'HACCP_FOOD_GRADE',
    notes: 'Food-grade tanker — must use BTC-certified cleaning agent (batch #FG-19).',
    status: 'ACTIVE',
    assignedAt: '2026-02-03T08:05:00Z',
    swappedAt: null,
    replacedBy: null,
  },
  {
    id: 'vehicle-003',
    portalId: 'portal-client-001',
    licensePlate: '48-BN-ZP',
    vehicleType: 'TRAILER',
    washType: 'STANDARD',
    notes: '',
    status: 'ACTIVE',
    assignedAt: '2026-02-03T08:10:00Z',
    swappedAt: null,
    replacedBy: null,
  },
  {
    id: 'vehicle-004',
    portalId: 'portal-client-001',
    licensePlate: 'ZX-445-LN',
    vehicleType: 'REFRIGERATED',
    washType: 'INTERIOR',
    notes: 'Interior must be sanitised with food-safe disinfectant. Reefer unit off during wash.',
    status: 'ACTIVE',
    assignedAt: '2026-02-10T09:00:00Z',
    swappedAt: null,
    replacedBy: null,
  },
  {
    id: 'vehicle-005',
    portalId: 'portal-client-001',
    licensePlate: '12-GH-44',
    vehicleType: 'TRUCK',
    washType: 'STANDARD',
    notes: 'Left side mirror cracked — document condition on intake photo.',
    status: 'ACTIVE',
    assignedAt: '2026-02-10T09:05:00Z',
    swappedAt: null,
    replacedBy: null,
  },
  // SWAPPED vehicle — replaced by vehicle-007
  {
    id: 'vehicle-006',
    portalId: 'portal-client-001',
    licensePlate: 'KL-088-XR',
    vehicleType: 'TRUCK',
    washType: 'FULL_SERVICE',
    notes: 'Original assignment — swapped out due to vehicle sale.',
    status: 'SWAPPED',
    assignedAt: '2026-02-03T08:15:00Z',
    swappedAt: '2026-03-01T11:00:00Z',
    replacedBy: 'vehicle-007',
  },
  {
    id: 'vehicle-007',
    portalId: 'portal-client-001',
    licensePlate: 'KL-215-NV',
    vehicleType: 'TRUCK',
    washType: 'FULL_SERVICE',
    notes: 'Replacement for KL-088-XR. New acquisition — standard full-service wash.',
    status: 'ACTIVE',
    assignedAt: '2026-03-01T11:00:00Z',
    swappedAt: null,
    replacedBy: null,
  },
  {
    id: 'vehicle-008',
    portalId: 'portal-client-001',
    licensePlate: 'TB-667-MZ',
    vehicleType: 'TRAILER',
    washType: 'STANDARD',
    notes: '',
    status: 'ACTIVE',
    assignedAt: '2026-02-15T09:00:00Z',
    swappedAt: null,
    replacedBy: null,
  },

  // ─── portal-client-002: Van den Berg Transport B.V. (agreement: 22 slots) ────
  {
    id: 'vehicle-009',
    portalId: 'portal-client-002',
    licensePlate: 'VB-001-TR',
    vehicleType: 'TRUCK',
    washType: 'STANDARD',
    notes: 'Priority vehicle — driver picks up before 08:00. Must be ready by 07:45.',
    status: 'ACTIVE',
    assignedAt: '2024-04-05T07:00:00Z',
    swappedAt: null,
    replacedBy: null,
  },
  {
    id: 'vehicle-010',
    portalId: 'portal-client-002',
    licensePlate: 'VB-114-HK',
    vehicleType: 'TANKER',
    washType: 'HACCP_FOOD_GRADE',
    notes: 'ADR-registered. Full hazmat wash protocol required. Crew of 2 minimum.',
    status: 'ACTIVE',
    assignedAt: '2024-04-05T07:05:00Z',
    swappedAt: null,
    replacedBy: null,
  },
  {
    id: 'vehicle-011',
    portalId: 'portal-client-002',
    licensePlate: '33-DX-TZ',
    vehicleType: 'TRUCK',
    washType: 'HACCP_FOOD_GRADE',
    notes: 'Bulk liquid food transport. Full HACCP protocol + rinse certificate required.',
    status: 'ACTIVE',
    assignedAt: '2024-04-05T07:10:00Z',
    swappedAt: null,
    replacedBy: null,
  },
  // SWAPPED vehicle — replaced by vehicle-013
  {
    id: 'vehicle-012',
    portalId: 'portal-client-002',
    licensePlate: 'VB-339-OD',
    vehicleType: 'REFRIGERATED',
    washType: 'INTERIOR',
    notes: 'Swapped out after compressor failure.',
    status: 'SWAPPED',
    assignedAt: '2024-04-05T07:15:00Z',
    swappedAt: '2025-11-18T10:30:00Z',
    replacedBy: 'vehicle-013',
  },
  {
    id: 'vehicle-013',
    portalId: 'portal-client-002',
    licensePlate: 'VB-512-QR',
    vehicleType: 'REFRIGERATED',
    washType: 'INTERIOR',
    notes: 'Replacement reefer unit. Interior sanitise programme required after each trip.',
    status: 'ACTIVE',
    assignedAt: '2025-11-18T10:30:00Z',
    swappedAt: null,
    replacedBy: null,
  },
  {
    id: 'vehicle-014',
    portalId: 'portal-client-002',
    licensePlate: '89-KP-VB',
    vehicleType: 'TRAILER',
    washType: 'STANDARD',
    notes: 'Curtainsider — avoid direct high-pressure spray on side curtains.',
    status: 'ACTIVE',
    assignedAt: '2024-05-12T08:00:00Z',
    swappedAt: null,
    replacedBy: null,
  },
  // ─── portal-client-003: De Rijn Logistics B.V. (5 vehicles) ─────────────────
  {
    id: 'vehicle-015', portalId: 'portal-client-003', licensePlate: 'DR-101-BK',
    vehicleType: 'TRUCK', washType: 'STANDARD', notes: '', status: 'ACTIVE',
    assignedAt: '2021-12-01T08:00:00Z', swappedAt: null, replacedBy: null,
  },
  {
    id: 'vehicle-016', portalId: 'portal-client-003', licensePlate: 'DR-202-FG',
    vehicleType: 'TANKER', washType: 'HACCP_FOOD_GRADE', notes: 'Bulk liquid food transport.', status: 'ACTIVE',
    assignedAt: '2021-12-01T08:05:00Z', swappedAt: null, replacedBy: null,
  },
  {
    id: 'vehicle-017', portalId: 'portal-client-003', licensePlate: '55-RJ-KP',
    vehicleType: 'TRAILER', washType: 'STANDARD', notes: '', status: 'ACTIVE',
    assignedAt: '2021-12-01T08:10:00Z', swappedAt: null, replacedBy: null,
  },
  {
    id: 'vehicle-018', portalId: 'portal-client-003', licensePlate: 'DR-318-HN',
    vehicleType: 'TRUCK', washType: 'STANDARD', notes: '', status: 'ACTIVE',
    assignedAt: '2022-03-15T09:00:00Z', swappedAt: null, replacedBy: null,
  },
  {
    id: 'vehicle-019', portalId: 'portal-client-003', licensePlate: '78-DP-VX',
    vehicleType: 'REFRIGERATED', washType: 'INTERIOR', notes: 'Interior sanitise after each trip.', status: 'ACTIVE',
    assignedAt: '2022-06-01T08:00:00Z', swappedAt: null, replacedBy: null,
  },

  // ─── portal-client-004: Hofstra Cargo (4 vehicles) ────────────────────────
  {
    id: 'vehicle-020', portalId: 'portal-client-004', licensePlate: 'HC-010-TR',
    vehicleType: 'TRUCK', washType: 'STANDARD', notes: '', status: 'ACTIVE',
    assignedAt: '2020-06-15T08:00:00Z', swappedAt: null, replacedBy: null,
  },
  {
    id: 'vehicle-021', portalId: 'portal-client-004', licensePlate: 'HC-044-BR',
    vehicleType: 'TRUCK', washType: 'STANDARD', notes: '', status: 'ACTIVE',
    assignedAt: '2020-06-15T08:05:00Z', swappedAt: null, replacedBy: null,
  },
  {
    id: 'vehicle-022', portalId: 'portal-client-004', licensePlate: '41-GN-HC',
    vehicleType: 'TRAILER', washType: 'STANDARD', notes: 'Curtainsider — avoid direct high-pressure on side curtains.', status: 'ACTIVE',
    assignedAt: '2020-06-15T08:10:00Z', swappedAt: null, replacedBy: null,
  },
  {
    id: 'vehicle-023', portalId: 'portal-client-004', licensePlate: 'HC-077-DV',
    vehicleType: 'TRUCK', washType: 'STANDARD', notes: '', status: 'ACTIVE',
    assignedAt: '2021-01-10T09:00:00Z', swappedAt: null, replacedBy: null,
  },

  // ─── portal-client-005: Maas & Waal Vervoer (5 vehicles) ──────────────────
  {
    id: 'vehicle-024', portalId: 'portal-client-005', licensePlate: 'MW-001-TK',
    vehicleType: 'TRUCK', washType: 'STANDARD', notes: '', status: 'ACTIVE',
    assignedAt: '2022-10-01T08:00:00Z', swappedAt: null, replacedBy: null,
  },
  {
    id: 'vehicle-025', portalId: 'portal-client-005', licensePlate: 'MW-055-RG',
    vehicleType: 'REFRIGERATED', washType: 'INTERIOR', notes: 'Reefer unit off during wash.', status: 'ACTIVE',
    assignedAt: '2022-10-01T08:05:00Z', swappedAt: null, replacedBy: null,
  },
  {
    id: 'vehicle-026', portalId: 'portal-client-005', licensePlate: '66-MW-ZP',
    vehicleType: 'TRAILER', washType: 'STANDARD', notes: '', status: 'ACTIVE',
    assignedAt: '2022-10-01T08:10:00Z', swappedAt: null, replacedBy: null,
  },
  {
    id: 'vehicle-027', portalId: 'portal-client-005', licensePlate: 'MW-112-FH',
    vehicleType: 'TRUCK', washType: 'STANDARD', notes: '', status: 'ACTIVE',
    assignedAt: '2023-02-15T09:00:00Z', swappedAt: null, replacedBy: null,
  },
  {
    id: 'vehicle-028', portalId: 'portal-client-005', licensePlate: 'MW-203-NK',
    vehicleType: 'TRUCK', washType: 'FULL_SERVICE', notes: '', status: 'ACTIVE',
    assignedAt: '2023-06-01T08:00:00Z', swappedAt: null, replacedBy: null,
  },

  // ─── portal-client-006: Vreugdenhil Logistics (6 vehicles) ────────────────
  {
    id: 'vehicle-029', portalId: 'portal-client-006', licensePlate: 'VL-001-MK',
    vehicleType: 'TRUCK', washType: 'HACCP_FOOD_GRADE', notes: 'Dairy transport.', status: 'ACTIVE',
    assignedAt: '2021-06-01T08:00:00Z', swappedAt: null, replacedBy: null,
  },
  {
    id: 'vehicle-030', portalId: 'portal-client-006', licensePlate: 'VL-088-PR',
    vehicleType: 'TANKER', washType: 'HACCP_FOOD_GRADE', notes: 'Milk tanker — full HACCP protocol.', status: 'ACTIVE',
    assignedAt: '2021-06-01T08:05:00Z', swappedAt: null, replacedBy: null,
  },
  {
    id: 'vehicle-031', portalId: 'portal-client-006', licensePlate: '22-VL-NB',
    vehicleType: 'TRUCK', washType: 'STANDARD', notes: '', status: 'ACTIVE',
    assignedAt: '2021-06-01T08:10:00Z', swappedAt: null, replacedBy: null,
  },
  {
    id: 'vehicle-032', portalId: 'portal-client-006', licensePlate: 'VL-144-SZ',
    vehicleType: 'REFRIGERATED', washType: 'INTERIOR', notes: 'Interior sanitise required.', status: 'ACTIVE',
    assignedAt: '2021-09-01T09:00:00Z', swappedAt: null, replacedBy: null,
  },
  {
    id: 'vehicle-033', portalId: 'portal-client-006', licensePlate: 'VL-201-DR',
    vehicleType: 'TRAILER', washType: 'STANDARD', notes: '', status: 'ACTIVE',
    assignedAt: '2022-01-15T08:00:00Z', swappedAt: null, replacedBy: null,
  },
  {
    id: 'vehicle-034', portalId: 'portal-client-006', licensePlate: 'VL-309-FT',
    vehicleType: 'TANKER', washType: 'HACCP_FOOD_GRADE', notes: 'Yoghurt transport.', status: 'ACTIVE',
    assignedAt: '2022-04-01T08:00:00Z', swappedAt: null, replacedBy: null,
  },

  // ─── portal-client-007: Dijkstra Transport B.V. (6 vehicles) ──────────────
  {
    id: 'vehicle-035', portalId: 'portal-client-007', licensePlate: 'DT-001-AB',
    vehicleType: 'TRUCK', washType: 'STANDARD', notes: '', status: 'ACTIVE',
    assignedAt: '2021-01-05T08:00:00Z', swappedAt: null, replacedBy: null,
  },
  {
    id: 'vehicle-036', portalId: 'portal-client-007', licensePlate: 'DT-055-HK',
    vehicleType: 'TANKER', washType: 'HACCP_FOOD_GRADE', notes: 'Beverage transport — HACCP required.', status: 'ACTIVE',
    assignedAt: '2021-01-05T08:05:00Z', swappedAt: null, replacedBy: null,
  },
  {
    id: 'vehicle-037', portalId: 'portal-client-007', licensePlate: '99-DT-ZK',
    vehicleType: 'TRUCK', washType: 'FULL_SERVICE', notes: '', status: 'ACTIVE',
    assignedAt: '2021-01-05T08:10:00Z', swappedAt: null, replacedBy: null,
  },
  {
    id: 'vehicle-038', portalId: 'portal-client-007', licensePlate: 'DT-112-PV',
    vehicleType: 'TANKER', washType: 'HACCP_FOOD_GRADE', notes: 'ADR-registered. Hazmat protocol.', status: 'ACTIVE',
    assignedAt: '2021-03-15T09:00:00Z', swappedAt: null, replacedBy: null,
  },
  {
    id: 'vehicle-039', portalId: 'portal-client-007', licensePlate: '44-DJ-WR',
    vehicleType: 'TRAILER', washType: 'STANDARD', notes: '', status: 'ACTIVE',
    assignedAt: '2021-06-01T08:00:00Z', swappedAt: null, replacedBy: null,
  },
  {
    id: 'vehicle-040', portalId: 'portal-client-007', licensePlate: 'DT-228-LM',
    vehicleType: 'REFRIGERATED', washType: 'INTERIOR', notes: 'Reefer unit must be off.', status: 'ACTIVE',
    assignedAt: '2022-01-10T08:00:00Z', swappedAt: null, replacedBy: null,
  },

  // ─── portal-client-008: Noord-Brabant Cargo B.V. (4 vehicles) ─────────────
  {
    id: 'vehicle-041', portalId: 'portal-client-008', licensePlate: 'NB-010-TR',
    vehicleType: 'TRUCK', washType: 'STANDARD', notes: '', status: 'ACTIVE',
    assignedAt: '2025-08-01T08:00:00Z', swappedAt: null, replacedBy: null,
  },
  {
    id: 'vehicle-042', portalId: 'portal-client-008', licensePlate: 'NB-033-GH',
    vehicleType: 'TRUCK', washType: 'STANDARD', notes: '', status: 'ACTIVE',
    assignedAt: '2025-08-01T08:05:00Z', swappedAt: null, replacedBy: null,
  },
  {
    id: 'vehicle-043', portalId: 'portal-client-008', licensePlate: '72-NB-VK',
    vehicleType: 'TRAILER', washType: 'STANDARD', notes: '', status: 'ACTIVE',
    assignedAt: '2025-08-01T08:10:00Z', swappedAt: null, replacedBy: null,
  },
  {
    id: 'vehicle-044', portalId: 'portal-client-008', licensePlate: 'NB-055-FD',
    vehicleType: 'REFRIGERATED', washType: 'INTERIOR', notes: 'Interior sanitise programme.', status: 'ACTIVE',
    assignedAt: '2025-09-15T09:00:00Z', swappedAt: null, replacedBy: null,
  },

  // ─── portal-client-009: Rijnmond Bulk Services (6 vehicles) ───────────────
  {
    id: 'vehicle-045', portalId: 'portal-client-009', licensePlate: 'RB-001-TK',
    vehicleType: 'TANKER', washType: 'HACCP_FOOD_GRADE', notes: 'Food-grade bulk liquid.', status: 'ACTIVE',
    assignedAt: '2023-06-01T08:00:00Z', swappedAt: null, replacedBy: null,
  },
  {
    id: 'vehicle-046', portalId: 'portal-client-009', licensePlate: 'RB-044-BN',
    vehicleType: 'TANKER', washType: 'HACCP_FOOD_GRADE', notes: 'Chemical wash available.', status: 'ACTIVE',
    assignedAt: '2023-06-01T08:05:00Z', swappedAt: null, replacedBy: null,
  },
  {
    id: 'vehicle-047', portalId: 'portal-client-009', licensePlate: '33-RB-FZ',
    vehicleType: 'TRUCK', washType: 'STANDARD', notes: '', status: 'ACTIVE',
    assignedAt: '2023-06-01T08:10:00Z', swappedAt: null, replacedBy: null,
  },
  {
    id: 'vehicle-048', portalId: 'portal-client-009', licensePlate: 'RB-088-KD',
    vehicleType: 'TANKER', washType: 'HACCP_FOOD_GRADE', notes: 'ADR class 3 — degassing required.', status: 'ACTIVE',
    assignedAt: '2023-09-01T09:00:00Z', swappedAt: null, replacedBy: null,
  },
  {
    id: 'vehicle-049', portalId: 'portal-client-009', licensePlate: 'RB-122-WP',
    vehicleType: 'TRUCK', washType: 'FULL_SERVICE', notes: '', status: 'ACTIVE',
    assignedAt: '2024-01-15T08:00:00Z', swappedAt: null, replacedBy: null,
  },
  {
    id: 'vehicle-050', portalId: 'portal-client-009', licensePlate: '67-RB-NL',
    vehicleType: 'TRAILER', washType: 'STANDARD', notes: '', status: 'ACTIVE',
    assignedAt: '2024-04-01T08:00:00Z', swappedAt: null, replacedBy: null,
  },

  // ─── portal-client-010: Schuttersveld Tanktransport (5 vehicles) ──────────
  {
    id: 'vehicle-051', portalId: 'portal-client-010', licensePlate: 'ST-001-TN',
    vehicleType: 'TANKER', washType: 'HACCP_FOOD_GRADE', notes: 'Tank interior cleaning required.', status: 'ACTIVE',
    assignedAt: '2021-09-01T08:00:00Z', swappedAt: null, replacedBy: null,
  },
  {
    id: 'vehicle-052', portalId: 'portal-client-010', licensePlate: 'ST-033-BV',
    vehicleType: 'TANKER', washType: 'HACCP_FOOD_GRADE', notes: 'Residue sampling after each clean.', status: 'ACTIVE',
    assignedAt: '2021-09-01T08:05:00Z', swappedAt: null, replacedBy: null,
  },
  {
    id: 'vehicle-053', portalId: 'portal-client-010', licensePlate: '88-ST-GH',
    vehicleType: 'TRUCK', washType: 'STANDARD', notes: '', status: 'ACTIVE',
    assignedAt: '2021-09-01T08:10:00Z', swappedAt: null, replacedBy: null,
  },
  {
    id: 'vehicle-054', portalId: 'portal-client-010', licensePlate: 'ST-077-DR',
    vehicleType: 'TANKER', washType: 'HACCP_FOOD_GRADE', notes: 'ADR specialist wash.', status: 'ACTIVE',
    assignedAt: '2022-02-01T09:00:00Z', swappedAt: null, replacedBy: null,
  },
  {
    id: 'vehicle-055', portalId: 'portal-client-010', licensePlate: 'ST-112-KL',
    vehicleType: 'TRUCK', washType: 'FULL_SERVICE', notes: '', status: 'ACTIVE',
    assignedAt: '2022-06-15T08:00:00Z', swappedAt: null, replacedBy: null,
  },

  // ─── portal-client-011: Tilburg Express Logistics (3 vehicles) ────────────
  {
    id: 'vehicle-056', portalId: 'portal-client-011', licensePlate: 'TE-010-AB',
    vehicleType: 'TRUCK', washType: 'STANDARD', notes: '', status: 'ACTIVE',
    assignedAt: '2026-02-01T08:00:00Z', swappedAt: null, replacedBy: null,
  },
  {
    id: 'vehicle-057', portalId: 'portal-client-011', licensePlate: 'TE-022-CD',
    vehicleType: 'TRUCK', washType: 'STANDARD', notes: '', status: 'ACTIVE',
    assignedAt: '2026-02-01T08:05:00Z', swappedAt: null, replacedBy: null,
  },
  {
    id: 'vehicle-058', portalId: 'portal-client-011', licensePlate: '14-TE-FG',
    vehicleType: 'TRAILER', washType: 'STANDARD', notes: '', status: 'ACTIVE',
    assignedAt: '2026-02-01T08:10:00Z', swappedAt: null, replacedBy: null,
  },

  // ─── portal-client-012: Borger & Meester Tankvracht (6 vehicles) ──────────
  {
    id: 'vehicle-059', portalId: 'portal-client-012', licensePlate: 'BM-001-TK',
    vehicleType: 'TANKER', washType: 'HACCP_FOOD_GRADE', notes: 'Food-grade tanker.', status: 'ACTIVE',
    assignedAt: '2025-11-01T08:00:00Z', swappedAt: null, replacedBy: null,
  },
  {
    id: 'vehicle-060', portalId: 'portal-client-012', licensePlate: 'BM-044-NR',
    vehicleType: 'TANKER', washType: 'HACCP_FOOD_GRADE', notes: 'ADR class 3 — degassing required.', status: 'ACTIVE',
    assignedAt: '2025-11-01T08:05:00Z', swappedAt: null, replacedBy: null,
  },
  {
    id: 'vehicle-061', portalId: 'portal-client-012', licensePlate: '55-BM-FP',
    vehicleType: 'TRUCK', washType: 'STANDARD', notes: '', status: 'ACTIVE',
    assignedAt: '2025-11-01T08:10:00Z', swappedAt: null, replacedBy: null,
  },
  {
    id: 'vehicle-062', portalId: 'portal-client-012', licensePlate: 'BM-088-HV',
    vehicleType: 'TRUCK', washType: 'FULL_SERVICE', notes: '', status: 'ACTIVE',
    assignedAt: '2025-12-15T09:00:00Z', swappedAt: null, replacedBy: null,
  },
  {
    id: 'vehicle-063', portalId: 'portal-client-012', licensePlate: 'BM-122-WZ',
    vehicleType: 'REFRIGERATED', washType: 'INTERIOR', notes: 'Interior sanitise required.', status: 'ACTIVE',
    assignedAt: '2026-01-10T08:00:00Z', swappedAt: null, replacedBy: null,
  },
  {
    id: 'vehicle-064', portalId: 'portal-client-012', licensePlate: '90-BM-KL',
    vehicleType: 'TRAILER', washType: 'STANDARD', notes: '', status: 'ACTIVE',
    assignedAt: '2026-02-01T08:00:00Z', swappedAt: null, replacedBy: null,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getVehiclesByPortalId(portalId) {
  return vehicles.filter((v) => v.portalId === portalId);
}

export function getActiveVehiclesByPortalId(portalId) {
  return vehicles.filter((v) => v.portalId === portalId && v.status === 'ACTIVE');
}

export function findVehicleById(id) {
  return vehicles.find((v) => v.id === id) || null;
}
