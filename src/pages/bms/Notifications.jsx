import { useState, useMemo } from 'react';
import { Home, ChevronRight, CheckCircle, XCircle, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationsContext';
import { NOTIFICATION_CATEGORIES } from '../../data/bms/notifications';
import NotificationCard from '../../components/domain/NotificationCard';
import CustomSearchBar from '../../components/shared/CustomSearchBar';
import CustomDropdown from '../../components/shared/CustomDropdown';
import Pagination from '../../components/shared/Pagination';
import Modal from '../../components/shared/Modal';
import styles from './Notifications.module.css';

const CATEGORY_TABS = [
  { id: 'ALL', label: 'All' },
  ...Object.entries(NOTIFICATION_CATEGORIES).map(([id, label]) => ({ id, label })),
];

const TYPE_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'TODO', label: 'To-Do' },
  { value: 'INFO', label: 'Informational' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'UNREAD', label: 'Unread' },
  { value: 'PENDING', label: 'Pending Action' },
  { value: 'RESOLVED', label: 'Resolved' },
];

export default function Notifications() {
  const {
    notifications,
    markAsRead,
    approveNotification,
    rejectNotification,
  } = useNotifications();

  // ── Filter state ──────────────────────────────────────────────────────────
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [createdByFilter, setCreatedByFilter] = useState('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // ── Reject modal state ────────────────────────────────────────────────────
  const [rejectModal, setRejectModal] = useState(null); // notif id
  const [rejectNotes, setRejectNotes] = useState('');

  // ── Toasts ────────────────────────────────────────────────────────────────
  const [toasts, setToasts] = useState([]);

  function addToast(message, type = 'success') {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4500);
  }

  // ── Created By options ────────────────────────────────────────────────────
  const createdByOptions = useMemo(() => {
    const names = [...new Set(notifications.map((n) => n.createdBy))].sort();
    return [{ value: '', label: 'All' }, ...names.map((n) => ({ value: n, label: n }))];
  }, [notifications]);

  // ── Category counts ───────────────────────────────────────────────────────
  const categoryCounts = useMemo(() => {
    const counts = { ALL: notifications.length };
    for (const key of Object.keys(NOTIFICATION_CATEGORIES)) {
      counts[key] = notifications.filter((n) => n.category === key).length;
    }
    return counts;
  }, [notifications]);

  // ── Filtering ─────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      if (activeCategory !== 'ALL' && n.category !== activeCategory) return false;
      if (typeFilter && n.type !== typeFilter) return false;
      if (statusFilter) {
        if (statusFilter === 'RESOLVED') {
          if (n.status !== 'APPROVED' && n.status !== 'REJECTED') return false;
        } else if (n.status !== statusFilter) {
          return false;
        }
      }
      if (createdByFilter && n.createdBy !== createdByFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        const match =
          n.name.toLowerCase().includes(q) ||
          n.description.toLowerCase().includes(q) ||
          n.entityName.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [notifications, activeCategory, typeFilter, statusFilter, createdByFilter, search]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  // Reset page when filters change
  function handleFilterChange(setter) {
    return (val) => { setter(val); setCurrentPage(1); };
  }

  // ── Action handlers ───────────────────────────────────────────────────────
  function handleApprove(id) {
    approveNotification(id);
    addToast('Change approved and applied to the client profile.', 'success');
  }

  function handleRejectOpen(id) {
    setRejectModal(id);
    setRejectNotes('');
  }

  function handleRejectConfirm() {
    if (rejectModal) {
      rejectNotification(rejectModal, rejectNotes);
      addToast('Change rejected. The planner will be notified.', 'error');
      setRejectModal(null);
      setRejectNotes('');
    }
  }

  function handleMarkAsRead(id) {
    markAsRead(id);
  }

  return (
    <div className={styles.page}>

      {/* ── Top bar ── */}
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <h1 className={styles.heading}>NOTIFICATIONS</h1>
          <nav className={styles.breadcrumbs}>
            <Link to="/" className={styles.breadcrumbLink}>
              <Home size={13} strokeWidth={2} />
            </Link>
            <ChevronRight size={12} strokeWidth={2} className={styles.breadcrumbSep} />
            <span className={styles.breadcrumbCurrent}>Notifications</span>
          </nav>
        </div>
        <div className={styles.topBarRight}>
          <CustomSearchBar
            value={search}
            onChange={handleFilterChange(setSearch)}
            placeholder="Search notifications..."
          />
        </div>
      </div>

      {/* ── Category tabs ── */}
      <div className={styles.categoryBar}>
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`${styles.categoryTab} ${activeCategory === tab.id ? styles.categoryTabActive : ''}`}
            onClick={() => { setActiveCategory(tab.id); setCurrentPage(1); }}
          >
            {tab.label}
            <span className={styles.categoryCount}>{categoryCounts[tab.id] ?? 0}</span>
          </button>
        ))}
      </div>

      {/* ── Content area ── */}
      <div className={styles.content}>

        {/* Left filter panel */}
        <aside className={styles.filterPanel}>
          <div className={styles.filterGroup}>
            <h4 className={styles.filterTitle}>Type</h4>
            {TYPE_OPTIONS.map((opt) => (
              <label key={opt.value} className={styles.radioLabel}>
                <input
                  type="radio"
                  name="typeFilter"
                  className={styles.radioInput}
                  checked={typeFilter === opt.value}
                  onChange={() => handleFilterChange(setTypeFilter)(opt.value)}
                />
                <span className={styles.radioText}>{opt.label}</span>
              </label>
            ))}
          </div>

          <div className={styles.filterGroup}>
            <h4 className={styles.filterTitle}>Status</h4>
            {STATUS_OPTIONS.map((opt) => (
              <label key={opt.value} className={styles.radioLabel}>
                <input
                  type="radio"
                  name="statusFilter"
                  className={styles.radioInput}
                  checked={statusFilter === opt.value}
                  onChange={() => handleFilterChange(setStatusFilter)(opt.value)}
                />
                <span className={styles.radioText}>{opt.label}</span>
              </label>
            ))}
          </div>

          <div className={styles.filterGroup}>
            <h4 className={styles.filterTitle}>Created By</h4>
            <CustomDropdown
              value={createdByFilter}
              onChange={handleFilterChange(setCreatedByFilter)}
              options={createdByOptions}
              placeholder="All"
            />
          </div>
        </aside>

        {/* Main notification list */}
        <div className={styles.main}>
          {paginated.length === 0 ? (
            <div className={styles.emptyState}>
              <Bell size={32} strokeWidth={1.5} style={{ color: 'var(--neutral-30)' }} />
              <p>No notifications match your filters.</p>
            </div>
          ) : (
            <div className={styles.list}>
              {paginated.map((n) => (
                <NotificationCard
                  key={n.id}
                  notification={n}
                  onApprove={handleApprove}
                  onReject={handleRejectOpen}
                  onMarkAsRead={handleMarkAsRead}
                />
              ))}
            </div>
          )}

          {filtered.length > perPage && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              perPage={perPage}
              onPageChange={setCurrentPage}
              onPerPageChange={(val) => { setPerPage(val); setCurrentPage(1); }}
            />
          )}
        </div>
      </div>

      {/* ── Reject confirmation modal ── */}
      <Modal
        isOpen={!!rejectModal}
        onClose={() => setRejectModal(null)}
        title="Reject Change"
      >
        <p className={styles.modalText}>
          Are you sure you want to reject this change? The planner will be notified.
        </p>
        <div className={styles.modalField}>
          <label className={styles.modalLabel}>Notes (optional)</label>
          <textarea
            className={styles.modalTextarea}
            rows={3}
            value={rejectNotes}
            onChange={(e) => setRejectNotes(e.target.value)}
            placeholder="Reason for rejection..."
          />
        </div>
        <div className={styles.modalActions}>
          <button
            type="button"
            className={styles.modalCancel}
            onClick={() => setRejectModal(null)}
          >
            Cancel
          </button>
          <button
            type="button"
            className={styles.modalReject}
            onClick={handleRejectConfirm}
          >
            <XCircle size={14} strokeWidth={2} />
            Reject Change
          </button>
        </div>
      </Modal>

      {/* ── Toasts ── */}
      <div className={styles.toastStack}>
        {toasts.map((toast) => (
          <div key={toast.id} className={`${styles.toast} ${toast.type === 'error' ? styles.toastError : ''}`}>
            {toast.type === 'error'
              ? <XCircle size={15} strokeWidth={2} style={{ flexShrink: 0 }} />
              : <CheckCircle size={15} strokeWidth={2} style={{ flexShrink: 0 }} />
            }
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}
