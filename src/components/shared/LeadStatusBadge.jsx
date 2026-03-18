import styles from './LeadStatusBadge.module.css';

const STATUS_CONFIG = {
  CAPTURED: { label: 'Captured', className: 'captured' },
  APPROVED: { label: 'Approved', className: 'approved' },
  DETAILS_SUBMITTED: { label: 'Details Submitted', className: 'detailsSubmitted' },
  UNDER_REVIEW: { label: 'Under Review', className: 'underReview' },
  PROPOSAL_SENT: { label: 'Proposal Sent', className: 'proposalSent' },
  AWAITING_ACCEPTANCE: { label: 'Awaiting Acceptance', className: 'awaitingAcceptance' },
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
