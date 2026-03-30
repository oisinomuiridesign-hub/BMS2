import { useState, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Truck,
  Package2,
  Droplets,
  Snowflake,
  HelpCircle,
  PlusCircle,
  ArrowLeftRight,
  Trash2,
  X,
  Info,
  AlertTriangle,
  CheckCircle,
  Upload,
  Download,
  FileText,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';
import { isStageAvailable } from '../../components/portal/PortalShell';
import { findAgreementByPortalId } from '../../data/portal/agreements';
import { getVehiclesByPortalId } from '../../data/portal/vehicles';
import sectionStyles from './PortalSection.module.css';
import styles from './PortalVehicles.module.css';

// ─── Constants ────────────────────────────────────────────────────────────────

const VEHICLE_TYPE_OPTIONS = [
  { value: 'TRUCK',        label: 'Truck',        icon: Truck },
  { value: 'TRAILER',      label: 'Trailer',      icon: Package2 },
  { value: 'TANKER',       label: 'Tanker',        icon: Droplets },
  { value: 'REFRIGERATED', label: 'Refrigerated',  icon: Snowflake },
  { value: 'OTHER',        label: 'Other',         icon: HelpCircle },
];

const WASH_TYPE_OPTIONS = [
  { value: 'STANDARD',        label: 'Standard',          color: 'blue' },
  { value: 'HACCP_FOOD_GRADE', label: 'HACCP Food-Grade',  color: 'purple' },
  { value: 'INTERIOR',        label: 'Interior',          color: 'orange' },
  { value: 'FULL_SERVICE',    label: 'Full Service',      color: 'green' },
  { value: 'OTHER',           label: 'Other',             color: 'grey' },
];

const EMPTY_FORM = {
  licensePlate: '',
  vehicleType: 'TRUCK',
  washType: 'STANDARD',
  notes: '',
};

const VALID_VEHICLE_TYPES = new Set(VEHICLE_TYPE_OPTIONS.map((o) => o.value));
const VALID_WASH_TYPES = new Set(WASH_TYPE_OPTIONS.map((o) => o.value));

const CSV_TEMPLATE = [
  'licensePlate,vehicleType,washType,notes',
  '# Valid vehicleType: TRUCK, TRAILER, TANKER, REFRIGERATED, OTHER',
  '# Valid washType: STANDARD, HACCP_FOOD_GRADE, INTERIOR, FULL_SERVICE, OTHER',
  '# Notes are optional. Delete these example rows and add your own.',
  'AB-123-CD,TRUCK,STANDARD,Example note here',
  '12-AB-34,TANKER,HACCP_FOOD_GRADE,',
].join('\n');

function splitCSVLine(line) {
  const fields = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      fields.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  fields.push(current.trim());
  return fields;
}

function parseCSV(text) {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0 && !l.startsWith('#'));
  if (lines.length === 0) return { rows: [], errors: [{ row: 0, message: 'File is empty or contains only comments.' }] };

  const header = splitCSVLine(lines[0]).map((h) => h.toLowerCase().replace(/[^a-z]/g, ''));
  const expected = ['licenseplate', 'vehicletype', 'washtype', 'notes'];
  const colMap = {};
  for (const exp of expected) {
    const idx = header.indexOf(exp);
    if (idx === -1 && exp !== 'notes') {
      return { rows: [], errors: [{ row: 1, message: `Missing required column: ${exp}` }] };
    }
    colMap[exp] = idx;
  }

  const rows = [];
  const errors = [];

  for (let i = 1; i < Math.min(lines.length, 101); i++) {
    const fields = splitCSVLine(lines[i]);
    const plate = (fields[colMap.licenseplate] || '').toUpperCase();
    const vType = (fields[colMap.vehicletype] || '').toUpperCase();
    const wType = (fields[colMap.washtype] || '').toUpperCase();
    const notes = colMap.notes >= 0 ? (fields[colMap.notes] || '') : '';

    const rowErrors = [];
    if (!plate) rowErrors.push('License plate is required');
    if (!VALID_VEHICLE_TYPES.has(vType)) rowErrors.push(`Invalid vehicle type: "${vType || '(empty)'}"`);
    if (!VALID_WASH_TYPES.has(wType)) rowErrors.push(`Invalid wash type: "${wType || '(empty)'}"`);

    rows.push({ licensePlate: plate, vehicleType: vType, washType: wType, notes, rowNum: i + 1, errors: rowErrors });
    if (rowErrors.length > 0) {
      errors.push({ row: i + 1, message: rowErrors.join('; ') });
    }
  }

  if (lines.length > 101) {
    errors.push({ row: 0, message: 'CSV truncated to 100 rows maximum.' });
  }

  // Duplicate plate detection within CSV
  const seenPlates = new Set();
  for (const row of rows) {
    if (row.licensePlate && row.errors.length === 0) {
      if (seenPlates.has(row.licensePlate)) {
        row.errors.push('Duplicate license plate in CSV');
        errors.push({ row: row.rowNum, message: 'Duplicate license plate in CSV' });
      }
      seenPlates.add(row.licensePlate);
    }
  }

  return { rows, errors };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function DutchPlate({ plate, size = 'md' }) {
  return (
    <span className={`${styles.dutchPlate} ${styles[`plate_${size}`]}`}>
      {plate}
    </span>
  );
}

function VehicleTypeIcon({ type, size = 18 }) {
  const option = VEHICLE_TYPE_OPTIONS.find((o) => o.value === type);
  const Icon = option ? option.icon : HelpCircle;
  return <Icon size={size} strokeWidth={1.8} />;
}

function VehicleTypeLabel({ type }) {
  const option = VEHICLE_TYPE_OPTIONS.find((o) => o.value === type);
  return (
    <span className={styles.vehicleTypeCell}>
      <VehicleTypeIcon type={type} size={15} />
      {option ? option.label : type}
    </span>
  );
}

function WashTypeBadge({ washType }) {
  const option = WASH_TYPE_OPTIONS.find((o) => o.value === washType);
  const label = option ? option.label : washType;
  const color = option ? option.color : 'blue';
  return (
    <span className={`${styles.washBadge} ${styles[`washBadge_${color}`]}`}>
      {label}
    </span>
  );
}

function StatusBadge({ status }) {
  const map = {
    ACTIVE:   { label: 'Active',   cls: styles.statusActive },
    SWAPPED:  { label: 'Swapped',  cls: styles.statusSwapped },
    REMOVED:  { label: 'Removed',  cls: styles.statusRemoved },
  };
  const cfg = map[status] || map.ACTIVE;
  return <span className={`${styles.statusBadge} ${cfg.cls}`}>{cfg.label}</span>;
}

function FormField({ label, hint, children, required }) {
  return (
    <div className={styles.formField}>
      <label className={styles.formLabel}>
        {label}
        {required && <span className={styles.formRequired}>*</span>}
      </label>
      {hint && <div className={styles.formHint}>{hint}</div>}
      {children}
    </div>
  );
}

function VehicleFormFields({ form, onChange }) {
  return (
    <>
      <FormField label="License Plate" hint="Dutch format: e.g. AB-123-CD or 12-AB-34" required>
        <input
          type="text"
          className={styles.formInput}
          value={form.licensePlate}
          onChange={(e) => onChange('licensePlate', e.target.value.toUpperCase())}
          placeholder="AB-123-CD"
          maxLength={9}
        />
      </FormField>

      <FormField label="Vehicle Type" required>
        <select
          className={styles.formSelect}
          value={form.vehicleType}
          onChange={(e) => onChange('vehicleType', e.target.value)}
        >
          {VEHICLE_TYPE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </FormField>

      <FormField label="Wash Type" required>
        <select
          className={styles.formSelect}
          value={form.washType}
          onChange={(e) => onChange('washType', e.target.value)}
        >
          {WASH_TYPE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </FormField>

      <FormField label="Special Notes" hint="Optional — driver instructions, damage notes, access requirements">
        <textarea
          className={styles.formTextarea}
          value={form.notes}
          onChange={(e) => onChange('notes', e.target.value)}
          placeholder="Any special instructions for the wash crew..."
          rows={3}
        />
      </FormField>
    </>
  );
}

function Modal({ isOpen, onClose, title, wide, children }) {
  if (!isOpen) return null;
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={`${styles.modalPanel} ${wide ? styles.modalPanelWide : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{title}</h2>
          <button className={styles.modalClose} onClick={onClose} type="button">
            <X size={18} strokeWidth={2} />
          </button>
        </div>
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PortalVehicles() {
  const { portal, isManagementView } = useOutletContext();
  const available = isStageAvailable(portal.stage, 'VEHICLE_ASSIGNMENT');

  // Agreement-based capacity
  const agreement = findAgreementByPortalId(portal.id);
  const totalSlots = agreement ? agreement.vehicleCount : 0;

  // Initialise from data layer; allow local mutations for demo
  const [vehicleList, setVehicleList] = useState(() => getVehiclesByPortalId(portal.id));

  // Modal state
  const [addModalOpen, setAddModalOpen]   = useState(false);
  const [swapModalOpen, setSwapModalOpen] = useState(false);
  const [swapTarget, setSwapTarget]       = useState(null);  // vehicle being replaced

  // Form state
  const [addForm,  setAddForm]  = useState(EMPTY_FORM);
  const [swapForm, setSwapForm] = useState({ ...EMPTY_FORM, swapReason: '' });
  const [addSuccess, setAddSuccess] = useState(false);

  // Bulk upload state
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [bulkStep, setBulkStep] = useState(1);
  const [bulkParsed, setBulkParsed] = useState([]);
  const [bulkErrors, setBulkErrors] = useState([]);
  const [bulkSuccess, setBulkSuccess] = useState(false);
  const fileInputRef = useRef(null);

  // Capacity stats
  const activeVehicles = vehicleList.filter((v) => v.status === 'ACTIVE');
  const usedSlots      = activeVehicles.length;
  const capacityPct    = totalSlots > 0 ? Math.min((usedSlots / totalSlots) * 100, 100) : 0;
  const atCapacity     = usedSlots >= totalSlots;

  if (!available) {
    return <LockedSection />;
  }

  // ─── Handlers ───────────────────────────────────────────────────────────────

  function handleAddFormChange(field, value) {
    setAddForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSwapFormChange(field, value) {
    setSwapForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleAddSubmit() {
    if (!addForm.licensePlate.trim()) return;
    const newVehicle = {
      id: `vehicle-new-${Date.now()}`,
      portalId: portal.id,
      licensePlate: addForm.licensePlate.trim().toUpperCase(),
      vehicleType: addForm.vehicleType,
      washType: addForm.washType,
      notes: addForm.notes.trim(),
      status: 'ACTIVE',
      assignedAt: new Date().toISOString(),
      swappedAt: null,
      replacedBy: null,
    };
    setVehicleList((prev) => [...prev, newVehicle]);
    setAddForm(EMPTY_FORM);
    setAddSuccess(true);
    setTimeout(() => {
      setAddSuccess(false);
      setAddModalOpen(false);
    }, 1400);
  }

  function handleSwapOpen(vehicle) {
    setSwapTarget(vehicle);
    setSwapForm({ ...EMPTY_FORM, swapReason: '' });
    setSwapModalOpen(true);
  }

  function handleSwapSubmit() {
    if (!swapForm.licensePlate.trim() || !swapTarget) return;
    const newId = `vehicle-swap-${Date.now()}`;
    const newVehicle = {
      id: newId,
      portalId: portal.id,
      licensePlate: swapForm.licensePlate.trim().toUpperCase(),
      vehicleType: swapForm.vehicleType,
      washType: swapForm.washType,
      notes: swapForm.notes.trim(),
      status: 'ACTIVE',
      assignedAt: new Date().toISOString(),
      swappedAt: null,
      replacedBy: null,
    };
    setVehicleList((prev) =>
      prev.map((v) =>
        v.id === swapTarget.id
          ? { ...v, status: 'SWAPPED', swappedAt: new Date().toISOString(), replacedBy: newId }
          : v
      ).concat(newVehicle)
    );
    setSwapModalOpen(false);
    setSwapTarget(null);
    setSwapForm({ ...EMPTY_FORM, swapReason: '' });
  }

  function handleRemove(vehicleId) {
    setVehicleList((prev) =>
      prev.map((v) => v.id === vehicleId ? { ...v, status: 'REMOVED' } : v)
    );
  }

  // ─── Bulk upload handlers ───────────────────────────────────────────────────

  function handleDownloadTemplate() {
    const blob = new Blob([CSV_TEMPLATE], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'btc-vehicle-template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result;
      const { rows, errors } = parseCSV(text);

      // Check for plates already in the vehicle list
      const existingPlates = new Set(vehicleList.map((v) => v.licensePlate));
      for (const row of rows) {
        if (row.licensePlate && row.errors.length === 0 && existingPlates.has(row.licensePlate)) {
          row.errors.push('License plate already exists');
          errors.push({ row: row.rowNum, message: `${row.licensePlate} already exists` });
        }
      }

      setBulkParsed(rows);
      setBulkErrors(errors);
      setBulkStep(2);
    };
    reader.readAsText(file);
  }

  function handleBulkSubmit() {
    const remainingSlots = totalSlots - usedSlots;
    const validRows = bulkParsed.filter((r) => r.errors.length === 0);
    const toAdd = validRows.slice(0, remainingSlots);

    const newVehicles = toAdd.map((row, i) => ({
      id: `vehicle-bulk-${Date.now()}-${i}`,
      portalId: portal.id,
      licensePlate: row.licensePlate,
      vehicleType: row.vehicleType,
      washType: row.washType,
      notes: row.notes,
      status: 'ACTIVE',
      assignedAt: new Date().toISOString(),
      swappedAt: null,
      replacedBy: null,
    }));

    setVehicleList((prev) => [...prev, ...newVehicles]);
    setBulkSuccess(true);
    setTimeout(() => {
      setBulkSuccess(false);
      setBulkModalOpen(false);
      setBulkStep(1);
      setBulkParsed([]);
      setBulkErrors([]);
    }, 1400);
  }

  function handleBulkModalClose() {
    setBulkModalOpen(false);
    setBulkStep(1);
    setBulkParsed([]);
    setBulkErrors([]);
    setBulkSuccess(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  // Bulk preview computed values
  const remainingSlots = totalSlots - usedSlots;
  const bulkValidRows = bulkParsed.filter((r) => r.errors.length === 0);
  const bulkCanAdd = Math.min(bulkValidRows.length, remainingSlots);
  const bulkWillTruncate = bulkValidRows.length > remainingSlots;

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className={sectionStyles.page}>

      {/* Page header */}
      <div className={sectionStyles.pageHeader}>
        <div className={sectionStyles.pageIconWrap} style={{ background: 'var(--primary-60)', color: 'var(--primary-10)' }}>
          <Truck size={22} strokeWidth={1.8} />
        </div>
        <div style={{ flex: 1 }}>
          <h1 className={sectionStyles.pageTitle}>Vehicle Assignment</h1>
          <p className={sectionStyles.pageSubtitle}>
            Assign vehicles to your contracted wash slots. Swap or remove vehicles any time without contacting BTC.
          </p>
        </div>
        {!atCapacity && (
          <div className={styles.headerActions}>
            <button
              className={styles.bulkUploadBtn}
              onClick={() => { setBulkStep(1); setBulkParsed([]); setBulkErrors([]); setBulkSuccess(false); setBulkModalOpen(true); }}
              type="button"
            >
              <Upload size={16} strokeWidth={1.8} />
              Bulk Upload
            </button>
            <button
              className={styles.addVehicleBtn}
              onClick={() => { setAddForm(EMPTY_FORM); setAddSuccess(false); setAddModalOpen(true); }}
              type="button"
            >
              <PlusCircle size={16} strokeWidth={1.8} />
              Add Vehicle
            </button>
          </div>
        )}
      </div>

      {/* Capacity bar */}
      <div className={sectionStyles.capacityCard}>
        <div className={sectionStyles.capacityRow}>
          <span className={sectionStyles.capacityLabel}>Vehicle slots used</span>
          <span className={sectionStyles.capacityValue}>
            {usedSlots} / {totalSlots} slots
          </span>
        </div>
        <div className={sectionStyles.capacityBar}>
          <div
            className={sectionStyles.capacityFill}
            style={{
              width: `${capacityPct}%`,
              background: capacityPct >= 100 ? 'var(--alert-error-primary)' : 'var(--primary-10)',
            }}
          />
        </div>
        <div className={sectionStyles.capacityHint}>
          {atCapacity
            ? `All ${totalSlots} contracted slots are filled. Contact BTC to increase capacity.`
            : `${totalSlots - usedSlots} slot${totalSlots - usedSlots !== 1 ? 's' : ''} remaining from your agreement`}
        </div>
      </div>

      {/* Info banner */}
      <div className={sectionStyles.infoCard}>
        <Info size={16} strokeWidth={2} style={{ color: 'var(--primary-10)', flexShrink: 0 }} />
        <div>
          Dutch license plate format: <strong>XX-000-XX</strong>, <strong>00-XX-00</strong>, <strong>XX-00-XX</strong> etc.
          Assign any vehicle type: trucks, trailers, tankers, or refrigerated units.
          Swapping a vehicle preserves the wash history of the original.
        </div>
      </div>

      {/* Vehicle table */}
      <div className={styles.vehicleTable}>
        {/* Header */}
        <div className={styles.tableHead}>
          <span>License Plate</span>
          <span>Type</span>
          <span>Wash Type</span>
          <span>Notes</span>
          <span>Status</span>
          <span>Assigned</span>
          <span></span>
        </div>

        {/* Rows */}
        {vehicleList.length === 0 && (
          <div className={styles.tableEmpty}>
            <Truck size={22} strokeWidth={1.2} style={{ color: 'var(--neutral-40)' }} />
            <span>No vehicles assigned yet. Click "Add Vehicle" to get started.</span>
          </div>
        )}

        {vehicleList.map((vehicle) => {
          const isSwapped = vehicle.status === 'SWAPPED';
          const isRemoved = vehicle.status === 'REMOVED';
          const dim = isSwapped || isRemoved;
          // Find replacement vehicle (if swapped)
          const replacement = vehicle.replacedBy
            ? vehicleList.find((v) => v.id === vehicle.replacedBy)
            : null;

          return (
            <div
              key={vehicle.id}
              className={`${styles.tableRow} ${dim ? styles.tableRowDim : ''}`}
            >
              {/* License plate */}
              <div className={styles.cell}>
                <DutchPlate plate={vehicle.licensePlate} />
              </div>

              {/* Vehicle type */}
              <div className={styles.cell}>
                <VehicleTypeLabel type={vehicle.vehicleType} />
              </div>

              {/* Wash type */}
              <div className={styles.cell}>
                <WashTypeBadge washType={vehicle.washType} />
              </div>

              {/* Notes */}
              <div className={`${styles.cell} ${styles.notesCell}`}>
                {vehicle.notes
                  ? <span className={styles.notesText} title={vehicle.notes}>{vehicle.notes}</span>
                  : <span className={styles.notesMuted}>—</span>}
              </div>

              {/* Status */}
              <div className={styles.cell}>
                <StatusBadge status={vehicle.status} />
                {isSwapped && replacement && (
                  <div className={styles.swapHint}>
                    Replaced by <DutchPlate plate={replacement.licensePlate} size="xs" />
                  </div>
                )}
              </div>

              {/* Date assigned */}
              <div className={`${styles.cell} ${styles.dateCell}`}>
                {new Date(vehicle.assignedAt).toLocaleDateString('nl-NL', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </div>

              {/* Actions */}
              <div className={`${styles.cell} ${styles.actionsCell}`}>
                {vehicle.status === 'ACTIVE' && (
                  <>
                    <button
                      className={styles.swapBtn}
                      onClick={() => handleSwapOpen(vehicle)}
                      type="button"
                      title="Swap this vehicle"
                    >
                      <ArrowLeftRight size={14} strokeWidth={1.8} />
                      Swap
                    </button>
                    {isManagementView && (
                      <button
                        className={styles.removeBtn}
                        onClick={() => handleRemove(vehicle.id)}
                        type="button"
                        title="Remove vehicle"
                      >
                        <Trash2 size={14} strokeWidth={1.8} />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── ADD VEHICLE MODAL ── */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add Vehicle"
      >
        {addSuccess ? (
          <div className={styles.successState}>
            <CheckCircle size={40} strokeWidth={1.5} style={{ color: 'var(--alert-success-primary)' }} />
            <p>Vehicle added successfully!</p>
          </div>
        ) : (
          <>
            <VehicleFormFields form={addForm} onChange={handleAddFormChange} />
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setAddModalOpen(false)} type="button">
                Cancel
              </button>
              <button
                className={styles.submitBtn}
                onClick={handleAddSubmit}
                disabled={!addForm.licensePlate.trim()}
                type="button"
              >
                <PlusCircle size={15} strokeWidth={1.8} />
                Add Vehicle
              </button>
            </div>
          </>
        )}
      </Modal>

      {/* ── SWAP VEHICLE MODAL ── */}
      <Modal
        isOpen={swapModalOpen}
        onClose={() => setSwapModalOpen(false)}
        title="Swap Vehicle"
      >
        {swapTarget && (
          <>
            <div className={styles.swapHeader}>
              <AlertTriangle size={16} strokeWidth={2} style={{ color: 'var(--alert-warning-primary)', flexShrink: 0 }} />
              <span>
                Replacing vehicle <DutchPlate plate={swapTarget.licensePlate} size="sm" />.
                The original vehicle will be marked as <strong>Swapped</strong> and the wash history is retained.
              </span>
            </div>

            <VehicleFormFields form={swapForm} onChange={handleSwapFormChange} />

            <div className={styles.formField}>
              <label className={styles.formLabel}>Reason for Swap</label>
              <div className={styles.formHint}>Optional — e.g. vehicle sold, transferred, breakdown</div>
              <textarea
                className={styles.formTextarea}
                value={swapForm.swapReason}
                onChange={(e) => handleSwapFormChange('swapReason', e.target.value)}
                placeholder="Brief reason for the vehicle swap..."
                rows={2}
              />
            </div>

            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setSwapModalOpen(false)} type="button">
                Cancel
              </button>
              <button
                className={styles.submitBtn}
                onClick={handleSwapSubmit}
                disabled={!swapForm.licensePlate.trim()}
                type="button"
              >
                <ArrowLeftRight size={15} strokeWidth={1.8} />
                Confirm Swap
              </button>
            </div>
          </>
        )}
      </Modal>

      {/* ── BULK UPLOAD MODAL ── */}
      <Modal
        isOpen={bulkModalOpen}
        onClose={handleBulkModalClose}
        title="Bulk Vehicle Upload"
        wide
      >
        {bulkSuccess ? (
          <div className={styles.successState}>
            <CheckCircle size={40} strokeWidth={1.5} style={{ color: 'var(--alert-success-primary)' }} />
            <p>{bulkCanAdd} vehicle{bulkCanAdd !== 1 ? 's' : ''} added successfully!</p>
          </div>
        ) : bulkStep === 1 ? (
          <>
            <span className={styles.bulkStepLabel}>Step 1 of 2</span>

            <div className={styles.templateSection}>
              <p>
                Download the CSV template, fill in your vehicle details, then upload the completed file.
                Each row represents one vehicle.
              </p>
              <button className={styles.downloadBtn} onClick={handleDownloadTemplate} type="button">
                <Download size={15} strokeWidth={1.8} />
                Download Template
              </button>
            </div>

            <hr className={styles.divider} />

            <div
              className={styles.uploadZone}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={24} strokeWidth={1.5} style={{ color: 'var(--neutral-30)' }} />
              <span className={styles.uploadZoneLabel}>Click to upload CSV file</span>
              <span className={styles.uploadZoneHint}>Accepts .csv files up to 100 rows</span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />
          </>
        ) : (
          <>
            <span className={styles.bulkStepLabel}>Step 2 of 2 — Preview</span>

            {bulkErrors.length > 0 && (
              <div className={styles.errorBanner}>
                <AlertCircle size={16} strokeWidth={2} style={{ color: 'var(--alert-error-primary)', flexShrink: 0, marginTop: 2 }} />
                <div>
                  <strong>{bulkErrors.length} issue{bulkErrors.length !== 1 ? 's' : ''} found.</strong> Rows with errors will be skipped.
                  <ul>
                    {bulkErrors.slice(0, 5).map((err, i) => (
                      <li key={i}>Row {err.row}: {err.message}</li>
                    ))}
                    {bulkErrors.length > 5 && <li>...and {bulkErrors.length - 5} more</li>}
                  </ul>
                </div>
              </div>
            )}

            {bulkWillTruncate && (
              <div className={styles.warningBanner}>
                <AlertTriangle size={16} strokeWidth={2} style={{ color: 'var(--alert-warning-primary)', flexShrink: 0, marginTop: 2 }} />
                <span>
                  Only <strong>{remainingSlots}</strong> slot{remainingSlots !== 1 ? 's' : ''} remaining.
                  The first {remainingSlots} valid vehicle{remainingSlots !== 1 ? 's' : ''} will be added;
                  {' '}{bulkValidRows.length - remainingSlots} will be skipped.
                </span>
              </div>
            )}

            <div className={styles.previewTable}>
              <div className={styles.previewHead}>
                <span>#</span>
                <span>License Plate</span>
                <span>Type</span>
                <span>Wash Type</span>
                <span>Notes</span>
                <span>Status</span>
              </div>
              {bulkParsed.map((row, idx) => {
                const hasError = row.errors.length > 0;
                const validIdx = hasError ? -1 : bulkValidRows.indexOf(row);
                const isSkipped = !hasError && validIdx >= remainingSlots;

                return (
                  <div
                    key={idx}
                    className={`${styles.previewRow} ${hasError ? styles.previewRowError : ''} ${isSkipped ? styles.previewRowSkipped : ''}`}
                  >
                    <span className={styles.previewRowNum}>{row.rowNum}</span>
                    <span>{row.licensePlate ? <DutchPlate plate={row.licensePlate} size="xs" /> : '—'}</span>
                    <span>{VALID_VEHICLE_TYPES.has(row.vehicleType) ? <VehicleTypeLabel type={row.vehicleType} /> : (row.vehicleType || '—')}</span>
                    <span>{VALID_WASH_TYPES.has(row.washType) ? <WashTypeBadge washType={row.washType} /> : (row.washType || '—')}</span>
                    <span className={styles.previewNotes} title={row.notes}>{row.notes || '—'}</span>
                    <span className={styles.previewStatus}>
                      {hasError ? (
                        <span className={styles.previewStatusError} title={row.errors.join('; ')}>
                          <X size={13} strokeWidth={2.5} /> Error
                        </span>
                      ) : isSkipped ? (
                        <span className={styles.previewStatusSkipped}>Skipped</span>
                      ) : (
                        <span className={styles.previewStatusValid}>
                          <CheckCircle size={13} strokeWidth={2} /> Valid
                        </span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className={styles.modalActions}>
              <button
                className={styles.backBtn}
                onClick={() => { setBulkStep(1); setBulkParsed([]); setBulkErrors([]); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                type="button"
              >
                <ArrowLeft size={14} strokeWidth={1.8} />
                Back
              </button>
              <button
                className={styles.submitBtn}
                onClick={handleBulkSubmit}
                disabled={bulkCanAdd === 0}
                type="button"
              >
                <PlusCircle size={15} strokeWidth={1.8} />
                Add {bulkCanAdd} Vehicle{bulkCanAdd !== 1 ? 's' : ''}
              </button>
            </div>
          </>
        )}
      </Modal>
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
        Vehicle assignment becomes available once your agreement has been digitally accepted. Required stage: <strong>Vehicle Assignment</strong>.
      </p>
    </div>
  );
}
