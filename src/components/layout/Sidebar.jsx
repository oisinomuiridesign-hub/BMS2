import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  UserSquare,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronDown,
  Target,
} from 'lucide-react';
import styles from './Sidebar.module.css';

const NAV_ITEMS = [
  { label: 'Home', icon: LayoutDashboard, to: '/' },
  { label: 'Leads', icon: Target, to: '/leads' },
  { label: 'Clients', icon: Users, to: '/clients' },
  { label: 'Department', icon: Building2, to: '/departments' },
  { label: 'Employees', icon: UserSquare, to: '/employees' },
];

const BOTTOM_NAV = [
  { label: 'Settings', icon: Settings, to: '/settings' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      {/* Logo */}
      <div className={styles.logoArea}>
        <div className={styles.logoWordmark}>
          <span className={styles.logoBasiq}>BASIQ</span>
          <span className={styles.logoManagement}>MANAGEMENT</span>
          <span className={styles.logoSystem}>SYSTEM</span>
          <span className={styles.logoTagline}>We simplify the job you hate</span>
        </div>
      </div>

      {/* Org Switcher */}
      <button className={styles.orgSwitcher} type="button" aria-label="Switch organisation">
        <span className={styles.orgAvatar}>BT</span>
        <span className={styles.orgName}>Basiq Truckcleaning B.V.</span>
        <ChevronDown className={styles.orgChevron} size={14} strokeWidth={2.5} />
      </button>

      {/* Main Nav */}
      <nav className={styles.nav} aria-label="Main navigation">
        <div className={styles.navSection}>
          <div className={styles.navLabel}>Menu</div>

          {NAV_ITEMS.map(({ label, icon: Icon, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              data-label={label}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
            >
              <Icon className={styles.navIcon} size={18} strokeWidth={1.8} />
              <span className={styles.navText}>{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Bottom Nav */}
      <div className={styles.sidebarBottom}>
        {BOTTOM_NAV.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={to}
            to={to}
            data-label={label}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
          >
            <Icon className={styles.navIcon} size={18} strokeWidth={1.8} />
            <span className={styles.navText}>{label}</span>
          </NavLink>
        ))}

        <button
          type="button"
          data-label="Expand"
          className={`${styles.navItem} ${styles.logoutBtn}`}
          onClick={() => {}}
          aria-label="Logout"
        >
          <LogOut className={styles.navIcon} size={18} strokeWidth={1.8} />
          <span className={styles.navText}>Logout</span>
        </button>

        {/* Shrink Toggle */}
        <button
          type="button"
          className={styles.shrinkToggle}
          onClick={() => setCollapsed((prev) => !prev)}
          aria-label={collapsed ? 'Expand menu' : 'Shrink menu'}
        >
          <ChevronLeft className={styles.shrinkIcon} size={16} strokeWidth={2} />
          <span className={styles.shrinkText}>Shrink Menu</span>
        </button>
      </div>
    </aside>
  );
}
