import { useMemo, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Building2,
  User,
  MapPin,
  Truck,
  FileText,
  Plus,
  Trash2,
  Send,
  CheckCircle2,
  Info,
  ArrowLeft,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import styles from './ServiceDetailsForm.module.css';

// ── Option sets (mirror the values used across the lead fixtures) ─────────────
const SERVICE_TYPES = ['Client comes to BTC facility', 'BTC comes on-site (mobile)'];
const SHUNTING_OPTIONS = ['Client handles shunting', 'Basiq with C/E license (paid)'];
const WASH_LOCATIONS = ['BTC facility', 'Client site (mobile)'];
const SCHEDULE_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const VEHICLE_TYPES = [
  'Oplegger (Semi-trailer)',
  'Bulkoplegger',
  'Tankwagen (Tank truck)',
  'Koeloplegger (Reefer trailer)',
  'Containeroplegger',
];
const TREATMENTS = ['Buitenwas', 'Binnenspuiten', 'Chemisch reinigen', 'Stoomreiniging'];
const FREQUENCIES = [
  { value: 1, label: 'Weekly' },
  { value: 2, label: 'Every 2 weeks' },
  { value: 4, label: 'Every 4 weeks' },
];

// Best-effort parse of "Ambachtsweg 18, 5253 RB Nieuwkuijk" for prefill.
function parseLocation(location) {
  if (!location) return { street: '', houseNumber: '', postalCode: '', city: '' };
  const [streetPart = '', cityPart = ''] = location.split(',').map((s) => s.trim());
  const houseMatch = streetPart.match(/\s(\d+\w*)$/);
  const houseNumber = houseMatch ? houseMatch[1] : '';
  const street = houseMatch ? streetPart.slice(0, houseMatch.index).trim() : streetPart;
  const cityTokens = cityPart.split(' ');
  // NL postcode is "1234 AB"
  const postalCode = cityTokens.slice(0, 2).join(' ').match(/^\d{4}\s?[A-Z]{2}$/i)
    ? cityTokens.slice(0, 2).join(' ')
    : '';
  const city = postalCode ? cityTokens.slice(2).join(' ') : cityPart;
  return { street, houseNumber, postalCode, city };
}

function emptyVehicleRow() {
  return { vehicleNumber: '', vehicleType: VEHICLE_TYPES[0], frequencyWeeks: 1, treatments: ['Buitenwas'], pricePerVehicle: '' };
}

// Build the initial form state from whatever BMS already knows about the lead.
function buildInitialForm(lead) {
  const existing = lead?.serviceDetailsForm;
  const loc = parseLocation(lead?.location);
  return {
    companyName: lead?.companyName || '',
    contactFullName: existing?.contactFullName || lead?.contactPerson || '',
    contactDepartment: existing?.contactDepartment || 'Fleet Manager',
    contactTelephone: existing?.contactTelephone || lead?.contactPhone || '',
    contactEmail: existing?.contactEmail || lead?.contactEmail || '',
    kvkNumber: existing?.kvkNumber || '',
    vatNumber: existing?.vatNumber || '',
    bankNumber: existing?.bankNumber || '',
    street: existing?.street || loc.street,
    houseNumber: existing?.houseNumber || loc.houseNumber,
    postalCode: existing?.postalCode || loc.postalCode,
    city: existing?.city || loc.city,
    country: existing?.country || 'Netherlands',
    serviceType: existing?.serviceType || SERVICE_TYPES[0],
    shuntingOption: existing?.shuntingOption || SHUNTING_OPTIONS[0],
    washLocation: existing?.washLocation || WASH_LOCATIONS[0],
    preferredSchedule: existing?.preferredSchedule || 'Wednesday',
    winterFrequency: existing?.winterFrequency ?? false,
    discount: existing?.discount ?? false,
    discountPercent: existing?.discountPercent ?? '',
    additionalAgreements: existing?.additionalAgreements || '',
    vehicleTable:
      existing?.vehicleTable && existing.vehicleTable.length
        ? existing.vehicleTable.map((v) => ({ ...v }))
        : [emptyVehicleRow()],
  };
}

// ── Reusable bits ─────────────────────────────────────────────────────────────
function Section({ icon: Icon, num, title, hint, children }) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHead}>
        <span className={styles.sectionNum}>{num}</span>
        <Icon size={18} className={styles.sectionIcon} />
        <div>
          <h2 className={styles.sectionTitle}>{title}</h2>
          {hint && <p className={styles.sectionHint}>{hint}</p>}
        </div>
      </div>
      <div className={styles.sectionBody}>{children}</div>
    </section>
  );
}

function Field({ label, children, full }) {
  return (
    <div className={`${styles.field} ${full ? styles.fieldFull : ''}`}>
      <label className={styles.label}>{label}</label>
      {children}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function ServiceDetailsForm() {
  const { formId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { leads, submitServiceDetailsForm } = useData();

  const isMgmt = searchParams.get('mgmt') === '1';
  const leadParam = searchParams.get('lead');
  // Resolve by the session-assigned form ID first; fall back to the lead id in
  // the URL so the form also works in a fresh tab / from an emailed link, where
  // the form ID hasn't been written into this context's data.
  const lead = useMemo(
    () => leads.find((l) => l.serviceFormId === formId) || leads.find((l) => l.id === leadParam),
    [leads, formId, leadParam]
  );

  const [form, setForm] = useState(() => buildInitialForm(lead));
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedLeadId, setSubmittedLeadId] = useState(null);

  // Form ID exists but matches no lead → friendly fallback.
  if (!lead) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.notFound}>
            <Info size={32} strokeWidth={1.5} />
            <h1>Form not found</h1>
            <p>
              We couldn&apos;t find a service form for <strong>{formId}</strong>. The link may have
              expired or been mistyped.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const setVehicle = (idx, key, value) =>
    setForm((f) => ({
      ...f,
      vehicleTable: f.vehicleTable.map((row, i) => (i === idx ? { ...row, [key]: value } : row)),
    }));

  const toggleTreatment = (idx, treatment) =>
    setForm((f) => ({
      ...f,
      vehicleTable: f.vehicleTable.map((row, i) => {
        if (i !== idx) return row;
        const has = row.treatments.includes(treatment);
        return {
          ...row,
          treatments: has
            ? row.treatments.filter((t) => t !== treatment)
            : [...row.treatments, treatment],
        };
      }),
    }));

  const addVehicle = () => setForm((f) => ({ ...f, vehicleTable: [...f.vehicleTable, emptyVehicleRow()] }));
  const removeVehicle = (idx) =>
    setForm((f) => ({ ...f, vehicleTable: f.vehicleTable.filter((_, i) => i !== idx) }));

  function handleConfirmSubmit() {
    const payload = {
      ...form,
      discountPercent: form.discount ? Number(form.discountPercent) || 0 : null,
      vehicleTable: form.vehicleTable.map((v) => ({
        ...v,
        frequencyWeeks: Number(v.frequencyWeeks),
        pricePerVehicle: Number(v.pricePerVehicle) || 0,
      })),
    };
    const leadId = submitServiceDetailsForm(formId, payload, lead.id);
    setSubmittedLeadId(leadId);
    setShowConfirm(false);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ── Success state ───────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.success}>
            <div className={styles.successIcon}>
              <CheckCircle2 size={40} strokeWidth={1.6} />
            </div>
            <h1 className={styles.successTitle}>Service details submitted</h1>
            <p className={styles.successText}>
              Thank you. The service details for <strong>{form.companyName}</strong> have been sent to
              Basiq Truckcleaning. Our team will review them and prepare your service agreement and
              quote.
            </p>
            <div className={styles.successMeta}>Form reference: {formId}</div>
            {isMgmt && submittedLeadId && (
              <button
                type="button"
                className={styles.returnBtn}
                onClick={() => navigate(`/leads/${submittedLeadId}`)}
              >
                <ArrowLeft size={16} />
                Return to lead in BMS
              </button>
            )}
          </div>
        </div>
        <div className={styles.footer}>
          &copy; {new Date().getFullYear()} Basiq Truckcleaning B.V.
        </div>
      </div>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────────────
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Header / brand */}
        <header className={styles.header}>
          <div className={styles.brand}>
            <div className={styles.logoMark}>
              <span className={styles.logoInitials}>BTC</span>
            </div>
            <div className={styles.brandText}>
              <span className={styles.brandName}>Basiq Truckcleaning</span>
              <span className={styles.brandSub}>Service Detail Form</span>
            </div>
          </div>
          <span className={styles.formIdBadge}>{formId}</span>
        </header>

        {/* Demonstration note */}
        <div className={styles.demoNote}>
          <Info size={16} strokeWidth={2} />
          <span>
            <strong>For demonstration purposes only.</strong> In the live system, every detail
            captured here flows into a full service agreement and Moneybird quote.
          </span>
        </div>

        {/* Context line — planner vs lead */}
        {isMgmt ? (
          <p className={styles.intro}>
            You&apos;re completing this form on behalf of <strong>{form.companyName}</strong> while on
            the call. Pre-filled details can be edited — confirm each field with the customer.
          </p>
        ) : (
          <p className={styles.intro}>
            Welcome{form.contactFullName ? `, ${form.contactFullName}` : ''}. Please review and
            complete your service details below so we can prepare your agreement.
          </p>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setShowConfirm(true);
          }}
        >
          {/* 1 — Company & contact */}
          <Section icon={Building2} num={1} title="Company & Contact">
            <div className={styles.grid}>
              <Field label="Company name" full>
                <input className={styles.input} value={form.companyName} onChange={(e) => set('companyName', e.target.value)} />
              </Field>
              <Field label="Contact name">
                <input className={styles.input} value={form.contactFullName} onChange={(e) => set('contactFullName', e.target.value)} />
              </Field>
              <Field label="Department / role">
                <input className={styles.input} value={form.contactDepartment} onChange={(e) => set('contactDepartment', e.target.value)} />
              </Field>
              <Field label="Telephone">
                <input className={styles.input} value={form.contactTelephone} onChange={(e) => set('contactTelephone', e.target.value)} />
              </Field>
              <Field label="Email">
                <input className={styles.input} type="email" value={form.contactEmail} onChange={(e) => set('contactEmail', e.target.value)} />
              </Field>
              <Field label="KVK number">
                <input className={styles.input} value={form.kvkNumber} onChange={(e) => set('kvkNumber', e.target.value)} placeholder="12345678" />
              </Field>
              <Field label="VAT (BTW) number">
                <input className={styles.input} value={form.vatNumber} onChange={(e) => set('vatNumber', e.target.value)} placeholder="NL000000000B01" />
              </Field>
              <Field label="Bank (IBAN)" full>
                <input className={styles.input} value={form.bankNumber} onChange={(e) => set('bankNumber', e.target.value)} placeholder="NL00BANK0000000000" />
              </Field>
            </div>
          </Section>

          {/* 2 — Billing address */}
          <Section icon={MapPin} num={2} title="Billing Address">
            <div className={styles.grid}>
              <Field label="Street">
                <input className={styles.input} value={form.street} onChange={(e) => set('street', e.target.value)} />
              </Field>
              <Field label="House number">
                <input className={styles.input} value={form.houseNumber} onChange={(e) => set('houseNumber', e.target.value)} />
              </Field>
              <Field label="Postal code">
                <input className={styles.input} value={form.postalCode} onChange={(e) => set('postalCode', e.target.value)} />
              </Field>
              <Field label="City">
                <input className={styles.input} value={form.city} onChange={(e) => set('city', e.target.value)} />
              </Field>
              <Field label="Country" full>
                <input className={styles.input} value={form.country} onChange={(e) => set('country', e.target.value)} />
              </Field>
            </div>
          </Section>

          {/* 3 — Service agreement */}
          <Section icon={FileText} num={3} title="Service Agreement">
            <div className={styles.grid}>
              <Field label="Service type">
                <select className={styles.input} value={form.serviceType} onChange={(e) => set('serviceType', e.target.value)}>
                  {SERVICE_TYPES.map((o) => <option key={o}>{o}</option>)}
                </select>
              </Field>
              <Field label="Wash location">
                <select className={styles.input} value={form.washLocation} onChange={(e) => set('washLocation', e.target.value)}>
                  {WASH_LOCATIONS.map((o) => <option key={o}>{o}</option>)}
                </select>
              </Field>
              <Field label="Shunting">
                <select className={styles.input} value={form.shuntingOption} onChange={(e) => set('shuntingOption', e.target.value)}>
                  {SHUNTING_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                </select>
              </Field>
              <Field label="Preferred schedule">
                <select className={styles.input} value={form.preferredSchedule} onChange={(e) => set('preferredSchedule', e.target.value)}>
                  {SCHEDULE_DAYS.map((o) => <option key={o}>{o}</option>)}
                </select>
              </Field>
              <Field label="Discount">
                <div className={styles.inlineControl}>
                  <label className={styles.checkRow}>
                    <input type="checkbox" checked={form.discount} onChange={(e) => set('discount', e.target.checked)} />
                    Apply discount
                  </label>
                  {form.discount && (
                    <div className={styles.percentWrap}>
                      <input
                        className={styles.percentInput}
                        type="number"
                        min="0"
                        max="100"
                        value={form.discountPercent}
                        onChange={(e) => set('discountPercent', e.target.value)}
                      />
                      <span>%</span>
                    </div>
                  )}
                </div>
              </Field>
              <Field label="Winter frequency">
                <label className={styles.checkRow}>
                  <input type="checkbox" checked={form.winterFrequency} onChange={(e) => set('winterFrequency', e.target.checked)} />
                  Increase frequency in winter
                </label>
              </Field>
            </div>
          </Section>

          {/* 4 — Vehicles */}
          <Section icon={Truck} num={4} title="Vehicles" hint="Add each vehicle, its wash frequency, and the treatments it needs.">
            <div className={styles.vehicleList}>
              {form.vehicleTable.map((row, idx) => (
                <div key={idx} className={styles.vehicleRow}>
                  <div className={styles.vehicleRowHead}>
                    <span className={styles.vehicleRowNum}>Vehicle {idx + 1}</span>
                    {form.vehicleTable.length > 1 && (
                      <button type="button" className={styles.removeBtn} onClick={() => removeVehicle(idx)} aria-label="Remove vehicle">
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                  <div className={styles.vehicleGrid}>
                    <Field label="Vehicle ID">
                      <input className={styles.input} value={row.vehicleNumber} onChange={(e) => setVehicle(idx, 'vehicleNumber', e.target.value)} placeholder="e.g. BL-001" />
                    </Field>
                    <Field label="Type">
                      <select className={styles.input} value={row.vehicleType} onChange={(e) => setVehicle(idx, 'vehicleType', e.target.value)}>
                        {VEHICLE_TYPES.map((o) => <option key={o}>{o}</option>)}
                      </select>
                    </Field>
                    <Field label="Frequency">
                      <select className={styles.input} value={row.frequencyWeeks} onChange={(e) => setVehicle(idx, 'frequencyWeeks', e.target.value)}>
                        {FREQUENCIES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </Field>
                    <Field label="Price / wash (€)">
                      <input className={styles.input} type="number" min="0" value={row.pricePerVehicle} onChange={(e) => setVehicle(idx, 'pricePerVehicle', e.target.value)} placeholder="0" />
                    </Field>
                  </div>
                  <div className={styles.treatments}>
                    <span className={styles.treatmentsLabel}>Treatments</span>
                    <div className={styles.chipRow}>
                      {TREATMENTS.map((t) => {
                        const active = row.treatments.includes(t);
                        return (
                          <button
                            type="button"
                            key={t}
                            className={`${styles.chip} ${active ? styles.chipActive : ''}`}
                            onClick={() => toggleTreatment(idx, t)}
                          >
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" className={styles.addBtn} onClick={addVehicle}>
              <Plus size={16} />
              Add vehicle
            </button>
          </Section>

          {/* 5 — Additional agreements */}
          <Section icon={FileText} num={5} title="Additional Agreements">
            <textarea
              className={styles.textarea}
              rows={4}
              placeholder="Any special requirements, certifications, or scheduling notes…"
              value={form.additionalAgreements}
              onChange={(e) => set('additionalAgreements', e.target.value)}
            />
          </Section>

          <div className={styles.submitBar}>
            <button type="submit" className={styles.submitBtn}>
              <Send size={16} />
              Submit service details
            </button>
          </div>
        </form>
      </div>

      <div className={styles.footer}>&copy; {new Date().getFullYear()} Basiq Truckcleaning B.V.</div>

      {/* Confirm modal */}
      {showConfirm && (
        <div className={styles.modalOverlay} onClick={() => setShowConfirm(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalIcon}>
              <Send size={24} strokeWidth={1.8} />
            </div>
            <h2 className={styles.modalTitle}>Submit service details?</h2>
            <p className={styles.modalText}>
              {isMgmt
                ? `Confirm the details for ${form.companyName} are correct. This will advance the lead to "Details Submitted" in BMS.`
                : 'Once submitted, the BTC team will use these details to prepare your agreement. You can contact us to make changes.'}
            </p>
            <div className={styles.modalActions}>
              <button className={styles.modalCancelBtn} type="button" onClick={() => setShowConfirm(false)}>
                Keep editing
              </button>
              <button className={styles.modalSubmitBtn} type="button" onClick={handleConfirmSubmit}>
                Confirm &amp; submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
