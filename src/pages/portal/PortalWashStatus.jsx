import { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Droplets,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  ChevronDown,
  Award,
  Minus,
  Filter,
} from 'lucide-react';
import { isStageAvailable } from '../../components/portal/PortalShell';
import { getVehiclesByPortalId } from '../../data/portal/vehicles';
import { getWashRecordsByPortalId } from '../../data/portal/washRecords';
import { getCertificatesByPortalId } from '../../data/portal/certificates';
import { employees } from '../../data/bms/employees';
import CertificateModal from '../../components/portal/CertificateModal';
import sectionStyles from './PortalSection.module.css';
import styles from './PortalWashStatus.module.css';

// ─── Constants ────────────────────────────────────────────────────────────────

const TODAY = '2026-03-10';

const STATUS_CONFIG = {
  COMPLETED: {
    label: 'Completed',
    color: 'var(--alert-success-primary)',
    bg: 'var(--alert-success-secondary)',
    borderColor: 'rgba(39, 174, 96, 0.25)',
    icon: CheckCircle,
  },
  CONFIRMED: {
    label: 'Confirmed',
    color: 'var(--alert-success-primary)',
    bg: 'var(--alert-success-secondary)',
    borderColor: 'rgba(39, 174, 96, 0.25)',
    icon: CheckCircle,
  },
  SCHEDULED: {
    label: 'Scheduled',
    color: 'var(--neutral-30)',
    bg: 'var(--neutral-60)',
    borderColor: 'var(--neutral-50)',
    icon: Clock,
  },
  EXCEPTION: {
    label: 'Exception',
    color: 'var(--alert-error-primary)',
    bg: 'var(--alert-error-secondary)',
    borderColor: 'rgba(239, 100, 97, 0.25)',
    icon: AlertCircle,
  },
};

const EXCEPTION_LABELS = {
  VEHICLE_ABSENT:   'Vehicle Absent',
  DAMAGE_OBSERVED:  'Damage Observed',
  ACCESS_ISSUE:     'Access Issue',
  EQUIPMENT_FAILURE:'Equipment Failure',
  OTHER:            'Other',
};

const WASH_TYPE_LABELS = {
  STANDARD:        'Standard',
  HACCP_FOOD_GRADE: 'HACCP Food-Grade',
  INTERIOR:        'Interior',
  FULL_SERVICE:    'Full Service',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function DutchPlate({ plate }) {
  return <span className={styles.dutchPlate}>{plate}</span>;
}

function StatusPip({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.SCHEDULED;
  const Icon = cfg.icon;
  return (
    <span
      className={styles.statusPip}
      style={{ color: cfg.color, borderColor: cfg.color, background: cfg.bg }}
    >
      <Icon size={11} strokeWidth={2} />
      {cfg.label}
    </span>
  );
}

function TodaySummaryCard({ records }) {
  const completed  = records.filter((r) => r.status === 'COMPLETED' || r.status === 'CONFIRMED').length;
  const scheduled  = records.filter((r) => r.status === 'SCHEDULED').length;
  const exceptions = records.filter((r) => r.status === 'EXCEPTION').length;
  const total      = records.length;

  const completedPct = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className={styles.summaryCard}>
      <div className={styles.summaryCardHeader}>
        <div className={styles.summaryDate}>
          <Calendar size={14} strokeWidth={2} />
          <span>Today — {new Date(TODAY + 'T12:00:00Z').toLocaleDateString('en-NL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
        <span className={styles.summaryTotal}>{total} vehicles scheduled</span>
      </div>

      <div className={styles.progressBarTrack}>
        <div className={styles.progressBarFill} style={{ width: `${completedPct}%` }} />
      </div>
      <div className={styles.progressLabel}>{completed} of {total} completed</div>

      <div className={styles.summaryStats}>
        <div className={styles.summaryStat} style={{ color: 'var(--alert-success-primary)' }}>
          <CheckCircle size={16} strokeWidth={2} />
          <span className={styles.summaryStatNum}>{completed}</span>
          <span className={styles.summaryStatLabel}>Done</span>
        </div>
        <div className={styles.summaryStatDivider} />
        <div className={styles.summaryStat} style={{ color: 'var(--neutral-30)' }}>
          <Clock size={16} strokeWidth={2} />
          <span className={styles.summaryStatNum}>{scheduled}</span>
          <span className={styles.summaryStatLabel}>Pending</span>
        </div>
        <div className={styles.summaryStatDivider} />
        <div className={styles.summaryStat} style={{ color: 'var(--alert-error-primary)' }}>
          <AlertCircle size={16} strokeWidth={2} />
          <span className={styles.summaryStatNum}>{exceptions}</span>
          <span className={styles.summaryStatLabel}>Exceptions</span>
        </div>
      </div>
    </div>
  );
}

function VehicleStatusCard({ vehicle, record }) {
  const status = record ? record.status : 'NOT_SCHEDULED';
  const cfg = STATUS_CONFIG[status] || null;

  let timeLabel = '—';
  if (record?.completedAt) {
    timeLabel = new Date(record.completedAt).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div
      className={styles.vehicleCard}
      style={{
        borderColor: cfg ? cfg.borderColor : 'var(--neutral-50)',
        background: cfg ? cfg.bg : 'var(--neutral-100)',
      }}
    >
      <div className={styles.vehicleCardTop}>
        <DutchPlate plate={vehicle.licensePlate} />
        {record
          ? <StatusPip status={record.status} />
          : <span className={styles.notScheduledPip}><Minus size={11} strokeWidth={2} /> Not scheduled</span>}
      </div>
      <div className={styles.vehicleCardMeta}>
        <span>{vehicle.vehicleType.charAt(0) + vehicle.vehicleType.slice(1).toLowerCase()}</span>
        <span className={styles.metaDot}>·</span>
        <span>{WASH_TYPE_LABELS[vehicle.washType] || vehicle.washType}</span>
      </div>
      {record?.status === 'COMPLETED' && (
        <div className={styles.vehicleCardTime}>
          <CheckCircle size={12} strokeWidth={2} style={{ color: 'var(--alert-success-primary)' }} />
          Completed at {timeLabel}
        </div>
      )}
      {record?.status === 'EXCEPTION' && record.exceptionType && (
        <div className={styles.vehicleCardException}>
          <AlertCircle size={12} strokeWidth={2} />
          {EXCEPTION_LABELS[record.exceptionType] || record.exceptionType}
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PortalWashStatus() {
  const { portal } = useOutletContext();
  const available = isStageAvailable(portal.stage, 'OPERATIONAL');

  const allVehicles  = getVehiclesByPortalId(portal.id).filter((v) => v.status === 'ACTIVE');
  const allRecords   = getWashRecordsByPortalId(portal.id);
  const allCerts     = getCertificatesByPortalId(portal.id);

  // Filter state for historical log
  const [filterVehicle,  setFilterVehicle]  = useState('ALL');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo,   setFilterDateTo]   = useState('');
  const [showFilters,    setShowFilters]    = useState(false);

  // Certificate modal
  const [activeCert, setActiveCert] = useState(null);

  const todayRecords = allRecords.filter((r) => r.scheduledDate === TODAY);

  // Group historical records by date, newest first
  const historicalDates = useMemo(() => {
    const historicalRecords = allRecords.filter((r) => r.scheduledDate !== TODAY);

    // Apply vehicle filter
    let filtered = historicalRecords;
    if (filterVehicle !== 'ALL') {
      filtered = filtered.filter((r) => r.vehicleId === filterVehicle);
    }
    if (filterDateFrom) {
      filtered = filtered.filter((r) => r.scheduledDate >= filterDateFrom);
    }
    if (filterDateTo) {
      filtered = filtered.filter((r) => r.scheduledDate <= filterDateTo);
    }

    // Group by date
    const dateMap = {};
    filtered.forEach((record) => {
      if (!dateMap[record.scheduledDate]) dateMap[record.scheduledDate] = [];
      dateMap[record.scheduledDate].push(record);
    });

    // Sort dates newest first
    return Object.keys(dateMap)
      .sort((a, b) => b.localeCompare(a))
      .map((date) => ({ date, records: dateMap[date] }));
  }, [allRecords, filterVehicle, filterDateFrom, filterDateTo]);

  if (!available) {
    return <LockedSection />;
  }

  function getEmployeeName(employeeId) {
    const emp = employees.find((e) => e.id === employeeId);
    return emp ? `${emp.firstName} ${emp.lastName}` : `Employee #${employeeId}`;
  }

  function formatDate(dateStr) {
    return new Date(dateStr + 'T12:00:00Z').toLocaleDateString('en-NL', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  function getVehiclePlate(vehicleId) {
    const v = allVehicles.find((veh) => veh.id === vehicleId);
    return v ? v.licensePlate : vehicleId;
  }

  // Find cert for a given date group — all records on same date share the same cert
  function getCertForDate(date) {
    // Look at the first record of the date group that has a certificateId
    const record = allRecords.find((r) => r.scheduledDate === date && r.certificateId);
    if (!record?.certificateId) return null;
    return allCerts.find((c) => c.id === record.certificateId) || null;
  }

  return (
    <div className={sectionStyles.page}>

      {/* Page header */}
      <div className={sectionStyles.pageHeader}>
        <div className={sectionStyles.pageIconWrap} style={{ background: 'var(--primary-60)', color: 'var(--primary-10)' }}>
          <Droplets size={22} strokeWidth={1.8} />
        </div>
        <div>
          <h1 className={sectionStyles.pageTitle}>Wash Status</h1>
          <p className={sectionStyles.pageSubtitle}>
            Real-time status of today's vehicle washes. Updated by BTC employees on-site.
          </p>
        </div>
      </div>

      {/* Today's summary card */}
      <TodaySummaryCard records={todayRecords} />

      {/* Today's vehicle grid */}
      <div>
        <h2 className={styles.sectionHeading}>Today's Vehicles</h2>
        {allVehicles.length === 0 ? (
          <div className={styles.emptyState}>No active vehicles assigned.</div>
        ) : (
          <div className={styles.vehicleGrid}>
            {allVehicles.map((vehicle) => {
              const record = todayRecords.find((r) => r.vehicleId === vehicle.id) || null;
              return <VehicleStatusCard key={vehicle.id} vehicle={vehicle} record={record} />;
            })}
          </div>
        )}
      </div>

      {/* Historical log */}
      <div>
        <div className={styles.historicalHeader}>
          <h2 className={styles.sectionHeading}>Historical Wash Log</h2>
          <button
            className={styles.filterToggleBtn}
            onClick={() => setShowFilters((v) => !v)}
            type="button"
          >
            <Filter size={14} strokeWidth={2} />
            Filters
            <ChevronDown
              size={13}
              strokeWidth={2}
              style={{ transform: showFilters ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }}
            />
          </button>
        </div>

        {showFilters && (
          <div className={styles.filterBar}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Vehicle</label>
              <select
                className={styles.filterSelect}
                value={filterVehicle}
                onChange={(e) => setFilterVehicle(e.target.value)}
              >
                <option value="ALL">All vehicles</option>
                {allVehicles.map((v) => (
                  <option key={v.id} value={v.id}>{v.licensePlate}</option>
                ))}
              </select>
            </div>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>From</label>
              <input
                type="date"
                className={styles.filterInput}
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
              />
            </div>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>To</label>
              <input
                type="date"
                className={styles.filterInput}
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
              />
            </div>
            <button
              className={styles.clearFiltersBtn}
              onClick={() => { setFilterVehicle('ALL'); setFilterDateFrom(''); setFilterDateTo(''); }}
              type="button"
            >
              Clear
            </button>
          </div>
        )}

        {historicalDates.length === 0 ? (
          <div className={styles.emptyState}>No historical wash records match the selected filters.</div>
        ) : (
          <div className={styles.historyTable}>
            {/* Table header */}
            <div className={styles.historyHead}>
              <span>Date</span>
              <span>License Plate</span>
              <span>Wash Type</span>
              <span>Employee</span>
              <span>Status</span>
              <span>Certificate</span>
            </div>

            {/* Grouped rows */}
            {historicalDates.map(({ date, records }) => {
              const cert = getCertForDate(date);
              return (
                <div key={date} className={styles.historyDateGroup}>
                  <div className={styles.historyDateBanner}>
                    <Calendar size={13} strokeWidth={2} />
                    {formatDate(date)}
                    <span className={styles.historyDateCount}>{records.length} washes</span>
                  </div>
                  {records.map((record) => {
                    const vehicle = allVehicles.find((v) => v.id === record.vehicleId);
                    // Determine if this specific record has a cert
                    const recordCert = record.certificateId
                      ? allCerts.find((c) => c.id === record.certificateId) || null
                      : null;

                    return (
                      <div key={record.id} className={styles.historyRow}>
                        <span className={styles.historyCell} />
                        <span className={styles.historyCell}>
                          {vehicle
                            ? <DutchPlate plate={vehicle.licensePlate} />
                            : <span style={{ color: 'var(--neutral-30)' }}>{getVehiclePlate(record.vehicleId)}</span>}
                        </span>
                        <span className={styles.historyCell}>
                          {vehicle ? (WASH_TYPE_LABELS[vehicle.washType] || vehicle.washType) : '—'}
                        </span>
                        <span className={styles.historyCell}>
                          {getEmployeeName(record.employeeId)}
                        </span>
                        <span className={styles.historyCell}>
                          <StatusPip status={record.status} />
                        </span>
                        <span className={styles.historyCell}>
                          {recordCert ? (
                            <button
                              className={styles.certBadge}
                              type="button"
                              onClick={() => setActiveCert(recordCert)}
                              title="View certificate"
                            >
                              <Award size={12} strokeWidth={2} />
                              {recordCert.certNumber}
                            </button>
                          ) : (
                            <span style={{ color: 'var(--neutral-40)', fontSize: '12px' }}>—</span>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Certificate detail modal */}
      {activeCert && (
        <CertificateModal
          certificate={activeCert}
          onClose={() => setActiveCert(null)}
        />
      )}
    </div>
  );
}

function LockedSection() {
  return (
    <div className={sectionStyles.lockedPage}>
      <div className={sectionStyles.lockedIcon}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      </div>
      <h2 className={sectionStyles.lockedTitle}>Section Locked</h2>
      <p className={sectionStyles.lockedDesc}>
        Wash status becomes available once vehicles have been assigned and the first scheduled wash date arrives. Required stage: <strong>Operational</strong>.
      </p>
    </div>
  );
}
