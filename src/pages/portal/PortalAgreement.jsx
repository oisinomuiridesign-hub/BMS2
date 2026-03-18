import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  FilePen,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileCheck,
  Download,
  Pen,
  Plus,
  Lock,
  X,
  Truck,
  Calendar,
  DollarSign,
} from 'lucide-react';
import { isStageAvailable } from '../../components/portal/PortalShell';
import { usePortalAuth } from '../../context/PortalAuthContext';
import { findAgreementByPortalId } from '../../data/portal/agreements';
import sectionStyles from './PortalSection.module.css';
import styles from './PortalAgreement.module.css';

// ─── Terms eligible for amendment ────────────────────────────────────────────
const AMENDABLE_TERMS = [
  'Vehicle Count',
  'Wash Frequency',
  'Service Type',
  'Price Per Wash',
  'Contract Duration',
  'Start Date',
  'End Date',
  'Payment Terms',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
}

function formatDateTime(isoString) {
  if (!isoString) return '—';
  const d = new Date(isoString);
  return (
    d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) +
    ' at ' +
    d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  );
}

function formatPrice(amount, currency) {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: currency || 'EUR',
    minimumFractionDigits: 2,
  }).format(amount);
}

// ─── Confirm Accept Modal ─────────────────────────────────────────────────────
function ConfirmAcceptModal({ companyName, onCancel, onConfirm }) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalCard}>
        <div className={styles.modalIcon}>
          <FileCheck size={26} strokeWidth={1.8} />
        </div>
        <h2 className={styles.modalTitle}>Confirm Digital Acceptance</h2>
        <p className={styles.modalText}>
          By clicking <strong>Confirm</strong>, you are digitally accepting this agreement on behalf of{' '}
          <span className={styles.modalCompanyHighlight}>{companyName}</span>. This creates a binding
          contract with Basiq Truckcleaning B.V. and cannot be undone.
        </p>
        <div className={styles.modalActions}>
          <button className={styles.modalCancelBtn} type="button" onClick={onCancel}>
            Cancel
          </button>
          <button className={styles.modalConfirmBtn} type="button" onClick={onConfirm}>
            Confirm &amp; Accept
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PortalAgreement() {
  const { portal } = useOutletContext();
  const { portalUser, isManagementView } = usePortalAuth();
  const available = isStageAvailable(portal.stage, 'CONTRACT_REVIEW');

  // Load agreement data
  const seedAgreement = findAgreementByPortalId(portal.id);

  // ── Component state ─────────────────────────────────────────────────────────
  const [agreementStatus, setAgreementStatus] = useState(
    seedAgreement ? seedAgreement.status : 'DRAFT'
  );
  const [acceptedAt, setAcceptedAt] = useState(seedAgreement?.acceptedAt || null);
  const [acceptedBy, setAcceptedBy] = useState(seedAgreement?.acceptedBy || null);
  const [portalStage, setPortalStage] = useState(portal.stage);

  const [hasAgreement, setHasAgreement] = useState(!!seedAgreement);

  // Acceptance checkbox
  const [termsChecked, setTermsChecked] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Amendment state
  const [amendments, setAmendments] = useState(seedAgreement?.amendments || []);
  const [showAmendmentForm, setShowAmendmentForm] = useState(false);
  const [amendTerm, setAmendTerm] = useState('');
  const [amendComment, setAmendComment] = useState('');

  // Conversion banner
  const [showConversionBanner, setShowConversionBanner] = useState(
    agreementStatus === 'ACCEPTED'
  );

  const agreement = seedAgreement;

  // ── Handlers ─────────────────────────────────────────────────────────────────
  function handleAcceptConfirm() {
    const now = new Date().toISOString();
    const signedBy = portalUser?.contactPerson || portal.contactPerson;
    setAgreementStatus('ACCEPTED');
    setAcceptedAt(now);
    setAcceptedBy(signedBy);
    setPortalStage('VEHICLE_ASSIGNMENT');
    setShowConversionBanner(true);
    setShowConfirmModal(false);
    setTermsChecked(false);
  }

  function handleSubmitAmendment() {
    if (!amendTerm || !amendComment.trim()) return;
    const newAmendment = {
      id: `amd-new-${Date.now()}`,
      term: amendTerm,
      comment: amendComment.trim(),
      status: 'PENDING',
      submittedAt: new Date().toISOString(),
      resolvedAt: null,
    };
    setAmendments((prev) => [...prev, newAmendment]);
    setAmendTerm('');
    setAmendComment('');
    setShowAmendmentForm(false);
    setAgreementStatus('AMENDED');
  }

  function handleMgmtResolveAmendment(id, resolution) {
    setAmendments((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: resolution, resolvedAt: new Date().toISOString() }
          : a
      )
    );
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
          The Agreement section becomes available once your location manual has been submitted and
          reviewed by BTC. Required stage: <strong>Contract Review</strong>.
        </p>
      </div>
    );
  }

  return (
    <>
      {showConfirmModal && (
        <ConfirmAcceptModal
          companyName={portal.companyName}
          onCancel={() => setShowConfirmModal(false)}
          onConfirm={handleAcceptConfirm}
        />
      )}

      <div className={sectionStyles.page}>
        {/* ── Page header ── */}
        <div className={sectionStyles.pageHeader}>
          <div
            className={sectionStyles.pageIconWrap}
            style={{ background: 'var(--primary-60)', color: 'var(--primary-10)' }}
          >
            <FilePen size={22} strokeWidth={1.8} />
          </div>
          <div>
            <h1 className={sectionStyles.pageTitle}>Service Agreement</h1>
            <p className={sectionStyles.pageSubtitle}>
              Review the key terms of your service agreement with Basiq Truckcleaning.
            </p>
          </div>
        </div>

        {/* ── No agreement yet ── */}
        {!hasAgreement && (
          <div className={sectionStyles.infoCard}>
            <Clock
              size={16}
              strokeWidth={2}
              style={{ color: 'var(--primary-10)', flexShrink: 0 }}
            />
            <div>
              <strong>Proposal being prepared</strong> — BTC is reviewing your location manual and
              drafting your contract proposal. You'll be notified here as soon as it's ready for
              review and digital acceptance.
            </div>
          </div>
        )}

        {hasAgreement && (
          <>
            {/* ── Agreement status banner ── */}
            {agreementStatus === 'AWAITING_ACCEPTANCE' || agreementStatus === 'AMENDED' ? (
              <div className={styles.statusBannerAwaiting}>
                <Clock size={16} strokeWidth={2} style={{ flexShrink: 0 }} />
                <span>
                  <strong>Awaiting your acceptance</strong> — Please review the terms below and
                  digitally accept the agreement to proceed.
                  {agreement?.sentAt && (
                    <span className={styles.statusBannerMeta}>
                      &nbsp;·&nbsp;Sent {formatDate(agreement.sentAt)}
                    </span>
                  )}
                </span>
              </div>
            ) : agreementStatus === 'ACCEPTED' ? (
              <div className={styles.statusBannerAccepted}>
                <CheckCircle2 size={16} strokeWidth={2} style={{ flexShrink: 0 }} />
                <span>
                  <strong>Agreement accepted</strong> — This agreement is active and binding.
                  {acceptedAt && (
                    <span className={styles.statusBannerMeta}>
                      &nbsp;·&nbsp;Accepted {formatDateTime(acceptedAt)}
                    </span>
                  )}
                </span>
              </div>
            ) : (
              <div className={styles.statusBannerDraft}>
                <Lock size={16} strokeWidth={1.8} style={{ flexShrink: 0 }} />
                <span>Agreement {agreementStatus.toLowerCase()} — awaiting BTC to send for review.</span>
              </div>
            )}

            {/* ── Key terms summary card ── */}
            <div className={styles.summaryCard}>
              <div className={styles.summaryCardHeader}>
                <FileCheck size={16} strokeWidth={1.8} style={{ color: 'var(--primary-20)' }} />
                <span className={styles.summaryCardHeaderTitle}>Service Agreement Key Terms</span>
                {agreement?.moneybirdQuoteRef && (
                  <span className={styles.summaryCardHeaderRef}>
                    {agreement.moneybirdQuoteRef}
                  </span>
                )}
              </div>

              {/* Hero numbers */}
              <div className={styles.summaryHero}>
                <div className={styles.heroItem}>
                  <span className={styles.heroLabel}>Vehicles</span>
                  <span className={styles.heroValue}>{agreement.vehicleCount}</span>
                </div>
                <div className={styles.heroItem}>
                  <span className={styles.heroLabel}>Frequency</span>
                  <span className={styles.heroValueSm}>{agreement.washFrequency}</span>
                </div>
                <div className={styles.heroItem}>
                  <span className={styles.heroLabel}>Price / Wash</span>
                  <span className={styles.heroValueSm}>
                    {formatPrice(agreement.pricePerWash, agreement.currency)}
                  </span>
                </div>
                <div className={styles.heroItem}>
                  <span className={styles.heroLabel}>Duration</span>
                  <span className={styles.heroValueXs}>{agreement.contractDuration}</span>
                </div>
              </div>

              {/* Detail rows */}
              <div className={styles.summaryDetails}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Service Type</span>
                  <span className={styles.detailValue}>{agreement.serviceType}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Payment Terms</span>
                  <span className={styles.detailValue}>{agreement.paymentTerms}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Start Date</span>
                  <span className={styles.detailValueDate}>{formatDate(agreement.startDate)}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>End Date</span>
                  <span className={styles.detailValueDate}>{formatDate(agreement.endDate)}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Currency</span>
                  <span className={styles.detailValue}>{agreement.currency}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Moneybird Ref</span>
                  <span className={styles.detailValue} style={{ fontFamily: 'Courier New, monospace', fontSize: '12px' }}>
                    {agreement.moneybirdQuoteRef}
                  </span>
                </div>
              </div>
            </div>

            {/* ── Digital Acceptance section (AWAITING_ACCEPTANCE or AMENDED) ── */}
            {!isManagementView &&
              (agreementStatus === 'AWAITING_ACCEPTANCE' || agreementStatus === 'AMENDED') && (
                <div className={styles.acceptanceCard}>
                  <div className={styles.acceptanceCardHeader}>
                    <Pen size={16} strokeWidth={1.8} style={{ color: 'var(--primary-0)' }} />
                    <span className={styles.acceptanceCardTitle}>Digital Acceptance</span>
                  </div>
                  <div className={styles.acceptanceCardBody}>
                    <label className={styles.checkboxRow}>
                      <input
                        type="checkbox"
                        className={styles.checkboxInput}
                        checked={termsChecked}
                        onChange={(e) => setTermsChecked(e.target.checked)}
                      />
                      <span className={styles.checkboxLabel}>
                        I have read and fully understood all terms of this service agreement, including
                        pricing, duration, service scope, and payment terms. I confirm that I am
                        authorised to accept this agreement on behalf of{' '}
                        <strong>{portal.companyName}</strong>.
                      </span>
                    </label>
                    <button
                      className={styles.acceptBtn}
                      type="button"
                      disabled={!termsChecked}
                      onClick={() => setShowConfirmModal(true)}
                    >
                      <FileCheck size={16} strokeWidth={2} />
                      Accept Agreement
                    </button>
                    {!termsChecked && (
                      <p style={{ fontSize: '12px', color: 'var(--text-dark-secondary)', marginTop: '-8px' }}>
                        Please confirm you have read the terms before accepting.
                      </p>
                    )}
                  </div>
                </div>
              )}

            {/* ── ACCEPTED state details ── */}
            {agreementStatus === 'ACCEPTED' && (
              <>
                {showConversionBanner && (
                  <div className={styles.conversionBanner}>
                    <CheckCircle2 size={20} strokeWidth={2} style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <strong>Agreement accepted — welcome to BTC!</strong>
                      Your portal will now advance to the Vehicle Assignment stage. The BMS system
                      has automatically initiated the conversion of your lead record to a client
                      account. Your BTC contact will be in touch shortly to confirm your vehicle
                      schedule.
                    </div>
                  </div>
                )}

                <div className={styles.acceptedDetails}>
                  <div className={styles.acceptedRow}>
                    <CheckCircle2 size={15} strokeWidth={2} style={{ color: 'var(--alert-success-primary)', flexShrink: 0 }} />
                    <span className={styles.acceptedMeta}>Accepted by:</span>
                    <span className={styles.acceptedValue}>{acceptedBy || portal.contactPerson}</span>
                  </div>
                  <div className={styles.acceptedRow}>
                    <Calendar size={15} strokeWidth={1.8} style={{ color: 'var(--neutral-30)', flexShrink: 0 }} />
                    <span className={styles.acceptedMeta}>Accepted on:</span>
                    <span className={styles.acceptedValue}>{formatDateTime(acceptedAt)}</span>
                  </div>
                  <button className={styles.downloadBtn} type="button" title="PDF generation is cosmetic in this prototype">
                    <Download size={15} strokeWidth={1.8} />
                    Download Agreement PDF
                  </button>
                </div>
              </>
            )}

            {/* ── Amendment request section ── */}
            <div className={styles.amendmentSection}>
              <div className={styles.amendmentSectionHeader}>
                <span className={styles.amendmentSectionTitle}>Amendment Requests</span>
                {(agreementStatus === 'AWAITING_ACCEPTANCE' || agreementStatus === 'AMENDED') &&
                  !isManagementView && (
                    <button
                      className={styles.openAmendmentBtn}
                      type="button"
                      onClick={() => setShowAmendmentForm((s) => !s)}
                    >
                      <Plus size={14} strokeWidth={2} />
                      Request Amendment
                    </button>
                  )}
              </div>

              {showAmendmentForm && (
                <div className={styles.amendmentForm}>
                  <span className={styles.amendmentFormTitle}>Request an Amendment</span>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Term to Flag *</label>
                    <select
                      className={styles.fieldSelect}
                      value={amendTerm}
                      onChange={(e) => setAmendTerm(e.target.value)}
                    >
                      <option value="">Select a term…</option>
                      {AMENDABLE_TERMS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Comment *</label>
                    <textarea
                      className={styles.fieldTextarea}
                      placeholder="Describe what you would like to change and why…"
                      value={amendComment}
                      onChange={(e) => setAmendComment(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <div className={styles.amendmentFormActions}>
                    <button
                      className={styles.submitAmendmentBtn}
                      type="button"
                      onClick={handleSubmitAmendment}
                      disabled={!amendTerm || !amendComment.trim()}
                    >
                      Submit Request
                    </button>
                    <button
                      className={styles.cancelAmendmentBtn}
                      type="button"
                      onClick={() => {
                        setShowAmendmentForm(false);
                        setAmendTerm('');
                        setAmendComment('');
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {amendments.length > 0 ? (
                <div className={styles.amendmentList}>
                  {amendments.map((amendment) => (
                    <div key={amendment.id} className={styles.amendmentItem}>
                      <div className={styles.amendmentItemHeader}>
                        <span className={styles.amendmentTerm}>{amendment.term}</span>
                        {amendment.status === 'PENDING' && (
                          <span className={styles.amendmentStatusPending}>
                            <Clock size={10} strokeWidth={2} />
                            Pending
                          </span>
                        )}
                        {amendment.status === 'APPROVED' && (
                          <span className={styles.amendmentStatusApproved}>
                            <CheckCircle2 size={10} strokeWidth={2.5} />
                            Approved
                          </span>
                        )}
                        {amendment.status === 'REJECTED' && (
                          <span className={styles.amendmentStatusRejected}>
                            <X size={10} strokeWidth={2.5} />
                            Rejected
                          </span>
                        )}
                        <span className={styles.amendmentDate}>
                          {formatDate(amendment.submittedAt)}
                        </span>
                      </div>
                      <p className={styles.amendmentComment}>{amendment.comment}</p>
                      {isManagementView && amendment.status === 'PENDING' && (
                        <div className={styles.amendmentMgmtActions}>
                          <button
                            className={styles.mgmtApproveAmendBtn}
                            type="button"
                            onClick={() => handleMgmtResolveAmendment(amendment.id, 'APPROVED')}
                          >
                            <CheckCircle2 size={12} strokeWidth={2.5} />
                            Approve
                          </button>
                          <button
                            className={styles.mgmtRejectAmendBtn}
                            type="button"
                            onClick={() => handleMgmtResolveAmendment(amendment.id, 'REJECTED')}
                          >
                            <X size={12} strokeWidth={2.5} />
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '13px', color: 'var(--text-dark-secondary)' }}>
                  No amendment requests have been submitted.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
