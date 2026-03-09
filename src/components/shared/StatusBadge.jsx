import styles from './StatusBadge.module.css';

const LABELS = {
  active: 'Active',
  inactive: 'Inactive',
  pending: 'Pending',
};

export default function StatusBadge({ status = 'active' }) {
  return (
    <span className={`${styles.badge} ${styles[status]}`}>
      {LABELS[status] ?? status}
    </span>
  );
}
