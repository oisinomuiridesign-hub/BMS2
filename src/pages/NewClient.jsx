import { useState } from 'react';
import { useState as useStateAlias } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X, Plus, ChevronDown, Home, ChevronRight } from 'lucide-react';
import { departments } from '../data/departments';
import styles from './NewClient.module.css';

const STEP_SELECT = 'select';
const STEP_DETAILS = 'details';

const MOCK_SEARCH_RESULTS = [
  { kvk: '12345678', name: 'Van den Berg Transport B.V.', city: 'Venlo' },
  { kvk: '23456789', name: 'Van den Berg Logistiek', city: 'Rotterdam' },
  { kvk: '34567890', name: 'Van den Berg Cargo Services', city: 'Eindhoven' },
];

export default function NewClient() {
  const navigate = useNavigate();
  const [step, setStep] = useState(STEP_SELECT);

  const [selectedDept, setSelectedDept] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  const [form, setForm] = useState({
    companyName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    email: '',
    kvk: '',
  });

  const [contacts, setContacts] = useState([
    { id: 1, name: '', role: 'Owner', phone: '', email: '' },
  ]);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSearchInput(v) {
    setSearchQuery(v);
    setShowResults(v.length > 2);
  }

  function selectCompany(company) {
    setSearchQuery(company.name);
    setShowResults(false);
    setForm((prev) => ({
      ...prev,
      companyName: company.name,
      kvk: company.kvk,
      city: company.city,
    }));
  }

  function handleNext() {
    if (!selectedDept) return;
    setStep(STEP_DETAILS);
  }

  function addContact() {
    setContacts((prev) => [
      ...prev,
      { id: Date.now(), name: '', role: 'Fleet Manager', phone: '', email: '' },
    ]);
  }

  function removeContact(id) {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  }

  function updateContact(id, field, value) {
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <h1 className={styles.pageTitle}>CLIENTS</h1>
          <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
            <Link to="/" className={styles.breadcrumbLink}>
              <Home size={14} />
            </Link>
            <ChevronRight size={14} className={styles.breadcrumbSep} />
            <Link to="/clients" className={styles.breadcrumbLink}>Clients</Link>
            <ChevronRight size={14} className={styles.breadcrumbSep} />
            <span className={styles.breadcrumbCurrent}>New Client</span>
          </nav>
        </div>
      </div>

      {/* Step 1: Modal overlay */}
      {step === STEP_SELECT && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>CREATE NEW CLIENT</h2>
              <button
                className={styles.closeBtn}
                onClick={() => navigate('/clients')}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Select a department</label>
                <div className={styles.selectWrapper}>
                  <select
                    className={styles.select}
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                  >
                    <option value="" disabled>Select a department…</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className={styles.selectArrow} />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Search for company name or KVK number</label>
                <div className={styles.searchWrap}>
                  <Search size={15} className={styles.searchIcon} />
                  <input
                    className={styles.searchInput}
                    type="text"
                    placeholder="e.g. Van den Berg or 12345678"
                    value={searchQuery}
                    onChange={(e) => handleSearchInput(e.target.value)}
                  />
                  {showResults && (
                    <div className={styles.searchResults}>
                      {MOCK_SEARCH_RESULTS.map((r) => (
                        <button
                          key={r.kvk}
                          className={styles.searchResultItem}
                          onClick={() => selectCompany(r)}
                          type="button"
                        >
                          <span className={styles.resultName}>{r.name}</span>
                          <span className={styles.resultMeta}>KVK {r.kvk} · {r.city}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <Link to="/clients" className={styles.cancelLink}>Cancel</Link>
              <button
                className={`${styles.nextBtn} ${!selectedDept ? styles.nextBtnDisabled : ''}`}
                onClick={handleNext}
                type="button"
                disabled={!selectedDept}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Detailed form */}
      {step === STEP_DETAILS && (
        <div className={styles.detailCard}>
          <div className={styles.detailCardHeader}>
            <h2 className={styles.detailCardTitle}>Client Details</h2>
            <span className={styles.deptBadge}>{selectedDept}</span>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Company Information</h3>
            <div className={styles.formGrid}>
              <div className={styles.fieldGroupFull}>
                <label className={styles.label}>Company Name</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="e.g. Van den Berg Transport B.V."
                  value={form.companyName}
                  onChange={(e) => handleChange('companyName', e.target.value)}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Street Address</label>
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
                <label className={styles.label}>Postal Code</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="e.g. 5916 PT"
                  value={form.postalCode}
                  onChange={(e) => handleChange('postalCode', e.target.value)}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Phone</label>
                <input
                  className={styles.input}
                  type="tel"
                  placeholder="+31 77 000 00 00"
                  value={form.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Email</label>
                <input
                  className={styles.input}
                  type="email"
                  placeholder="info@company.nl"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>KVK Number</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="8-digit KVK"
                  value={form.kvk}
                  onChange={(e) => handleChange('kvk', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Contacts</h3>
              <button className={styles.addContactBtn} onClick={addContact} type="button">
                <Plus size={14} />
                Add Contact
              </button>
            </div>

            {contacts.map((contact, idx) => (
              <div key={contact.id} className={styles.contactBlock}>
                <div className={styles.contactBlockHeader}>
                  <span className={styles.contactNum}>Contact {idx + 1}</span>
                  {contacts.length > 1 && (
                    <button
                      className={styles.removeContactBtn}
                      onClick={() => removeContact(contact.id)}
                      type="button"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                <div className={styles.formGrid}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Full Name</label>
                    <input
                      className={styles.input}
                      type="text"
                      placeholder="Full name"
                      value={contact.name}
                      onChange={(e) => updateContact(contact.id, 'name', e.target.value)}
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Role</label>
                    <div className={styles.selectWrapper}>
                      <select
                        className={styles.select}
                        value={contact.role}
                        onChange={(e) => updateContact(contact.id, 'role', e.target.value)}
                      >
                        {['Owner', 'Fleet Manager', 'Planner', 'Driver', 'Administration', 'Technical Service', 'Other'].map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                      <ChevronDown size={16} className={styles.selectArrow} />
                    </div>
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Phone</label>
                    <input
                      className={styles.input}
                      type="tel"
                      placeholder="+31 6 00 00 00 00"
                      value={contact.phone}
                      onChange={(e) => updateContact(contact.id, 'phone', e.target.value)}
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Email</label>
                    <input
                      className={styles.input}
                      type="email"
                      placeholder="name@company.nl"
                      value={contact.email}
                      onChange={(e) => updateContact(contact.id, 'email', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.divider} />

          <div className={styles.detailActions}>
            <button
              className={styles.backBtn}
              type="button"
              onClick={() => setStep(STEP_SELECT)}
            >
              Back
            </button>
            <button
              className={styles.saveBtn}
              type="button"
              onClick={() => navigate('/clients')}
            >
              Save Client
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
