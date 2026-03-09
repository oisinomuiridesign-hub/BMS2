import { Home, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './Breadcrumbs.module.css';

export default function Breadcrumbs({ items = [] }) {
  return (
    <nav className={styles.nav} aria-label="Breadcrumb">
      <ol className={styles.list}>
        <li className={styles.item}>
          <Link to="/" className={styles.link} aria-label="Home">
            <Home size={14} />
          </Link>
        </li>

        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={item.path ?? item.label} className={styles.item}>
              <ChevronRight size={14} className={styles.separator} />
              {isLast ? (
                <span className={styles.current}>{item.label}</span>
              ) : (
                <Link to={item.path} className={styles.link}>
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
