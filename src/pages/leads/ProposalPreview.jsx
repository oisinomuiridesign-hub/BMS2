import { useMemo, useState } from 'react';
import { FileText, X, Pencil, Check, Send, ExternalLink } from 'lucide-react';
import Modal from '../../components/shared/Modal';
import styles from './ProposalPreview.module.css';

const money = (amount, currency = 'EUR') =>
  new Intl.NumberFormat('nl-NL', { style: 'currency', currency, minimumFractionDigits: 2 }).format(
    amount || 0
  );

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
}

// A document-style preview of the draft/sent proposal. The "proposal" is the
// lead's agreement record; line items come from the agreement (if customised)
// or fall back to the submitted service-detail vehicle table. Supports light
// in-place editing of prices and terms for the customize-and-resend loop.
export default function ProposalPreview({
  isOpen,
  onClose,
  lead,
  proposal,
  onSave,
  onSend,
  sendLabel,
}) {
  const sdf = lead?.serviceDetailsForm || {};
  const baseLineItems = useMemo(
    () => proposal?.lineItems || sdf.vehicleTable || [],
    [proposal, sdf.vehicleTable]
  );

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(null);

  if (!proposal) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Proposal">
        <div className={styles.empty}>
          <FileText size={36} strokeWidth={1.3} />
          <p>No proposal has been drafted for this lead yet.</p>
        </div>
      </Modal>
    );
  }

  // Initialise the editable draft when entering edit mode.
  function startEditing() {
    setDraft({
      lineItems: baseLineItems.map((r) => ({ ...r })),
      contractDuration: proposal.contractDuration || '12 months',
      startDate: proposal.startDate || '',
      paymentTerms: proposal.paymentTerms || '',
      discountPercent: proposal.discountPercent ?? '',
    });
    setEditing(true);
  }

  const view = editing && draft ? draft : { ...proposal, lineItems: baseLineItems };
  const lineItems = view.lineItems;
  const subtotal = lineItems.reduce((s, r) => s + (Number(r.pricePerVehicle) || 0), 0);
  const discountPct = Number(view.discountPercent) || 0;
  const discountAmt = subtotal * (discountPct / 100);
  const net = subtotal - discountAmt;
  const vat = net * 0.21;
  const total = net + vat;

  const setLinePrice = (idx, value) =>
    setDraft((d) => ({
      ...d,
      lineItems: d.lineItems.map((r, i) =>
        i === idx ? { ...r, pricePerVehicle: value === '' ? '' : Number(value) } : r
      ),
    }));

  function handleSave() {
    const cleanedItems = draft.lineItems.map((r) => ({
      ...r,
      pricePerVehicle: Number(r.pricePerVehicle) || 0,
    }));
    onSave?.({
      lineItems: cleanedItems,
      pricePerWash: cleanedItems.reduce((s, r) => s + r.pricePerVehicle, 0),
      contractDuration: draft.contractDuration,
      startDate: draft.startDate,
      paymentTerms: draft.paymentTerms,
      discountPercent: draft.discountPercent === '' ? null : Number(draft.discountPercent),
    });
    setEditing(false);
    setDraft(null);
  }

  function handleSend() {
    if (editing && draft) handleSave();
    onSend?.();
  }

  const statusLabel =
    proposal.status === 'DRAFT' ? 'Draft — not yet sent'
    : proposal.status === 'AWAITING_ACCEPTANCE' ? 'Sent — awaiting acceptance'
    : proposal.status === 'ACCEPTED' ? 'Accepted'
    : proposal.status;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Service Proposal" size="lg">
      <div className={styles.doc}>
        {/* Document header */}
        <div className={styles.docHeader}>
          <div className={styles.brand}>
            <div className={styles.logoMark}><span>BTC</span></div>
            <div>
              <div className={styles.brandName}>Basiq Truckcleaning</div>
              <div className={styles.brandSub}>Service Proposal &amp; Quote</div>
            </div>
          </div>
          <div className={styles.docMeta}>
            {proposal.moneybirdQuoteRef && (
              <span className={styles.quoteRef}>{proposal.moneybirdQuoteRef}</span>
            )}
            <span className={`${styles.statusPill} ${styles[`pill_${proposal.status}`] || ''}`}>
              {statusLabel}
            </span>
            {proposal.version > 1 && <span className={styles.version}>v{proposal.version}</span>}
          </div>
        </div>

        <div className={styles.demoNote}>
          For demonstration — this draft is generated automatically from the submitted service
          details and would sync to Moneybird in the live system.
        </div>

        {/* Parties */}
        <div className={styles.parties}>
          <div>
            <div className={styles.partyLabel}>Prepared for</div>
            <div className={styles.partyName}>{lead.companyName}</div>
            <div className={styles.partyLine}>{sdf.contactFullName || lead.contactPerson}</div>
            <div className={styles.partyLine}>{lead.location}</div>
          </div>
          <div className={styles.partyRight}>
            <div className={styles.termRow}><span>Vehicles</span><span>{lineItems.length}</span></div>
            <div className={styles.termRow}><span>Frequency</span><span>{proposal.washFrequency}</span></div>
            <div className={styles.termRow}><span>Service</span><span>{proposal.serviceType}</span></div>
          </div>
        </div>

        {/* Line items */}
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
            {lineItems.map((r, i) => (
              <tr key={i}>
                <td>{r.vehicleNumber || `Vehicle ${i + 1}`}</td>
                <td className={styles.muted}>{r.vehicleType}</td>
                <td className={styles.colCenter}>
                  {r.frequencyWeeks === 1 ? 'Weekly' : `${r.frequencyWeeks}w`}
                </td>
                <td className={styles.muted}>{(r.treatments || []).join(', ')}</td>
                <td className={styles.colRight}>
                  {editing ? (
                    <input
                      type="number"
                      className={styles.priceInput}
                      value={r.pricePerVehicle}
                      onChange={(e) => setLinePrice(i, e.target.value)}
                    />
                  ) : (
                    money(r.pricePerVehicle, proposal.currency)
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className={styles.totals}>
          <div className={styles.totalRow}><span>Subtotal / wash</span><span>{money(subtotal, proposal.currency)}</span></div>
          {(discountPct > 0 || editing) && (
            <div className={styles.totalRow}>
              <span>
                Discount
                {editing ? (
                  <input
                    type="number"
                    className={styles.discountInput}
                    value={draft.discountPercent}
                    onChange={(e) => setDraft((d) => ({ ...d, discountPercent: e.target.value }))}
                  />
                ) : ` (${discountPct}%)`}
              </span>
              <span>−{money(discountAmt, proposal.currency)}</span>
            </div>
          )}
          <div className={styles.totalRow}><span>VAT (21%)</span><span>{money(vat, proposal.currency)}</span></div>
          <div className={`${styles.totalRow} ${styles.grand}`}><span>Total / wash</span><span>{money(total, proposal.currency)}</span></div>
        </div>

        {/* Terms */}
        <div className={styles.terms}>
          <div className={styles.termCol}>
            <span className={styles.termKey}>Contract duration</span>
            {editing ? (
              <input className={styles.termInput} value={draft.contractDuration}
                onChange={(e) => setDraft((d) => ({ ...d, contractDuration: e.target.value }))} />
            ) : <span className={styles.termVal}>{proposal.contractDuration}</span>}
          </div>
          <div className={styles.termCol}>
            <span className={styles.termKey}>Start date</span>
            {editing ? (
              <input type="date" className={styles.termInput} value={draft.startDate}
                onChange={(e) => setDraft((d) => ({ ...d, startDate: e.target.value }))} />
            ) : <span className={styles.termVal}>{formatDate(proposal.startDate)}</span>}
          </div>
          <div className={`${styles.termCol} ${styles.termColFull}`}>
            <span className={styles.termKey}>Payment terms</span>
            {editing ? (
              <input className={styles.termInput} value={draft.paymentTerms}
                onChange={(e) => setDraft((d) => ({ ...d, paymentTerms: e.target.value }))} />
            ) : <span className={styles.termVal}>{proposal.paymentTerms}</span>}
          </div>
        </div>

        {proposal.status === 'ACCEPTED' && proposal.acceptedBy && (
          <div className={styles.acceptedBanner}>
            <Check size={16} /> Accepted by {proposal.acceptedBy} on {formatDate(proposal.acceptedAt)}
          </div>
        )}

        {/* Footer actions */}
        <div className={styles.actions}>
          <a
            href="https://moneybird.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.mbLink}
          >
            <ExternalLink size={14} /> Open in Moneybird
          </a>
          <div className={styles.actionsRight}>
            {proposal.status !== 'ACCEPTED' && !editing && (
              <button type="button" className={styles.editBtn} onClick={startEditing}>
                <Pencil size={14} /> Edit terms
              </button>
            )}
            {editing && (
              <button type="button" className={styles.editBtn} onClick={handleSave}>
                <Check size={14} /> Save changes
              </button>
            )}
            {onSend && proposal.status !== 'ACCEPTED' && (
              <button type="button" className={styles.sendBtn} onClick={handleSend}>
                <Send size={14} /> {sendLabel || 'Send Proposal'}
              </button>
            )}
            <button type="button" className={styles.closeBtn} onClick={onClose}>
              <X size={14} /> Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
