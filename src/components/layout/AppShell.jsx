import Sidebar from './Sidebar';
import styles from './AppShell.module.css';

export default function AppShell({ children }) {
  return (
    <div className={styles.shell}>
      <Sidebar />
      <div className={styles.main}>
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}
