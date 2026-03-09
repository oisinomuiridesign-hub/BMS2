import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Camera } from 'lucide-react';
import AvatarInitials from '../components/shared/AvatarInitials';
import styles from './Settings.module.css';

const TABS = ['Profile', 'Organisation', 'Notifications'];

const NOTIFICATION_SETTINGS = [
  { key: 'new_client', label: 'New Client Added', description: 'Get notified when a new client is created in the system.' },
  { key: 'complaint_filed', label: 'Complaint Filed', description: 'Receive an alert when a complaint is logged against a client.' },
  { key: 'invoice_overdue', label: 'Invoice Overdue', description: 'Notify when a client invoice goes past its due date.' },
  { key: 'agreement_expiring', label: 'Agreement Expiring', description: 'Alert 30 days before a client agreement expires.' },
  { key: 'employee_added', label: 'Employee Added', description: 'Get notified when a new employee is added.' },
  { key: 'system_updates', label: 'System Updates', description: 'Receive notifications about platform updates and maintenance.' },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState('Profile');

  const [profile, setProfile] = useState({
    name: 'Martijn de Vries',
    email: 'martijn.devries@basiq.nl',
    phone: '+31 6 12 34 56 78',
    password: '',
  });

  const [org, setOrg] = useState({
    companyName: 'Basiq Truckcleaning B.V.',
    address: 'Nijmeegseweg 84',
    city: 'Venlo',
    postalCode: '5916 PT',
    country: 'Netherlands',
    kvk: '12345678',
    vatNumber: 'NL001234567B01',
  });

  const [notifications, setNotifications] = useState(
    Object.fromEntries(NOTIFICATION_SETTINGS.map((n) => [n.key, true]))
  );

  function handleProfileChange(field, value) {
    setProfile((prev) => ({ ...prev, [field]: value }));
  }

  function handleOrgChange(field, value) {
    setOrg((prev) => ({ ...prev, [field]: value }));
  }

  function toggleNotification(key) {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <div>
          <h1 className={styles.heading}>SETTINGS</h1>
          <p className={styles.breadcrumbs}>
            <Link to="/" className={styles.breadcrumbLink}>Home</Link>
            <span className={styles.breadcrumbSep}>/</span>
            Settings
          </p>
        </div>
      </div>

      {/* Tab bar */}
      <div className={styles.tabBar}>
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`${styles.tabBtn} ${activeTab === tab ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Profile tab */}
      {activeTab === 'Profile' && (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Profile Settings</h2>

          <div className={styles.avatarSection}>
            <div className={styles.avatarWrap}>
              <AvatarInitials initials="MV" color="#0082ca" size="lg" />
              <button className={styles.avatarEditBtn} aria-label="Change avatar">
                <Camera size={14} />
              </button>
            </div>
            <div>
              <p className={styles.avatarName}>{profile.name}</p>
              <p className={styles.avatarRole}>Owner · Venlo</p>
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.formGrid}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Full Name</label>
              <input
                className={styles.input}
                type="text"
                value={profile.name}
                onChange={(e) => handleProfileChange('name', e.target.value)}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Email Address</label>
              <input
                className={styles.input}
                type="email"
                value={profile.email}
                onChange={(e) => handleProfileChange('email', e.target.value)}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Phone Number</label>
              <input
                className={styles.input}
                type="tel"
                value={profile.phone}
                onChange={(e) => handleProfileChange('phone', e.target.value)}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>New Password</label>
              <input
                className={styles.input}
                type="password"
                placeholder="Leave blank to keep current"
                value={profile.password}
                onChange={(e) => handleProfileChange('password', e.target.value)}
              />
            </div>
          </div>

          <div className={styles.formActions}>
            <button className={styles.saveBtn} type="button">Save Changes</button>
          </div>
        </div>
      )}

      {/* Organisation tab */}
      {activeTab === 'Organisation' && (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Organisation Settings</h2>

          <div className={styles.formGrid}>
            <div className={styles.fieldGroupFull}>
              <label className={styles.label}>Company Name</label>
              <input
                className={styles.input}
                type="text"
                value={org.companyName}
                onChange={(e) => handleOrgChange('companyName', e.target.value)}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Street Address</label>
              <input
                className={styles.input}
                type="text"
                value={org.address}
                onChange={(e) => handleOrgChange('address', e.target.value)}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>City</label>
              <input
                className={styles.input}
                type="text"
                value={org.city}
                onChange={(e) => handleOrgChange('city', e.target.value)}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Postal Code</label>
              <input
                className={styles.input}
                type="text"
                value={org.postalCode}
                onChange={(e) => handleOrgChange('postalCode', e.target.value)}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Country</label>
              <input
                className={styles.input}
                type="text"
                value={org.country}
                onChange={(e) => handleOrgChange('country', e.target.value)}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>KVK Number</label>
              <input
                className={styles.input}
                type="text"
                value={org.kvk}
                onChange={(e) => handleOrgChange('kvk', e.target.value)}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>VAT Number</label>
              <input
                className={styles.input}
                type="text"
                value={org.vatNumber}
                onChange={(e) => handleOrgChange('vatNumber', e.target.value)}
              />
            </div>
          </div>

          <div className={styles.formActions}>
            <button className={styles.saveBtn} type="button">Save Changes</button>
          </div>
        </div>
      )}

      {/* Notifications tab */}
      {activeTab === 'Notifications' && (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Notification Preferences</h2>
          <p className={styles.notifSubtext}>
            Choose which events trigger a notification. Changes are saved automatically.
          </p>

          <div className={styles.notifList}>
            {NOTIFICATION_SETTINGS.map((notif) => (
              <div key={notif.key} className={styles.notifRow}>
                <div className={styles.notifInfo}>
                  <p className={styles.notifLabel}>{notif.label}</p>
                  <p className={styles.notifDesc}>{notif.description}</p>
                </div>
                <button
                  className={`${styles.toggle} ${notifications[notif.key] ? styles.toggleOn : ''}`}
                  onClick={() => toggleNotification(notif.key)}
                  role="switch"
                  aria-checked={notifications[notif.key]}
                  aria-label={`Toggle ${notif.label}`}
                >
                  <span className={styles.toggleThumb} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
