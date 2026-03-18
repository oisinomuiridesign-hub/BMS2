import { NavLink, Outlet, useParams } from 'react-router-dom';
import {
  LayoutDashboard,
  FilePen,
  FileText,
  Truck,
  Receipt,
  Award,
  Droplets,
  CalendarCheck,
  LogOut,
  Lock,
  ChevronRight,
} from 'lucide-react';
import { usePortalAuth } from '../../context/PortalAuthContext';
import { findPortalById } from '../../data/portal/portals';
import styles from './PortalShell.module.css';

// ─── Stage engine ─────────────────────────────────────────────────────────────
const STAGE_ORDER = ['INTAKE', 'CONTRACT_REVIEW', 'VEHICLE_ASSIGNMENT', 'OPERATIONAL', 'ACTIVE'];

const STAGE_LABELS = {
  INTAKE:              'Intake',
  CONTRACT_REVIEW:     'Contract Review',
  VEHICLE_ASSIGNMENT:  'Vehicle Assignment',
  OPERATIONAL:         'Operational',
  ACTIVE:              'Active',
};

export function isStageAvailable(currentStage, requiredStage) {
  return STAGE_ORDER.indexOf(currentStage) >= STAGE_ORDER.indexOf(requiredStage);
}

// ─── Nav link config by role ──────────────────────────────────────────────────
function getNavLinks(role, portalId, currentStage) {
  const base = `/portal/${portalId}`;

  if (role === 'employee') {
    return [
      {
        to: `${base}/washes`,
        label: 'Wash Status',
        icon: Droplets,
        requiredStage: 'OPERATIONAL',
      },
    ];
  }

  const overviewLink = { to: base, label: 'Overview', icon: LayoutDashboard, requiredStage: 'INTAKE', end: true };

  if (role === 'management') {
    return [
      overviewLink,
      { to: `${base}/agreement`,    label: 'Agreement',       icon: FilePen,   requiredStage: 'CONTRACT_REVIEW' },
      { to: `${base}/vehicles`,     label: 'Vehicles',        icon: Truck,     requiredStage: 'VEHICLE_ASSIGNMENT' },
      { to: `${base}/invoices`,     label: 'Invoices',        icon: Receipt,   requiredStage: 'OPERATIONAL' },
      { to: `${base}/certificates`, label: 'Certificates',    icon: Award,     requiredStage: 'ACTIVE' },
      { to: `${base}/manual`,       label: 'Location Manual', icon: FileText,  requiredStage: 'INTAKE' },
      { to: `${base}/wash-status`,  label: 'Wash Status',     icon: Droplets,  requiredStage: 'OPERATIONAL' },
    ];
  }

  if (role === 'lead') {
    return [
      overviewLink,
      { to: `${base}/agreement`, label: 'Agreement',       icon: FilePen,   requiredStage: 'CONTRACT_REVIEW' },
      { to: `${base}/manual`,    label: 'Location Manual', icon: FileText,  requiredStage: 'INTAKE' },
    ];
  }

  // client
  return [
    overviewLink,
    { to: `${base}/agreement`,    label: 'Agreement',       icon: FilePen,   requiredStage: 'CONTRACT_REVIEW' },
    { to: `${base}/vehicles`,     label: 'Vehicles',        icon: Truck,     requiredStage: 'VEHICLE_ASSIGNMENT' },
    { to: `${base}/invoices`,     label: 'Invoices',        icon: Receipt,   requiredStage: 'OPERATIONAL' },
    { to: `${base}/certificates`, label: 'Certificates',    icon: Award,     requiredStage: 'ACTIVE' },
    { to: `${base}/manual`,       label: 'Location Manual', icon: FileText,  requiredStage: 'INTAKE' },
    { to: `${base}/wash-status`,  label: 'Wash Status',     icon: Droplets,  requiredStage: 'OPERATIONAL' },
  ];
}

// ─── Role badge ───────────────────────────────────────────────────────────────
function RoleBadge({ role }) {
  const labels = {
    lead:       'Lead',
    client:     'Client',
    employee:   'Employee',
    management: 'Management',
  };
  return (
    <span className={`${styles.roleBadge} ${styles[`role_${role}`]}`}>
      {labels[role] || role}
    </span>
  );
}

// ─── Stage progress bar ───────────────────────────────────────────────────────
function StageProgress({ currentStage }) {
  const currentIdx = STAGE_ORDER.indexOf(currentStage);

  return (
    <div className={styles.stageProgress}>
      <div className={styles.stageLabel}>Portal Stage</div>
      <div className={styles.stageSteps}>
        {STAGE_ORDER.map((stage, idx) => {
          const isPast    = idx < currentIdx;
          const isCurrent = idx === currentIdx;
          const isFuture  = idx > currentIdx;

          return (
            <div key={stage} className={styles.stageStepWrapper}>
              <div
                className={`${styles.stageStep} ${isPast ? styles.stageStepPast : ''} ${isCurrent ? styles.stageStepCurrent : ''} ${isFuture ? styles.stageStepFuture : ''}`}
                title={STAGE_LABELS[stage]}
              >
                {isPast ? (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>
              {/* Connector line after step */}
              {idx < STAGE_ORDER.length - 1 && (
                <div
                  className={`${styles.stageConnector} ${isPast ? styles.stageConnectorActive : ''}`}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className={styles.stageCurrentLabel}>
        {STAGE_LABELS[currentStage]}
      </div>
    </div>
  );
}

// ─── Portal Shell ─────────────────────────────────────────────────────────────
export default function PortalShell({ portal }) {
  const { portalUser, logout, isManagementView } = usePortalAuth();
  const role = portalUser?.role || 'lead';
  const navLinks = getNavLinks(role, portal.id, portal.stage);

  function handleLogout() {
    logout();
    window.location.href = '/portal/login';
  }

  return (
    <div className={styles.shell}>
      {/* ── Sidebar (desktop) ── */}
      <aside className={styles.sidebar}>
        {/* Management banner */}
        {isManagementView && (
          <div className={styles.mgmtBanner}>
            <span>Management View</span>
          </div>
        )}

        {/* BTC Logo */}
        <div className={styles.logoArea}>
          <div className={styles.logoMark}>
            <span className={styles.logoInitials}>BTC</span>
          </div>
          <div className={styles.logoTextGroup}>
            <span className={styles.logoName}>Basiq Truckcleaning</span>
            <span className={styles.logoSub}>Client Portal</span>
          </div>
        </div>

        {/* Company info */}
        <div className={styles.companyCard}>
          <div className={styles.companyAvatar}>
            {portal.companyName.slice(0, 2).toUpperCase()}
          </div>
          <div className={styles.companyInfo}>
            <div className={styles.companyName}>{portal.companyName}</div>
            <div className={styles.companyContact}>{portal.contactPerson}</div>
          </div>
        </div>

        {/* Stage progress */}
        <StageProgress currentStage={portal.stage} />

        <div className={styles.sidebarDivider} />

        {/* Navigation */}
        <nav className={styles.nav}>
          {navLinks.map(({ to, label, icon: Icon, requiredStage, end }) => {
            const available = isStageAvailable(portal.stage, requiredStage);
            if (!available) {
              return (
                <div key={to} className={styles.navItemLocked} title={`Available from ${STAGE_LABELS[requiredStage]}`}>
                  <Lock size={16} strokeWidth={1.8} className={styles.navIcon} />
                  <span className={styles.navLabel}>{label}</span>
                  <span className={styles.lockedBadge}>
                    {STAGE_LABELS[requiredStage]}
                  </span>
                </div>
              );
            }
            return (
              <NavLink
                key={to}
                to={to}
                end={!!end}
                className={({ isActive }) =>
                  `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
                }
              >
                <Icon size={16} strokeWidth={1.8} className={styles.navIcon} />
                <span className={styles.navLabel}>{label}</span>
                <ChevronRight size={14} strokeWidth={2} className={styles.navChevron} />
              </NavLink>
            );
          })}
        </nav>

        {/* User info at bottom */}
        <div className={styles.sidebarFooter}>
          <div className={styles.userRow}>
            <div className={styles.userAvatar}>
              {(portalUser?.email || 'U').slice(0, 1).toUpperCase()}
            </div>
            <div className={styles.userInfo}>
              <div className={styles.userEmail}>{portalUser?.email}</div>
              <RoleBadge role={role} />
            </div>
          </div>
          {!isManagementView && (
            <button className={styles.logoutBtn} onClick={handleLogout} type="button">
              <LogOut size={15} strokeWidth={1.8} />
              <span>Sign out</span>
            </button>
          )}
          {isManagementView && (
            <a href={`/leads/${portal.entityId}`} className={styles.backToBmsBtn}>
              ← Back to BMS
            </a>
          )}
        </div>
      </aside>

      {/* ── Mobile header ── */}
      <header className={styles.mobileHeader}>
        <div className={styles.mobileLogoArea}>
          <div className={styles.mobileLogoMark}>BTC</div>
          <span className={styles.mobileTitle}>{portal.companyName}</span>
        </div>
        {!isManagementView && (
          <button className={styles.mobileLogoutBtn} onClick={handleLogout} type="button">
            <LogOut size={18} strokeWidth={1.8} />
          </button>
        )}
      </header>

      {/* ── Main content ── */}
      <main className={styles.main}>
        <div className={styles.content}>
          <Outlet context={{ portal, role, isManagementView }} />
        </div>
      </main>

      {/* ── Mobile bottom navigation ── */}
      <nav className={styles.mobileBottomNav}>
        {navLinks.map(({ to, label, icon: Icon, requiredStage, end }) => {
          const available = isStageAvailable(portal.stage, requiredStage);
          if (!available) {
            return (
              <div key={to} className={styles.mobileNavItemLocked} title={`Locked: ${STAGE_LABELS[requiredStage]}`}>
                <Lock size={18} strokeWidth={1.8} />
                <span>{label}</span>
              </div>
            );
          }
          return (
            <NavLink
              key={to}
              to={to}
              end={!!end}
              className={({ isActive }) =>
                `${styles.mobileNavItem} ${isActive ? styles.mobileNavItemActive : ''}`
              }
            >
              <Icon size={20} strokeWidth={1.8} />
              <span>{label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
