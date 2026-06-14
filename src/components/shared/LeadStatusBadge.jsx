import styles from './LeadStatusBadge.module.css';

const STATUS_CONFIG = {
  CAPTURED: { label: 'New Lead', className: 'captured' },
  APPROVED: { label: 'Awaiting Details', className: 'approved' },
  // DETAILS_SUBMITTED is folded into UNDER_REVIEW; kept as a safe alias.
  DETAILS_SUBMITTED: { label: 'Under Review', className: 'underReview' },
  UNDER_REVIEW: { label: 'Under Review', className: 'underReview' },
  PROPOSAL_SENT: { label: 'Proposal Sent', className: 'proposalSent' },
  AWAITING_ACCEPTANCE: { label: 'Awaiting Acceptance', className: 'awaitingAcceptance' },
  READY_TO_CONVERT: { label: 'Ready to Convert', className: 'awaitingAcceptance' },
  CONVERTED: { label: 'Converted', className: 'converted' },
  LOST: { label: 'Lost', className: 'lost' },
};

export default function LeadStatusBadge({ status = 'CAPTURED' }) {
  const config = STATUS_CONFIG[status] ?? { label: status, className: 'captured' };

  return (
    <span className={`${styles.badge} ${styles[config.className]}`}>
      {config.label}
    </span>
  );
}
