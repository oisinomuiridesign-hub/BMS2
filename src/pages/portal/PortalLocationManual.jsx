import { useState, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  FileText,
  MapPin,
  Clock,
  Users,
  Truck,
  Zap,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Trash2,
  Lock,
  Send,
  Save,
  Info,
} from 'lucide-react';
import { isStageAvailable } from '../../components/portal/PortalShell';
import { usePortalAuth } from '../../context/PortalAuthContext';
import { findManualByPortalId } from '../../data/portal/locationManuals';
import sectionStyles from './PortalSection.module.css';
import styles from './PortalLocationManual.module.css';

// ─── Section definitions ──────────────────────────────────────────────────────
const SECTIONS = [
  { id: 'site',     num: 1, icon: MapPin,        label: 'Site Address & Access' },
  { id: 'hours',    num: 2, icon: Clock,         label: 'Operating Hours' },
  { id: 'contacts', num: 3, icon: Users,         label: 'Contact Persons' },
  { id: 'parking',  num: 4, icon: Truck,         label: 'Parking & Washing Bay' },
  { id: 'supply',   num: 5, icon: Zap,           label: 'Water & Power Supply' },
  { id: 'waste',    num: 6, icon: AlertTriangle, label: 'Waste Disposal' },
  { id: 'safety',   num: 7, icon: Shield,        label: 'Safety Requirements' },
  { id: 'special',  num: 8, icon: FileText,      label: 'Special Instructions' },
];

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_LABELS = {
  monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
  thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday',
};

const DEFAULT_HOURS = {
  monday: '06:00', tuesday: '06:00', wednesday: '06:00',
  thursday: '06:00', friday: '06:00', saturday: '08:00', sunday: '',
};
const DEFAULT_HOURS_END = {
  monday: '20:00', tuesday: '20:00', wednesday: '20:00',
  thursday: '20:00', friday: '18:00', saturday: '14:00', sunday: '',
};

function formatDate(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
}

// ─── Confirm Submit Modal ─────────────────────────────────────────────────────
function ConfirmSubmitModal({ onCancel, onConfirm }) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalCard}>
        <div className={styles.modalIcon}>
          <Send size={24} strokeWidth={1.8} />
        </div>
        <h2 className={styles.modalTitle}>Submit Location Manual</h2>
        <p className={styles.modalText}>
          Submit your Location Manual to Basiq Truckcleaning? Once submitted, you cannot make changes without contacting BTC directly.
        </p>
        <div className={styles.modalActions}>
          <button className={styles.modalCancelBtn} type="button" onClick={onCancel}>
            Cancel
          </button>
          <button className={styles.modalSubmitBtn} type="button" onClick={onConfirm}>
            Submit Manual
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Section Card wrapper ─────────────────────────────────────────────────────
function SectionCard({ id, num, icon: Icon, label, isDone, readOnly, children }) {
  return (
    <div id={`section-${id}`} className={styles.sectionCard}>
      <div className={styles.sectionCardHeader}>
        <div className={`${styles.sectionCardNum} ${isDone ? styles.sectionCardNumDone : ''}`}>
          {isDone ? <CheckCircle2 size={12} strokeWidth={2.5} /> : num}
        </div>
        <Icon size={15} strokeWidth={1.8} style={{ color: 'var(--neutral-30)' }} />
        <span className={styles.sectionCardTitle}>{label}</span>
        {isDone && (
          <span className={styles.sectionCardDoneTag}>
            <CheckCircle2 size={12} strokeWidth={2.5} />
            Complete
          </span>
        )}
        {readOnly && !isDone && (
          <span className={styles.sectionCardDoneTag} style={{ color: 'var(--neutral-30)' }}>
            <Lock size={12} strokeWidth={2} />
            Read only
          </span>
        )}
      </div>
      <div className={styles.sectionCardBody}>{children}</div>
    </div>
  );
}

// ─── Field components ─────────────────────────────────────────────────────────
function Field({ label, required, children }) {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.fieldLabel}>
        {label}
        {required && <span className={styles.fieldRequired}>*</span>}
      </label>
      {children}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PortalLocationManual() {
  const { portal } = useOutletContext();
  const { isManagementView } = usePortalAuth();
  const available = isStageAvailable(portal.stage, 'INTAKE');

  // Load seed data if available for this portal
  const seedManual = findManualByPortalId(portal.id);

  // ── Form state ──────────────────────────────────────────────────────────────
  const [manualStatus, setManualStatus] = useState(
    seedManual ? seedManual.status : 'NOT_STARTED'
  );
  const [submittedAt, setSubmittedAt] = useState(seedManual?.submittedAt || null);
  const [approvedAt, setApprovedAt] = useState(seedManual?.approvedAt || null);

  const [siteAddress, setSiteAddress] = useState(seedManual?.siteAddress || '');
  const [accessInstructions, setAccessInstructions] = useState(seedManual?.accessInstructions || '');

  // Hours: store as { day: { start, end, closed } }
  const buildHoursState = () => {
    const h = {};
    DAYS.forEach((d) => {
      if (seedManual?.operatingHours) {
        const raw = seedManual.operatingHours[d] || '';
        if (!raw || raw.toLowerCase() === 'closed') {
          h[d] = { start: '', end: '', closed: true };
        } else {
          const [start = '', end = ''] = raw.split('–').map((s) => s.trim());
          h[d] = { start, end, closed: false };
        }
      } else {
        const isClosed = d === 'sunday';
        h[d] = {
          start: isClosed ? '' : DEFAULT_HOURS[d],
          end: isClosed ? '' : DEFAULT_HOURS_END[d],
          closed: isClosed,
        };
      }
    });
    return h;
  };
  const [hours, setHours] = useState(buildHoursState);

  const [contacts, setContacts] = useState(
    seedManual?.contacts?.length
      ? seedManual.contacts.map((c, i) => ({ ...c, _key: i }))
      : [{ _key: 0, role: '', name: '', phone: '', email: '' }]
  );

  const [parkingSpecs, setParkingSpecs] = useState(seedManual?.parkingSpecs || '');
  const [waterSupply, setWaterSupply] = useState(seedManual?.waterSupply || '');
  const [powerSupply, setPowerSupply] = useState(seedManual?.powerSupply || '');
  const [wasteDisposal, setWasteDisposal] = useState(seedManual?.wasteDisposal || '');
  const [safetyRequirements, setSafetyRequirements] = useState(seedManual?.safetyRequirements || '');
  const [specialInstructions, setSpecialInstructions] = useState(seedManual?.specialInstructions || '');

  // ── Modal + mgmt state ──────────────────────────────────────────────────────
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [mgmtNotes, setMgmtNotes] = useState('');
  const [mgmtActionDone, setMgmtActionDone] = useState(null); // 'approved'|'requested_changes'

  // ── Section completeness checks ─────────────────────────────────────────────
  const sectionComplete = {
    site:     siteAddress.trim().length > 0 && accessInstructions.trim().length > 0,
    hours:    DAYS.some((d) => !hours[d].closed && hours[d].start),
    contacts: contacts.some((c) => c.name.trim().length > 0 && c.role.trim().length > 0),
    parking:  parkingSpecs.trim().length > 0,
    supply:   waterSupply.trim().length > 0 && powerSupply.trim().length > 0,
    waste:    wasteDisposal.trim().length > 0,
    safety:   safetyRequirements.trim().length > 0,
    special:  true, // optional section
  };

  const requiredSections = ['site', 'hours', 'contacts', 'parking', 'supply', 'waste', 'safety'];
  const allRequiredComplete = requiredSections.every((s) => sectionComplete[s]);

  const isReadOnly = manualStatus === 'SUBMITTED' || manualStatus === 'APPROVED';

  // ── Hours helpers ───────────────────────────────────────────────────────────
  const updateHours = useCallback((day, field, value) => {
    setHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  }, []);

  // ── Contact helpers ─────────────────────────────────────────────────────────
  const addContact = () => {
    setContacts((prev) => [
      ...prev,
      { _key: Date.now(), role: '', name: '', phone: '', email: '' },
    ]);
  };

  const removeContact = (key) => {
    setContacts((prev) => prev.filter((c) => c._key !== key));
  };

  const updateContact = (key, field, value) => {
    setContacts((prev) =>
      prev.map((c) => (c._key === key ? { ...c, [field]: value } : c))
    );
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  function handleSubmitConfirm() {
    setManualStatus('SUBMITTED');
    setSubmittedAt(new Date().toISOString());
    setShowSubmitModal(false);
  }

  // ── Management actions ──────────────────────────────────────────────────────
  function handleMgmtApprove() {
    setManualStatus('APPROVED');
    setApprovedAt(new Date().toISOString());
    setMgmtActionDone('approved');
  }

  function handleMgmtRequestChanges() {
    setManualStatus('IN_PROGRESS');
    setMgmtActionDone('requested_changes');
  }

  // ── Locked state ────────────────────────────────────────────────────────────
  if (!available) {
    return (
      <div className={sectionStyles.lockedPage}>
        <div className={sectionStyles.lockedIcon}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h2 className={sectionStyles.lockedTitle}>Section Locked</h2>
        <p className={sectionStyles.lockedDesc}>
          The Location Manual section will be available from the <strong>Intake</strong> stage.
        </p>
      </div>
    );
  }

  // ── Status bar config ───────────────────────────────────────────────────────
  const statusConfig = {
    NOT_STARTED:  { label: 'Not Started',  cls: styles.statusNot_started },
    IN_PROGRESS:  { label: 'In Progress',  cls: styles.statusIn_progress },
    SUBMITTED:    { label: 'Submitted',    cls: styles.statusSubmitted },
    APPROVED:     { label: 'Approved',     cls: styles.statusApproved },
  };
  const currentStatus = statusConfig[manualStatus] || statusConfig.NOT_STARTED;

  return (
    <>
      {showSubmitModal && (
        <ConfirmSubmitModal
          onCancel={() => setShowSubmitModal(false)}
          onConfirm={handleSubmitConfirm}
        />
      )}

      <div className={sectionStyles.page}>
        {/* ── Page header ── */}
        <div className={sectionStyles.pageHeader}>
          <div
            className={sectionStyles.pageIconWrap}
            style={{ background: 'var(--primary-60)', color: 'var(--primary-10)' }}
          >
            <FileText size={22} strokeWidth={1.8} />
          </div>
          <div>
            <h1 className={sectionStyles.pageTitle}>Location Manual</h1>
            <p className={sectionStyles.pageSubtitle}>
              Complete all sections so BTC can prepare your site for professional truck cleaning.
            </p>
          </div>
        </div>

        {/* ── Status bar ── */}
        <div className={styles.statusBar}>
          <span className={styles.statusBarLabel}>Status:</span>
          <span className={`${styles.statusBarBadge} ${currentStatus.cls}`}>
            {manualStatus === 'APPROVED' && <CheckCircle2 size={11} strokeWidth={2.5} />}
            {currentStatus.label}
          </span>
          {submittedAt && (
            <span className={styles.statusBarMeta}>
              Submitted {formatDate(submittedAt)}
              {approvedAt && ` · Approved ${formatDate(approvedAt)}`}
            </span>
          )}
        </div>

        {/* ── Status notification banners ── */}
        {manualStatus === 'IN_PROGRESS' && !isManagementView && (
          <div className={sectionStyles.infoCard}>
            <AlertTriangle size={16} strokeWidth={2} style={{ color: 'var(--alert-warning-primary)', flexShrink: 0 }} />
            <div>
              <strong>Action required</strong> — Please complete all sections of the location manual. BTC cannot proceed with your contract until this information has been submitted and reviewed.
            </div>
          </div>
        )}

        {manualStatus === 'NOT_STARTED' && !isManagementView && (
          <div className={sectionStyles.infoCard}>
            <Info size={16} strokeWidth={2} style={{ color: 'var(--primary-10)', flexShrink: 0 }} />
            <div>
              <strong>Welcome!</strong> — Fill in your site details below. BTC needs this information before drafting your service agreement. All fields marked <strong>*</strong> are required.
            </div>
          </div>
        )}

        {manualStatus === 'SUBMITTED' && (
          <div className={sectionStyles.successCard}>
            <CheckCircle2 size={16} strokeWidth={2} style={{ color: 'var(--alert-success-primary)', flexShrink: 0 }} />
            <div>
              <strong>Manual submitted</strong> — Thank you. BTC is reviewing your location details. You will be notified here when your contract proposal is ready. To make changes, please contact BTC directly.
            </div>
          </div>
        )}

        {manualStatus === 'APPROVED' && (
          <div className={styles.approvedBanner}>
            <CheckCircle2 size={18} strokeWidth={2} style={{ flexShrink: 0 }} />
            <div>
              <strong>Your location manual has been approved by BTC.</strong> Your agreement is now being prepared. You will be notified as soon as the contract is ready for your review.
            </div>
          </div>
        )}

        {/* ── Two-column layout: section nav + form ── */}
        <div className={styles.layout}>
          {/* Sticky section nav */}
          <nav className={styles.sectionNav} aria-label="Manual sections">
            <div className={styles.sectionNavTitle}>Sections</div>
            <div className={styles.sectionNavList}>
              {SECTIONS.map(({ id, label }) => (
                <a
                  key={id}
                  href={`#section-${id}`}
                  className={styles.sectionNavItem}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                >
                  <span
                    className={`${styles.sectionNavDot} ${sectionComplete[id] ? styles.sectionNavDotDone : ''}`}
                  />
                  {label}
                </a>
              ))}
            </div>
          </nav>

          {/* Form body */}
          <div className={styles.formBody}>

            {/* ── Section 1: Site Address & Access ── */}
            <SectionCard
              id="site" num={1} icon={MapPin}
              label="Site Address & Access"
              isDone={isReadOnly && sectionComplete.site}
              readOnly={isReadOnly}
            >
              <Field label="Site Address" required>
                <input
                  type="text"
                  className={styles.fieldInput}
                  placeholder="e.g. Industrieweg 12, 5928 BM Venlo"
                  value={siteAddress}
                  onChange={(e) => setSiteAddress(e.target.value)}
                  disabled={isReadOnly}
                />
              </Field>
              <Field label="Access Instructions" required>
                <textarea
                  className={styles.fieldTextarea}
                  placeholder="Gate codes, access procedures, security requirements, escort rules…"
                  value={accessInstructions}
                  onChange={(e) => setAccessInstructions(e.target.value)}
                  rows={4}
                  disabled={isReadOnly}
                />
              </Field>
            </SectionCard>

            {/* ── Section 2: Operating Hours ── */}
            <SectionCard
              id="hours" num={2} icon={Clock}
              label="Operating Hours"
              isDone={isReadOnly && sectionComplete.hours}
              readOnly={isReadOnly}
            >
              <p className={styles.readOnlyHint} style={{ color: 'var(--text-dark-secondary)', fontStyle: 'normal', marginTop: 0 }}>
                Specify wash bay availability for each day. Check "Closed" for days the site is not accessible.
              </p>
              <div className={styles.hoursGrid}>
                {DAYS.map((day) => (
                  <div key={day} style={{ display: 'contents' }}>
                    <span className={styles.hoursDay}>{DAY_LABELS[day]}</span>
                    {hours[day].closed ? (
                      <div className={styles.hoursInputRow}>
                        <span style={{ fontSize: '13px', color: 'var(--neutral-30)', fontStyle: 'italic' }}>Closed</span>
                        {!isReadOnly && (
                          <label className={styles.hoursClosedToggle} style={{ marginLeft: 8 }}>
                            <input
                              type="checkbox"
                              checked={hours[day].closed}
                              onChange={(e) => updateHours(day, 'closed', e.target.checked)}
                            />
                            Closed
                          </label>
                        )}
                      </div>
                    ) : (
                      <div className={styles.hoursInputRow}>
                        <input
                          type="time"
                          className={styles.hoursInput}
                          value={hours[day].start}
                          onChange={(e) => updateHours(day, 'start', e.target.value)}
                          disabled={isReadOnly}
                        />
                        <span className={styles.hoursSep}>–</span>
                        <input
                          type="time"
                          className={styles.hoursInput}
                          value={hours[day].end}
                          onChange={(e) => updateHours(day, 'end', e.target.value)}
                          disabled={isReadOnly}
                        />
                        {!isReadOnly && (
                          <label className={styles.hoursClosedToggle} style={{ marginLeft: 6 }}>
                            <input
                              type="checkbox"
                              checked={hours[day].closed}
                              onChange={(e) => updateHours(day, 'closed', e.target.checked)}
                            />
                            Closed
                          </label>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* ── Section 3: Contact Persons ── */}
            <SectionCard
              id="contacts" num={3} icon={Users}
              label="Contact Persons"
              isDone={isReadOnly && sectionComplete.contacts}
              readOnly={isReadOnly}
            >
              <div className={styles.contactsList}>
                {contacts.map((contact, idx) => (
                  <div key={contact._key} className={styles.contactCard}>
                    {!isReadOnly && contacts.length > 1 && (
                      <button
                        className={styles.contactRemoveBtn}
                        type="button"
                        onClick={() => removeContact(contact._key)}
                        title="Remove contact"
                      >
                        <Trash2 size={14} strokeWidth={1.8} />
                      </button>
                    )}
                    <div className={styles.contactGrid}>
                      <Field label={`Contact ${idx + 1} — Role`} required={idx === 0}>
                        <input
                          type="text"
                          className={styles.fieldInput}
                          placeholder="e.g. Site Manager, Fleet Manager"
                          value={contact.role}
                          onChange={(e) => updateContact(contact._key, 'role', e.target.value)}
                          disabled={isReadOnly}
                        />
                      </Field>
                      <Field label="Full Name" required={idx === 0}>
                        <input
                          type="text"
                          className={styles.fieldInput}
                          placeholder="First and last name"
                          value={contact.name}
                          onChange={(e) => updateContact(contact._key, 'name', e.target.value)}
                          disabled={isReadOnly}
                        />
                      </Field>
                      <Field label="Phone">
                        <input
                          type="tel"
                          className={styles.fieldInput}
                          placeholder="+31 6 00 00 00 00"
                          value={contact.phone}
                          onChange={(e) => updateContact(contact._key, 'phone', e.target.value)}
                          disabled={isReadOnly}
                        />
                      </Field>
                      <Field label="Email">
                        <input
                          type="email"
                          className={styles.fieldInput}
                          placeholder="name@company.nl"
                          value={contact.email}
                          onChange={(e) => updateContact(contact._key, 'email', e.target.value)}
                          disabled={isReadOnly}
                        />
                      </Field>
                    </div>
                  </div>
                ))}
              </div>
              {!isReadOnly && (
                <button className={styles.addContactBtn} type="button" onClick={addContact}>
                  <Plus size={15} strokeWidth={2} />
                  Add Another Contact
                </button>
              )}
            </SectionCard>

            {/* ── Section 4: Parking & Washing Bay ── */}
            <SectionCard
              id="parking" num={4} icon={Truck}
              label="Parking & Washing Bay Specifications"
              isDone={isReadOnly && sectionComplete.parking}
              readOnly={isReadOnly}
            >
              <Field label="Parking & Bay Specifications" required>
                <textarea
                  className={styles.fieldTextarea}
                  placeholder="Number of bays, dimensions, overhead clearance, capacity (number of trucks), special equipment available…"
                  value={parkingSpecs}
                  onChange={(e) => setParkingSpecs(e.target.value)}
                  rows={4}
                  disabled={isReadOnly}
                />
              </Field>
            </SectionCard>

            {/* ── Section 5: Water & Power Supply ── */}
            <SectionCard
              id="supply" num={5} icon={Zap}
              label="Water & Power Supply"
              isDone={isReadOnly && sectionComplete.supply}
              readOnly={isReadOnly}
            >
              <Field label="Water Supply" required>
                <textarea
                  className={styles.fieldTextarea}
                  placeholder="Water source (mains/tank), pressure (bar), flow rate (L/min), hot water availability, meter reference…"
                  value={waterSupply}
                  onChange={(e) => setWaterSupply(e.target.value)}
                  rows={3}
                  disabled={isReadOnly}
                />
              </Field>
              <Field label="Power Supply" required>
                <textarea
                  className={styles.fieldTextarea}
                  placeholder="Voltage (V), phase (single/three), amperage, socket types available, emergency backup…"
                  value={powerSupply}
                  onChange={(e) => setPowerSupply(e.target.value)}
                  rows={3}
                  disabled={isReadOnly}
                />
              </Field>
            </SectionCard>

            {/* ── Section 6: Waste Disposal ── */}
            <SectionCard
              id="waste" num={6} icon={AlertTriangle}
              label="Waste Disposal"
              isDone={isReadOnly && sectionComplete.waste}
              readOnly={isReadOnly}
            >
              <Field label="Waste Disposal Provisions" required>
                <textarea
                  className={styles.fieldTextarea}
                  placeholder="Interceptor pit capacity, compliance certificates, waste contractor, permit numbers, discharge route…"
                  value={wasteDisposal}
                  onChange={(e) => setWasteDisposal(e.target.value)}
                  rows={4}
                  disabled={isReadOnly}
                />
              </Field>
            </SectionCard>

            {/* ── Section 7: Safety Requirements ── */}
            <SectionCard
              id="safety" num={7} icon={Shield}
              label="Safety Requirements"
              isDone={isReadOnly && sectionComplete.safety}
              readOnly={isReadOnly}
            >
              <Field label="Site Safety Requirements" required>
                <textarea
                  className={styles.fieldTextarea}
                  placeholder="Required PPE, site rules, no-smoking zones, emergency procedures, first aid, inspection certificates…"
                  value={safetyRequirements}
                  onChange={(e) => setSafetyRequirements(e.target.value)}
                  rows={4}
                  disabled={isReadOnly}
                />
              </Field>
            </SectionCard>

            {/* ── Section 8: Special Instructions ── */}
            <SectionCard
              id="special" num={8} icon={FileText}
              label="Special Instructions"
              isDone={isReadOnly && specialInstructions.trim().length > 0}
              readOnly={isReadOnly}
            >
              <Field label="Special Instructions (optional)">
                <textarea
                  className={styles.fieldTextarea}
                  placeholder="HACCP requirements, ADR cargo handling, food-grade protocols, custom wash procedures, certification requirements…"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  rows={4}
                  disabled={isReadOnly}
                />
              </Field>
            </SectionCard>

            {/* ── Submit row (only shown when not read-only) ── */}
            {!isReadOnly && (
              <div className={styles.submitRow}>
                <button
                  className={styles.submitBtn}
                  type="button"
                  disabled={!allRequiredComplete}
                  onClick={() => setShowSubmitModal(true)}
                  title={!allRequiredComplete ? 'Complete all required sections first' : undefined}
                >
                  <Send size={15} strokeWidth={2} />
                  Submit to BTC
                </button>
                <button
                  className={styles.saveDraftBtn}
                  type="button"
                >
                  <Save size={15} strokeWidth={1.8} />
                  Save Draft
                </button>
                <span className={styles.submitHint}>
                  {allRequiredComplete
                    ? 'All required sections complete'
                    : `${requiredSections.filter((s) => !sectionComplete[s]).length} required section(s) incomplete`}
                </span>
              </div>
            )}

            {/* ── Management Review Panel ── */}
            {isManagementView && (manualStatus === 'SUBMITTED' || manualStatus === 'APPROVED') && (
              <div className={styles.mgmtPanel}>
                <div className={styles.mgmtPanelHeader}>
                  <Shield size={16} strokeWidth={1.8} style={{ color: 'var(--primary-0)' }} />
                  <span className={styles.mgmtPanelTitle}>Management Review</span>
                </div>
                <div className={styles.mgmtPanelBody}>
                  {mgmtActionDone === 'approved' ? (
                    <div className={styles.mgmtSuccess}>
                      <CheckCircle2 size={16} strokeWidth={2} />
                      Location manual approved. The lead has been moved to Contract Review stage.
                    </div>
                  ) : mgmtActionDone === 'requested_changes' ? (
                    <div className={styles.mgmtSuccess} style={{ background: 'var(--alert-warning-secondary)', borderColor: 'rgba(224,153,21,0.2)', color: 'var(--alert-warning-primary)' }}>
                      <AlertTriangle size={16} strokeWidth={2} />
                      Amendment request sent to the lead. They can now edit and resubmit.
                    </div>
                  ) : (
                    <>
                      <div>
                        <div className={styles.mgmtNotesLabel}>Review Notes (optional)</div>
                        <textarea
                          className={styles.mgmtTextarea}
                          placeholder="Add notes for the lead or internal review comments…"
                          value={mgmtNotes}
                          onChange={(e) => setMgmtNotes(e.target.value)}
                        />
                      </div>
                      <div className={styles.mgmtActions}>
                        <button
                          className={styles.mgmtApproveBtn}
                          type="button"
                          onClick={handleMgmtApprove}
                          disabled={manualStatus === 'APPROVED'}
                        >
                          <CheckCircle2 size={15} strokeWidth={2} />
                          {manualStatus === 'APPROVED' ? 'Already Approved' : 'Approve Manual'}
                        </button>
                        <button
                          className={styles.mgmtRejectBtn}
                          type="button"
                          onClick={handleMgmtRequestChanges}
                        >
                          <AlertTriangle size={15} strokeWidth={2} />
                          Request Changes
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
