import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './DepartmentCreate.module.css';

export default function DepartmentCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    address: '',
    city: '',
    contactPerson: '',
    phone: '',
  });

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

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
            Create Department
          </p>
        </div>
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Department Details</h2>

        <div className={styles.formGrid}>
          <div className={styles.fieldGroupFull}>
            <label className={styles.label}>Department Name</label>
            <input
              className={styles.input}
              type="text"
              placeholder="e.g. Venlo, Rotterdam, Eindhoven"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Address</label>
            <input
              className={styles.input}
              type="text"
              placeholder="Street and number"
              value={form.address}
              onChange={(e) => handleChange('address', e.target.value)}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>City</label>
            <input
              className={styles.input}
              type="text"
              placeholder="e.g. Venlo"
              value={form.city}
              onChange={(e) => handleChange('city', e.target.value)}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Contact Person</label>
            <input
              className={styles.input}
              type="text"
              placeholder="Full name"
              value={form.contactPerson}
              onChange={(e) => handleChange('contactPerson', e.target.value)}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Phone Number</label>
            <input
              className={styles.input}
              type="tel"
              placeholder="+31 77 000 00 00"
              value={form.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.actions}>
          <button
            className={styles.cancelBtn}
            type="button"
            onClick={() => navigate('/departments')}
          >
            Cancel
          </button>
          <button
            className={styles.saveBtn}
            type="button"
            onClick={() => navigate('/departments')}
          >
            Save Department
          </button>
        </div>
      </div>
    </div>
  );
}
