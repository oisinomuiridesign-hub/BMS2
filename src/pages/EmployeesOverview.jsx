import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, Plus } from 'lucide-react';
import { employees } from '../data/employees';
import { departments } from '../data/departments';
import AvatarInitials from '../components/shared/AvatarInitials';
import StatusBadge from '../components/shared/StatusBadge';
import CustomSearchBar from '../components/shared/CustomSearchBar';
import CustomButton from '../components/shared/CustomButton';
import CustomDropdown from '../components/shared/CustomDropdown';
import Pagination from '../components/shared/Pagination';
import styles from './EmployeesOverview.module.css';

const SKILL_LABELS = {
  FORKLIFT: 'Forklift',
  AERIAL_PL: 'Aerial Platform',
  CERTIFICATE: 'Certificate',
  FIRST_AID: 'First Aid',
  REMAINDER: 'Remainder',
};

const PER_PAGE_DEFAULT = 12;

export default function EmployeesOverview() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(PER_PAGE_DEFAULT);

  const filtered = employees.filter((emp) => {
    const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
    if (search && !fullName.includes(search.toLowerCase())) return false;
    if (statusFilter && emp.status !== statusFilter) return false;
    if (deptFilter && emp.department !== deptFilter) return false;
    if (skillFilter && !emp.skills.includes(skillFilter)) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const activeFilterCount = [search, statusFilter, deptFilter, paymentFilter, skillFilter].filter(Boolean).length;

  const deptOptions = [
    { value: '', label: 'All Departments' },
    ...departments.map((d) => ({ value: d.name, label: d.name })),
  ];

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];

  const paymentOptions = [
    { value: '', label: 'All' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'weekly', label: 'Weekly' },
  ];

  const skillOptions = [
    { value: '', label: 'All Skills' },
    ...Object.entries(SKILL_LABELS).map(([v, l]) => ({ value: v, label: l })),
  ];

  function getInitials(emp) {
    return `${emp.firstName[0]}${emp.lastName[0]}`;
  }

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <div>
          <h1 className={styles.heading}>EMPLOYEES</h1>
          <p className={styles.breadcrumbs}>
            <a href="/" className={styles.breadcrumbLink}>Home</a>
            <span className={styles.breadcrumbSep}>/</span>
            Employees
          </p>
        </div>
        <CustomButton
          variant="primary"
          icon={<Plus size={16} />}
          onClick={() => navigate('/employees/new')}
        >
          New Employee
        </CustomButton>
      </div>

      <div className={styles.filterBar}>
        <CustomSearchBar
          value={search}
          onChange={(v) => { setSearch(v); setPage(1); }}
          placeholder="Search by Employee Name"
        />
        <span className={styles.filterCount}>Selected Filters: {activeFilterCount}</span>
        <CustomDropdown
          value={statusFilter}
          onChange={(v) => { setStatusFilter(v); setPage(1); }}
          options={statusOptions}
          placeholder="Status"
        />
        <CustomDropdown
          value={paymentFilter}
          onChange={(v) => { setPaymentFilter(v); setPage(1); }}
          options={paymentOptions}
          placeholder="Payment by"
        />
        <CustomDropdown
          value={deptFilter}
          onChange={(v) => { setDeptFilter(v); setPage(1); }}
          options={deptOptions}
          placeholder="Department"
        />
        <CustomDropdown
          value={skillFilter}
          onChange={(v) => { setSkillFilter(v); setPage(1); }}
          options={skillOptions}
          placeholder="Skills"
        />
      </div>

      {paginated.length === 0 ? (
        <div className={styles.empty}>No employees match the current filters.</div>
      ) : (
        <div className={styles.grid}>
          {paginated.map((emp) => (
            <EmployeeCard
              key={emp.id}
              employee={emp}
              initials={getInitials(emp)}
              onClick={() => navigate(`/employees/${emp.id}`)}
            />
          ))}
        </div>
      )}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        perPage={perPage}
        onPageChange={setPage}
        onPerPageChange={(n) => { setPerPage(n); setPage(1); }}
      />
    </div>
  );
}

function EmployeeCard({ employee, initials, onClick }) {
  return (
    <div className={styles.card} onClick={onClick} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}>
      <div className={styles.cardTopRow}>
        <AvatarInitials initials={initials} color={employee.avatarColor} size="md" />
        <button
          className={styles.menuBtn}
          onClick={(e) => e.stopPropagation()}
          aria-label="Options"
        >
          <MoreVertical size={16} />
        </button>
      </div>

      <div className={styles.cardInfo}>
        <p className={styles.cardName}>{employee.firstName} {employee.lastName}</p>
        <p className={styles.cardRole}>{employee.role === 'basic' ? 'Basic User' : employee.role}</p>
        <p className={styles.cardDept}>{employee.department}</p>
      </div>

      <div className={styles.cardSkills}>
        {employee.skills.length > 0 ? (
          employee.skills.map((s) => (
            <span key={s} className={styles.skillPill}>{SKILL_LABELS[s] ?? s}</span>
          ))
        ) : (
          <span className={styles.skillPillEmpty}>No Skills Yet</span>
        )}
      </div>

      <div className={styles.cardFooter}>
        <StatusBadge status={employee.status} />
      </div>

      <div className={styles.accentBar} />
    </div>
  );
}
