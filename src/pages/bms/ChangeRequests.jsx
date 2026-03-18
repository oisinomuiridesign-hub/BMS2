import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, ChevronRight, ArrowRight, CheckCheck } from 'lucide-react';
import { useChangeRequests } from '../../context/ChangeRequestsContext';
import styles from './ChangeRequests.module.css';

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

const TABS = ['PENDING', 'APPROVED', 'REJECTED'];

const TAB_LABELS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
};

export default function ChangeRequests() {
  const navigate = useNavigate();
  const { requests, approveRequest, rejectRequest } = useChangeRequests();
  const [activeTab, setActiveTab] = useState('PENDING');
  const [toasts, setToasts] = useState([]);

  const counts = {
    PENDING:  requests.filter((r) => r.status === 'PENDING').length,
    APPROVED: requests.filter((r) => r.status === 'APPROVED').length,
    REJECTED: requests.filter((r) => r.status === 'REJECTED').length,
  };

  const filtered = requests.filter((r) => r.status === activeTab);

  function addToast(message, type = 'success') {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4500);
  }

  function handleApprove(e, id) {
    e.stopPropagation();
    approveRequest(id);
    addToast('Change approved and applied to the client profile.', 'success');
  }

  function handleReject(e, id) {
    e.stopPropagation();
    rejectRequest(id);
    addToast('Change rejected. The planner will be notified.', 'error');
  }

  return (
    <div className={styles.page}>

      {/* ── Top bar ── */}
      <div className={styles.topBar}>
        <div>
          <h1 className={styles.heading}>TASK MANAGER</h1>
          <p className={styles.breadcrumbs}>Home &rsaquo; Task Manager</p>
        </div>
      </div>

      {/* ── Filter tabs ── */}
      <div className={styles.tabs}>
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {TAB_LABELS[tab]}
            {counts[tab] > 0 && (
              <span className={`${styles.tabBadge} ${tab === 'PENDING' ? styles.tabBadgePending : tab === 'APPROVED' ? styles.tabBadgeApproved : styles.tabBadgeRejected}`}>
                {counts[tab]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Table ── */}
      <div className={styles.table}>

        {/* Column headers */}
        <div className={styles.tableHeader}>
          <div className={styles.colLocation}>Client / Location</div>
          <div className={styles.colChange}>Requested Change</div>
          <div className={styles.colActions}>Action</div>
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <CheckCheck size={28} strokeWidth={1.5} style={{ color: 'var(--alert-success-primary)' }} />
            <p>No {TAB_LABELS[activeTab].toLowerCase()} requests.</p>
          </div>
        ) : (
          filtered.map((req) => (
            <RequestRow
              key={req.id}
              req={req}
              onRowClick={() => navigate(req.locationPath)}
              onApprove={(e) => handleApprove(e, req.id)}
              onReject={(e) => handleReject(e, req.id)}
            />
          ))
        )}
      </div>

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

// ─── Row component ────────────────────────────────────────────────────────────

function RequestRow({ req, onRowClick, onApprove, onReject }) {
  const isPending  = req.status === 'PENDING';
  const isApproved = req.status === 'APPROVED';

  return (
    <div
      className={`${styles.row} ${isPending ? styles.rowClickable : ''}`}
      onClick={isPending ? onRowClick : undefined}
      role={isPending ? 'button' : undefined}
      tabIndex={isPending ? 0 : undefined}
      onKeyDown={isPending ? (e) => e.key === 'Enter' && onRowClick() : undefined}
    >
      {/* Col 1 — Client / Location */}
      <div className={styles.colLocation}>
        <div className={styles.clientName}>{req.clientName}</div>
        <div className={styles.locationPath}>
          {req.locationLabel}
          {isPending && <ChevronRight size={12} strokeWidth={2} className={styles.chevron} />}
        </div>
        <div className={styles.requester}>
          {req.requestedBy} &middot; {formatDate(req.requestedAt)}
        </div>
      </div>

      {/* Col 2 — Requested change */}
      <div className={styles.colChange}>
        <span className={styles.fieldLabel}>{req.field}</span>
        <div className={styles.changeValues}>
          <span className={styles.currentVal}>{req.currentValue}</span>
          <ArrowRight size={13} strokeWidth={2} className={styles.arrow} />
          <span className={styles.requestedVal}>{req.requestedValue}</span>
        </div>
        {req.description && (
          <p className={styles.changeDesc}>{req.description}</p>
        )}
      </div>

      {/* Col 3 — Actions */}
      <div className={styles.colActions} onClick={(e) => e.stopPropagation()}>
        {isPending ? (
          <div className={styles.actionBtns}>
            <button
              type="button"
              className={styles.approveBtn}
              onClick={onApprove}
              title="Approve change"
            >
              <CheckCircle size={14} strokeWidth={2} />
              Approve
            </button>
            <button
              type="button"
              className={styles.rejectBtn}
              onClick={onReject}
              title="Reject change"
            >
              <XCircle size={14} strokeWidth={2} />
              Reject
            </button>
          </div>
        ) : (
          <div className={`${styles.resolvedBadge} ${isApproved ? styles.resolvedApproved : styles.resolvedRejected}`}>
            {isApproved
              ? <><CheckCircle size={13} strokeWidth={2} /> Approved</>
              : <><XCircle size={13} strokeWidth={2} /> Rejected</>
            }
            {req.reviewedAt && (
              <span className={styles.resolvedDate}>{formatDate(req.reviewedAt)}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
