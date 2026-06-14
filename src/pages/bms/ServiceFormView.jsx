import { FileText, X } from 'lucide-react';
import Modal from '../../components/shared/Modal';
import styles from '../leads/ProposalPreview.module.css';

const money = (amount, currency = 'EUR') =>
  new Intl.NumberFormat('nl-NL', { style: 'currency', currency, minimumFractionDigits: 2 }).format(
    amount || 0
  );

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
}

// Read-only document view of a submitted Service Detail Form (Form 2). Reuses the
// proposal document styling so both client documents look like one paper trail.
export default function ServiceFormView({ isOpen, onClose, lead }) {
  const sdf = lead?.serviceDetailsForm;

  if (!sdf) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Service Detail Form">
        <div className={styles.empty}>
          <FileText size={36} strokeWidth={1.3} />
          <p>No service detail form on file for this client.</p>
        </div>
      </Modal>
    );
  }

  const rows = sdf.vehicleTable || [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Service Detail Form" size="lg">
      <div className={styles.doc}>
        {/* Header */}
        <div className={styles.docHeader}>
          <div className={styles.brand}>
            <div className={styles.logoMark}><span>BTC</span></div>
            <div>
              <div className={styles.brandName}>Basiq Truckcleaning</div>
              <div className={styles.brandSub}>Service Detail Form</div>
            </div>
          </div>
          <div className={styles.docMeta}>
            {lead.serviceFormId && <span className={styles.quoteRef}>{lead.serviceFormId}</span>}
            <span className={`${styles.statusPill} ${styles.pill_ACCEPTED}`}>
              Submitted {formatDate(sdf.form2SubmittedAt)}
            </span>
          </div>
        </div>

        {/* Parties / registration */}
        <div className={styles.parties}>
          <div>
            <div className={styles.partyLabel}>Submitted by</div>
            <div className={styles.partyName}>{lead.companyName}</div>
            <div className={styles.partyLine}>{sdf.contactFullName || lead.contactPerson}</div>
            <div className={styles.partyLine}>
              {sdf.street} {sdf.houseNumber}, {sdf.postalCode} {sdf.city}
            </div>
          </div>
          <div className={styles.partyRight}>
            <div className={styles.termRow}><span>KVK</span><span>{sdf.kvkNumber || '—'}</span></div>
            <div className={styles.termRow}><span>VAT (BTW)</span><span>{sdf.vatNumber || '—'}</span></div>
            <div className={styles.termRow}><span>IBAN</span><span>{sdf.bankNumber || '—'}</span></div>
          </div>
        </div>

        {/* Service terms */}
        <div className={styles.terms}>
          <div className={styles.termCol}><span className={styles.termKey}>Service type</span><span className={styles.termVal}>{sdf.serviceType || '—'}</span></div>
          <div className={styles.termCol}><span className={styles.termKey}>Wash location</span><span className={styles.termVal}>{sdf.washLocation || '—'}</span></div>
          <div className={styles.termCol}><span className={styles.termKey}>Shunting</span><span className={styles.termVal}>{sdf.shuntingOption || '—'}</span></div>
          <div className={styles.termCol}><span className={styles.termKey}>Preferred schedule</span><span className={styles.termVal}>{sdf.preferredSchedule || '—'}</span></div>
          <div className={styles.termCol}><span className={styles.termKey}>Winter frequency</span><span className={styles.termVal}>{sdf.winterFrequency ? 'Increased in winter' : 'Standard'}</span></div>
          <div className={styles.termCol}><span className={styles.termKey}>Discount</span><span className={styles.termVal}>{sdf.discount ? `${sdf.discountPercent}%` : 'None'}</span></div>
        </div>

        {/* Vehicles */}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>Type</th>
              <th className={styles.colCenter}>Freq.</th>
              <th>Treatments</th>
              <th className={styles.colRight}>Price / wash</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td>{r.vehicleNumber || `Vehicle ${i + 1}`}</td>
                <td className={styles.muted}>{r.vehicleType}</td>
                <td className={styles.colCenter}>{r.frequencyWeeks === 1 ? 'Weekly' : `${r.frequencyWeeks}w`}</td>
                <td className={styles.muted}>{(r.treatments || []).join(', ')}</td>
                <td className={styles.colRight}>{money(r.pricePerVehicle)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {sdf.additionalAgreements && (
          <div className={styles.terms}>
            <div className={`${styles.termCol} ${styles.termColFull}`}>
              <span className={styles.termKey}>Additional agreements</span>
              <span className={styles.termVal} style={{ fontWeight: 400 }}>{sdf.additionalAgreements}</span>
            </div>
          </div>
        )}

        <div className={styles.actions}>
          <span className={styles.mbLink} style={{ cursor: 'default' }}>
            <FileText size={14} /> Form reference {lead.serviceFormId || '—'}
          </span>
          <div className={styles.actionsRight}>
            <button type="button" className={styles.closeBtn} onClick={onClose}>
              <X size={14} /> Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
