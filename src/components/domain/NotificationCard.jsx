import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, ArrowRight, ExternalLink, Eye } from 'lucide-react';
import { NOTIFICATION_CATEGORIES } from '../../data/bms/notifications';
import styles from './NotificationCard.module.css';

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function NotificationCard({
  notification,
  onApprove,
  onReject,
  onMarkAsRead,
}) {
  const navigate = useNavigate();
  const n = notification;

  const isPending  = n.status === 'PENDING';
  const isApproved = n.status === 'APPROVED';
  const isRejected = n.status === 'REJECTED';
  const isUnread   = n.status === 'UNREAD' || n.status === 'PENDING';
  const isResolved = isApproved || isRejected;
  const isTodo     = n.type === 'TODO';

  return (
    <div className={`${styles.card} ${isUnread ? styles.unread : ''}`}>
      {/* Left colour bar */}
      <div className={`${styles.bar} ${isTodo ? styles.barTodo : styles.barInfo}`} />

      <div className={styles.body}>
        {/* ── Header row ────────────────────────────────────────────── */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            {isUnread && <span className={styles.dot} />}
            <h3 className={styles.name}>{n.name}</h3>
          </div>
          <div className={styles.badges}>
            <span className={`${styles.badge} ${isTodo ? styles.badgeTodo : styles.badgeInfo}`}>
              {isTodo ? 'To-Do' : 'Info'}
            </span>
            <span className={styles.badgeCat}>
              {NOTIFICATION_CATEGORIES[n.category] ?? n.category}
            </span>
          </div>
        </div>

        {/* ── Description ───────────────────────────────────────────── */}
        <p className={styles.description}>{n.description}</p>

        {/* ── Change detail (optional) ──────────────────────────────── */}
        {n.field && (
          <div className={styles.changeDetail}>
            <span className={styles.fieldLabel}>{n.field}</span>
            <div className={styles.changeValues}>
              <span className={styles.currentVal}>{n.currentValue}</span>
              <ArrowRight size={13} strokeWidth={2} className={styles.arrow} />
              <span className={styles.requestedVal}>{n.requestedValue}</span>
            </div>
          </div>
        )}

        {/* ── Meta row ──────────────────────────────────────────────── */}
        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <strong>{n.entityType === 'employee' ? 'Employee' : 'Client'}:</strong> {n.entityName}
          </span>
          <span className={styles.metaSep}>·</span>
          <span className={styles.metaItem}>
            <strong>Created by:</strong> {n.createdBy}
          </span>
          <span className={styles.metaSep}>·</span>
          <span className={styles.metaItem}>
            <strong>Roles:</strong> {n.roles.join(', ')}
          </span>
        </div>

        {/* ── Footer: date + actions ────────────────────────────────── */}
        <div className={styles.footer}>
          <span className={styles.date}>{formatDate(n.createdAt)}</span>

          <div className={styles.actions}>
            {/* Approve / Reject — only for actionable + pending */}
            {n.actionable && isPending && (
              <>
                <button
                  type="button"
                  className={styles.approveBtn}
                  onClick={() => onApprove(n.id)}
                >
                  <CheckCircle size={14} strokeWidth={2} />
                  Approve
                </button>
                <button
                  type="button"
                  className={styles.rejectBtn}
                  onClick={() => onReject(n.id)}
                >
                  <XCircle size={14} strokeWidth={2} />
                  Reject
                </button>
              </>
            )}

            {/* Resolved badge */}
            {isResolved && (
              <span className={`${styles.resolvedBadge} ${isApproved ? styles.resolvedApproved : styles.resolvedRejected}`}>
                {isApproved
                  ? <><CheckCircle size={13} strokeWidth={2} /> Approved</>
                  : <><XCircle size={13} strokeWidth={2} /> Rejected</>
                }
                {n.resolvedAt && (
                  <span className={styles.resolvedDate}>{formatDate(n.resolvedAt)}</span>
                )}
              </span>
            )}

            {/* Rejection reason */}
            {isRejected && n.resolvedNotes && (
              <div className={styles.rejectionNotes}>
                <strong>Reason:</strong> {n.resolvedNotes}
              </div>
            )}

            {/* Mark as Read — for unread info items */}
            {!n.actionable && n.status === 'UNREAD' && (
              <button
                type="button"
                className={styles.readBtn}
                onClick={() => onMarkAsRead(n.id)}
              >
                <Eye size={14} strokeWidth={2} />
                Mark as Read
              </button>
            )}

            {/* View link */}
            {n.locationPath && (
              <button
                type="button"
                className={styles.viewBtn}
                onClick={() => navigate(n.locationPath)}
              >
                <ExternalLink size={14} strokeWidth={2} />
                View
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
