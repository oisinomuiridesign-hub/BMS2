import { useState } from 'react';
import { Users, Building2, Briefcase, UserCheck, FileText, AlertCircle, CheckCircle, Clock, XCircle, MapPin, Truck, User, X, Bell } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { clients } from '../../data/bms/clients';
import { employees } from '../../data/bms/employees';
import { departments } from '../../data/bms/departments';
import { activities } from '../../data/bms/activities';
import { approvalQueue } from '../../data/portal/approvalQueue';
import { certificates } from '../../data/portal/certificates';
import { getPendingChangeRequests } from '../../data/bms/changeRequests';
import styles from './Home.module.css';
import approvalStyles from './HomeApprovals.module.css';

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function generateCertNumber() {
  const existing = certificates.map((c) => c.certNumber);
  const nums = existing.map((n) => parseInt(n.split('-')[2], 10)).filter(Boolean);
  const next = nums.length > 0 ? Math.max(...nums) + 1 : 4;
  return `BTC-2026-${String(next).padStart(3, '0')}`;
}

export default function Home() {
  const navigate = useNavigate();
  const pendingChangeCount = getPendingChangeRequests().length;

  const totalClients     = clients.length;
  const activeClients    = clients.filter((c) => c.status === 'active').length;
  const totalEmployees   = employees.length;
  const totalDepartments = departments.length;

  const recentActivities = [...activities]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const clientsByDept = departments.map((dept) => {
    const count = clients.filter((c) => c.departments.includes(dept.name)).length;
    const max   = Math.max(...departments.map((d) => clients.filter((cc) => cc.departments.includes(d.name)).length));
    return { ...dept, count, pct: max > 0 ? Math.round((count / max) * 100) : 0 };
  });

  const statCards = [
    { label: 'Total Clients',    value: totalClients,    icon: <Briefcase size={22} />,  color: 'var(--primary-10)' },
    { label: 'Active Clients',   value: activeClients,   icon: <UserCheck size={22} />,  color: 'var(--alert-success-primary)' },
    { label: 'Total Employees',  value: totalEmployees,  icon: <Users size={22} />,      color: 'var(--alert-warning-primary)' },
    { label: 'Departments',      value: totalDepartments, icon: <Building2 size={22} />, color: 'var(--alert-error-primary)' },
  ];

  // ─── Approval queue state ───────────────────────────────────────────────────
  const [queue, setQueue] = useState(approvalQueue);
  const [approveModal, setApproveModal] = useState(null);   // { item }
  const [rejectModal,  setRejectModal]  = useState(null);   // { item }
  const [rejectNotes,  setRejectNotes]  = useState('');
  const [toasts,       setToasts]       = useState([]);     // [{ id, message }]

  const pendingItems = queue.filter((a) => a.status === 'PENDING');

  function addToast(message) {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5000);
  }

  function handleApprove(item) {
    const certNum = generateCertNumber();
    setQueue((prev) =>
      prev.map((a) =>
        a.id === item.id
          ? { ...a, status: 'APPROVED', reviewedBy: 'Martijn de Vries', reviewedAt: new Date().toISOString(), generatedCertId: certNum }
          : a
      )
    );
    setApproveModal(null);
    addToast(`Certificate ${certNum} generated and published to the client portal.`);
  }

  function handleReject(item) {
    setQueue((prev) =>
      prev.map((a) =>
        a.id === item.id
          ? { ...a, status: 'REJECTED', reviewedBy: 'Martijn de Vries', reviewedAt: new Date().toISOString(), reviewNotes: rejectNotes }
          : a
      )
    );
    setRejectModal(null);
    setRejectNotes('');
    addToast('Changes requested. The employee will be notified.');
  }

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <div>
          <h1 className={styles.heading}>HOME</h1>
          <p className={styles.breadcrumbs}>Dashboard</p>
        </div>
        <button
          type="button"
          className={styles.bellBtn}
          onClick={() => navigate('/change-requests')}
          title={pendingChangeCount > 0 ? `${pendingChangeCount} pending change request${pendingChangeCount > 1 ? 's' : ''}` : 'No pending change requests'}
        >
          <Bell size={20} strokeWidth={1.8} />
          {pendingChangeCount > 0 && (
            <span className={styles.bellBadge}>{pendingChangeCount}</span>
          )}
        </button>
      </div>

      {/* ── Stat cards ── */}
      <div className={styles.statRow}>
        {statCards.map((card) => (
          <div key={card.label} className={styles.statCard}>
            <div className={styles.statIcon} style={{ color: card.color, background: `${card.color}18` }}>
              {card.icon}
            </div>
            <div className={styles.statText}>
              <span className={styles.statValue}>{card.value}</span>
              <span className={styles.statLabel}>{card.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Body row ── */}
      <div className={styles.bodyRow}>
        <div className={styles.panel}>
          <h2 className={styles.panelTitle}>Recent Activity</h2>
          <div className={styles.activityList}>
            {recentActivities.map((act) => {
              const client = clients.find((c) => c.id === act.clientId);
              return (
                <div key={act.id} className={styles.activityItem}>
                  <div className={styles.activityLeft}>
                    <span className={`${styles.typeBadge} ${act.type === 'complaint' ? styles.complaint : styles.note}`}>
                      {act.type === 'complaint' ? <AlertCircle size={11} /> : <FileText size={11} />}
                      {act.type}
                    </span>
                  </div>
                  <div className={styles.activityBody}>
                    <p className={styles.activityTitle}>{act.title}</p>
                    <p className={styles.activityMeta}>
                      {act.authorName}
                      {client && (
                        <Link to={`/clients/${client.id}`} className={styles.clientLink}>
                          {' · '}{client.companyName}
                        </Link>
                      )}
                    </p>
                  </div>
                  <span className={styles.activityDate}>{formatDate(act.createdAt)}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.panel}>
          <h2 className={styles.panelTitle}>Clients by Department</h2>
          <div className={styles.deptList}>
            {clientsByDept.map((dept) => (
              <div key={dept.id} className={styles.deptRow}>
                <div className={styles.deptHeader}>
                  <Link to={`/departments/${dept.id}`} className={styles.deptName}>{dept.name}</Link>
                  <span className={styles.deptCount}>{dept.count} clients</span>
                </div>
                <div className={styles.progressTrack}>
                  <div className={styles.progressFill} style={{ width: `${dept.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className={styles.quickLinks}>
            <h3 className={styles.quickLinksTitle}>Quick Links</h3>
            <div className={styles.quickLinksGrid}>
              <Link to="/clients/new" className={styles.quickLink}>+ New Client</Link>
              <Link to="/employees/new" className={styles.quickLink}>+ New Employee</Link>
              <Link to="/departments/new" className={styles.quickLink}>+ Create Department</Link>
              <Link to="/clients" className={styles.quickLink}>View All Clients</Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Pending Wash Approvals ── */}
      <div className={approvalStyles.approvalSection} style={{ marginTop: '32px' }}>
        <div className={approvalStyles.approvalHeader}>
          <div className={approvalStyles.approvalHeaderLeft}>
            <h2 className={approvalStyles.approvalTitle}>Pending Wash Approvals</h2>
            {pendingItems.length > 0 && (
              <span className={approvalStyles.pendingBadge}>{pendingItems.length}</span>
            )}
          </div>
          <p className={approvalStyles.approvalSubtitle}>
            Review employee-submitted wash reports and generate cleaning certificates for clients.
          </p>
        </div>

        {pendingItems.length === 0 ? (
          <div className={approvalStyles.emptyApprovals}>
            <CheckCircle size={28} strokeWidth={1.5} style={{ color: 'var(--alert-success-primary)' }} />
            <p>No pending approvals — all wash reports are up to date.</p>
          </div>
        ) : (
          <div className={approvalStyles.approvalList}>
            {queue.filter((a) => a.status !== 'REJECTED' || pendingItems.length === 0).map((item) => (
              <ApprovalCard
                key={item.id}
                item={item}
                onApprove={() => setApproveModal({ item })}
                onReject={() => { setRejectModal({ item }); setRejectNotes(''); }}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Approve confirmation modal ── */}
      {approveModal && (
        <div className={approvalStyles.modalOverlay} onClick={(e) => e.target === e.currentTarget && setApproveModal(null)}>
          <div className={approvalStyles.confirmModal}>
            <button className={approvalStyles.modalClose} onClick={() => setApproveModal(null)} type="button">
              <X size={16} strokeWidth={2} />
            </button>
            <div className={approvalStyles.confirmIcon}>
              <CheckCircle size={28} strokeWidth={1.8} style={{ color: 'var(--alert-success-primary)' }} />
            </div>
            <h3 className={approvalStyles.confirmTitle}>Approve Wash Report</h3>
            <p className={approvalStyles.confirmDesc}>
              Approving this report will auto-generate a cleaning certificate and publish it to the client portal for{' '}
              <strong>{approveModal.item.clientName}</strong>.
            </p>
            <div className={approvalStyles.confirmDetails}>
              <div className={approvalStyles.confirmRow}>
                <span>Date</span><span>{approveModal.item.date}</span>
              </div>
              <div className={approvalStyles.confirmRow}>
                <span>Employee</span><span>{approveModal.item.employeeName}</span>
              </div>
              <div className={approvalStyles.confirmRow}>
                <span>Vehicles completed</span>
                <span>{approveModal.item.vehiclesCompleted} of {approveModal.item.vehiclesTotal}</span>
              </div>
              {approveModal.item.vehiclesException > 0 && (
                <div className={approvalStyles.confirmRow} style={{ color: 'var(--alert-warning-primary)' }}>
                  <span>Exceptions</span><span>{approveModal.item.vehiclesException} vehicle(s)</span>
                </div>
              )}
            </div>
            <div className={approvalStyles.confirmActions}>
              <button
                className={approvalStyles.confirmCancelBtn}
                type="button"
                onClick={() => setApproveModal(null)}
              >
                Cancel
              </button>
              <button
                className={approvalStyles.confirmApproveBtn}
                type="button"
                onClick={() => handleApprove(approveModal.item)}
              >
                <CheckCircle size={15} strokeWidth={2} />
                Confirm Approval
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Reject / Request Changes modal ── */}
      {rejectModal && (
        <div className={approvalStyles.modalOverlay} onClick={(e) => e.target === e.currentTarget && setRejectModal(null)}>
          <div className={approvalStyles.confirmModal}>
            <button className={approvalStyles.modalClose} onClick={() => setRejectModal(null)} type="button">
              <X size={16} strokeWidth={2} />
            </button>
            <div className={approvalStyles.confirmIcon}>
              <XCircle size={28} strokeWidth={1.8} style={{ color: 'var(--alert-error-primary)' }} />
            </div>
            <h3 className={approvalStyles.confirmTitle}>Request Changes</h3>
            <p className={approvalStyles.confirmDesc}>
              Provide feedback to <strong>{rejectModal.item.employeeName}</strong> explaining what needs
              to be corrected before this report can be approved.
            </p>
            <textarea
              className={approvalStyles.notesTextarea}
              placeholder="Describe what changes are required..."
              value={rejectNotes}
              onChange={(e) => setRejectNotes(e.target.value)}
              rows={4}
            />
            <div className={approvalStyles.confirmActions}>
              <button
                className={approvalStyles.confirmCancelBtn}
                type="button"
                onClick={() => setRejectModal(null)}
              >
                Cancel
              </button>
              <button
                className={approvalStyles.confirmRejectBtn}
                type="button"
                onClick={() => handleReject(rejectModal.item)}
                disabled={!rejectNotes.trim()}
              >
                <XCircle size={15} strokeWidth={2} />
                Send Feedback
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast notifications ── */}
      <div className={approvalStyles.toastStack}>
        {toasts.map((toast) => (
          <div key={toast.id} className={approvalStyles.toast}>
            <CheckCircle size={16} strokeWidth={2} style={{ color: 'var(--alert-success-primary)', flexShrink: 0 }} />
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Approval card ────────────────────────────────────────────────────────────

function ApprovalCard({ item, onApprove, onReject }) {
  const isApproved = item.status === 'APPROVED';
  const isRejected = item.status === 'REJECTED';

  const borderColor = isApproved
    ? 'var(--alert-success-primary)'
    : isRejected
    ? 'var(--alert-error-primary)'
    : 'var(--primary-10)';

  return (
    <div
      className={approvalStyles.approvalCard}
      style={{ borderLeftColor: borderColor }}
    >
      {/* Card header */}
      <div className={approvalStyles.cardHeader}>
        <div className={approvalStyles.cardHeaderLeft}>
          <span className={approvalStyles.clientName}>{item.clientName}</span>
          <span className={approvalStyles.statusPip} style={{
            background: isApproved ? 'var(--alert-success-secondary)' : isRejected ? 'var(--alert-error-secondary)' : 'var(--primary-60)',
            color: isApproved ? 'var(--alert-success-primary)' : isRejected ? 'var(--alert-error-primary)' : 'var(--primary-0)',
            borderColor: isApproved ? 'rgba(39,174,96,0.2)' : isRejected ? 'rgba(239,100,97,0.2)' : 'var(--primary-50)',
          }}>
            {isApproved ? <CheckCircle size={10} strokeWidth={2} /> : isRejected ? <XCircle size={10} strokeWidth={2} /> : <Clock size={10} strokeWidth={2} />}
            {isApproved ? 'Approved' : isRejected ? 'Changes Requested' : 'Pending'}
          </span>
        </div>
        {isApproved && item.generatedCertId && (
          <span className={approvalStyles.certGeneratedPill}>
            Certificate {item.generatedCertId} generated
          </span>
        )}
      </div>

      {/* Meta row */}
      <div className={approvalStyles.cardMeta}>
        <span className={approvalStyles.metaItem}>
          <MapPin size={12} strokeWidth={2} />
          {item.location}
        </span>
        <span className={approvalStyles.metaItem}>
          <Clock size={12} strokeWidth={2} />
          {item.date}
        </span>
        <span className={approvalStyles.metaItem}>
          <User size={12} strokeWidth={2} />
          {item.employeeName}
        </span>
      </div>

      {/* Vehicles row */}
      <div className={approvalStyles.vehiclesRow}>
        <span className={approvalStyles.vehicleStat} style={{ color: 'var(--alert-success-primary)' }}>
          <CheckCircle size={13} strokeWidth={2} />
          {item.vehiclesCompleted} completed
        </span>
        <span className={approvalStyles.vehicleStatDivider} />
        <span className={approvalStyles.vehicleStat} style={{ color: 'var(--neutral-30)' }}>
          <Truck size={13} strokeWidth={2} />
          {item.vehiclesTotal} total
        </span>
        {item.vehiclesException > 0 && (
          <>
            <span className={approvalStyles.vehicleStatDivider} />
            <span className={approvalStyles.vehicleStat} style={{ color: 'var(--alert-warning-primary)' }}>
              <AlertCircle size={13} strokeWidth={2} />
              {item.vehiclesException} exception
            </span>
          </>
        )}
      </div>

      {/* Exception summary */}
      {item.exceptionSummary && (
        <div className={approvalStyles.exceptionNote}>
          <AlertCircle size={12} strokeWidth={2} style={{ flexShrink: 0, color: 'var(--alert-warning-primary)' }} />
          {item.exceptionSummary}
        </div>
      )}

      {/* Review notes (rejected) */}
      {isRejected && item.reviewNotes && (
        <div className={approvalStyles.reviewNotesBox}>
          <strong>Feedback sent:</strong> {item.reviewNotes}
        </div>
      )}

      {/* Action buttons (PENDING only) */}
      {!isApproved && !isRejected && (
        <div className={approvalStyles.cardActions}>
          <button
            className={approvalStyles.approveBtn}
            type="button"
            onClick={onApprove}
          >
            <CheckCircle size={14} strokeWidth={2} />
            Approve &amp; Generate Certificate
          </button>
          <button
            className={approvalStyles.rejectBtn}
            type="button"
            onClick={onReject}
          >
            <XCircle size={14} strokeWidth={2} />
            Request Changes
          </button>
        </div>
      )}
    </div>
  );
}
