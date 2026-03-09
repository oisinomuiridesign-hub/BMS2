import { useParams, Link } from 'react-router-dom';
import { MapPin, Phone, Users, Briefcase } from 'lucide-react';
import { departments } from '../data/departments';
import { employees } from '../data/employees';
import AvatarInitials from '../components/shared/AvatarInitials';
import StatusBadge from '../components/shared/StatusBadge';
import styles from './DepartmentView.module.css';

const DEPT_COLORS = {
  Venlo: '#0082ca',
  Rotterdam: '#27ae60',
  Eindhoven: '#e09915',
  Amsterdam: '#ef6461',
};

function getDeptColor(name) {
  return DEPT_COLORS[name] ?? '#344667';
}

export default function DepartmentView() {
  const { id } = useParams();
  const department = departments.find((d) => String(d.id) === String(id));

  if (!department) {
    return (
      <div className={styles.page}>
        <p className={styles.notFound}>Department not found.</p>
      </div>
    );
  }

  const deptColor = getDeptColor(department.name);
  const deptEmployees = employees.filter((e) => e.department === department.name);

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <div>
          <h1 className={styles.heading}>DEPARTMENTS</h1>
          <p className={styles.breadcrumbs}>
            <Link to="/" className={styles.breadcrumbLink}>Home</Link>
            <span className={styles.breadcrumbSep}>/</span>
            <Link to="/departments" className={styles.breadcrumbLink}>Departments</Link>
            <span className={styles.breadcrumbSep}>/</span>
            {department.name}
          </p>
        </div>
      </div>

      <div className={styles.layout}>
        {/* Left panel */}
        <div className={styles.leftPanel}>
          <div className={styles.profileCard}>
            <div className={styles.avatarRow}>
              <AvatarInitials initials={department.name[0]} color={deptColor} size="lg" />
              <div>
                <h2 className={styles.deptName}>{department.name}</h2>
                <p className={styles.deptSub}>Wash Location</p>
              </div>
            </div>

            <div className={styles.statusRow}>
              <StatusBadge status={department.status} />
            </div>

            <div className={styles.divider} />

            <div className={styles.infoList}>
              <div className={styles.infoItem}>
                <span className={styles.infoIcon}><MapPin size={15} /></span>
                <div>
                  <p className={styles.infoLabel}>Address</p>
                  <p className={styles.infoValue}>{department.address}</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoIcon}><Phone size={15} /></span>
                <div>
                  <p className={styles.infoLabel}>Phone</p>
                  <p className={styles.infoValue}>{department.phone}</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoIcon}><Users size={15} /></span>
                <div>
                  <p className={styles.infoLabel}>Contact Person</p>
                  <p className={styles.infoValue}>{department.contactPerson}</p>
                </div>
              </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.statsRow}>
              <div className={styles.statBox}>
                <span className={styles.statNum}>{department.employeeCount}</span>
                <span className={styles.statLabel}>Employees</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.statBox}>
                <span className={styles.statNum}>{department.clientCount}</span>
                <span className={styles.statLabel}>Clients</span>
              </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>Established</span>
              <span className={styles.metaValue}>
                {new Date(department.createdDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className={styles.rightPanel}>
          <div className={styles.empCard}>
            <h3 className={styles.empCardTitle}>
              Employees in {department.name}
              <span className={styles.empCount}>{deptEmployees.length}</span>
            </h3>

            {deptEmployees.length === 0 ? (
              <p className={styles.noEmps}>No employees assigned to this department.</p>
            ) : (
              <div className={styles.empList}>
                {deptEmployees.map((emp) => {
                  const initials = `${emp.firstName[0]}${emp.lastName[0]}`;
                  return (
                    <Link
                      key={emp.id}
                      to={`/employees/${emp.id}`}
                      className={styles.empRow}
                    >
                      <AvatarInitials initials={initials} color={emp.avatarColor} size="sm" />
                      <div className={styles.empInfo}>
                        <p className={styles.empName}>{emp.firstName} {emp.lastName}</p>
                        <p className={styles.empRole}>{emp.role === 'basic' ? 'Basic User' : emp.role}</p>
                      </div>
                      <StatusBadge status={emp.status} />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
