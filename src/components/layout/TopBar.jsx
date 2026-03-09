import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import styles from './TopBar.module.css';

/**
 * TopBar
 *
 * Props:
 *   title       {string}              — Page title displayed large + uppercase
 *   breadcrumbs {Array<{label, path}>} — Breadcrumb trail; last item is current (no link)
 *   actions     {ReactNode}            — Buttons / controls rendered top-right
 */
export default function TopBar({ title, breadcrumbs = [], actions }) {
  return (
    <header className={styles.topBar}>
      {/* Left: title + breadcrumbs */}
      <div className={styles.left}>
        <h1 className={styles.title}>{title}</h1>

        {breadcrumbs.length > 0 && (
          <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
            {/* Home icon anchor */}
            <Link to="/" className={styles.breadcrumbHome} aria-label="Home">
              <Home size={13} strokeWidth={2} />
            </Link>

            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <span key={crumb.path ?? crumb.label} style={{ display: 'contents' }}>
                  <span className={styles.breadcrumbSep} aria-hidden="true">›</span>
                  {isLast || !crumb.path ? (
                    <span className={styles.breadcrumbCurrent}>{crumb.label}</span>
                  ) : (
                    <Link to={crumb.path} className={styles.breadcrumbLink}>
                      {crumb.label}
                    </Link>
                  )}
                </span>
              );
            })}
          </nav>
        )}
      </div>

      {/* Right: action buttons slot */}
      {actions && (
        <div className={styles.actions}>
          {actions}
        </div>
      )}
    </header>
  );
}
