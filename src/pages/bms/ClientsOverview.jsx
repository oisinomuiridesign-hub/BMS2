import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Download, Plus, Filter, Home, ChevronRight } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { departments } from '../../data/bms/departments';
import ClientCard from '../../components/domain/ClientCard';
import CustomButton from '../../components/shared/CustomButton';
import CustomSearchBar from '../../components/shared/CustomSearchBar';
import CustomDropdown from '../../components/shared/CustomDropdown';
import Pagination from '../../components/shared/Pagination';
import styles from './ClientsOverview.module.css';

const STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

export default function ClientsOverview() {
  const { clients } = useData();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(12);

  const departmentOptions = useMemo(() => {
    const base = [{ value: '', label: 'All Departments' }];
    departments.forEach((d) => base.push({ value: d.name, label: d.name }));
    return base;
  }, []);

  const filtered = useMemo(() => {
    return clients.filter((c) => {
      const nameMatch = c.companyName.toLowerCase().includes(search.toLowerCase());
      const statusMatch = statusFilter === '' || c.status === statusFilter;
      const deptMatch = departmentFilter === '' || c.departments.includes(departmentFilter);
      return nameMatch && statusMatch && deptMatch;
    });
  }, [search, statusFilter, departmentFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const activeFilterCount = [
    search !== '',
    statusFilter !== '',
    departmentFilter !== '',
  ].filter(Boolean).length;

  function handleSearchChange(val) {
    setSearch(val);
    setCurrentPage(1);
  }

  function handleStatusChange(val) {
    setStatusFilter(val);
    setCurrentPage(1);
  }

  function handleDeptChange(val) {
    setDepartmentFilter(val);
    setCurrentPage(1);
  }

  function handlePerPageChange(val) {
    setPerPage(val);
    setCurrentPage(1);
  }

  return (
    <div className={styles.page}>
      {/* ── Top Bar ── */}
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <h1 className={styles.pageTitle}>CLIENTS</h1>
          <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
            <Link to="/" className={styles.breadcrumbLink}>
              <Home size={14} />
            </Link>
            <ChevronRight size={14} className={styles.breadcrumbSep} />
            <span className={styles.breadcrumbCurrent}>Clients</span>
          </nav>
        </div>
        <div className={styles.topBarRight}>
          <CustomButton variant="secondary" icon={<Download size={15} />}>
            Export
          </CustomButton>
          <Link to="/clients/new" style={{ textDecoration: 'none' }}>
            <CustomButton variant="primary" icon={<Plus size={15} />}>
              New Client
            </CustomButton>
          </Link>
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div className={styles.filterBar}>
        <div className={styles.filterBarLeft}>
          <CustomSearchBar
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by Client Name"
          />
        </div>
        <div className={styles.filterBarRight}>
          <div className={styles.filterCounter}>
            <Filter size={14} className={styles.filterIcon} />
            <span>Selected Filters: {activeFilterCount}</span>
          </div>

          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Status</span>
            <CustomDropdown
              value={statusFilter}
              onChange={handleStatusChange}
              options={STATUS_OPTIONS}
              placeholder="All"
            />
          </div>

          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Department</span>
            <CustomDropdown
              value={departmentFilter}
              onChange={handleDeptChange}
              options={departmentOptions}
              placeholder="All Departments"
            />
          </div>

          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Created Date</span>
            <div className={styles.dateRange}>01/01/2023 – 09/03/2026</div>
          </div>
        </div>
      </div>

      {/* ── Card Grid ── */}
      <div className={styles.gridWrapper}>
        {paginated.length > 0 ? (
          <div className={styles.grid}>
            {paginated.map((client) => (
              <ClientCard key={client.id} client={client} />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <p>No clients match your filters.</p>
          </div>
        )}
      </div>

      {/* ── Pagination ── */}
      <div className={styles.paginationWrapper}>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          perPage={perPage}
          onPageChange={setCurrentPage}
          onPerPageChange={handlePerPageChange}
        />
      </div>
    </div>
  );
}
