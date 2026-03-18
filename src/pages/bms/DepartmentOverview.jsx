import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, Plus, Phone } from 'lucide-react';
import { departments } from '../../data/bms/departments';
import AvatarInitials from '../../components/shared/AvatarInitials';
import StatusBadge from '../../components/shared/StatusBadge';
import CustomSearchBar from '../../components/shared/CustomSearchBar';
import CustomButton from '../../components/shared/CustomButton';
import CustomDropdown from '../../components/shared/CustomDropdown';
import Pagination from '../../components/shared/Pagination';
import styles from './DepartmentOverview.module.css';

const DEPT_COLORS = {
  Venlo: '#0082ca',
  Rotterdam: '#27ae60',
  Eindhoven: '#e09915',
  Amsterdam: '#ef6461',
};

function getDeptColor(name) {
  return DEPT_COLORS[name] ?? '#344667';
}

const PER_PAGE_DEFAULT = 12;

export default function DepartmentOverview() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(PER_PAGE_DEFAULT);

  const filtered = departments.filter((dept) => {
    if (search && !dept.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter && dept.status !== statusFilter) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const activeFilterCount = [search, statusFilter].filter(Boolean).length;

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <div>
          <h1 className={styles.heading}>DEPARTMENTS</h1>
          <p className={styles.breadcrumbs}>
            <a href="/" className={styles.breadcrumbLink}>Home</a>
            <span className={styles.breadcrumbSep}>/</span>
            Departments
          </p>
        </div>
        <CustomButton
          variant="primary"
          icon={<Plus size={16} />}
          onClick={() => navigate('/departments/new')}
        >
          Create Department
        </CustomButton>
      </div>

      <div className={styles.filterBar}>
        <CustomSearchBar
          value={search}
          onChange={(v) => { setSearch(v); setPage(1); }}
          placeholder="Search department"
        />
        <span className={styles.filterCount}>Selected Filters: {activeFilterCount}</span>
        <CustomDropdown
          value={statusFilter}
          onChange={(v) => { setStatusFilter(v); setPage(1); }}
          options={statusOptions}
          placeholder="Status"
        />
      </div>

      {paginated.length === 0 ? (
        <div className={styles.empty}>No departments match the current filters.</div>
      ) : (
        <div className={styles.grid}>
          {paginated.map((dept) => (
            <DepartmentCard
              key={dept.id}
              department={dept}
              color={getDeptColor(dept.name)}
              onClick={() => navigate(`/departments/${dept.id}`)}
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

function DepartmentCard({ department, color, onClick }) {
  const truncatedAddress = department.address.length > 42
    ? department.address.slice(0, 42) + '…'
    : department.address;

  return (
    <div className={styles.card} onClick={onClick} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}>
      <div className={styles.cardTopRow}>
        <AvatarInitials initials={department.name[0]} color={color} size="lg" />
        <div className={styles.cardTopRight}>
          <StatusBadge status={department.status} />
          <button
            className={styles.menuBtn}
            onClick={(e) => e.stopPropagation()}
            aria-label="Options"
          >
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      <div className={styles.cardInfo}>
        <p className={styles.cardName}>{department.name}</p>
        <p className={styles.cardAddress}>{truncatedAddress}</p>
      </div>

      <div className={styles.contactRow}>
        <span className={styles.contactLabel}>Contact Person</span>
        <p className={styles.contactName}>{department.contactPerson}</p>
        <div className={styles.phoneRow}>
          <Phone size={12} className={styles.phoneIcon} />
          <span className={styles.phoneNum}>{department.phone}</span>
        </div>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.stat}>
          <span className={styles.statNum}>{department.employeeCount}</span>
          <span className={styles.statLabel}>Employees</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.stat}>
          <span className={styles.statNum}>{department.clientCount}</span>
          <span className={styles.statLabel}>Clients</span>
        </div>
      </div>

      <div className={styles.accentBar} />
    </div>
  );
}
