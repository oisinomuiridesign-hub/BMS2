import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Download,
  Plus,
  Filter,
  Home,
  ChevronRight,
  Building2,
  User,
  MapPin,
  Calendar,
  Clock,
  X,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import LeadStatusBadge from '../../components/shared/LeadStatusBadge';
import CustomButton from '../../components/shared/CustomButton';
import CustomSearchBar from '../../components/shared/CustomSearchBar';
import CustomDropdown from '../../components/shared/CustomDropdown';
import Pagination from '../../components/shared/Pagination';
import Modal from '../../components/shared/Modal';
import AvatarInitials from '../../components/shared/AvatarInitials';
import styles from './LeadsOverview.module.css';

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'CAPTURED', label: 'Captured' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'DETAILS_SUBMITTED', label: 'Details Submitted' },
  { value: 'UNDER_REVIEW', label: 'Under Review' },
  { value: 'PROPOSAL_SENT', label: 'Proposal Sent' },
  { value: 'AWAITING_ACCEPTANCE', label: 'Awaiting Acceptance' },
  { value: 'CONVERTED', label: 'Converted' },
  { value: 'LOST', label: 'Lost' },
];

const SOURCE_LABELS = {
  WEBSITE_FORM: 'Website Form',
  PHONE: 'Phone',
  EMAIL: 'Email',
  REFERRAL: 'Referral',
  MANUAL: 'Manual',
};

const SOURCE_OPTIONS = [
  { value: '', label: 'All Sources' },
  { value: 'WEBSITE_FORM', label: 'Website Form' },
  { value: 'PHONE', label: 'Phone' },
  { value: 'EMAIL', label: 'Email' },
  { value: 'REFERRAL', label: 'Referral' },
  { value: 'MANUAL', label: 'Manual' },
];

function formatDate(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatRelativeDate(isoString) {
  if (!isoString) return '—';
  const now = new Date();
  const then = new Date(isoString);
  const diffDays = Math.floor((now - then) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
}

// ── New Lead Modal ──────────────────────────────────────────────────────────

const LEAD_SOURCE_FORM_OPTIONS = [
  { value: 'WEBSITE_FORM', label: 'Website Form' },
  { value: 'PHONE', label: 'Phone' },
  { value: 'EMAIL', label: 'Email' },
  { value: 'REFERRAL', label: 'Referral' },
  { value: 'MANUAL', label: 'Manual Entry' },
];

function NewLeadModal({ isOpen, onClose }) {
  const [form, setForm] = useState({
    companyName: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    location: '',
    leadSource: 'WEBSITE_FORM',
  });

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit() {
    // Cosmetic — no real submit logic
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Lead">
      <div className={styles.modalForm}>
        <div className={styles.modalField}>
          <label className={styles.modalLabel}>Company Name</label>
          <input
            className={styles.modalInput}
            type="text"
            placeholder="e.g. Van den Berg Transport B.V."
            value={form.companyName}
            onChange={(e) => handleChange('companyName', e.target.value)}
          />
        </div>

        <div className={styles.modalRow}>
          <div className={styles.modalField}>
            <label className={styles.modalLabel}>Contact Person</label>
            <input
              className={styles.modalInput}
              type="text"
              placeholder="Full name"
              value={form.contactPerson}
              onChange={(e) => handleChange('contactPerson', e.target.value)}
            />
          </div>
          <div className={styles.modalField}>
            <label className={styles.modalLabel}>Phone</label>
            <input
              className={styles.modalInput}
              type="tel"
              placeholder="+31 6 00 00 00 00"
              value={form.contactPhone}
              onChange={(e) => handleChange('contactPhone', e.target.value)}
            />
          </div>
        </div>

        <div className={styles.modalField}>
          <label className={styles.modalLabel}>Email Address</label>
          <input
            className={styles.modalInput}
            type="email"
            placeholder="contact@company.nl"
            value={form.contactEmail}
            onChange={(e) => handleChange('contactEmail', e.target.value)}
          />
        </div>

        <div className={styles.modalField}>
          <label className={styles.modalLabel}>Site Location</label>
          <input
            className={styles.modalInput}
            type="text"
            placeholder="Street, postcode, city"
            value={form.location}
            onChange={(e) => handleChange('location', e.target.value)}
          />
        </div>

        <div className={styles.modalField}>
          <label className={styles.modalLabel}>Lead Source</label>
          <select
            className={styles.modalSelect}
            value={form.leadSource}
            onChange={(e) => handleChange('leadSource', e.target.value)}
          >
            {LEAD_SOURCE_FORM_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.modalActions}>
          <button className={styles.modalCancelBtn} type="button" onClick={onClose}>
            Cancel
          </button>
          <button className={styles.modalSubmitBtn} type="button" onClick={handleSubmit}>
            Create Lead
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────

export default function LeadsOverview() {
  const navigate = useNavigate();
  const { leads } = useData();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);

  const filtered = useMemo(() => {
    return leads.filter((lead) => {
      const nameMatch = lead.companyName.toLowerCase().includes(search.toLowerCase()) ||
        lead.contactPerson.toLowerCase().includes(search.toLowerCase());
      const statusMatch = statusFilter === '' || lead.status === statusFilter;
      const sourceMatch = sourceFilter === '' || lead.leadSource === sourceFilter;
      return nameMatch && statusMatch && sourceMatch;
    });
  }, [search, statusFilter, sourceFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const activeFilterCount = [
    search !== '',
    statusFilter !== '',
    sourceFilter !== '',
  ].filter(Boolean).length;

  function handleSearchChange(val) {
    setSearch(val);
    setCurrentPage(1);
  }

  function handleStatusChange(val) {
    setStatusFilter(val);
    setCurrentPage(1);
  }

  function handleSourceChange(val) {
    setSourceFilter(val);
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
          <h1 className={styles.pageTitle}>LEADS</h1>
          <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
            <Link to="/" className={styles.breadcrumbLink}>
              <Home size={14} />
            </Link>
            <ChevronRight size={14} className={styles.breadcrumbSep} />
            <span className={styles.breadcrumbCurrent}>Leads</span>
          </nav>
        </div>
        <div className={styles.topBarRight}>
          <CustomButton variant="secondary" icon={<Download size={15} />}>
            Export
          </CustomButton>
          <CustomButton
            variant="primary"
            icon={<Plus size={15} />}
            onClick={() => setShowNewLeadModal(true)}
          >
            Add Lead
          </CustomButton>
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div className={styles.filterBar}>
        <div className={styles.filterBarLeft}>
          <CustomSearchBar
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by company or contact name"
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
              placeholder="All Statuses"
            />
          </div>

          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Source</span>
            <CustomDropdown
              value={sourceFilter}
              onChange={handleSourceChange}
              options={SOURCE_OPTIONS}
              placeholder="All Sources"
            />
          </div>

          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Created Date</span>
            <div className={styles.dateRange}>01/10/2025 – 10/03/2026</div>
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className={styles.tableWrapper}>
        {paginated.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr className={styles.tableHead}>
                <th className={styles.thCompany}>
                  <span className={styles.thInner}>
                    <Building2 size={13} className={styles.thIcon} />
                    Company Name
                  </span>
                </th>
                <th className={styles.thContact}>
                  <span className={styles.thInner}>
                    <User size={13} className={styles.thIcon} />
                    Contact Person
                  </span>
                </th>
                <th className={styles.thLocation}>
                  <span className={styles.thInner}>
                    <MapPin size={13} className={styles.thIcon} />
                    Location
                  </span>
                </th>
                <th className={styles.thStatus}>Status</th>
                <th className={styles.thDate}>
                  <span className={styles.thInner}>
                    <Calendar size={13} className={styles.thIcon} />
                    Date Created
                  </span>
                </th>
                <th className={styles.thActivity}>
                  <span className={styles.thInner}>
                    <Clock size={13} className={styles.thIcon} />
                    Last Activity
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((lead) => (
                <tr
                  key={lead.id}
                  className={styles.tableRow}
                  onClick={() => navigate(`/leads/${lead.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/leads/${lead.id}`); }}
                >
                  <td className={styles.tdCompany}>
                    <div className={styles.companyCell}>
                      <AvatarInitials
                        initials={lead.avatarInitials}
                        color={lead.avatarColor}
                        size="sm"
                      />
                      <span className={styles.companyName}>{lead.companyName}</span>
                    </div>
                  </td>
                  <td className={styles.tdContact}>
                    <span className={styles.contactName}>{lead.contactPerson}</span>
                    <span className={styles.contactSource}>{SOURCE_LABELS[lead.leadSource]}</span>
                  </td>
                  <td className={styles.tdLocation}>
                    <span className={styles.locationText}>{lead.location}</span>
                  </td>
                  <td className={styles.tdStatus}>
                    <LeadStatusBadge status={lead.status} />
                  </td>
                  <td className={styles.tdDate}>
                    {formatDate(lead.createdAt)}
                  </td>
                  <td className={styles.tdActivity}>
                    <span className={styles.relativeDate}>{formatRelativeDate(lead.lastActivity)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={styles.empty}>
            <p>No leads match your filters.</p>
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

      {/* ── New Lead Modal ── */}
      <NewLeadModal
        isOpen={showNewLeadModal}
        onClose={() => setShowNewLeadModal(false)}
      />
    </div>
  );
}
