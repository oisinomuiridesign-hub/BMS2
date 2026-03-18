import { X, Download, Award, Shield, CheckCircle, XCircle, MapPin, User, Calendar, CheckSquare } from 'lucide-react';
import styles from './CertificateModal.module.css';

const WASH_TYPE_LABELS = {
  STANDARD:        'Standard',
  HACCP_FOOD_GRADE: 'HACCP Food-Grade',
  INTERIOR:        'Interior',
  FULL_SERVICE:    'Full Service',
};

const VEHICLE_TYPE_LABELS = {
  TRUCK:        'Truck',
  TRAILER:      'Trailer',
  TANKER:       'Tanker',
  REFRIGERATED: 'Refrigerated',
  OTHER:        'Other',
};

function formatDate(isoStr) {
  if (!isoStr) return '—';
  return new Date(isoStr).toLocaleDateString('en-NL', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

function formatDateTime(isoStr) {
  if (!isoStr) return '—';
  const d = new Date(isoStr);
  return d.toLocaleDateString('en-NL', { day: 'numeric', month: 'long', year: 'numeric' })
    + ' at '
    + d.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
}

function showDownloadToast() {
  // Create a simple toast notification
  const toast = document.createElement('div');
  toast.textContent = 'Download started — PDF will be ready shortly.';
  toast.style.cssText = `
    position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
    background: #12213d; color: #fff; padding: 12px 24px; border-radius: 8px;
    font-family: 'Montserrat', sans-serif; font-size: 14px; font-weight: 500;
    box-shadow: 0 4px 16px rgba(0,0,0,0.2); z-index: 99999;
    animation: slideUp 200ms ease;
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 300ms';
    setTimeout(() => document.body.removeChild(toast), 300);
  }, 3000);
}

export default function CertificateModal({ certificate, onClose }) {
  if (!certificate) return null;

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>

        {/* Close button */}
        <button className={styles.closeBtn} onClick={onClose} type="button" aria-label="Close">
          <X size={18} strokeWidth={2} />
        </button>

        {/* ── Document header ── */}
        <div className={styles.docHeader}>
          <div className={styles.docLogoArea}>
            <div className={styles.docLogoMark}>BTC</div>
            <div className={styles.docLogoText}>
              <span className={styles.docLogoName}>Basiq Truckcleaning B.V.</span>
              <span className={styles.docLogoSub}>Industrieweg 12, 5928 BM Venlo — +31 77 123 4567</span>
            </div>
          </div>
          <div className={styles.docTitleArea}>
            <h1 className={styles.docTitle}>CLEANING CERTIFICATE</h1>
            <div className={styles.certNumberBadge}>
              <Award size={14} strokeWidth={2} />
              {certificate.certNumber}
            </div>
          </div>
        </div>

        <div className={styles.docDivider} />

        {/* ── Certificate meta row ── */}
        <div className={styles.metaRow}>
          <div className={styles.metaItem}>
            <Calendar size={14} strokeWidth={1.8} className={styles.metaIcon} />
            <div>
              <div className={styles.metaLabel}>Wash Date</div>
              <div className={styles.metaValue}>{formatDate(certificate.washDate + 'T12:00:00Z')}</div>
            </div>
          </div>
          <div className={styles.metaItem}>
            <Calendar size={14} strokeWidth={1.8} className={styles.metaIcon} />
            <div>
              <div className={styles.metaLabel}>Certificate Issued</div>
              <div className={styles.metaValue}>{formatDateTime(certificate.issuedAt)}</div>
            </div>
          </div>
          <div className={styles.metaItem}>
            <MapPin size={14} strokeWidth={1.8} className={styles.metaIcon} />
            <div>
              <div className={styles.metaLabel}>Location</div>
              <div className={styles.metaValue}>{certificate.location}</div>
            </div>
          </div>
          <div className={styles.metaItem}>
            <User size={14} strokeWidth={1.8} className={styles.metaIcon} />
            <div>
              <div className={styles.metaLabel}>Client</div>
              <div className={styles.metaValue}>{certificate.clientName}</div>
            </div>
          </div>
        </div>

        {/* ── HACCP compliance banner ── */}
        {certificate.haccpCompliant && (
          <div className={styles.haccpBanner}>
            <Shield size={18} strokeWidth={2} className={styles.haccpIcon} />
            <div>
              <strong>HACCP Food-Grade Compliance Confirmed</strong>
              <p>
                This certificate confirms that all HACCP food-grade washing requirements were met in accordance
                with EC Regulation 852/2004 on the hygiene of foodstuffs. Cleaning agents used are approved
                for food-contact surface application (BTC batch certification on file).
              </p>
            </div>
          </div>
        )}

        {/* ── Vehicle table ── */}
        <div className={styles.sectionHeading}>
          <CheckSquare size={15} strokeWidth={2} />
          Washed Vehicles ({certificate.totalVehicles})
        </div>

        <div className={styles.vehicleTable}>
          <div className={styles.vehicleTableHead}>
            <span>License Plate</span>
            <span>Vehicle Type</span>
            <span>Wash Type</span>
            <span>HACCP</span>
          </div>
          {certificate.vehicles.map((v) => (
            <div key={v.vehicleId} className={styles.vehicleTableRow}>
              <span className={styles.plateCell}>
                <span className={styles.dutchPlate}>{v.plate}</span>
              </span>
              <span className={styles.vehicleTypeCell}>
                {VEHICLE_TYPE_LABELS[v.type] || v.type}
              </span>
              <span className={styles.washTypeCell}>
                {WASH_TYPE_LABELS[v.washType] || v.washType}
                {v.washType === 'HACCP_FOOD_GRADE' && (
                  <span className={styles.haccpBadgeSmall}>
                    <Shield size={9} strokeWidth={2} /> HACCP
                  </span>
                )}
              </span>
              <span className={styles.haccpCell}>
                {v.haccpCompliant
                  ? <CheckCircle size={15} strokeWidth={2} style={{ color: 'var(--alert-success-primary)' }} />
                  : <XCircle   size={15} strokeWidth={2} style={{ color: 'var(--neutral-40)' }} />}
              </span>
            </div>
          ))}
        </div>

        {/* ── Service details ── */}
        <div className={styles.sectionHeading}>
          <User size={15} strokeWidth={2} />
          Service Details
        </div>

        <div className={styles.serviceGrid}>
          <div className={styles.serviceItem}>
            <span className={styles.serviceLabel}>Wash Carried Out By</span>
            <span className={styles.serviceValue}>{certificate.employeeName}</span>
          </div>
          <div className={styles.serviceItem}>
            <span className={styles.serviceLabel}>Total Vehicles Washed</span>
            <span className={styles.serviceValue}>{certificate.totalVehicles}</span>
          </div>
          <div className={styles.serviceItem}>
            <span className={styles.serviceLabel}>Service Location</span>
            <span className={styles.serviceValue}>{certificate.location}</span>
          </div>
          <div className={styles.serviceItem}>
            <span className={styles.serviceLabel}>Compliance Status</span>
            <span className={styles.serviceValue} style={{ color: 'var(--alert-success-primary)' }}>
              All requirements met
            </span>
          </div>
        </div>

        {/* ── Approval section ── */}
        <div className={styles.approvalSection}>
          <div className={styles.approvalLeft}>
            <div className={styles.sectionHeading} style={{ marginBottom: 12 }}>
              <CheckCircle size={15} strokeWidth={2} />
              Management Approval
            </div>
            <div className={styles.approvalDetails}>
              <div className={styles.approvalRow}>
                <span className={styles.approvalLabel}>Approved by</span>
                <span className={styles.approvalValue}>{certificate.approverName}</span>
              </div>
              <div className={styles.approvalRow}>
                <span className={styles.approvalLabel}>Approval timestamp</span>
                <span className={styles.approvalValue}>{formatDateTime(certificate.issuedAt)}</span>
              </div>
              <div className={styles.approvalRow}>
                <span className={styles.approvalLabel}>Certificate number</span>
                <span className={styles.approvalValue}>{certificate.certNumber}</span>
              </div>
            </div>
          </div>
          <div className={styles.approvalRight}>
            <div className={styles.signaturePlaceholder}>
              <div className={styles.signatureLabel}>Digital Signature</div>
              <div className={styles.signatureLine} />
              <div className={styles.signatureName}>{certificate.approverName}</div>
              <div className={styles.signatureRole}>BTC Management</div>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className={styles.docFooter}>
          <div className={styles.footerLeft}>
            <strong>Basiq Truckcleaning B.V.</strong><br />
            Industrieweg 12, 5928 BM Venlo<br />
            +31 77 123 4567 · info@basiqtruckcleaning.nl<br />
            KvK: 12345678 · BTW: NL123456789B01
          </div>
          <div className={styles.footerRight}>
            <div className={styles.issuedBadge}>
              <CheckCircle size={13} strokeWidth={2} />
              ISSUED
            </div>
            <div className={styles.footerCertNum}>{certificate.certNumber}</div>
          </div>
        </div>

        {/* ── Download button ── */}
        <div className={styles.downloadRow}>
          <button className={styles.downloadBtn} type="button" onClick={showDownloadToast}>
            <Download size={16} strokeWidth={2} />
            Download PDF Certificate
          </button>
        </div>

      </div>
    </div>
  );
}
