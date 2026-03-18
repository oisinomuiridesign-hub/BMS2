import { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Award,
  Download,
  Calendar,
  Shield,
  ChevronDown,
  CheckCircle,
  Eye,
  Truck,
} from 'lucide-react';
import { isStageAvailable } from '../../components/portal/PortalShell';
import { getCertificatesByPortalId } from '../../data/portal/certificates';
import { getVehiclesByPortalId } from '../../data/portal/vehicles';
import CertificateModal from '../../components/portal/CertificateModal';
import sectionStyles from './PortalSection.module.css';
import styles from './PortalCertificates.module.css';

// ─── Constants ────────────────────────────────────────────────────────────────

const WASH_TYPE_OPTIONS = [
  { value: 'ALL',             label: 'All wash types' },
  { value: 'STANDARD',        label: 'Standard' },
  { value: 'HACCP_FOOD_GRADE', label: 'HACCP Food-Grade' },
  { value: 'INTERIOR',        label: 'Interior' },
  { value: 'FULL_SERVICE',    label: 'Full Service' },
];

function formatDate(isoStr) {
  if (!isoStr) return '—';
  return new Date(isoStr).toLocaleDateString('en-NL', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

function showDownloadToast() {
  const toast = document.createElement('div');
  toast.textContent = 'Download started — PDF will be ready shortly.';
  toast.style.cssText = `
    position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
    background: #12213d; color: #fff; padding: 12px 24px; border-radius: 8px;
    font-family: 'Montserrat', sans-serif; font-size: 14px; font-weight: 500;
    box-shadow: 0 4px 16px rgba(0,0,0,0.2); z-index: 99999;
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 300ms';
    setTimeout(() => document.body.removeChild(toast), 300);
  }, 3000);
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PortalCertificates() {
  const { portal } = useOutletContext();
  const available = isStageAvailable(portal.stage, 'ACTIVE');

  const allCerts    = getCertificatesByPortalId(portal.id);
  const allVehicles = getVehiclesByPortalId(portal.id);

  // Filter state
  const [filterVehicle,  setFilterVehicle]  = useState('ALL');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo,   setFilterDateTo]   = useState('');
  const [filterWashType, setFilterWashType] = useState('ALL');
  const [showFilters,    setShowFilters]    = useState(false);

  // Modal state
  const [activeCert, setActiveCert] = useState(null);

  // Derived: filtered certs
  const filteredCerts = useMemo(() => {
    return allCerts.filter((cert) => {
      if (filterVehicle !== 'ALL') {
        const hasVehicle = cert.vehicles.some((v) => v.vehicleId === filterVehicle);
        if (!hasVehicle) return false;
      }
      if (filterDateFrom && cert.washDate < filterDateFrom) return false;
      if (filterDateTo   && cert.washDate > filterDateTo)   return false;
      if (filterWashType !== 'ALL') {
        const hasType = cert.vehicles.some((v) => v.washType === filterWashType);
        if (!hasType) return false;
      }
      return true;
    });
  }, [allCerts, filterVehicle, filterDateFrom, filterDateTo, filterWashType]);

  // Summary stats
  const totalCerts     = allCerts.length;
  const haccpCount     = allCerts.filter((c) => c.haccpCompliant).length;
  const latestCert     = allCerts.length > 0
    ? allCerts.reduce((a, b) => a.issuedAt > b.issuedAt ? a : b)
    : null;

  const activeFilterCount = [
    filterVehicle !== 'ALL',
    !!filterDateFrom,
    !!filterDateTo,
    filterWashType !== 'ALL',
  ].filter(Boolean).length;

  if (!available) {
    return <LockedSection />;
  }

  return (
    <div className={sectionStyles.page}>

      {/* ── Page header ── */}
      <div className={sectionStyles.pageHeader}>
        <div
          className={sectionStyles.pageIconWrap}
          style={{ background: 'var(--alert-success-secondary)', color: 'var(--alert-success-primary)' }}
        >
          <Award size={22} strokeWidth={1.8} />
        </div>
        <div>
          <h1 className={sectionStyles.pageTitle}>Certificate Library</h1>
          <p className={sectionStyles.pageSubtitle}>
            Download your cleaning certificates. Generated after every approved wash session.
          </p>
        </div>
      </div>

      {/* ── Summary row ── */}
      <div className={styles.summaryRow}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon} style={{ background: 'var(--primary-60)', color: 'var(--primary-10)' }}>
            <Award size={18} strokeWidth={1.8} />
          </div>
          <div className={styles.summaryText}>
            <span className={styles.summaryNum}>{totalCerts}</span>
            <span className={styles.summaryLabel}>Total Certificates</span>
          </div>
        </div>
        <div className={styles.summaryCard}>
          <div className={`${styles.summaryIcon} ${styles.summaryIconHaccp}`}>
            <Shield size={18} strokeWidth={1.8} />
          </div>
          <div className={styles.summaryText}>
            <span className={styles.summaryNum}>{haccpCount}</span>
            <span className={styles.summaryLabel}>HACCP Compliant</span>
          </div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon} style={{ background: 'var(--neutral-60)', color: 'var(--neutral-30)' }}>
            <Calendar size={18} strokeWidth={1.8} />
          </div>
          <div className={styles.summaryText}>
            <span className={styles.summaryNum} style={{ fontSize: 'var(--text-sm)' }}>
              {latestCert ? formatDate(latestCert.issuedAt) : '—'}
            </span>
            <span className={styles.summaryLabel}>Most Recent</span>
          </div>
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div>
        <div className={styles.filterHeader}>
          <button
            className={styles.filterToggleBtn}
            type="button"
            onClick={() => setShowFilters((v) => !v)}
          >
            <ChevronDown
              size={14}
              strokeWidth={2}
              style={{ transform: showFilters ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }}
            />
            Filters
            {activeFilterCount > 0 && (
              <span className={styles.filterCount}>{activeFilterCount}</span>
            )}
          </button>
          {activeFilterCount > 0 && (
            <button
              className={styles.clearFiltersBtn}
              type="button"
              onClick={() => {
                setFilterVehicle('ALL');
                setFilterDateFrom('');
                setFilterDateTo('');
                setFilterWashType('ALL');
              }}
            >
              Clear filters
            </button>
          )}
          <span className={styles.resultCount}>
            {filteredCerts.length} of {totalCerts} certificates
          </span>
        </div>

        {showFilters && (
          <div className={styles.filterPanel}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Vehicle</label>
              <select
                className={styles.filterSelect}
                value={filterVehicle}
                onChange={(e) => setFilterVehicle(e.target.value)}
              >
                <option value="ALL">All vehicles</option>
                {allVehicles.filter((v) => v.status === 'ACTIVE').map((v) => (
                  <option key={v.id} value={v.id}>{v.licensePlate}</option>
                ))}
              </select>
            </div>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Wash type</label>
              <select
                className={styles.filterSelect}
                value={filterWashType}
                onChange={(e) => setFilterWashType(e.target.value)}
              >
                {WASH_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Date from</label>
              <input
                type="date"
                className={styles.filterInput}
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
              />
            </div>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Date to</label>
              <input
                type="date"
                className={styles.filterInput}
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Certificate list ── */}
      {filteredCerts.length === 0 ? (
        <div className={styles.emptyState}>
          <Award size={28} strokeWidth={1.5} style={{ color: 'var(--neutral-40)', marginBottom: 8 }} />
          <p>No certificates match the selected filters.</p>
        </div>
      ) : (
        <div className={styles.certList}>
          {filteredCerts
            .slice()
            .sort((a, b) => b.issuedAt.localeCompare(a.issuedAt))
            .map((cert) => (
              <CertCard
                key={cert.id}
                cert={cert}
                onView={() => setActiveCert(cert)}
              />
            ))}
        </div>
      )}

      {/* ── Certificate detail modal ── */}
      {activeCert && (
        <CertificateModal
          certificate={activeCert}
          onClose={() => setActiveCert(null)}
        />
      )}

    </div>
  );
}

// ─── Certificate card ──────────────────────────────────────────────────────────

function CertCard({ cert, onView }) {
  function formatShortDate(isoStr) {
    if (!isoStr) return '—';
    return new Date(isoStr).toLocaleDateString('en-NL', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  }

  return (
    <div className={styles.certCard}>
      {/* Left icon */}
      <div className={styles.certIconWrap}>
        <Award size={20} strokeWidth={1.5} />
      </div>

      {/* Info */}
      <div className={styles.certInfo}>
        <div className={styles.certTopRow}>
          <span className={styles.certNumber}>{cert.certNumber}</span>
          {cert.haccpCompliant && (
            <span className={styles.haccpBadge}>
              <Shield size={10} strokeWidth={2} /> HACCP
            </span>
          )}
          <span className={styles.certStatusBadge}>
            <CheckCircle size={10} strokeWidth={2} />
            Issued
          </span>
        </div>
        <div className={styles.certDate}>
          <Calendar size={12} strokeWidth={2} />
          {formatShortDate(cert.issuedAt)}
        </div>
        <div className={styles.certMeta}>
          <Truck size={12} strokeWidth={2} />
          {cert.totalVehicles} vehicles
          &nbsp;·&nbsp;
          Approved by {cert.approverName}
          &nbsp;·&nbsp;
          {cert.location}
        </div>
      </div>

      {/* Actions */}
      <div className={styles.certActions}>
        <button
          className={styles.viewBtn}
          type="button"
          onClick={onView}
        >
          <Eye size={14} strokeWidth={2} />
          View Certificate
        </button>
        <button
          className={styles.downloadBtnSmall}
          type="button"
          onClick={showDownloadToast}
        >
          <Download size={14} strokeWidth={2} />
          PDF
        </button>
      </div>
    </div>
  );
}

// ─── Locked state ─────────────────────────────────────────────────────────────

function LockedSection() {
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
        Certificates are issued after each approved wash session. This section becomes available once
        your account is fully active. Required stage: <strong>Active</strong>.
      </p>
    </div>
  );
}
