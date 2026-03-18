import { Routes, Route, Navigate } from 'react-router-dom'
import { PortalAuthProvider } from './context/PortalAuthContext'
import { ChangeRequestsProvider } from './context/ChangeRequestsContext'
import { DataProvider } from './context/DataContext'

// ── BMS pages ────────────────────────────────────────────────────────────────
import AppShell from './components/layout/AppShell'
import Home from './pages/bms/Home'
import ClientsOverview from './pages/bms/ClientsOverview'
import ClientProfile from './pages/bms/ClientProfile'
import NewClient from './pages/bms/NewClient'
import DepartmentOverview from './pages/bms/DepartmentOverview'
import DepartmentCreate from './pages/bms/DepartmentCreate'
import DepartmentView from './pages/bms/DepartmentView'
import EmployeesOverview from './pages/bms/EmployeesOverview'
import NewEmployee from './pages/bms/NewEmployee'
import EmployeeView from './pages/bms/EmployeeView'
import Settings from './pages/bms/Settings'
import ChangeRequests from './pages/bms/ChangeRequests'
import LeadsOverview from './pages/leads/LeadsOverview'
import LeadProfile from './pages/leads/LeadProfile'

// ── Portal pages ─────────────────────────────────────────────────────────────
import PortalLogin from './pages/portal/PortalLogin'
import PortalRoute from './pages/portal/PortalRoute'
import PortalHome from './pages/portal/PortalHome'
import PortalLocationManual from './pages/portal/PortalLocationManual'
import PortalAgreement from './pages/portal/PortalAgreement'
import PortalVehicles from './pages/portal/PortalVehicles'
import PortalWashStatus from './pages/portal/PortalWashStatus'
import PortalCertificates from './pages/portal/PortalCertificates'
import PortalEmployeeDashboard from './pages/portal/PortalEmployeeDashboard'
import PortalInvoices from './pages/portal/PortalInvoices'

export default function App() {
  return (
    <DataProvider>
    <ChangeRequestsProvider>
    <PortalAuthProvider>
      <Routes>
        {/* ── Portal routes — own layout, NO BMS sidebar ─────────────────── */}
        <Route path="/portal/login" element={<PortalLogin />} />

        {/*
          PortalRoute is the auth-guard wrapper. It renders PortalShell which
          uses <Outlet> — so all nested routes render inside the portal layout.
        */}
        <Route path="/portal/:portalId" element={<PortalRoute />}>
          <Route index element={<PortalHome />} />
          <Route path="manual"       element={<PortalLocationManual />} />
          <Route path="agreement"    element={<PortalAgreement />} />
          <Route path="vehicles"     element={<PortalVehicles />} />
          <Route path="wash-status"  element={<PortalWashStatus />} />
          <Route path="certificates" element={<PortalCertificates />} />
          <Route path="washes"       element={<PortalEmployeeDashboard />} />
          <Route path="invoices"     element={<PortalInvoices />} />
        </Route>

        {/* ── BMS routes — wrapped in AppShell (dark sidebar layout) ──────── */}
        <Route path="/*" element={
          <AppShell>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/leads" element={<LeadsOverview />} />
              <Route path="/leads/:id" element={<LeadProfile />} />
              <Route path="/clients" element={<ClientsOverview />} />
              <Route path="/clients/new" element={<NewClient />} />
              <Route path="/clients/:id" element={<ClientProfile />} />
              <Route path="/clients/:id/shifts" element={<ClientProfile initialTab="shifts" />} />
              <Route path="/clients/:id/agreements" element={<ClientProfile initialTab="agreements" />} />
              <Route path="/clients/:id/portal" element={<ClientProfile initialTab="portal" />} />
              <Route path="/departments" element={<DepartmentOverview />} />
              <Route path="/departments/new" element={<DepartmentCreate />} />
              <Route path="/departments/:id" element={<DepartmentView />} />
              <Route path="/employees" element={<EmployeesOverview />} />
              <Route path="/employees/new" element={<NewEmployee />} />
              <Route path="/employees/:id/shifts" element={<EmployeeView initialTab="shifts" />} />
              <Route path="/employees/:id" element={<EmployeeView />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/change-requests" element={<ChangeRequests />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppShell>
        } />
      </Routes>
    </PortalAuthProvider>
    </ChangeRequestsProvider>
    </DataProvider>
  )
}
