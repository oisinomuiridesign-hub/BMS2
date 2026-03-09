import { Routes, Route, Navigate } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import Home from './pages/Home'
import ClientsOverview from './pages/ClientsOverview'
import ClientProfile from './pages/ClientProfile'
import NewClient from './pages/NewClient'
import DepartmentOverview from './pages/DepartmentOverview'
import DepartmentCreate from './pages/DepartmentCreate'
import DepartmentView from './pages/DepartmentView'
import EmployeesOverview from './pages/EmployeesOverview'
import NewEmployee from './pages/NewEmployee'
import EmployeeView from './pages/EmployeeView'
import Settings from './pages/Settings'

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/clients" element={<ClientsOverview />} />
        <Route path="/clients/new" element={<NewClient />} />
        <Route path="/clients/:id" element={<ClientProfile />} />
        <Route path="/clients/:id/files" element={<ClientProfile initialTab="files" />} />
        <Route path="/clients/:id/manuals" element={<ClientProfile initialTab="manuals" />} />
        <Route path="/clients/:id/agreements" element={<ClientProfile initialTab="agreements" />} />
        <Route path="/departments" element={<DepartmentOverview />} />
        <Route path="/departments/new" element={<DepartmentCreate />} />
        <Route path="/departments/:id" element={<DepartmentView />} />
        <Route path="/employees" element={<EmployeesOverview />} />
        <Route path="/employees/new" element={<NewEmployee />} />
        <Route path="/employees/:id" element={<EmployeeView />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  )
}
