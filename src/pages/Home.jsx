import { Users, Building2, Briefcase, UserCheck, FileText, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { clients } from '../data/clients';
import { employees } from '../data/employees';
import { departments } from '../data/departments';
import { activities } from '../data/activities';
import styles from './Home.module.css';

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function Home() {
  const totalClients = clients.length;
  const activeClients = clients.filter((c) => c.status === 'active').length;
  const totalEmployees = employees.length;
  const totalDepartments = departments.length;

  const recentActivities = [...activities]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const clientsByDept = departments.map((dept) => {
    const count = clients.filter((c) => c.department === dept.name).length;
    const max = Math.max(...departments.map((d) => clients.filter((cc) => cc.department === d.name).length));
    return { ...dept, count, pct: max > 0 ? Math.round((count / max) * 100) : 0 };
  });

  const statCards = [
    { label: 'Total Clients', value: totalClients, icon: <Briefcase size={22} />, color: 'var(--primary-10)' },
    { label: 'Active Clients', value: activeClients, icon: <UserCheck size={22} />, color: 'var(--alert-success-primary)' },
    { label: 'Total Employees', value: totalEmployees, icon: <Users size={22} />, color: 'var(--alert-warning-primary)' },
    { label: 'Departments', value: totalDepartments, icon: <Building2 size={22} />, color: 'var(--alert-error-primary)' },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <div>
          <h1 className={styles.heading}>HOME</h1>
          <p className={styles.breadcrumbs}>Dashboard</p>
        </div>
      </div>

      <div className={styles.statRow}>
        {statCards.map((card) => (
          <div key={card.label} className={styles.statCard}>
            <div className={styles.statIcon} style={{ color: card.color, background: `${card.color}18` }}>
              {card.icon}
            </div>
            <div className={styles.statText}>
              <span className={styles.statValue}>{card.value}</span>
              <span className={styles.statLabel}>{card.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.bodyRow}>
        <div className={styles.panel}>
          <h2 className={styles.panelTitle}>Recent Activity</h2>
          <div className={styles.activityList}>
            {recentActivities.map((act) => {
              const client = clients.find((c) => c.id === act.clientId);
              return (
                <div key={act.id} className={styles.activityItem}>
                  <div className={styles.activityLeft}>
                    <span className={`${styles.typeBadge} ${act.type === 'complaint' ? styles.complaint : styles.note}`}>
                      {act.type === 'complaint' ? <AlertCircle size={11} /> : <FileText size={11} />}
                      {act.type}
                    </span>
                  </div>
                  <div className={styles.activityBody}>
                    <p className={styles.activityTitle}>{act.title}</p>
                    <p className={styles.activityMeta}>
                      {act.authorName}
                      {client && (
                        <Link to={`/clients/${client.id}`} className={styles.clientLink}>
                          {' · '}{client.companyName}
                        </Link>
                      )}
                    </p>
                  </div>
                  <span className={styles.activityDate}>{formatDate(act.createdAt)}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.panel}>
          <h2 className={styles.panelTitle}>Clients by Department</h2>
          <div className={styles.deptList}>
            {clientsByDept.map((dept) => (
              <div key={dept.id} className={styles.deptRow}>
                <div className={styles.deptHeader}>
                  <Link to={`/departments/${dept.id}`} className={styles.deptName}>{dept.name}</Link>
                  <span className={styles.deptCount}>{dept.count} clients</span>
                </div>
                <div className={styles.progressTrack}>
                  <div className={styles.progressFill} style={{ width: `${dept.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className={styles.quickLinks}>
            <h3 className={styles.quickLinksTitle}>Quick Links</h3>
            <div className={styles.quickLinksGrid}>
              <Link to="/clients/new" className={styles.quickLink}>+ New Client</Link>
              <Link to="/employees/new" className={styles.quickLink}>+ New Employee</Link>
              <Link to="/departments/new" className={styles.quickLink}>+ Create Department</Link>
              <Link to="/clients" className={styles.quickLink}>View All Clients</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
