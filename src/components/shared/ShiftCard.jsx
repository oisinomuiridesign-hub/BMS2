import { useState } from 'react';
import { ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import styles from './ShiftCard.module.css';

function formatDate(isoString) {
  const d = new Date(isoString);
  return {
    day: String(d.getDate()).padStart(2, '0'),
    month: d.toLocaleString('en-GB', { month: 'short' }).toUpperCase(),
    full: d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
  };
}

const DETAIL_ROWS = [
  { label: 'User ID',       key: 'userId' },
  { label: 'Employee No.',  key: 'employeeNumber' },
  { label: 'Name',          key: 'employeeName' },
  { label: 'Date',          key: '_date' },
  { label: 'Day',           key: 'day' },
  { label: 'Start Time',    key: 'startTime' },
  { label: 'End Time',      key: 'endTime' },
  { label: 'Break',         key: 'breakDuration' },
  { label: 'Total Hours',   key: 'totalHours' },
  { label: 'Shift Name',    key: 'shiftName' },
  { label: 'Department',    key: 'department' },
  { label: 'Team',          key: 'team' },
  { label: 'Description',   key: 'description', full: true },
  { label: 'Schedule ID',   key: 'scheduleId' },
  { label: 'Shift ID',      key: 'id' },
  { label: 'Team ID',       key: 'teamId' },
  { label: 'Department ID', key: 'departmentId' },
  { label: 'Location ID',   key: 'locationId' },
];

export default function ShiftCard({ shift, isPast }) {
  const [expanded, setExpanded] = useState(false);
  const date = formatDate(shift.date);

  const statusClass =
    shift.status === 'upcoming'
      ? styles.statusUpcoming
      : shift.status === 'completed'
        ? styles.statusCompleted
        : styles.statusCancelled;

  const statusLabel =
    shift.status === 'upcoming'
      ? 'Upcoming'
      : shift.status === 'completed'
        ? 'Completed'
        : 'Cancelled';

  const detailValues = { ...shift, _date: date.full };

  return (
    <div className={`${styles.shiftCard} ${isPast ? styles.shiftCardPast : ''}`}>
      {/* ── Header row — click to expand ── */}
      <div
        className={styles.shiftHeader}
        onClick={() => setExpanded((v) => !v)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') setExpanded((v) => !v);
        }}
        aria-expanded={expanded}
      >
        {/* Date badge */}
        <div className={styles.dateBadge}>
          <span className={styles.dateBadgeDay}>{date.day}</span>
          <span className={styles.dateBadgeMonth}>{date.month}</span>
        </div>

        {/* Location title */}
        <div className={styles.headerMain}>
          <span className={styles.location}>{shift.location}</span>
        </div>

        {/* Status + Shiftbase link + chevron */}
        <div className={styles.headerRight}>
          <span className={`${styles.statusBadge} ${statusClass}`}>{statusLabel}</span>
          <a
            href={shift.shiftbaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.linkBtn}
            onClick={(e) => e.stopPropagation()}
            title="Open in Shiftbase"
            aria-label="Open shift in Shiftbase"
          >
            <ExternalLink size={14} />
          </a>
          {expanded
            ? <ChevronUp size={14} className={styles.chevron} />
            : <ChevronDown size={14} className={styles.chevron} />
          }
        </div>
      </div>

      {/* ── Expanded detail panel ── */}
      {expanded && (
        <div className={styles.shiftDetails}>
          <div className={styles.detailGrid}>
            {DETAIL_ROWS.map(({ label, key, full }) => (
              <div
                key={key}
                className={`${styles.detailRow} ${full ? styles.detailFull : ''}`}
              >
                <span className={styles.detailLabel}>{label}</span>
                <span className={styles.detailValue}>{detailValues[key] ?? '—'}</span>
              </div>
            ))}
          </div>

          <a
            href={shift.shiftbaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.shiftbaseBtn}
          >
            <ExternalLink size={14} />
            Open in Shiftbase
          </a>
        </div>
      )}
    </div>
  );
}
