import { Search } from 'lucide-react';
import styles from './CustomSearchBar.module.css';

export default function CustomSearchBar({
  value = '',
  onChange,
  placeholder = 'Search…',
}) {
  return (
    <div className={styles.wrapper}>
      <Search size={16} className={styles.icon} />
      <input
        type="text"
        className={styles.input}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
