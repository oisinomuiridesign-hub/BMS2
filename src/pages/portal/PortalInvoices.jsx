import { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Receipt,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  InboxIcon,
} from 'lucide-react';
import { isStageAvailable } from '../../components/portal/PortalShell';
import { getInvoicesByPortalId } from '../../data/portal/invoices';
import sectionStyles from './PortalSection.module.css';
import styles from './PortalInvoices.module.css';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatEur(amount) {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(amount);
}

function formatDate(dateStr) {
  return new Date(dateStr + 'T12:00:00Z').toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

function formatPeriod(from, to) {
  const f = new Date(from + 'T12:00:00Z');
  const t = new Date(to + 'T12:00:00Z');
  const fLabel = f.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  const tLabel = t.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  return `${fLabel} – ${tLabel}`;
}

const FILTER_OPTIONS = ['ALL', 'PAID', 'PENDING', 'OVERDUE'];

const FILTER_LABELS = {
  ALL: 'All',
  PAID: 'Paid',
  PENDING: 'Pending',
  OVERDUE: 'Overdue',
};

// ─── Status pip ───────────────────────────────────────────────────────────────

function StatusPip({ status }) {
  if (status === 'PAID') {
    return (
      <span className={`${styles.statusPip} ${styles.statusPaid}`}>
        <CheckCircle size={10} strokeWidth={2.5} />
        Paid
      </span>
    );
  }
  if (status === 'PENDING') {
    return (
      <span className={`${styles.statusPip} ${styles.statusPending}`}>
        <Clock size={10} strokeWidth={2.5} />
        Pending
      </span>
    );
  }
  return (
    <span className={`${styles.statusPip} ${styles.statusOverdue}`}>
      <AlertCircle size={10} strokeWidth={2.5} />
      Overdue
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PortalInvoices() {
  const { portal } = useOutletContext();
  const available = isStageAvailable(portal.stage, 'OPERATIONAL');

  const [activeFilter, setActiveFilter] = useState('ALL');

  const allInvoices = getInvoicesByPortalId(portal.id);

  const filtered = useMemo(() => {
    if (activeFilter === 'ALL') return allInvoices;
    return allInvoices.filter((inv) => inv.status === activeFilter);
  }, [allInvoices, activeFilter]);

  const counts = useMemo(() => ({
    ALL: allInvoices.length,
    PAID: allInvoices.filter((i) => i.status === 'PAID').length,
    PENDING: allInvoices.filter((i) => i.status === 'PENDING').length,
    OVERDUE: allInvoices.filter((i) => i.status === 'OVERDUE').length,
  }), [allInvoices]);

  const totals = useMemo(() => {
    const totalBilled = allInvoices.reduce((s, i) => s + i.amountIncVat, 0);
    const totalPaid   = allInvoices.filter((i) => i.status === 'PAID').reduce((s, i) => s + i.amountIncVat, 0);
    const totalOpen   = allInvoices.filter((i) => i.status !== 'PAID').reduce((s, i) => s + i.amountIncVat, 0);
    const totalOverdue = allInvoices.filter((i) => i.status === 'OVERDUE').reduce((s, i) => s + i.amountIncVat, 0);
    return { totalBilled, totalPaid, totalOpen, totalOverdue };
  }, [allInvoices]);

  if (!available) {
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
          Invoices become available once the account reaches Operational stage.
          Required stage: <strong>Operational</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className={sectionStyles.page}>

      {/* Page header */}
      <div className={sectionStyles.pageHeader}>
        <div
          className={sectionStyles.pageIconWrap}
          style={{ background: 'var(--primary-60)', color: 'var(--primary-10)' }}
        >
          <Receipt size={22} strokeWidth={1.8} />
        </div>
        <div>
          <h1 className={sectionStyles.pageTitle}>Invoices</h1>
          <p className={sectionStyles.pageSubtitle}>
            Overview of your billing invoices. Download copies or track payment status.
          </p>
        </div>
      </div>

      {/* Summary bar */}
      <div className={styles.summaryBar}>
        <div className={styles.summaryChip}>
          <span className={styles.summaryChipLabel}>Total billed (YTD)</span>
          <span className={styles.summaryChipAmount}>{formatEur(totals.totalBilled)}</span>
          <span className={styles.summaryChipSub}>{counts.ALL} invoices</span>
        </div>
        <div className={`${styles.summaryChip} ${styles.summaryChipPaid}`}>
          <span className={styles.summaryChipLabel}>Paid</span>
          <span className={styles.summaryChipAmount}>{formatEur(totals.totalPaid)}</span>
          <span className={styles.summaryChipSub}>{counts.PAID} invoices</span>
        </div>
        <div className={`${styles.summaryChip} ${totals.totalOverdue > 0 ? styles.summaryChipOverdue : ''}`}>
          <span className={styles.summaryChipLabel}>Outstanding</span>
          <span className={styles.summaryChipAmount}>{formatEur(totals.totalOpen)}</span>
          <span className={styles.summaryChipSub}>
            {counts.PENDING} pending{counts.OVERDUE > 0 ? `, ${counts.OVERDUE} overdue` : ''}
          </span>
        </div>
      </div>

      {/* Filter tabs */}
      <div className={styles.filterTabs}>
        {FILTER_OPTIONS.map((f) => (
          <button
            key={f}
            type="button"
            className={`${styles.filterTab} ${activeFilter === f ? styles.filterTabActive : ''}`}
            onClick={() => setActiveFilter(f)}
          >
            {FILTER_LABELS[f]}
            <span className={styles.filterTabCount}>{counts[f]}</span>
          </button>
        ))}
      </div>

      {/* Invoice table */}
      <div className={styles.invoiceTable}>
        <div className={styles.invoiceTableHead}>
          <span>Invoice</span>
          <span>Period</span>
          <span>Issued</span>
          <span>Due date</span>
          <span>Amount (incl. VAT)</span>
          <span>Status</span>
          <span></span>
        </div>

        {filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <InboxIcon size={32} className={styles.emptyIcon} strokeWidth={1.5} />
            No invoices match the selected filter.
          </div>
        ) : (
          filtered.map((inv) => (
            <div
              key={inv.id}
              className={`${styles.invoiceRow} ${inv.status === 'OVERDUE' ? styles.invoiceRowOverdue : ''}`}
            >
              {/* Invoice number */}
              <div className={styles.invoiceNumberCell}>
                <span className={styles.invoiceNumber}>{inv.invoiceNumber}</span>
                <span className={styles.moneybirdRef}>{inv.moneybirdRef}</span>
              </div>

              {/* Period */}
              <div className={styles.periodCell}>
                {formatPeriod(inv.periodFrom, inv.periodTo)}
              </div>

              {/* Invoice date */}
              <div className={styles.dateCell}>
                {formatDate(inv.invoiceDate)}
              </div>

              {/* Due date */}
              <div className={`${styles.dateCell} ${inv.status === 'OVERDUE' ? styles.dateCellOverdue : ''}`}>
                {formatDate(inv.dueDate)}
              </div>

              {/* Amount */}
              <div>
                <div className={styles.amountCell}>{formatEur(inv.amountIncVat)}</div>
                <div className={styles.amountExVat}>{formatEur(inv.amountExVat)} excl. VAT</div>
              </div>

              {/* Status */}
              <div>
                <StatusPip status={inv.status} />
              </div>

              {/* Download */}
              <div>
                <button type="button" className={styles.downloadBtn} disabled>
                  <Download size={13} strokeWidth={2} />
                  PDF
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
