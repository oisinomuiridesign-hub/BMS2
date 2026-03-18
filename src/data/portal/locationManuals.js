// Location manual entities — one per lead that has progressed past LOCATION_MANUAL_PENDING
// Matches portals.js IDs (locationManualId field) and leads.js (leadId)

export const locationManuals = [
  // ─── APPROVED — linked to portal-lead-003 (lead-003, UNDER_REVIEW stage) ────
  {
    id: 'manual-003',
    leadId: 'lead-003',
    portalId: 'portal-lead-003',
    status: 'APPROVED',             // NOT_STARTED|IN_PROGRESS|SUBMITTED|APPROVED|REJECTED
    submittedAt: '2026-02-14T10:45:00Z',
    approvedAt: '2026-02-18T09:30:00Z',
    approvedBy: 3,                   // employee ID (Femke van Breugel's BTC contact)
    siteAddress: 'Beemsterhoek 4, 5706 DN Helmond',
    accessInstructions:
      'Main entrance via Beemsterhoek. Gate code: 7741. Drive to the rear of the building — wash bay is signposted. Security guard on site weekdays 07:00–18:00.',
    operatingHours: {
      monday:    '06:00–20:00',
      tuesday:   '06:00–20:00',
      wednesday: '06:00–20:00',
      thursday:  '06:00–20:00',
      friday:    '06:00–18:00',
      saturday:  '08:00–14:00',
      sunday:    'Closed',
    },
    contacts: [
      {
        role: 'Site Manager',
        name: 'Femke van Breugel',
        phone: '+31 6 36 44 55 66',
        email: 'f.vanbreugel@breugellogistics.nl',
      },
      {
        role: 'Fleet Manager',
        name: 'Sander Molenaar',
        phone: '+31 6 81 22 33 44',
        email: 's.molenaar@breugellogistics.nl',
      },
      {
        role: 'Driver Coordinator',
        name: 'Ingrid Timmermans',
        phone: '+31 6 55 66 77 88',
        email: 'i.timmermans@breugellogistics.nl',
      },
    ],
    parkingSpecs:
      'Capacity for 6 trucks simultaneously in the covered wash hall. Overhead clearance 4.8 m. Two dedicated wash bays for 13.6 m semi-trailers. External waiting area for 4 additional vehicles.',
    waterSupply:
      'Municipal mains water. Static pressure: 5.5 bar. Flow rate: 18 L/min at the wash bay outlet. Hot water boiler (500 L) available. Water meter ID: WM-BL-0044.',
    powerSupply:
      '400 V three-phase, 32 A per bay. CEE sockets installed at each wash bay. Emergency cutoff panel located at east wall, bay 1.',
    wasteDisposal:
      'Grease interceptor pit on-site (3,000 L capacity), certified by Gemeente Helmond. Pit emptied quarterly by Van Gansewinkel. Wash water directed to municipal sewer under permit VH-2024-0092.',
    safetyRequirements:
      'Hi-vis vest and safety boots mandatory on entire site. No smoking anywhere on premises. Fire extinguisher inspection current (last: Jan 2026). First aid kit at site manager office.',
    specialInstructions:
      'HACCP food-grade wash required for all tankers carrying consumable goods — use BTC-approved detergent only. ADR placards must be removed before entering wash bay. Photo documentation required after each food-grade wash.',
  },

  // ─── SUBMITTED — linked to portal-lead-006 (lead-006 → stage CONTRACT_REVIEW) ─
  {
    id: 'manual-006',
    leadId: 'lead-006',
    portalId: 'portal-lead-006',
    status: 'SUBMITTED',
    submittedAt: '2026-02-28T14:20:00Z',
    approvedAt: null,
    approvedBy: null,
    siteAddress: 'Maasvlakte 2, 3199 KB Rotterdam',
    accessInstructions:
      'Access via Maasvlakteweg gate 3. Visitor badge required — collect from port reception (building A). Escort required within the port perimeter. Wash bay at coordinates 51.9651° N, 4.0023° E (follow internal signage).',
    operatingHours: {
      monday:    '05:00–22:00',
      tuesday:   '05:00–22:00',
      wednesday: '05:00–22:00',
      thursday:  '05:00–22:00',
      friday:    '05:00–22:00',
      saturday:  '07:00–18:00',
      sunday:    '08:00–16:00',
    },
    contacts: [
      {
        role: 'Site Manager',
        name: 'Pieter-Jan Hagenaar',
        phone: '+31 6 69 77 88 99',
        email: 'pj.hagenaar@havenstadtank.nl',
      },
      {
        role: 'Fleet Manager',
        name: 'Roel van der Berg',
        phone: '+31 6 70 88 99 00',
        email: 'r.vanderberg@havenstadtank.nl',
      },
    ],
    parkingSpecs:
      'Open-air wash platform. Can accommodate 10 tankers simultaneously. No overhead obstruction. Vehicle lengths up to 25 m accepted. Turning circle for articulated lorries available.',
    waterSupply:
      'Port water supply, 7 bar pressure. Dual-feed system with 800 L buffer tank. Desalinated water available for final rinse. Flow rate: 22 L/min.',
    powerSupply:
      '400 V three-phase throughout. Generator backup (150 kVA) for emergency operations. All sockets protected to IP67 due to outdoor installation.',
    wasteDisposal:
      'Port Authority-approved separator system. Discharge to dedicated industrial wastewater drain under permit HA-RTM-2025-114. Tank cleaning waste collected by Veolia under separate contract.',
    safetyRequirements:
      'Full PPE required: hi-vis, safety boots, hard hat, chemical-resistant gloves. Port Authority security pass required for all personnel. ISPS security protocol applies. No unauthorised photography.',
    specialInstructions:
      'All tankers carrying hazardous cargo (ADR class 1–9) must be degassed before wash. Gas-free certificate required on arrival. Chemical wash available for food-grade tankers — 48-hour advance booking required.',
  },

  // ─── APPROVED — linked to portal-lead-004 (lead-004, AWAITING_ACCEPTANCE stage) ─
  {
    id: 'manual-004',
    leadId: 'lead-004',
    portalId: 'portal-lead-004',
    status: 'APPROVED',
    submittedAt: '2026-02-01T11:30:00Z',
    approvedAt: '2026-02-10T09:00:00Z',
    approvedBy: 2,
    siteAddress: 'Poortweg 33, 2612 PA Delft',
    accessInstructions:
      'Enter via main Poortweg gate. Intercom at gate: press "3" for logistics yard. Wash facility is building G at the south end of the site. Parking for visitors on the left after gate.',
    operatingHours: {
      monday:    '06:00–22:00',
      tuesday:   '06:00–22:00',
      wednesday: '06:00–22:00',
      thursday:  '06:00–22:00',
      friday:    '06:00–20:00',
      saturday:  '08:00–16:00',
      sunday:    'Closed',
    },
    contacts: [
      {
        role: 'Site Manager',
        name: 'Sjoerd de Groot',
        phone: '+31 6 47 55 66 77',
        email: 's.degroot@degroottank.nl',
      },
      {
        role: 'Fleet Manager',
        name: 'Yvonne Blom',
        phone: '+31 6 48 66 77 88',
        email: 'y.blom@degroottank.nl',
      },
      {
        role: 'Driver Coordinator',
        name: 'Henk-Jan Oosterveld',
        phone: '+31 6 49 77 88 99',
        email: 'hj.oosterveld@degroottank.nl',
      },
    ],
    parkingSpecs:
      'Can accommodate 8 trucks simultaneously. Covered wash hall with 3 bays. Overhead clearance 4.5 m. Bay width 5.2 m — suitable for standard trucks and tankers up to 2.6 m wide. Articulated vehicle access confirmed.',
    waterSupply:
      'Mains water available. Static pressure: 6 bar. Flow rate: 15 L/min at wash bay. Softened water for final rinse. Water meter registered under permit DLF-2025-W-008.',
    powerSupply:
      '380 V three-phase available at wash bay. 16 A and 32 A CEE outlets at each bay. Power metered separately for wash operations.',
    wasteDisposal:
      'Interceptor pit on-site (2,000 L), compliant with Gemeente Delft municipal regulations. Emptied bi-monthly by Renewi. Effluent discharged to municipal drain under environmental licence DLF-EL-2024-055.',
    safetyRequirements:
      'Hi-vis vest required on entire site. No smoking within 50 m of tankers or wash area. Safety data sheets available for all cleaning products. MSDS folder at site manager office.',
    specialInstructions:
      'HACCP certification required for all food-grade tankers (dairy and beverage transport). Separate wash bay reserved for food-grade cleaning — must not be used for hazardous cargo vehicles. BTC to provide own HACCP-approved detergent.',
  },

  // ─── IN_PROGRESS — linked to portal-lead-002 (lead-002, LOCATION_MANUAL_PENDING) ─
  {
    id: 'manual-002-draft',
    leadId: 'lead-002',
    portalId: 'portal-lead-002',
    status: 'IN_PROGRESS',
    submittedAt: null,
    approvedAt: null,
    approvedBy: null,
    siteAddress: 'Distributieweg 7, 2988 DC Ridderkerk',
    accessInstructions: '',
    operatingHours: {
      monday:    '07:00–18:00',
      tuesday:   '07:00–18:00',
      wednesday: '07:00–18:00',
      thursday:  '07:00–18:00',
      friday:    '07:00–16:00',
      saturday:  'Closed',
      sunday:    'Closed',
    },
    contacts: [
      {
        role: 'Site Manager',
        name: 'Olaf Hendriksen',
        phone: '+31 6 25 33 44 55',
        email: 'o.hendriksen@hendriksencargo.nl',
      },
    ],
    parkingSpecs: '',
    waterSupply: '',
    powerSupply: '',
    wasteDisposal: '',
    safetyRequirements: '',
    specialInstructions: '',
  },
  // ─── APPROVED — Koelman Trucking B.V. (portal-client-001, client id=3) ──────
  {
    id: 'manual-koelman',
    leadId: null,
    portalId: 'portal-client-001',
    status: 'APPROVED',
    submittedAt: '2025-10-20T09:00:00Z',
    approvedAt: '2025-10-25T14:00:00Z',
    approvedBy: 1,
    siteAddress: 'Venrayseweg 103, 5928 RK Venlo',
    accessInstructions:
      'Main entrance via Venrayseweg. Gate code: 4412. Wash bay at rear of compound. Report to site office before proceeding.',
    operatingHours: {
      monday: '06:00–20:00', tuesday: '06:00–20:00', wednesday: '06:00–20:00',
      thursday: '06:00–20:00', friday: '06:00–18:00', saturday: '08:00–14:00', sunday: 'Closed',
    },
    contacts: [
      { role: 'Site Manager', name: 'Hendrik Koelman', phone: '+31 40 233 88 61', email: 'hendrik@koelmantruck.nl' },
      { role: 'Fleet Manager', name: 'Frank Dijk', phone: '+31 6 77 88 99 00', email: 'frank@koelmantruck.nl' },
    ],
    parkingSpecs: 'Capacity for 4 trucks. Overhead clearance 4.6 m. Two wash bays for standard trailers.',
    waterSupply: 'Municipal mains. Static pressure: 5.0 bar. Flow rate: 16 L/min.',
    powerSupply: '400 V three-phase, 25 A per bay.',
    wasteDisposal: 'Grease interceptor (2,500 L). Emptied quarterly by Van Gansewinkel.',
    safetyRequirements: 'Hi-vis vest and safety boots mandatory. No smoking on premises.',
    specialInstructions: 'Food-grade tankers require BTC-approved detergent. Photo documentation after each wash.',
  },

  // ─── APPROVED — Van den Berg Transport B.V. (portal-client-002, client id=1) ─
  {
    id: 'manual-vdb',
    leadId: null,
    portalId: 'portal-client-002',
    status: 'APPROVED',
    submittedAt: '2022-03-10T10:00:00Z',
    approvedAt: '2022-03-14T09:00:00Z',
    approvedBy: 1,
    siteAddress: 'Industrieweg 44, 5916 PK Venlo',
    accessInstructions:
      'Enter via main Industrieweg gate. Visitor badge from reception. Wash facility building D, south end.',
    operatingHours: {
      monday: '05:00–22:00', tuesday: '05:00–22:00', wednesday: '05:00–22:00',
      thursday: '05:00–22:00', friday: '05:00–20:00', saturday: '07:00–16:00', sunday: 'Closed',
    },
    contacts: [
      { role: 'Site Manager', name: 'Jan van den Berg', phone: '+31 6 11 22 33 44', email: 'jan@vandenbergtransport.nl' },
      { role: 'Fleet Manager', name: 'Rob Claessens', phone: '+31 6 22 33 44 55', email: 'fleet@vandenbergtransport.nl' },
    ],
    parkingSpecs: 'Capacity for 8 trucks. Covered wash hall with 4 bays. Overhead clearance 5.0 m.',
    waterSupply: 'Mains water. Static pressure: 6.5 bar. Flow rate: 20 L/min. Hot water boiler available.',
    powerSupply: '400 V three-phase, 32 A per bay. Generator backup available.',
    wasteDisposal: 'Industrial separator system. Discharge under permit VN-2022-0188.',
    safetyRequirements: 'Full PPE required. ISPS protocol applies.',
    specialInstructions: 'ADR-registered tankers require full hazmat wash protocol. HACCP food-grade cleaning for tankers.',
  },

  // ─── APPROVED — De Rijn Logistics B.V. (portal-client-003, client id=2) ────
  {
    id: 'manual-client-003',
    leadId: null,
    portalId: 'portal-client-003',
    status: 'APPROVED',
    submittedAt: '2021-11-05T10:00:00Z',
    approvedAt: '2021-11-07T14:00:00Z',
    approvedBy: 1,
    siteAddress: 'Waalhaven Oostzijde 55, 3087 BN Rotterdam',
    accessInstructions:
      'Port access via Waalhaven gate. Security badge required. Wash bay at dock 7.',
    operatingHours: {
      monday: '05:00–22:00', tuesday: '05:00–22:00', wednesday: '05:00–22:00',
      thursday: '05:00–22:00', friday: '05:00–20:00', saturday: '07:00–16:00', sunday: 'Closed',
    },
    contacts: [
      { role: 'Site Manager', name: 'Peter de Rijn', phone: '+31 10 444 77 88', email: 'peter@derijnlogistics.nl' },
      { role: 'Fleet Manager', name: 'Thomas Jansen', phone: '+31 6 44 55 66 77', email: 'fleet@derijnlogistics.nl' },
    ],
    parkingSpecs: 'Open-air platform. Capacity for 6 trucks. Turning circle for articulated lorries.',
    waterSupply: 'Port water supply, 6.5 bar pressure. Buffer tank 600 L.',
    powerSupply: '400 V three-phase, 32 A per bay.',
    wasteDisposal: 'Port Authority separator. Discharge under permit HA-RTM-2021-088.',
    safetyRequirements: 'Hi-vis vest, safety boots, hard hat mandatory.',
    specialInstructions: 'Bulk liquid tankers require full rinse certification.',
  },

  // ─── APPROVED — Hofstra Cargo (portal-client-004, client id=4) ─────────────
  {
    id: 'manual-client-004',
    leadId: null,
    portalId: 'portal-client-004',
    status: 'APPROVED',
    submittedAt: '2020-05-28T09:00:00Z',
    approvedAt: '2020-05-30T11:00:00Z',
    approvedBy: 1,
    siteAddress: 'Transportweg 8, 3198 LC Rotterdam',
    accessInstructions:
      'Enter via Transportweg main gate. Intercom at gate — press 2 for logistics. Wash hall building B.',
    operatingHours: {
      monday: '06:00–20:00', tuesday: '06:00–20:00', wednesday: '06:00–20:00',
      thursday: '06:00–20:00', friday: '06:00–18:00', saturday: '08:00–14:00', sunday: 'Closed',
    },
    contacts: [
      { role: 'Site Manager', name: 'Wietse Hofstra', phone: '+31 50 312 45 67', email: 'wietse@hofstracargo.nl' },
      { role: 'Planner', name: 'Bram Visser', phone: '+31 6 44 22 11 00', email: 'bram@hofstracargo.nl' },
    ],
    parkingSpecs: 'Capacity for 5 trucks. Covered wash hall with 2 bays. Overhead clearance 4.5 m.',
    waterSupply: 'Municipal mains. Static pressure: 5.5 bar. Flow rate: 15 L/min.',
    powerSupply: '380 V three-phase, 25 A per bay.',
    wasteDisposal: 'Interceptor pit (2,000 L). Emptied bi-monthly by Renewi.',
    safetyRequirements: 'Hi-vis vest and safety boots mandatory.',
    specialInstructions: 'Standard wash only. No ADR or food-grade requirements.',
  },

  // ─── APPROVED — Maas & Waal Vervoer (portal-client-005, client id=5) ──────
  {
    id: 'manual-client-005',
    leadId: null,
    portalId: 'portal-client-005',
    status: 'APPROVED',
    submittedAt: '2022-09-10T10:00:00Z',
    approvedAt: '2022-09-13T09:00:00Z',
    approvedBy: 2,
    siteAddress: 'Nijverheidsstraat 21, 6603 AB Wijchen',
    accessInstructions:
      'Main entrance via Nijverheidsstraat. Report to reception. Wash bay behind warehouse 3.',
    operatingHours: {
      monday: '06:00–18:00', tuesday: '06:00–18:00', wednesday: '06:00–18:00',
      thursday: '06:00–18:00', friday: '06:00–16:00', saturday: 'Closed', sunday: 'Closed',
    },
    contacts: [
      { role: 'Site Manager', name: 'Gerrit van Maas', phone: '+31 488 41 22 33', email: 'gerrit@maaswaalvervoer.nl' },
      { role: 'Fleet Manager', name: 'Liesbeth Hermsen', phone: '+31 6 99 00 11 22', email: 'fleet@maaswaalvervoer.nl' },
    ],
    parkingSpecs: 'Capacity for 4 trucks. Single covered wash bay. Overhead clearance 4.2 m.',
    waterSupply: 'Municipal mains. Static pressure: 4.5 bar. Flow rate: 14 L/min.',
    powerSupply: '400 V three-phase, 16 A per bay.',
    wasteDisposal: 'Interceptor pit (1,500 L). Emptied quarterly.',
    safetyRequirements: 'Hi-vis vest and safety boots required.',
    specialInstructions: 'Refrigerated units must have reefer powered off during wash.',
  },

  // ─── APPROVED — Vreugdenhil Logistics (portal-client-006, client id=6) ────
  {
    id: 'manual-client-006',
    leadId: null,
    portalId: 'portal-client-006',
    status: 'APPROVED',
    submittedAt: '2021-04-25T09:00:00Z',
    approvedAt: '2021-04-28T14:00:00Z',
    approvedBy: 1,
    siteAddress: 'Agrarisch Centrum 5, 3771 SK Barneveld',
    accessInstructions:
      'Enter via Agrarisch Centrum road. Gate code: 2288. Wash bay at south end of the yard.',
    operatingHours: {
      monday: '06:00–20:00', tuesday: '06:00–20:00', wednesday: '06:00–20:00',
      thursday: '06:00–20:00', friday: '06:00–18:00', saturday: '08:00–12:00', sunday: 'Closed',
    },
    contacts: [
      { role: 'Site Manager', name: 'Cor Vreugdenhil', phone: '+31 79 321 66 55', email: 'cor@vreugdenhillogistics.nl' },
      { role: 'Fleet Manager', name: 'Ruud Zonneveld', phone: '+31 6 77 66 55 44', email: 'fleet@vreugdenhillogistics.nl' },
    ],
    parkingSpecs: 'Capacity for 6 trucks. Covered wash hall with 3 bays. Overhead clearance 4.8 m.',
    waterSupply: 'Municipal mains. Static pressure: 5.8 bar. Flow rate: 18 L/min.',
    powerSupply: '400 V three-phase, 32 A per bay.',
    wasteDisposal: 'Grease interceptor (3,000 L). Certified by Gemeente Barneveld.',
    safetyRequirements: 'Hi-vis vest, safety boots. NVWA inspection compliance required.',
    specialInstructions: 'HACCP food-grade wash for all dairy transport vehicles. NVWA audit documentation required.',
  },

  // ─── APPROVED — Dijkstra Transport B.V. (portal-client-007, client id=7) ──
  {
    id: 'manual-client-007',
    leadId: null,
    portalId: 'portal-client-007',
    status: 'APPROVED',
    submittedAt: '2020-11-28T10:00:00Z',
    approvedAt: '2020-12-01T09:00:00Z',
    approvedBy: 2,
    siteAddress: 'Vliegveldweg 30, 5657 EA Eindhoven',
    accessInstructions:
      'Enter via Vliegveldweg. Security checkpoint at gate. Wash facility in building C.',
    operatingHours: {
      monday: '05:30–21:00', tuesday: '05:30–21:00', wednesday: '05:30–21:00',
      thursday: '05:30–21:00', friday: '05:30–19:00', saturday: '07:00–15:00', sunday: 'Closed',
    },
    contacts: [
      { role: 'Site Manager', name: 'Arno Dijkstra', phone: '+31 15 261 77 44', email: 'arno@dijkstratransport.nl' },
      { role: 'Fleet Manager', name: 'Patrick van Vliet', phone: '+31 6 55 44 33 22', email: 'fleet@dijkstratransport.nl' },
    ],
    parkingSpecs: 'Capacity for 7 trucks. 3 covered bays. Overhead clearance 5.0 m.',
    waterSupply: 'Mains water. Static pressure: 6.0 bar. Flow rate: 19 L/min. Hot water available.',
    powerSupply: '400 V three-phase, 32 A per bay. UPS backup.',
    wasteDisposal: 'Industrial separator. Discharge under permit EHV-2020-W-044.',
    safetyRequirements: 'Full PPE required. Airport proximity — no high-pressure spraying near perimeter fence.',
    specialInstructions: 'ADR specialist washing available. Crew of 2 minimum for hazmat vehicles.',
  },

  // ─── APPROVED — Noord-Brabant Cargo B.V. (portal-client-008, client id=8) ─
  {
    id: 'manual-client-008',
    leadId: null,
    portalId: 'portal-client-008',
    status: 'APPROVED',
    submittedAt: '2025-07-15T09:00:00Z',
    approvedAt: '2025-07-18T14:00:00Z',
    approvedBy: 3,
    siteAddress: 'Meerenakkerweg 22, 5652 AR Eindhoven',
    accessInstructions:
      'Main entrance Meerenakkerweg. Intercom at gate — press 1 for logistics. Wash bay at dock 3.',
    operatingHours: {
      monday: '06:00–20:00', tuesday: '06:00–20:00', wednesday: '06:00–20:00',
      thursday: '06:00–20:00', friday: '06:00–18:00', saturday: '08:00–14:00', sunday: 'Closed',
    },
    contacts: [
      { role: 'Site Manager', name: 'Theo van Gils', phone: '+31 73 640 22 11', email: 'theo@nbcargo.nl' },
      { role: 'Planner', name: 'Dennis Peeters', phone: '+31 6 66 55 44 33', email: 'planning@nbcargo.nl' },
    ],
    parkingSpecs: 'Capacity for 5 trucks. 2 covered bays. Overhead clearance 4.5 m.',
    waterSupply: 'Municipal mains. Static pressure: 5.2 bar. Flow rate: 15 L/min.',
    powerSupply: '380 V three-phase, 25 A per bay.',
    wasteDisposal: 'Interceptor pit (2,000 L). Emptied bi-monthly.',
    safetyRequirements: 'Hi-vis vest and safety boots mandatory.',
    specialInstructions: 'Standard and interior wash only. No hazmat capability on-site.',
  },

  // ─── APPROVED — Rijnmond Bulk Services (portal-client-009, client id=9) ────
  {
    id: 'manual-client-009',
    leadId: null,
    portalId: 'portal-client-009',
    status: 'APPROVED',
    submittedAt: '2023-05-18T10:00:00Z',
    approvedAt: '2023-05-21T09:00:00Z',
    approvedBy: 1,
    siteAddress: 'Botlekweg 181, 3199 LD Rotterdam',
    accessInstructions:
      'Enter via Botlekweg industrial gate. Port Authority pass required. Wash platform at berth 12.',
    operatingHours: {
      monday: '05:00–22:00', tuesday: '05:00–22:00', wednesday: '05:00–22:00',
      thursday: '05:00–22:00', friday: '05:00–22:00', saturday: '06:00–18:00', sunday: '08:00–16:00',
    },
    contacts: [
      { role: 'Site Manager', name: 'Klaas Verhoef', phone: '+31 10 591 44 00', email: 'klaas@rijnmondbulk.nl' },
      { role: 'Fleet Manager', name: 'Mirjam Timmermans', phone: '+31 6 88 77 66 55', email: 'fleet@rijnmondbulk.nl' },
    ],
    parkingSpecs: 'Open-air platform. Capacity for 8 tankers. No overhead obstruction. 25 m vehicle length accepted.',
    waterSupply: 'Port water supply, 7.5 bar. Dual-feed with 1,000 L buffer. Desalinated rinse water.',
    powerSupply: '400 V three-phase. Generator backup 200 kVA. IP67 outdoor sockets.',
    wasteDisposal: 'Port Authority separator. Discharge under permit HA-RTM-2023-055. Veolia waste collection.',
    safetyRequirements: 'Full PPE: hi-vis, boots, hard hat, chemical gloves. Port security pass required.',
    specialInstructions: 'All tankers must be degassed before wash. Gas-free certificate required on arrival. Bulk chemical wash available.',
  },

  // ─── APPROVED — Schuttersveld Tanktransport (portal-client-010, client id=10)
  {
    id: 'manual-client-010',
    leadId: null,
    portalId: 'portal-client-010',
    status: 'APPROVED',
    submittedAt: '2021-08-08T09:00:00Z',
    approvedAt: '2021-08-10T14:00:00Z',
    approvedBy: 2,
    siteAddress: 'Schuttersveld 12, 5233 DP Den Bosch',
    accessInstructions:
      'Main gate via Schuttersveld road. Visitor parking on the left. Wash facility at building E.',
    operatingHours: {
      monday: '06:00–20:00', tuesday: '06:00–20:00', wednesday: '06:00–20:00',
      thursday: '06:00–20:00', friday: '06:00–18:00', saturday: '08:00–14:00', sunday: 'Closed',
    },
    contacts: [
      { role: 'Site Manager', name: 'Frits Schuttersveld', phone: '+31 492 543 21 00', email: 'frits@schuttersveld.nl' },
      { role: 'Technical Service', name: 'Bart Nooijen', phone: '+31 6 22 44 66 88', email: 'techniek@schuttersveld.nl' },
    ],
    parkingSpecs: 'Capacity for 6 tankers. Covered hall with 3 bays. Overhead clearance 4.8 m.',
    waterSupply: 'Municipal mains. Static pressure: 5.5 bar. Flow rate: 17 L/min. Hot water boiler.',
    powerSupply: '400 V three-phase, 32 A per bay.',
    wasteDisposal: 'Grease interceptor (2,500 L). Certified by Gemeente Den Bosch.',
    safetyRequirements: 'Hi-vis vest, safety boots. ADR compliance for tank cleaning operations.',
    specialInstructions: 'Tank interiors require certified cleaning agents only. Residue sampling after each clean.',
  },

  // ─── APPROVED — Tilburg Express Logistics (portal-client-011, client id=11) ─
  {
    id: 'manual-client-011',
    leadId: null,
    portalId: 'portal-client-011',
    status: 'APPROVED',
    submittedAt: '2026-01-12T10:00:00Z',
    approvedAt: '2026-01-14T14:00:00Z',
    approvedBy: 1,
    siteAddress: 'Kempenbaan 55, 5022 BG Tilburg',
    accessInstructions:
      'Enter via Kempenbaan. Gate code: 6633. Wash bay at end of the loading dock area.',
    operatingHours: {
      monday: '07:00–19:00', tuesday: '07:00–19:00', wednesday: '07:00–19:00',
      thursday: '07:00–19:00', friday: '07:00–17:00', saturday: 'Closed', sunday: 'Closed',
    },
    contacts: [
      { role: 'Site Manager', name: 'Hugo Renders', phone: '+31 13 544 88 77', email: 'hugo@tilburgexpress.nl' },
      { role: 'Planner', name: 'Tom van Alphen', phone: '+31 6 99 88 77 66', email: 'planning@tilburgexpress.nl' },
    ],
    parkingSpecs: 'Capacity for 3 trucks. Single covered bay. Overhead clearance 4.2 m.',
    waterSupply: 'Municipal mains. Static pressure: 4.8 bar. Flow rate: 13 L/min.',
    powerSupply: '380 V three-phase, 16 A.',
    wasteDisposal: 'Interceptor pit (1,500 L). Emptied quarterly.',
    safetyRequirements: 'Hi-vis vest and safety boots required.',
    specialInstructions: 'Standard exterior wash only. Limited on-site facilities.',
  },

  // ─── APPROVED — Borger & Meester Tankvracht (portal-client-012, client id=12)
  {
    id: 'manual-client-012',
    leadId: null,
    portalId: 'portal-client-012',
    status: 'APPROVED',
    submittedAt: '2025-10-03T10:00:00Z',
    approvedAt: '2025-10-06T09:00:00Z',
    approvedBy: 1,
    siteAddress: 'Nieuwe Hemweg 6, 1013 BG Amsterdam',
    accessInstructions:
      'Enter via Nieuwe Hemweg. Port security gate — pass required. Wash facility at pier 4.',
    operatingHours: {
      monday: '05:00–22:00', tuesday: '05:00–22:00', wednesday: '05:00–22:00',
      thursday: '05:00–22:00', friday: '05:00–20:00', saturday: '07:00–16:00', sunday: '08:00–14:00',
    },
    contacts: [
      { role: 'Site Manager', name: 'Dirk Borger', phone: '+31 20 633 55 11', email: 'dirk@borgermeester.nl' },
      { role: 'Fleet Manager', name: 'Edwin de Jong', phone: '+31 6 77 55 33 11', email: 'fleet@borgermeester.nl' },
    ],
    parkingSpecs: 'Open-air platform. Capacity for 8 tankers. No height restriction. 25 m vehicle length.',
    waterSupply: 'Port water supply, 7.0 bar. Buffer tank 800 L. Desalinated final rinse.',
    powerSupply: '400 V three-phase, 32 A. Generator backup 150 kVA.',
    wasteDisposal: 'Port Authority separator. Discharge under permit HA-AMS-2025-077.',
    safetyRequirements: 'Full PPE: hi-vis, boots, hard hat, chemical gloves. Port security pass required.',
    specialInstructions: 'ADR class 1-9 tankers must be degassed. Gas-free certificate required. Chemical wash for food-grade tankers.',
  },
];

// Helper: find manual by portal ID
export function findManualByPortalId(portalId) {
  return locationManuals.find((m) => m.portalId === portalId) || null;
}

// Helper: find manual by lead ID
export function findManualByLeadId(leadId) {
  return locationManuals.find((m) => m.leadId === leadId) || null;
}
