import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Mail, Phone, Building2, InboxIcon, CalendarClock, Clock } from 'lucide-react';
import { employees } from '../../data/bms/employees';
import { getShiftsForEmployee } from '../../data/bms/shifts';
import AvatarInitials from '../../components/shared/AvatarInitials';
import StatusBadge from '../../components/shared/StatusBadge';
import ShiftCard from '../../components/shared/ShiftCard';
import styles from './EmployeeView.module.css';

const SKILL_LABELS = {
  FORKLIFT: 'Forklift',
  AERIAL_PL: 'Aerial Platform',
  CERTIFICATE: 'Certificate',
  FIRST_AID: 'First Aid',
  REMAINDER: 'Remainder',
};

const TODAY = '2026-03-17';

export default function EmployeeView({ initialTab = 'activity' }) {
  const { id } = useParams();
  const employee = employees.find((e) => String(e.id) === String(id));
  const [activeTab, setActiveTab] = useState(initialTab);

  const employeeShifts = useMemo(() => {
    if (!employee) return { upcoming: [], past: [] };
    const fullName = `${employee.firstName} ${employee.lastName}`;
    const all = getShiftsForEmployee(fullName);
    return {
      upcoming: all
        .filter((s) => s.date >= TODAY && s.status !== 'cancelled')
        .sort((a, b) => a.date.localeCompare(b.date)),
      past: all
        .filter((s) => s.date < TODAY || s.status === 'cancelled')
        .sort((a, b) => b.date.localeCompare(a.date)),
    };
  }, [employee]);

  if (!employee) {
    return (
      <div className={styles.page}>
        <p className={styles.notFound}>Employee not found.</p>
      </div>
    );
  }

  const initials = `${employee.firstName[0]}${employee.lastName[0]}`;
  const fullName = `${employee.firstName} ${employee.lastName}`;

  const TABS = [
    { key: 'activity', label: 'Activity' },
    { key: 'shifts',   label: 'Shifts' },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <div>
          <h1 className={styles.heading}>EMPLOYEES</h1>
          <p className={styles.breadcrumbs}>
            <Link to="/" className={styles.breadcrumbLink}>Home</Link>
            <span className={styles.breadcrumbSep}>/</span>
            <Link to="/employees" className={styles.breadcrumbLink}>Employees</Link>
            <span className={styles.breadcrumbSep}>/</span>
            {fullName}
          </p>
        </div>
      </div>

      <div className={styles.layout}>
        {/* Left panel */}
        <div className={styles.leftPanel}>
          <div className={styles.profileCard}>
            <div className={styles.avatarRow}>
              <AvatarInitials initials={initials} color={employee.avatarColor} size="lg" />
              <div>
                <h2 className={styles.empName}>{fullName}</h2>
                <p className={styles.empRole}>{employee.role === 'basic' ? 'Basic User' : employee.role}</p>
              </div>
            </div>

            <div className={styles.statusRow}>
              <StatusBadge status={employee.status} />
            </div>

            <div className={styles.divider} />

            <div className={styles.infoList}>
              <div className={styles.infoItem}>
                <span className={styles.infoIcon}><Mail size={15} /></span>
                <div>
                  <p className={styles.infoLabel}>Email</p>
                  <a href={`mailto:${employee.email}`} className={styles.infoValue}>{employee.email}</a>
                </div>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoIcon}><Phone size={15} /></span>
                <div>
                  <p className={styles.infoLabel}>Phone</p>
                  <p className={styles.infoValue}>{employee.phone}</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoIcon}><Building2 size={15} /></span>
                <div>
                  <p className={styles.infoLabel}>Department</p>
                  <p className={styles.infoValue}>{employee.department}</p>
                </div>
              </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.skillsSection}>
              <p className={styles.skillsLabel}>Skills</p>
              <div className={styles.skillsList}>
                {employee.skills.length > 0 ? (
                  employee.skills.map((s) => (
                    <span key={s} className={styles.skillPill}>{SKILL_LABELS[s] ?? s}</span>
                  ))
                ) : (
                  <span className={styles.skillPillEmpty}>No Skills Yet</span>
                )}
              </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>Member since</span>
              <span className={styles.metaValue}>
                {new Date(employee.createdDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className={styles.rightPanel}>
          {/* Tab bar */}
          <div className={styles.tabBar}>
            {TABS.map((tab) => (
              <button
                key={tab.key}
                className={`${styles.tabBtn} ${activeTab === tab.key ? styles.tabBtnActive : ''}`}
                onClick={() => setActiveTab(tab.key)}
                type="button"
              >
                {tab.label}
                {tab.key === 'shifts' && (
                  <span className={styles.tabCount}>
                    {employeeShifts.upcoming.length + employeeShifts.past.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Activity tab */}
          {activeTab === 'activity' && (
            <div className={styles.activityCard}>
              <h3 className={styles.activityTitle}>Activity & Notes</h3>
              <div className={styles.emptyState}>
                <InboxIcon size={40} className={styles.emptyIcon} />
                <p className={styles.emptyText}>No activity yet</p>
                <p className={styles.emptySubtext}>Notes and activity related to this employee will appear here.</p>
              </div>
            </div>
          )}

          {/* Shifts tab */}
          {activeTab === 'shifts' && (
            <div className={styles.shiftsContainer}>
              {/* Upcoming */}
              <div className={styles.shiftsSection}>
                <h3 className={styles.shiftsSectionTitle}>
                  <CalendarClock size={16} />
                  Upcoming Shifts
                  <span className={styles.shiftsCount}>{employeeShifts.upcoming.length}</span>
                </h3>
                {employeeShifts.upcoming.length > 0 ? (
                  <div className={styles.shiftsList}>
                    {employeeShifts.upcoming.map((shift) => (
                      <ShiftCard key={shift.id} shift={shift} isPast={false} />
                    ))}
                  </div>
                ) : (
                  <p className={styles.shiftsEmpty}>No upcoming shifts</p>
                )}
              </div>

              {/* Past */}
              <div className={styles.shiftsSection}>
                <h3 className={styles.shiftsSectionTitle}>
                  <Clock size={16} />
                  Past Shifts
                  <span className={styles.shiftsCount}>{employeeShifts.past.length}</span>
                </h3>
                {employeeShifts.past.length > 0 ? (
                  <div className={styles.shiftsList}>
                    {employeeShifts.past.map((shift) => (
                      <ShiftCard key={shift.id} shift={shift} isPast={true} />
                    ))}
                  </div>
                ) : (
                  <p className={styles.shiftsEmpty}>No past shifts</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
