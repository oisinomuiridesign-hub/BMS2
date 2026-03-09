import styles from './AvatarInitials.module.css';

const SIZE_CLASS = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
};

export default function AvatarInitials({
  initials = '?',
  color = '#0082ca',
  size = 'md',
}) {
  return (
    <div
      className={`${styles.avatar} ${SIZE_CLASS[size] ?? styles.md}`}
      style={{ backgroundColor: color }}
    >
      <span className={styles.text}>{initials.slice(0, 2).toUpperCase()}</span>
    </div>
  );
}
