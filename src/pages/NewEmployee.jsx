import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { departments } from '../data/departments';
import styles from './NewEmployee.module.css';

const SKILLS = [
  { key: 'FORKLIFT', label: 'Forklift' },
  { key: 'AERIAL_PL', label: 'Aerial Platform' },
  { key: 'CERTIFICATE', label: 'Certificate' },
  { key: 'FIRST_AID', label: 'First Aid' },
  { key: 'REMAINDER', label: 'Remainder' },
];

const ROLES = [
  { value: 'basic', label: 'Basic User' },
  { value: 'Super User', label: 'Super User' },
  { value: 'Owner', label: 'Owner' },
];

export default function NewEmployee() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    role: '',
  });
  const [selectedSkills, setSelectedSkills] = useState([]);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleSkill(key) {
    setSelectedSkills((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }

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
            New Employee
          </p>
        </div>
      </div>

      <div className={styles.card}>
        {/* Section: Personal Info */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Personal Information</h2>
          <div className={styles.formGrid}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>First Name</label>
              <input
                className={styles.input}
                type="text"
                placeholder="e.g. Martijn"
                value={form.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Last Name</label>
              <input
                className={styles.input}
                type="text"
                placeholder="e.g. de Vries"
                value={form.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Email Address</label>
              <input
                className={styles.input}
                type="email"
                placeholder="name@basiq.nl"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Phone Number</label>
              <input
                className={styles.input}
                type="tel"
                placeholder="+31 6 00 00 00 00"
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className={styles.divider} />

        {/* Section: Work Info */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Work Information</h2>
          <div className={styles.formGrid}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Department</label>
              <div className={styles.selectWrapper}>
                <select
                  className={styles.select}
                  value={form.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                >
                  <option value="" disabled>Select a department</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Role</label>
              <div className={styles.selectWrapper}>
                <select
                  className={styles.select}
                  value={form.role}
                  onChange={(e) => handleChange('role', e.target.value)}
                >
                  <option value="" disabled>Select a role</option>
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className={styles.fieldGroup} style={{ marginTop: 20 }}>
            <label className={styles.label}>Skills</label>
            <div className={styles.skillsGrid}>
              {SKILLS.map((skill) => (
                <label key={skill.key} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={selectedSkills.includes(skill.key)}
                    onChange={() => toggleSkill(skill.key)}
                  />
                  <span className={styles.checkboxText}>{skill.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.actions}>
          <button
            className={styles.cancelBtn}
            type="button"
            onClick={() => navigate('/employees')}
          >
            Cancel
          </button>
          <button
            className={styles.saveBtn}
            type="button"
            onClick={() => navigate('/employees')}
          >
            Save Employee
          </button>
        </div>
      </div>
    </div>
  );
}
