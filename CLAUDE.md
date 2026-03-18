# BMS Prototype — Claude Code Context

## Project
High-fidelity interactive React prototype of the Basiq Management System (BMS) for a client pitch. Desktop only (1280px+), no backend — all data is hardcoded JSON fixtures. Reference screenshots: `docs/References/As Is/`.

## Tech Stack
React 18 + Vite + React Router v6 + CSS Modules + JavaScript (no TypeScript)

## Project Structure
```
src/
├── main.jsx / App.jsx
├── styles/          tokens.css, global.css
├── context/         PortalAuthContext.jsx
├── components/
│   ├── layout/      AppShell, Sidebar, TopBar
│   ├── shared/      AvatarInitials, Breadcrumbs, CustomButton, CustomDropdown,
│   │                CustomSearchBar, Modal, Pagination, StatusBadge,
│   │                LeadStatusBadge, Tabs
│   ├── domain/      ClientCard
│   └── portal/      PortalShell, CertificateModal
├── data/
│   ├── bms/         clients, employees, departments, activities
│   ├── leads/       leads, leadActivities
│   └── portal/      portals, agreements, vehicles, washRecords,
│                    certificates, locationManuals, approvalQueue
└── pages/
    ├── bms/         Home, ClientsOverview, ClientProfile, NewClient,
    │                DepartmentOverview, DepartmentCreate, DepartmentView,
    │                EmployeesOverview, NewEmployee, EmployeeView, Settings
    ├── leads/       LeadsOverview, LeadProfile
    └── portal/      PortalLogin, PortalRoute, PortalHome, PortalLocationManual,
                     PortalAgreement, PortalVehicles, PortalWashStatus,
                     PortalCertificates, PortalEmployeeDashboard
docs/                References/, brief and status docs, files.zip
```

## Navigation
```
/                    Home
/leads               LeadsOverview
/leads/:id           LeadProfile
/clients             ClientsOverview
/clients/new         NewClient
/clients/:id         ClientProfile (tabs: timeline | files | manuals | agreements | portal)
/departments         DepartmentOverview
/departments/new     DepartmentCreate
/departments/:id     DepartmentView
/employees           EmployeesOverview
/employees/new       NewEmployee
/employees/:id       EmployeeView
/settings            Settings
/portal/login        PortalLogin
/portal/:portalId/*  Portal app (home | manual | agreement | vehicles | wash-status | certificates | washes)
```

## Design Tokens
```css
:root {
  --primary-0: #004d78;      --primary-10: #0082ca;    --primary-20: #52bcf7;
  --primary-50: #e2f3f8;     --primary-60: #f3fafc;

  --neutral-0: #060b14;      --neutral-10: #12213d;    --neutral-20: #344667;
  --neutral-30: #8ca0c4;     --neutral-40: #cbd8f0;    --neutral-50: #dfe7f6;
  --neutral-60: #f3f5f9;     --neutral-70: #f9fafc;    --neutral-80: #fcfcfd;
  --neutral-100: #ffffff;

  --alert-warning-primary: #e09915;   --alert-warning-secondary: #fff6e5;
  --alert-error-primary: #ef6461;     --alert-error-secondary: #fdf2f2;
  --alert-success-primary: #27ae60;   --alert-success-secondary: #e8f8ef;

  --secondary-red-10: #ef6461;  --secondary-red-30: #fdf2f2;  --secondary-orange: #e09915;

  --text-light-primary: #f9fafc;  --text-dark-primary: #060b14;
  --text-dark-secondary: rgba(0,0,0,0.5);

  --radius-s: 4px;  --radius-m: 8px;  --radius-l: 12px;  --radius-100: 100px;

  --shadow-float: 0px 0px 20px 0px rgba(7,36,89,0.05);
  --shadow-card: 0 2px 8px rgba(7,36,89,0.06);
  --shadow-card-hover: 0 4px 16px rgba(7,36,89,0.10);

  --font-heading: 'Archivo', sans-serif;
  --font-body: 'Montserrat', sans-serif;
  --font-accent: 'Open Sans', sans-serif;

  --text-xs: 11px;  --text-sm: 14px;  --text-md: 16px;  --text-lg: 18px;
  --text-xl: 22px;  --text-xxl: 28px;
}
```

## Key Patterns
- **Sidebar**: dark navy (`--neutral-10`), logo + org switcher pill, nav icons, "Shrink Menu" toggle at bottom
- **TopBar**: large uppercase Archivo title, breadcrumbs, action buttons top-right, filter bar below (search + dropdowns + date range)
- **ClientCard grid**: 3-col, avatar initials circle, company name, address, status icons, contact info, blue accent bar at bottom
- **ClientProfile**: tabbed (Timeline | Files | Location Manuals | Agreements | Portal), left contact list grouped by role, centre activity feed

# currentDate
Today's date is 2026-03-17.
