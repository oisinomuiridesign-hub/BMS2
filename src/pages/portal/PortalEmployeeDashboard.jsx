import { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Droplets,
  CheckCircle2,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  MapPin,
  Truck,
  Package2,
  Snowflake,
  HelpCircle,
  X,
  CheckCheck,
  Clock,
  History,
  Filter,
  Calendar,
  ChevronDown,
  Award,
} from 'lucide-react';
import { isStageAvailable } from '../../components/portal/PortalShell';
import { getActiveVehiclesByPortalId, getVehiclesByPortalId } from '../../data/portal/vehicles';
import { getWashRecordsByPortalAndDate, getWashRecordsByPortalId } from '../../data/portal/washRecords';
import { getCertificatesByPortalId } from '../../data/portal/certificates';
import { employees } from '../../data/bms/employees';
import CertificateModal from '../../components/portal/CertificateModal';
import sectionStyles from './PortalSection.module.css';
import styles from './PortalEmployeeDashboard.module.css';

// ─── Constants ────────────────────────────────────────────────────────────────

const TODAY = '2026-03-10';
const TODAY_DISPLAY = 'Tuesday, 10 March 2026';

const STATUS_CONFIG = {
  COMPLETED: { label: 'Completed', color: 'var(--alert-success-primary)', bg: 'var(--alert-success-secondary)', borderColor: 'rgba(39,174,96,0.25)', icon: CheckCircle },
  CONFIRMED: { label: 'Confirmed', color: 'var(--alert-success-primary)', bg: 'var(--alert-success-secondary)', borderColor: 'rgba(39,174,96,0.25)', icon: CheckCircle },
  SCHEDULED: { label: 'Scheduled', color: 'var(--neutral-30)', bg: 'var(--neutral-60)', borderColor: 'var(--neutral-50)', icon: Clock },
  EXCEPTION: { label: 'Exception', color: 'var(--alert-error-primary)', bg: 'var(--alert-error-secondary)', borderColor: 'rgba(239,100,97,0.25)', icon: AlertCircle },
};

const EXCEPTION_LABELS_MAP = {
  VEHICLE_ABSENT: 'Vehicle Absent', DAMAGE_OBSERVED: 'Damage Observed',
  ACCESS_ISSUE: 'Access Issue', EQUIPMENT_FAILURE: 'Equipment Failure', OTHER: 'Other',
};

const WASH_TYPE_LABELS_MAP = {
  STANDARD: 'Standard', HACCP_FOOD_GRADE: 'HACCP Food-Grade',
  INTERIOR: 'Interior', FULL_SERVICE: 'Full Service',
};

// For the employee demo, always show portal-client-001 (Koelman Trucking — Venlo)
const DEMO_PORTAL_ID = 'portal-client-001';

const VEHICLE_TYPE_ICONS = {
  TRUCK:        Truck,
  TRAILER:      Package2,
  TANKER:       Droplets,
  REFRIGERATED: Snowflake,
  OTHER:        HelpCircle,
};

const WASH_TYPE_CONFIG = {
  STANDARD:        { label: 'Standard',        color: 'blue'   },
  HACCP_FOOD_GRADE: { label: 'HACCP Food-Grade', color: 'purple' },
  INTERIOR:        { label: 'Interior',        color: 'orange' },
  FULL_SERVICE:    { label: 'Full Service',    color: 'green'  },
};

const EXCEPTION_OPTIONS = [
  { value: 'VEHICLE_ABSENT',    label: 'Vehicle Absent',     emoji: '🚗' },
  { value: 'DAMAGE_OBSERVED',   label: 'Damage Observed',    emoji: '⚠️' },
  { value: 'ACCESS_ISSUE',      label: 'Access Issue',       emoji: '🔐' },
  { value: 'EQUIPMENT_FAILURE', label: 'Equipment Failure',  emoji: '🔧' },
  { value: 'OTHER',             label: 'Other',              emoji: '📝' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function DutchPlateLarge({ plate }) {
  return <span className={styles.dutchPlate}>{plate}</span>;
}

function WashTypeBadge({ washType }) {
  const cfg = WASH_TYPE_CONFIG[washType] || { label: washType, color: 'blue' };
  return (
    <span className={`${styles.washBadge} ${styles[`washBadge_${cfg.color}`]}`}>
      {cfg.label}
    </span>
  );
}

function ExceptionSheet({ isOpen, onClose, onSubmit }) {
  const [selected, setSelected] = useState('');
  const [notes, setNotes] = useState('');

  function handleSubmit() {
    if (!selected) return;
    onSubmit({ exceptionType: selected, notes });
    setSelected('');
    setNotes('');
  }

  function handleClose() {
    setSelected('');
    setNotes('');
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className={styles.sheetOverlay} onClick={handleClose}>
      <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
        <div className={styles.sheetHandle} />
        <div className={styles.sheetHeader}>
          <h2 className={styles.sheetTitle}>Report an Issue</h2>
          <button className={styles.sheetClose} onClick={handleClose} type="button">
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        <p className={styles.sheetSubtitle}>Select the issue type:</p>

        <div className={styles.exceptionGrid}>
          {EXCEPTION_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`${styles.exceptionOption} ${selected === opt.value ? styles.exceptionOptionSelected : ''}`}
              onClick={() => setSelected(opt.value)}
            >
              <span className={styles.exceptionEmoji}>{opt.emoji}</span>
              <span className={styles.exceptionLabel}>{opt.label}</span>
            </button>
          ))}
        </div>

        <div className={styles.sheetField}>
          <label className={styles.sheetLabel}>Additional notes (optional)</label>
          <textarea
            className={styles.sheetTextarea}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Describe the issue in detail..."
            rows={3}
          />
        </div>

        <button
          className={styles.sheetSubmitBtn}
          onClick={handleSubmit}
          disabled={!selected}
          type="button"
        >
          <AlertTriangle size={18} strokeWidth={1.8} />
          Submit Issue Report
        </button>
      </div>
    </div>
  );
}

// ─── Vehicle wash card ────────────────────────────────────────────────────────

function VehicleWashCard({ vehicle, initialRecord, onConfirm, onException }) {
  const [status, setStatus]         = useState(() => {
    if (initialRecord?.status === 'COMPLETED') return 'confirmed';
    if (initialRecord?.status === 'EXCEPTION') return 'exception';
    return 'pending';
  });
  const [exceptionType, setExceptionType] = useState(initialRecord?.exceptionType || null);
  const [confirming,    setConfirming]    = useState(false);
  const [sheetOpen,     setSheetOpen]     = useState(false);

  const TypeIcon = VEHICLE_TYPE_ICONS[vehicle.vehicleType] || HelpCircle;

  async function handleConfirm() {
    if (status !== 'pending') return;
    setConfirming(true);
    // Simulate async confirm
    await new Promise((r) => setTimeout(r, 800));
    setStatus('confirmed');
    setConfirming(false);
    onConfirm(vehicle.id);
  }

  function handleExceptionSubmit({ exceptionType: type, notes }) {
    setStatus('exception');
    setExceptionType(type);
    setSheetOpen(false);
    onException(vehicle.id, type, notes);
  }

  const isConfirmed = status === 'confirmed';
  const isException = status === 'exception';

  const exceptionLabel = EXCEPTION_OPTIONS.find((o) => o.value === exceptionType)?.label;

  return (
    <>
      <div
        className={`${styles.vehicleCard} ${isConfirmed ? styles.vehicleCardConfirmed : ''} ${isException ? styles.vehicleCardException : ''}`}
      >
        {/* Plate + type row */}
        <div className={styles.cardTop}>
          <DutchPlateLarge plate={vehicle.licensePlate} />
          <div className={styles.cardTypeRow}>
            <TypeIcon size={16} strokeWidth={1.8} style={{ color: 'var(--neutral-30)' }} />
            <span className={styles.cardTypeLabel}>
              {vehicle.vehicleType.charAt(0) + vehicle.vehicleType.slice(1).toLowerCase()}
            </span>
          </div>
        </div>

        {/* Wash type badge */}
        <div className={styles.cardMid}>
          <WashTypeBadge washType={vehicle.washType} />
        </div>

        {/* Notes highlight box */}
        {vehicle.notes && (
          <div className={styles.notesBox}>
            <AlertTriangle size={13} strokeWidth={2} style={{ color: 'var(--alert-warning-primary)', flexShrink: 0 }} />
            <span>{vehicle.notes}</span>
          </div>
        )}

        {/* Exception indicator */}
        {isException && exceptionLabel && (
          <div className={styles.exceptionIndicator}>
            <AlertTriangle size={14} strokeWidth={2} />
            {exceptionLabel} reported
          </div>
        )}

        {/* Action buttons */}
        <div className={styles.cardActions}>
          {isConfirmed ? (
            <div className={styles.confirmedState}>
              <CheckCircle2 size={20} strokeWidth={2} />
              <span>Confirmed</span>
            </div>
          ) : isException ? (
            <div className={styles.exceptionState}>
              <AlertTriangle size={20} strokeWidth={2} />
              <span>Exception Reported</span>
            </div>
          ) : (
            <>
              <button
                className={`${styles.confirmBtn} ${confirming ? styles.confirmBtnLoading : ''}`}
                onClick={handleConfirm}
                disabled={confirming}
                type="button"
              >
                {confirming ? (
                  <>
                    <Clock size={18} strokeWidth={1.8} className={styles.spinIcon} />
                    Confirming...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} strokeWidth={1.8} />
                    Confirm Wash
                  </>
                )}
              </button>
              <button
                className={styles.issueBtn}
                onClick={() => setSheetOpen(true)}
                type="button"
              >
                <AlertTriangle size={15} strokeWidth={1.8} />
                Report Issue
              </button>
            </>
          )}
        </div>
      </div>

      <ExceptionSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSubmit={handleExceptionSubmit}
      />
    </>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PortalEmployeeDashboard() {
  const { portal } = useOutletContext();
  const available = isStageAvailable(portal.stage, 'OPERATIONAL');

  // Employees always see portal-client-001 for the demo
  const targetPortalId = DEMO_PORTAL_ID;
  const vehicles       = getActiveVehiclesByPortalId(targetPortalId);
  const seedRecords    = getWashRecordsByPortalAndDate(targetPortalId, TODAY);

  // Track vehicle states locally
  const [confirmedIds,  setConfirmedIds]  = useState(() =>
    seedRecords.filter((r) => r.status === 'COMPLETED').map((r) => r.vehicleId)
  );
  const [exceptionIds,  setExceptionIds]  = useState(() =>
    seedRecords.filter((r) => r.status === 'EXCEPTION').map((r) => r.vehicleId)
  );
  const [submitted,     setSubmitted]     = useState(false);

  // History toggle state
  const [showHistory,    setShowHistory]    = useState(false);
  const [showHistFilters, setShowHistFilters] = useState(false);
  const [filterVehicle,  setFilterVehicle]  = useState('ALL');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo,   setFilterDateTo]   = useState('');
  const [activeCert,     setActiveCert]     = useState(null);

  // Data for history section
  const allVehicles  = getVehiclesByPortalId(targetPortalId).filter((v) => v.status === 'ACTIVE');
  const allRecords   = getWashRecordsByPortalId(targetPortalId);
  const allCerts     = getCertificatesByPortalId(targetPortalId);

  const historicalDates = useMemo(() => {
    let filtered = allRecords.filter((r) => r.scheduledDate !== TODAY);
    if (filterVehicle !== 'ALL') filtered = filtered.filter((r) => r.vehicleId === filterVehicle);
    if (filterDateFrom) filtered = filtered.filter((r) => r.scheduledDate >= filterDateFrom);
    if (filterDateTo)   filtered = filtered.filter((r) => r.scheduledDate <= filterDateTo);
    const dateMap = {};
    filtered.forEach((rec) => {
      if (!dateMap[rec.scheduledDate]) dateMap[rec.scheduledDate] = [];
      dateMap[rec.scheduledDate].push(rec);
    });
    return Object.keys(dateMap)
      .sort((a, b) => b.localeCompare(a))
      .map((date) => ({ date, records: dateMap[date] }));
  }, [allRecords, filterVehicle, filterDateFrom, filterDateTo]);

  const total      = vehicles.length;
  const confirmed  = confirmedIds.length;
  const exceptions = exceptionIds.length;
  const pending    = total - confirmed - exceptions;
  const allDone    = pending === 0 && total > 0;
  const progressPct = total > 0 ? ((confirmed + exceptions) / total) * 100 : 0;

  if (!available) {
    return (
      <div className={sectionStyles.lockedPage}>
        <div className={sectionStyles.lockedIcon}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
        <h2 className={sectionStyles.lockedTitle}>Dashboard not available</h2>
        <p className={sectionStyles.lockedDesc}>Employee wash dashboard requires the system to be in Operational stage.</p>
      </div>
    );
  }

  function handleConfirm(vehicleId) {
    setConfirmedIds((prev) => prev.includes(vehicleId) ? prev : [...prev, vehicleId]);
  }

  function handleException(vehicleId) {
    setExceptionIds((prev) => prev.includes(vehicleId) ? prev : [...prev, vehicleId]);
  }

  function handleSubmitReport() {
    setSubmitted(true);
  }

  // ─── Success screen ────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className={styles.successPage}>
        <div className={styles.successIcon}>
          <CheckCheck size={48} strokeWidth={1.5} style={{ color: 'var(--alert-success-primary)' }} />
        </div>
        <h1 className={styles.successTitle}>Report Submitted</h1>
        <p className={styles.successSub}>Thank you! Your wash report has been sent to management for review.</p>
        <div className={styles.successStats}>
          <div className={styles.successStat}>
            <span className={styles.successStatNum} style={{ color: 'var(--alert-success-primary)' }}>{confirmed}</span>
            <span className={styles.successStatLabel}>Confirmed</span>
          </div>
          {exceptions > 0 && (
            <div className={styles.successStat}>
              <span className={styles.successStatNum} style={{ color: 'var(--alert-error-primary)' }}>{exceptions}</span>
              <span className={styles.successStatLabel}>Exceptions</span>
            </div>
          )}
          <div className={styles.successStat}>
            <span className={styles.successStatNum} style={{ color: 'var(--neutral-20)' }}>{total}</span>
            <span className={styles.successStatLabel}>Total</span>
          </div>
        </div>
        <p className={styles.successNote}>
          Certificates will be issued by management after review. You'll receive a confirmation.
        </p>
      </div>
    );
  }

  // ─── Wash list ─────────────────────────────────────────────────────────────

  return (
    <div className={styles.dashboardPage}>

      {/* Header card */}
      <div className={styles.headerCard}>
        <div className={styles.headerTop}>
          <div className={styles.headerIconWrap}>
            <Droplets size={24} strokeWidth={1.8} />
          </div>
          <div className={styles.headerText}>
            <h1 className={styles.headerTitle}>Wash Status</h1>
            <div className={styles.headerDate}>{TODAY_DISPLAY}</div>
          </div>
          <button
            type="button"
            className={`${styles.historyToggleBtn} ${showHistory ? styles.historyToggleBtnActive : ''}`}
            onClick={() => setShowHistory((v) => !v)}
          >
            <History size={15} strokeWidth={2} />
            {showHistory ? 'Hide History' : 'Wash History'}
            <ChevronDown
              size={13}
              strokeWidth={2}
              style={{ transform: showHistory ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }}
            />
          </button>
        </div>

        {portal.assignedLocations && portal.assignedLocations.length > 0 && (
          <div className={styles.locationRow}>
            {portal.assignedLocations.slice(0, 1).map((loc) => (
              <span key={loc} className={styles.locationBadge}>
                <MapPin size={12} strokeWidth={2} />
                {loc}
              </span>
            ))}
          </div>
        )}

        <div className={styles.progressSection}>
          <div className={styles.progressTop}>
            <span className={styles.progressText}>{confirmed + exceptions} of {total} processed</span>
            <span className={styles.progressPct}>{Math.round(progressPct)}%</span>
          </div>
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className={styles.progressStats}>
            <span className={styles.progressStatItem} style={{ color: 'var(--alert-success-primary)' }}>
              <CheckCircle2 size={13} strokeWidth={2} />
              {confirmed} confirmed
            </span>
            {exceptions > 0 && (
              <span className={styles.progressStatItem} style={{ color: 'var(--alert-error-primary)' }}>
                <AlertTriangle size={13} strokeWidth={2} />
                {exceptions} exceptions
              </span>
            )}
            {pending > 0 && (
              <span className={styles.progressStatItem} style={{ color: 'var(--neutral-30)' }}>
                <Clock size={13} strokeWidth={2} />
                {pending} pending
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Vehicle list */}
      <div className={styles.vehicleList}>
        {vehicles.map((vehicle) => {
          const record = seedRecords.find((r) => r.vehicleId === vehicle.id) || null;
          return (
            <VehicleWashCard
              key={vehicle.id}
              vehicle={vehicle}
              initialRecord={record}
              onConfirm={handleConfirm}
              onException={handleException}
            />
          );
        })}
      </div>

      {/* Wash history panel */}
      {showHistory && (
        <div className={styles.historyPanel}>
          <div className={styles.historyPanelHeader}>
            <div className={styles.historyPanelTitle}>
              <History size={16} strokeWidth={2} />
              Historical Wash Log
            </div>
            <button
              type="button"
              className={styles.historyFilterBtn}
              onClick={() => setShowHistFilters((v) => !v)}
            >
              <Filter size={13} strokeWidth={2} />
              Filters
              <ChevronDown size={12} strokeWidth={2} style={{ transform: showHistFilters ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }} />
            </button>
          </div>

          {showHistFilters && (
            <div className={styles.historyFilterBar}>
              <div className={styles.historyFilterGroup}>
                <label className={styles.historyFilterLabel}>Vehicle</label>
                <select className={styles.historyFilterSelect} value={filterVehicle} onChange={(e) => setFilterVehicle(e.target.value)}>
                  <option value="ALL">All vehicles</option>
                  {allVehicles.map((v) => <option key={v.id} value={v.id}>{v.licensePlate}</option>)}
                </select>
              </div>
              <div className={styles.historyFilterGroup}>
                <label className={styles.historyFilterLabel}>From</label>
                <input type="date" className={styles.historyFilterInput} value={filterDateFrom} onChange={(e) => setFilterDateFrom(e.target.value)} />
              </div>
              <div className={styles.historyFilterGroup}>
                <label className={styles.historyFilterLabel}>To</label>
                <input type="date" className={styles.historyFilterInput} value={filterDateTo} onChange={(e) => setFilterDateTo(e.target.value)} />
              </div>
              <button type="button" className={styles.historyClearBtn} onClick={() => { setFilterVehicle('ALL'); setFilterDateFrom(''); setFilterDateTo(''); }}>
                Clear
              </button>
            </div>
          )}

          {historicalDates.length === 0 ? (
            <div className={styles.historyEmpty}>No historical wash records match the selected filters.</div>
          ) : (
            <div className={styles.historyTable}>
              <div className={styles.historyHead}>
                <span>Date</span>
                <span>License Plate</span>
                <span>Wash Type</span>
                <span>Employee</span>
                <span>Status</span>
                <span>Certificate</span>
              </div>
              {historicalDates.map(({ date, records }) => (
                <div key={date} className={styles.historyDateGroup}>
                  <div className={styles.historyDateBanner}>
                    <Calendar size={13} strokeWidth={2} />
                    {new Date(date + 'T12:00:00Z').toLocaleDateString('en-NL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    <span className={styles.historyDateCount}>{records.length} washes</span>
                  </div>
                  {records.map((rec) => {
                    const veh = allVehicles.find((v) => v.id === rec.vehicleId);
                    const cfg = STATUS_CONFIG[rec.status] || STATUS_CONFIG.SCHEDULED;
                    const StatusIcon = cfg.icon;
                    const emp = employees.find((e) => e.id === rec.employeeId);
                    const empName = emp ? `${emp.firstName} ${emp.lastName}` : `Employee #${rec.employeeId}`;
                    const recCert = rec.certificateId ? allCerts.find((c) => c.id === rec.certificateId) || null : null;
                    return (
                      <div key={rec.id} className={styles.historyRow}>
                        <span className={styles.historyCell} />
                        <span className={styles.historyCell}>
                          {veh
                            ? <span className={styles.historyPlate}>{veh.licensePlate}</span>
                            : <span style={{ color: 'var(--neutral-30)' }}>{rec.vehicleId}</span>}
                        </span>
                        <span className={styles.historyCell}>
                          {veh ? (WASH_TYPE_LABELS_MAP[veh.washType] || veh.washType) : '—'}
                        </span>
                        <span className={styles.historyCell}>{empName}</span>
                        <span className={styles.historyCell}>
                          <span className={styles.statusPip} style={{ color: cfg.color, borderColor: cfg.color, background: cfg.bg }}>
                            <StatusIcon size={11} strokeWidth={2} />
                            {cfg.label}
                          </span>
                        </span>
                        <span className={styles.historyCell}>
                          {recCert ? (
                            <button type="button" className={styles.certBadge} onClick={() => setActiveCert(recCert)} title="View certificate">
                              <Award size={12} strokeWidth={2} />
                              {recCert.certNumber}
                            </button>
                          ) : (
                            <span style={{ color: 'var(--neutral-40)', fontSize: '12px' }}>—</span>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Submit report footer */}
      <div className={styles.submitFooter}>
        <div className={styles.submitStatus}>
          {allDone ? (
            <span className={styles.submitReady}>
              <CheckCircle2 size={16} strokeWidth={2} />
              All vehicles processed — ready to submit
            </span>
          ) : (
            <span className={styles.submitPending}>
              <Clock size={16} strokeWidth={2} />
              {pending} vehicle{pending !== 1 ? 's' : ''} still pending confirmation
            </span>
          )}
        </div>
        <button
          className={`${styles.submitBtn} ${allDone ? styles.submitBtnReady : ''}`}
          onClick={handleSubmitReport}
          disabled={!allDone}
          type="button"
        >
          <CheckCheck size={18} strokeWidth={1.8} />
          Submit Day Report
        </button>
      </div>

      {activeCert && (
        <CertificateModal certificate={activeCert} onClose={() => setActiveCert(null)} />
      )}
    </div>
  );
}
