import styles from './CustomButton.module.css';

export default function CustomButton({
  variant = 'primary',
  size = 'md',
  icon,
  onClick,
  children,
  disabled = false,
}) {
  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    disabled ? styles.disabled : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} onClick={onClick} disabled={disabled} type="button">
      {icon && <span className={styles.icon}>{icon}</span>}
      {children && <span>{children}</span>}
    </button>
  );
}
