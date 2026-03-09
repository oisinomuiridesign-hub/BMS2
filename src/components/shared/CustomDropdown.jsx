import { ChevronDown } from 'lucide-react';
import styles from './CustomDropdown.module.css';

export default function CustomDropdown({
  value,
  onChange,
  options = [],
  placeholder = 'Select…',
  label,
}) {
  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.selectWrapper}>
        <select
          className={styles.select}
          value={value ?? ''}
          onChange={(e) => onChange?.(e.target.value)}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className={styles.arrow} />
      </div>
    </div>
  );
}
