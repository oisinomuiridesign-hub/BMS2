import styles from './Tabs.module.css';

export default function Tabs({ tabs = [], activeTab, onChange }) {
  return (
    <div className={styles.tabBar} role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={tab.id === activeTab}
          className={`${styles.tab} ${tab.id === activeTab ? styles.active : ''}`}
          onClick={() => onChange?.(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
