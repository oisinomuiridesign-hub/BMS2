export const activities = [
  {
    id: 1,
    clientId: 1,
    type: 'note',
    title: 'Quarterly service check confirmed',
    content:
      'Spoke with Jan van den Berg regarding the Q1 service schedule. All four tanker trailers will be brought in on the 18th. He requested that the cleaning be completed before 14:00 as the trucks need to leave for Germany that afternoon.',
    authorName: 'Martijn de Vries',
    authorAvatar: 'MV',
    createdAt: '2026-02-14T09:22:00Z',
    replies: [
      {
        id: 101,
        content: 'Confirmed with the Venlo team. Slot reserved from 07:00–13:30.',
        authorName: 'Joost Hermans',
        createdAt: '2026-02-14T11:05:00Z',
      },
    ],
  },
  {
    id: 2,
    clientId: 1,
    type: 'complaint',
    title: 'Residue found in tank after cleaning',
    content:
      'Client reported that trailer #VDB-04 still had visible chemical residue after the last full clean. Jan van den Berg was understandably unhappy. We need to investigate the rinse procedure used by the team on that shift.',
    authorName: 'Sandra Koopman',
    authorAvatar: 'SK',
    createdAt: '2026-01-28T14:47:00Z',
    replies: [
      {
        id: 102,
        content:
          'Reviewed the shift log. The final rinse step was cut short due to a water pressure issue. Scheduling a re-clean at no charge.',
        authorName: 'Martijn de Vries',
        createdAt: '2026-01-29T08:30:00Z',
      },
      {
        id: 103,
        content: 'Re-clean completed and signed off by client. Case closed.',
        authorName: 'Sandra Koopman',
        createdAt: '2026-01-30T15:10:00Z',
      },
    ],
  },
  {
    id: 3,
    clientId: 2,
    type: 'note',
    title: 'New fleet agreement discussed',
    content:
      'Meeting with Thomas Jansen (Fleet Manager at De Rijn Logistics). They are expanding their fleet by 8 trailers in Q2 and want to add those to the existing framework agreement. Sent over updated pricing sheet.',
    authorName: 'Sandra Koopman',
    authorAvatar: 'SK',
    createdAt: '2026-02-20T10:00:00Z',
    replies: [],
  },
  {
    id: 4,
    clientId: 2,
    type: 'note',
    title: 'Invoice reminder sent — 32 days overdue',
    content:
      'Invoice #INV-2025-1184 remains unpaid at 32 days past due. Automated reminder sent on 10 Feb. Following up by phone today. Contact for invoices is Eline de Graaf.',
    authorName: 'Renske Bakker',
    authorAvatar: 'RB',
    createdAt: '2026-02-17T13:15:00Z',
    replies: [
      {
        id: 104,
        content: 'Reached Eline by phone. Payment to be processed by end of week.',
        authorName: 'Renske Bakker',
        createdAt: '2026-02-17T16:40:00Z',
      },
    ],
  },
  {
    id: 5,
    clientId: 3,
    type: 'note',
    title: 'Onboarding call completed',
    content:
      'Welcome call with Koelman Trucking completed. Owner Hendrik Koelman confirmed 6 trailers on the monthly plan. First cleaning session scheduled for 3 March. Location manuals sent via email.',
    authorName: 'Pieter van Loon',
    authorAvatar: 'PL',
    createdAt: '2026-02-24T09:45:00Z',
    replies: [],
  },
  {
    id: 6,
    clientId: 3,
    type: 'complaint',
    title: 'Scheduling conflict — trucks arrived late',
    content:
      "Koelman's trucks arrived 90 minutes after the agreed slot, causing a backlog for the afternoon. This is the second time this has happened. Raised with Planner Frank Dijk to ensure better coordination going forward.",
    authorName: 'Pieter van Loon',
    authorAvatar: 'PL',
    createdAt: '2025-12-11T16:20:00Z',
    replies: [
      {
        id: 105,
        content:
          'Frank Dijk apologised and confirmed they will align with our scheduling window. No compensation requested.',
        authorName: 'Pieter van Loon',
        createdAt: '2025-12-12T10:00:00Z',
      },
    ],
  },
  {
    id: 7,
    clientId: 4,
    type: 'note',
    title: 'Annual contract renewal signed',
    content:
      'Hofstra Cargo renewed their annual cleaning contract for 2026. 12 trailers covered under the new agreement. Pricing remains the same as 2025 with a 2.1% indexation clause. Contract uploaded to Files tab.',
    authorName: 'Sandra Koopman',
    authorAvatar: 'SK',
    createdAt: '2026-01-03T11:00:00Z',
    replies: [],
  },
  {
    id: 8,
    clientId: 4,
    type: 'note',
    title: 'New contact added — replacement planner',
    content:
      "Hofstra's previous planner Wim Hofstra retired. New contact is Bram Visser, reachable at +31 6 44 22 11 00. Updated contact list in the system.",
    authorName: 'Renske Bakker',
    authorAvatar: 'RB',
    createdAt: '2026-02-07T14:30:00Z',
    replies: [],
  },
  {
    id: 9,
    clientId: 5,
    type: 'complaint',
    title: 'Chemical smell reported after ADR clean',
    content:
      'Maas & Waal Vervoer driver Daan Pietersen reported a persistent chemical odour in the cab area after the ADR cleaning on trailer #MW-19. Investigating whether cross-contamination occurred during the process.',
    authorName: 'Joost Hermans',
    authorAvatar: 'JH',
    createdAt: '2025-11-22T08:55:00Z',
    replies: [
      {
        id: 106,
        content:
          'No cross-contamination found. Smell was from the standard solvent agent which dissipates within 24 hours. Informed client.',
        authorName: 'Martijn de Vries',
        createdAt: '2025-11-22T17:30:00Z',
      },
    ],
  },
  {
    id: 10,
    clientId: 5,
    type: 'note',
    title: 'Requested updated ADR certificate documentation',
    content:
      'Maas & Waal require updated ADR handling certificates from our team for their internal compliance records. Forwarded the request to HR. Deadline 1 December.',
    authorName: 'Martijn de Vries',
    authorAvatar: 'MV',
    createdAt: '2025-11-18T13:00:00Z',
    replies: [],
  },
  {
    id: 11,
    clientId: 6,
    type: 'note',
    title: 'Pilot programme — steam cleaning test',
    content:
      'Discussed with Vreugdenhil Logistics the possibility of piloting our new steam cleaning method on 2 of their food-grade tankers. They are interested. Proposal document sent on 21 Feb.',
    authorName: 'Anke Willems',
    authorAvatar: 'AW',
    createdAt: '2026-02-21T10:30:00Z',
    replies: [],
  },
  {
    id: 12,
    clientId: 6,
    type: 'note',
    title: 'HACCP compliance check passed',
    content:
      'Annual HACCP compliance inspection completed for Vreugdenhil Logistics food-grade tankers. All 8 trailers passed. Certificates issued and uploaded.',
    authorName: 'Anke Willems',
    authorAvatar: 'AW',
    createdAt: '2025-10-14T15:45:00Z',
    replies: [],
  },
  {
    id: 13,
    clientId: 7,
    type: 'complaint',
    title: 'Billing dispute — double charge on invoice',
    content:
      'Dijkstra Transport B.V. flagged invoice #INV-2025-0998 as containing a duplicate line item for trailer cleaning on 14 October. Verified internally — duplicate entry confirmed. Credit note issued.',
    authorName: 'Renske Bakker',
    authorAvatar: 'RB',
    createdAt: '2025-11-04T09:10:00Z',
    replies: [
      {
        id: 107,
        content: 'Credit note #CN-2025-0042 sent. Client confirmed receipt.',
        authorName: 'Renske Bakker',
        createdAt: '2025-11-05T11:00:00Z',
      },
    ],
  },
  {
    id: 14,
    clientId: 7,
    type: 'note',
    title: 'Expanded to 3 additional trailers',
    content:
      'Dijkstra Transport added 3 more bulk tankers to the service agreement as of 1 January 2026. Updated fleet count in the system from 9 to 12 trailers.',
    authorName: 'Martijn de Vries',
    authorAvatar: 'MV',
    createdAt: '2026-01-02T08:00:00Z',
    replies: [],
  },
  {
    id: 15,
    clientId: 8,
    type: 'note',
    title: 'First service completed — positive feedback',
    content:
      'Noord-Brabant Cargo had their inaugural service run at the Eindhoven facility. Driver and planner both expressed satisfaction with the turnaround time and cleanliness standard. Good start.',
    authorName: 'Lars Smeets',
    authorAvatar: 'LS',
    createdAt: '2025-09-08T12:00:00Z',
    replies: [],
  },
  {
    id: 16,
    clientId: 9,
    type: 'complaint',
    title: 'Access gate issue caused 45-minute delay',
    content:
      'Rijnmond Bulk Services truck was unable to access the Rotterdam facility due to a malfunctioning gate barrier. Driver waited 45 minutes. This is unacceptable and we have issued a service credit.',
    authorName: 'Sandra Koopman',
    authorAvatar: 'SK',
    createdAt: '2026-01-15T07:30:00Z',
    replies: [
      {
        id: 108,
        content: 'Gate repaired same day. Added to the preventive maintenance schedule.',
        authorName: 'Sandra Koopman',
        createdAt: '2026-01-15T14:00:00Z',
      },
    ],
  },
  {
    id: 17,
    clientId: 10,
    type: 'note',
    title: 'Contract extension — 18 months agreed',
    content:
      'Schuttersveld Tanktransport signed an 18-month extension on their existing agreement. They were happy with service quality in 2025. No pricing changes.',
    authorName: 'Pieter van Loon',
    authorAvatar: 'PL',
    createdAt: '2026-02-01T10:00:00Z',
    replies: [],
  },
  {
    id: 18,
    clientId: 10,
    type: 'note',
    title: 'Special request: nitrogen purge after clean',
    content:
      'Schuttersveld now requires nitrogen purging after each chemical tanker clean. Confirmed we can accommodate this at the Eindhoven site. Additional cost of €45 per trailer per visit added to agreement.',
    authorName: 'Pieter van Loon',
    authorAvatar: 'PL',
    createdAt: '2025-10-29T11:20:00Z',
    replies: [],
  },
  {
    id: 19,
    clientId: 11,
    type: 'note',
    title: 'Intake meeting — Tilburg Express',
    content:
      'Initial intake meeting with Tilburg Express Logistics. They run 5 dry bulk and 3 liquid tankers. Interested in bi-weekly cleaning at Amsterdam location. Sending proposal this week.',
    authorName: 'Renske Bakker',
    authorAvatar: 'RB',
    createdAt: '2026-02-11T14:00:00Z',
    replies: [],
  },
  {
    id: 20,
    clientId: 12,
    type: 'complaint',
    title: 'Damaged seal reported post-service',
    content:
      'Borger & Meester Tankvracht reported a cracked hatch seal on trailer #BM-07 discovered after cleaning. They claim it was damaged during the process. Reviewing CCTV from the service bay.',
    authorName: 'Anke Willems',
    authorAvatar: 'AW',
    createdAt: '2025-12-19T16:05:00Z',
    replies: [
      {
        id: 109,
        content:
          'CCTV review shows seal was already compromised on arrival. Shared footage with client. Liability dispute resolved — no claim.',
        authorName: 'Anke Willems',
        createdAt: '2025-12-20T09:50:00Z',
      },
    ],
  },
];
