import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Home,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  MoreVertical,
  RotateCcw,
  Search,
  Eye,
  EyeOff,
  ArrowRight,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  FileText,
} from 'lucide-react';
import { leadActivities } from '../../data/leads/leadActivities';
import { employees } from '../../data/bms/employees';
import { useData } from '../../context/DataContext';
import LeadStatusBadge from '../../components/shared/LeadStatusBadge';
import AvatarInitials from '../../components/shared/AvatarInitials';
import Modal from '../../components/shared/Modal';
import CustomButton from '../../components/shared/CustomButton';
import styles from './LeadProfile.module.css';

// ── Pipeline stages in order ───────────────────────────────────────────────
const PIPELINE_STAGES = [
  { key: 'CAPTURED', label: 'Captured', description: 'Enquiry form submitted — awaiting planner approval' },
  { key: 'APPROVED', label: 'Approved', description: 'Planner approved — service details form emailed to lead' },
  { key: 'DETAILS_SUBMITTED', label: 'Details Submitted', description: 'Lead submitted service details — awaiting BTC review' },
  { key: 'UNDER_REVIEW', label: 'Under Review', description: 'BTC team reviewing submitted service details' },
  { key: 'PROPOSAL_SENT', label: 'Proposal Sent', description: 'Draft agreement and Moneybird quote sent to lead' },
  { key: 'AWAITING_ACCEPTANCE', label: 'Awaiting Acceptance', description: 'Awaiting lead signature on service agreement' },
  { key: 'CONVERTED', label: 'Converted', description: 'Lead converted to full client' },
];

const STAGE_INDEX = Object.fromEntries(PIPELINE_STAGES.map((s, i) => [s.key, i]));

const SOURCE_LABELS = {
  WEBSITE_FORM: 'Website Form',
  PHONE: 'Phone',
  EMAIL: 'Email',
  REFERRAL: 'Referral',
  MANUAL: 'Manual Entry',
};

// ── Helpers ─────────────────────────────────────────────────────────────────
function formatDate(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatTimestamp(isoString) {
  if (!isoString) return '—';
  const d = new Date(isoString);
  return (
    d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
    ', ' +
    d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  );
}

function formatDateBadge(isoString) {
  const d = new Date(isoString);
  return {
    day: String(d.getDate()).padStart(2, '0'),
    month: d.toLocaleString('en-GB', { month: 'short' }).toUpperCase(),
    year: d.getFullYear(),
  };
}

// ── ActivityCard (reused from ClientProfile pattern) ───────────────────────
function ActivityCard({ activity }) {
  const [expanded, setExpanded] = useState(false);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const badge = formatDateBadge(activity.createdAt);
  const isNote = activity.type === 'note';
  const TRUNCATE_AT = 200;
  const longContent = activity.content.length > TRUNCATE_AT;
  const displayContent =
    expanded || !longContent ? activity.content : activity.content.slice(0, TRUNCATE_AT) + '…';

  return (
    <div className={styles.activityRow}>
      <div className={styles.dateBadge}>
        <span className={styles.dateBadgeDay}>{badge.day}</span>
        <span className={styles.dateBadgeMonth}>{badge.month}</span>
        <span className={styles.dateBadgeYear}>{badge.year}</span>
      </div>

      <div className={`${styles.activityCard} ${isNote ? styles.activityNote : styles.activitySystem}`}>
        <div className={styles.activityHeader}>
          <div className={styles.activityMeta}>
            <span className={`${styles.typeBadge} ${isNote ? styles.typeBadgeNote : styles.typeBadgeSystem}`}>
              {isNote ? 'Note' : 'System'}
            </span>
            <span className={styles.activityAuthor}>by {activity.authorName}</span>
            <span className={styles.activityTimestamp}>{formatTimestamp(activity.createdAt)}</span>
          </div>
          <button className={styles.cardMenuBtn} type="button" aria-label="Options">
            <MoreVertical size={15} />
          </button>
        </div>

        <h3 className={styles.activityTitle}>{activity.title}</h3>

        <p className={styles.activityContent}>
          {displayContent}
          {longContent && (
            <button
              className={styles.readMoreBtn}
              onClick={() => setExpanded((e) => !e)}
              type="button"
            >
              {expanded ? ' show less' : ' ...read more'}
            </button>
          )}
        </p>

        {activity.replies && activity.replies.length > 0 && (
          <div className={styles.replies}>
            {activity.replies.map((reply) => (
              <div key={reply.id} className={styles.reply}>
                <div className={styles.replyMeta}>
                  <span className={styles.replyAuthor}>{reply.authorName}</span>
                  <span className={styles.replyTime}>{formatTimestamp(reply.createdAt)}</span>
                </div>
                <p className={styles.replyContent}>{reply.content}</p>
              </div>
            ))}
          </div>
        )}

        <div className={styles.activityFooter}>
          <button
            className={styles.replyBtn}
            onClick={() => setShowReplyBox((s) => !s)}
            type="button"
          >
            <MessageSquare size={14} />
            Reply
          </button>
        </div>

        {showReplyBox && (
          <div className={styles.replyBox}>
            <textarea
              className={styles.replyTextarea}
              placeholder="Write a reply…"
              rows={3}
            />
            <button className={styles.replySubmitBtn} type="button">
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Approve Lead Modal ───────────────────────────────────────────────────────
function ApproveModal({ isOpen, onClose, contactPerson, contactEmail, onConfirm }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Approve Lead">
      <div className={styles.convertModal}>
        <div className={`${styles.convertIcon} ${styles.approveIcon}`}>
          <CheckCircle size={32} strokeWidth={1.5} />
        </div>
        <p className={styles.convertText}>
          Approving this lead will send the <strong>Service Detail Form (Form 2)</strong> to{' '}
          <strong>{contactPerson}</strong> at {contactEmail}. They will complete and return it
          before a quote can be drafted.
        </p>
        <div className={styles.convertActions}>
          <button className={styles.convertCancelBtn} type="button" onClick={onClose}>
            Cancel
          </button>
          <button className={styles.approveConfirmBtn} type="button" onClick={onConfirm}>
            Confirm Approval
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ── Convert to Client Modal ─────────────────────────────────────────────────
function ConvertModal({ isOpen, onClose, companyName, onConfirm }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Convert Lead to Client">
      <div className={styles.convertModal}>
        <div className={styles.convertIcon}>
          <RefreshCw size={32} strokeWidth={1.5} />
        </div>
        <p className={styles.convertText}>
          This will move <strong>{companyName}</strong> from the Leads module to the Clients module.
          All data will be carried over — company info, contacts, service details, and agreement.{' '}
          <strong>This cannot be undone.</strong>
        </p>
        <div className={styles.convertActions}>
          <button className={styles.convertCancelBtn} type="button" onClick={onClose}>
            Cancel
          </button>
          <button className={styles.convertConfirmBtn} type="button" onClick={onConfirm}>
            Confirm Conversion
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ── AgreementCard — collapsed/expandable card for one agreement ─────────────
function AgreementCard({ agreement, formatPrice, statusBadgeStyle, statusLabel, styles, lead }) {
  const [expanded, setExpanded] = useState(false);

  const summary = [
    `${agreement.vehicleCount} vehicles`,
    agreement.washFrequency,
    formatPrice(agreement.pricePerWash, agreement.currency) + ' /wash',
  ].join(' · ');

  return (
    <div className={styles.agreementCard}>
      {/* ── Collapsed header — click to expand ── */}
      <div
        className={styles.agreementCardHeader}
        onClick={() => setExpanded((v) => !v)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setExpanded((v) => !v); }}
        aria-expanded={expanded}
      >
        <div className={styles.agreementCardLeft}>
          <span className={styles.manualStatusBadge} style={statusBadgeStyle(agreement.status)}>
            {statusLabel(agreement.status)}
          </span>
          {agreement.moneybirdQuoteRef && (
            <span className={styles.agreementCardMbRef}>{agreement.moneybirdQuoteRef}</span>
          )}
          <span className={styles.agreementCardSummary}>{summary}</span>
        </div>
        <div className={styles.agreementCardRight}>
          <a
            href="https://moneybird.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.mbLinkBtn}
            onClick={(e) => e.stopPropagation()}
            title="Open in Moneybird"
          >
            <ExternalLink size={14} />
          </a>
          {expanded
            ? <ChevronUp size={14} className={styles.agreementCardChevron} />
            : <ChevronDown size={14} className={styles.agreementCardChevron} />
          }
        </div>
      </div>

      {/* ── Expanded body ── */}
      {expanded && (
        <div className={styles.agreementCardBody}>
          {agreement.status === 'ACCEPTED' && (
            <div className={styles.statusApproved}>
              <CheckCircle size={18} className={styles.approvedIcon} />
              <span className={styles.approvedText}>
                Agreement accepted by {agreement.acceptedBy} on {formatDate(agreement.acceptedAt)}
                {lead.convertedAt && ` — converted to client on ${formatDate(lead.convertedAt)}`}
              </span>
            </div>
          )}
          {(agreement.status === 'AWAITING_ACCEPTANCE' || agreement.status === 'AMENDED') && (
            <div className={styles.agreementStatus}>
              <Clock size={16} className={styles.agreementStatusIcon} />
              <span className={styles.agreementStatusText}>
                Awaiting digital acceptance — sent {formatDate(agreement.sentAt)}
                {agreement.amendments && agreement.amendments.filter(a => a.status === 'PENDING').length > 0 && (
                  <span style={{ display: 'block', marginTop: '4px', color: 'var(--alert-warning-primary)', fontWeight: 600 }}>
                    {agreement.amendments.filter(a => a.status === 'PENDING').length} amendment request(s) pending review.
                  </span>
                )}
              </span>
            </div>
          )}
          {agreement.status === 'DRAFT' && (
            <div className={styles.agreementStatus}>
              <Clock size={16} className={styles.agreementStatusIcon} />
              <span className={styles.agreementStatusText}>Internal draft — not yet sent to client</span>
            </div>
          )}

          <div className={styles.agreementTerms}>
            <h4 className={styles.agreementTermsTitle}>
              {agreement.status === 'DRAFT' ? 'Draft Terms' : agreement.status === 'ACCEPTED' ? 'Agreement Terms' : 'Key Terms'}
            </h4>
            {[
              ['Vehicle count', `${agreement.vehicleCount} vehicles`],
              ['Wash frequency', agreement.washFrequency],
              ['Service type', agreement.serviceType],
              ['Price per wash', formatPrice(agreement.pricePerWash, agreement.currency)],
              ['Contract duration', agreement.contractDuration],
              ['Start date', formatDate(agreement.startDate)],
              ['Payment terms', agreement.paymentTerms],
            ].map(([label, value]) => (
              <div key={label} className={styles.termRow}>
                <span className={styles.termLabel}>{label}</span>
                <span className={styles.termValue}>{value}</span>
              </div>
            ))}
          </div>

          {agreement.status === 'DRAFT' && (
            <div className={styles.agreementAcceptance}>
              <p className={styles.acceptanceNote}>
                This draft has not been sent to the client yet. Finalise and generate a Moneybird quote before sending.
              </p>
            </div>
          )}
          {(agreement.status === 'AWAITING_ACCEPTANCE' || agreement.status === 'AMENDED') && (
            <div className={styles.agreementAcceptance}>
              <p className={styles.acceptanceNote}>
                Digital acceptance pending via client portal. A notification will be sent automatically when the agreement is signed.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AgreementCardList({ leadAgreements, formatPrice, statusBadgeStyle, statusLabel, styles, lead }) {
  return (
    <div className={styles.agreementCardList}>
      {leadAgreements.map((agreement) => (
        <AgreementCard
          key={agreement.id}
          agreement={agreement}
          formatPrice={formatPrice}
          statusBadgeStyle={statusBadgeStyle}
          statusLabel={statusLabel}
          styles={styles}
          lead={lead}
        />
      ))}
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────
export default function LeadProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { leads, agreements, convertLeadToClient } = useData();

  const lead = leads.find((l) => l.id === id);
  const [activeTab, setActiveTab] = useState('overview');
  const [leadStatus, setLeadStatus] = useState(lead?.status ?? 'CAPTURED');
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [approveSuccess, setApproveSuccess] = useState(false);

  // Activity tab state
  const [filterSearch, setFilterSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showArchived, setShowArchived] = useState(false);
  const [noteText, setNoteText] = useState('');

  const assignedEmployee = useMemo(() => {
    if (!lead) return null;
    return employees.find((e) => e.id === lead.assignedTo) ?? null;
  }, [lead]);

  const leadActivitiesFiltered = useMemo(() => {
    if (!lead) return [];
    return leadActivities
      .filter((a) => a.leadId === lead.id)
      .filter((a) => {
        if (typeFilter === 'notes') return a.type === 'note';
        if (typeFilter === 'system') return a.type === 'system';
        return true;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [lead, typeFilter]);

  if (!lead) {
    return (
      <div className={styles.notFound}>
        <p>Lead not found.</p>
        <button onClick={() => navigate('/leads')} type="button">
          Back to Leads
        </button>
      </div>
    );
  }

  const currentStageIndex = STAGE_INDEX[leadStatus] ?? -1;
  const isLost = leadStatus === 'LOST';
  const canConvert = currentStageIndex >= 2 && leadStatus !== 'CONVERTED' && leadStatus !== 'LOST';

  const TABS = [
    { key: 'overview', label: 'Overview' },
    { key: 'agreement', label: 'Agreement' },
    { key: 'activity', label: 'Activity' },
  ];

  function handleApproveConfirm() {
    setShowApproveModal(false);
    setLeadStatus('APPROVED');
    setApproveSuccess(true);
  }

  function handleConvertConfirm() {
    const newClientId = convertLeadToClient(lead.id);
    setShowConvertModal(false);
    if (newClientId) {
      setLeadStatus('CONVERTED');
      navigate(`/clients/${newClientId}`);
    }
  }

  return (
    <div className={styles.page}>
      {/* ── Top Bar ── */}
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <h1 className={styles.pageTitle}>LEADS</h1>
          <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
            <Link to="/" className={styles.breadcrumbLink}>
              <Home size={14} />
            </Link>
            <ChevronRight size={14} className={styles.breadcrumbSep} />
            <Link to="/leads" className={styles.breadcrumbLink}>
              Leads
            </Link>
            <ChevronRight size={14} className={styles.breadcrumbSep} />
            <span className={styles.breadcrumbCurrent}>{lead.companyName}</span>
          </nav>
        </div>

        {/* Tab bar top-right */}
        <nav className={styles.tabBar} aria-label="Lead profile tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`${styles.tabLink} ${activeTab === tab.key ? styles.tabLinkActive : ''}`}
              onClick={() => setActiveTab(tab.key)}
              type="button"
            >
              {activeTab === tab.key && <span className={styles.tabDot} />}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Approve success banner */}
      {approveSuccess && leadStatus === 'APPROVED' && (
        <div className={styles.successBanner}>
          <CheckCircle size={16} />
          <span>
            Lead approved. Form 2 has been sent to <strong>{lead.contactEmail}</strong>.
          </span>
        </div>
      )}

      {/* Converted banner — shown for leads that are already CONVERTED */}
      {leadStatus === 'CONVERTED' && lead.convertedTo && (
        <div className={styles.successBanner}>
          <CheckCircle size={16} />
          <span>
            <strong>{lead.companyName}</strong> has been converted to a client.{' '}
            <Link to={`/clients/${lead.convertedTo}`} className={styles.bannerLink}>
              View Client Profile →
            </Link>
          </span>
        </div>
      )}

      {/* ── Body ── */}
      <div className={styles.body}>

        {/* ================================================================
            TAB: OVERVIEW
            ================================================================ */}
        {activeTab === 'overview' && (
          <>
            {/* Left: Company Info */}
            <div className={styles.overviewLeft}>
              <div className={styles.infoCard}>
                <div className={styles.infoCardHeader}>
                  <AvatarInitials
                    initials={lead.avatarInitials}
                    color={lead.avatarColor}
                    size="lg"
                  />
                  <div className={styles.infoCardHeadText}>
                    <h2 className={styles.infoCompanyName}>{lead.companyName}</h2>
                    <LeadStatusBadge status={leadStatus} />
                  </div>
                </div>

                <div className={styles.infoSection}>
                  <span className={styles.infoSectionLabel}>Contact Details</span>
                  <div className={styles.infoRow}>
                    <User size={14} className={styles.infoIcon} />
                    <span className={styles.infoValue}>{lead.contactPerson}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <Mail size={14} className={styles.infoIcon} />
                    <a href={`mailto:${lead.contactEmail}`} className={styles.infoLink}>
                      {lead.contactEmail}
                    </a>
                  </div>
                  <div className={styles.infoRow}>
                    <Phone size={14} className={styles.infoIcon} />
                    <span className={styles.infoValue}>{lead.contactPhone}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <MapPin size={14} className={styles.infoIcon} />
                    <span className={styles.infoValue}>{lead.location}</span>
                  </div>
                </div>

                <div className={styles.infoSection}>
                  <span className={styles.infoSectionLabel}>Lead Details</span>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Lead Source</span>
                    <span className={styles.sourceBadge}>{SOURCE_LABELS[lead.leadSource]}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Created</span>
                    <span className={styles.detailValue}>{formatDate(lead.createdAt)}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Last Updated</span>
                    <span className={styles.detailValue}>{formatDate(lead.updatedAt)}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Assigned To</span>
                    <span className={styles.detailValue}>
                      {assignedEmployee
                        ? `${assignedEmployee.firstName} ${assignedEmployee.lastName}`
                        : 'Unassigned'}
                    </span>
                  </div>
                  {lead.convertedAt && (
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Converted</span>
                      <span className={styles.detailValue}>{formatDate(lead.convertedAt)}</span>
                    </div>
                  )}
                </div>

                {/* ── Enquiry Form (Form 1) ── */}
                {lead.enquiryForm && (
                  <div className={styles.infoSection}>
                    <span className={styles.infoSectionLabel}>Enquiry Form</span>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Fleet size</span>
                      <span className={styles.detailValue}>~{lead.enquiryForm.fleetSize} vehicles</span>
                    </div>
                    <div className={styles.detailRowBlock}>
                      <span className={styles.detailLabel}>Service interest</span>
                      <p className={styles.detailParagraph}>{lead.enquiryForm.serviceInterest}</p>
                    </div>
                    {lead.plannerApprovedAt && (
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Approved by</span>
                        <span className={styles.detailValue}>
                          {lead.plannerApprovedBy} — {formatDate(lead.plannerApprovedAt)}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Service Details Form (Form 2) ── */}
                {lead.serviceDetailsForm && (
                  <div className={styles.infoSection}>
                    <span className={styles.infoSectionLabel}>Service Details</span>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>KVK</span>
                      <span className={styles.detailValue}>{lead.serviceDetailsForm.kvkNumber}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>VAT (BTW)</span>
                      <span className={styles.detailValue}>{lead.serviceDetailsForm.vatNumber}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Address</span>
                      <span className={styles.detailValue}>
                        {lead.serviceDetailsForm.street} {lead.serviceDetailsForm.houseNumber},{' '}
                        {lead.serviceDetailsForm.postalCode} {lead.serviceDetailsForm.city}
                      </span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Service type</span>
                      <span className={styles.detailValue}>{lead.serviceDetailsForm.serviceType}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Shunting</span>
                      <span className={styles.detailValue}>{lead.serviceDetailsForm.shuntingOption}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Wash location</span>
                      <span className={styles.detailValue}>{lead.serviceDetailsForm.washLocation}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Schedule</span>
                      <span className={styles.detailValue}>{lead.serviceDetailsForm.preferredSchedule}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Vehicles</span>
                      <span className={styles.detailValue}>{lead.serviceDetailsForm.vehicleTable.length} vehicles</span>
                    </div>
                    {lead.serviceDetailsForm.discount && (
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Discount</span>
                        <span className={styles.detailValue}>{lead.serviceDetailsForm.discountPercent}%</span>
                      </div>
                    )}
                    {lead.serviceDetailsForm.additionalAgreements && (
                      <div className={styles.detailRowBlock}>
                        <span className={styles.detailLabel}>Additional notes</span>
                        <p className={styles.detailParagraph}>{lead.serviceDetailsForm.additionalAgreements}</p>
                      </div>
                    )}

                    {/* Vehicle table */}
                    <div className={styles.vehicleTableWrapper}>
                      <table className={styles.vehicleTable}>
                        <thead>
                          <tr className={styles.vehicleTableHead}>
                            <th className={styles.vehicleThNum}>Vehicle</th>
                            <th className={styles.vehicleThType}>Type</th>
                            <th className={styles.vehicleThFreq}>Freq.</th>
                            <th className={styles.vehicleThTreat}>Treatments</th>
                            <th className={styles.vehicleThPrice}>Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lead.serviceDetailsForm.vehicleTable.map((row, i) => (
                            <tr key={i} className={styles.vehicleTableRow}>
                              <td className={styles.vehicleTdNum}>{row.vehicleNumber}</td>
                              <td className={styles.vehicleTdType}>{row.vehicleType}</td>
                              <td className={styles.vehicleTdFreq}>
                                {row.frequencyWeeks === 1 ? 'Weekly' : `${row.frequencyWeeks}w`}
                              </td>
                              <td className={styles.vehicleTdTreat}>
                                {row.treatments.join(', ')}
                              </td>
                              <td className={styles.vehicleTdPrice}>€{row.pricePerVehicle}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Lost reason */}
                {lead.lostReason && (
                  <div className={styles.infoSection}>
                    <span className={styles.infoSectionLabel}>Lost Reason</span>
                    <p className={styles.detailParagraph} style={{ color: 'var(--alert-error-primary)' }}>
                      {lead.lostReason}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Pipeline Stepper */}
            <div className={styles.overviewRight}>
              <div className={styles.pipelineCard}>
                <h3 className={styles.pipelineTitle}>Pipeline Stage</h3>
                {isLost ? (
                  <div className={styles.lostBanner}>
                    <XCircle size={20} className={styles.lostIcon} />
                    <div>
                      <span className={styles.lostTitle}>Lead Lost</span>
                      <span className={styles.lostSub}>
                        This lead has been closed as lost on {formatDate(lead.updatedAt)}.
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className={styles.stepper}>
                    {PIPELINE_STAGES.map((stage, idx) => {
                      const isDone = idx < currentStageIndex;
                      const isCurrent = idx === currentStageIndex;
                      const isFuture = idx > currentStageIndex;

                      return (
                        <div key={stage.key} className={styles.stepperItem}>
                          <div className={styles.stepperLeft}>
                            <div
                              className={`${styles.stepDot} ${
                                isDone ? styles.stepDone : isCurrent ? styles.stepCurrent : styles.stepFuture
                              }`}
                            >
                              {isDone ? (
                                <CheckCircle size={16} strokeWidth={2.5} />
                              ) : isCurrent ? (
                                <span className={styles.stepDotInner} />
                              ) : (
                                <span className={styles.stepDotEmpty} />
                              )}
                            </div>
                            {idx < PIPELINE_STAGES.length - 1 && (
                              <div
                                className={`${styles.stepLine} ${
                                  isDone ? styles.stepLineDone : styles.stepLineFuture
                                }`}
                              />
                            )}
                          </div>
                          <div className={styles.stepContent}>
                            <span
                              className={`${styles.stepLabel} ${
                                isCurrent ? styles.stepLabelCurrent : isDone ? styles.stepLabelDone : styles.stepLabelFuture
                              }`}
                            >
                              {stage.label}
                            </span>
                            {isCurrent && (
                              <span className={styles.stepDescription}>{stage.description}</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className={styles.pipelineFooter}>
                  <Clock size={13} className={styles.pipelineFooterIcon} />
                  <span className={styles.pipelineFooterText}>
                    Last activity: {formatTimestamp(lead.lastActivity)}
                  </span>
                </div>

                {/* Approve Lead action — only for CAPTURED leads */}
                {leadStatus === 'CAPTURED' && (
                  <div className={styles.convertAction}>
                    <button
                      className={styles.approveBtn}
                      type="button"
                      onClick={() => setShowApproveModal(true)}
                    >
                      <CheckCircle size={15} />
                      Approve Lead
                    </button>
                  </div>
                )}

                {/* Convert to Client action — only available from DETAILS_SUBMITTED onwards */}
                {canConvert && (
                  <div className={styles.convertAction}>
                    <button
                      className={styles.convertBtn}
                      type="button"
                      onClick={() => setShowConvertModal(true)}
                    >
                      <RefreshCw size={15} />
                      Convert to Client
                    </button>
                  </div>
                )}
                {leadStatus === 'CONVERTED' && lead.convertedTo && (
                  <div className={styles.convertAction}>
                    <Link to={`/clients/${lead.convertedTo}`} className={styles.viewClientBtn}>
                      <ArrowRight size={15} />
                      View Client Profile
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {false && (() => {
          const manual = findManualByLeadId(lead.id);
          const effectiveStatus = manualStatus || (manual ? manual.status : null);

          return (
            <div className={styles.tabContent}>
              <div className={styles.statusCard}>
                <div className={styles.statusCardHeader}>
                  <FileText size={20} className={styles.statusCardIcon} />
                  <h3 className={styles.statusCardTitle}>Location Manual</h3>
                  {effectiveStatus && (
                    <span className={`${styles.manualStatusBadge} ${styles[`manualStatus_${effectiveStatus}`]}`}>
                      {effectiveStatus === 'NOT_STARTED' && 'Not Started'}
                      {effectiveStatus === 'IN_PROGRESS' && 'In Progress'}
                      {effectiveStatus === 'SUBMITTED' && 'Submitted'}
                      {effectiveStatus === 'APPROVED' && 'Approved'}
                      {effectiveStatus === 'REJECTED' && 'Changes Requested'}
                    </span>
                  )}
                </div>

                {/* No manual at all */}
                {(!manual && !effectiveStatus) || effectiveStatus === 'NOT_STARTED' ? (
                  <div className={styles.statusEmpty}>
                    <AlertCircle size={40} strokeWidth={1.2} className={styles.statusEmptyIcon} />
                    <p className={styles.statusEmptyTitle}>Location manual not yet submitted</p>
                    <p className={styles.statusEmptyText}>
                      The lead has received portal access but has not yet started the location manual
                      form. The manual must be submitted and approved before BTC can draft a proposal.
                    </p>
                    <a
                      href={`/portal/${lead.portalId}?mgmt=true`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.viewPortalBtn}
                    >
                      <Globe size={15} />
                      Open Portal
                    </a>
                  </div>
                ) : effectiveStatus === 'IN_PROGRESS' ? (
                  <div className={styles.statusEmpty}>
                    <AlertCircle size={40} strokeWidth={1.2} className={styles.statusEmptyIcon} style={{ color: 'var(--alert-warning-primary)' }} />
                    <p className={styles.statusEmptyTitle}>Location manual in progress</p>
                    <p className={styles.statusEmptyText}>
                      The lead has started filling in the location manual but has not yet submitted
                      it.
                      {manual?.siteAddress && (
                        <span style={{ display: 'block', marginTop: '8px', color: 'var(--neutral-20)' }}>
                          Site address: <strong>{manual.siteAddress}</strong>
                        </span>
                      )}
                    </p>
                    <a
                      href={`/portal/${lead.portalId}?mgmt=true`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.viewPortalBtn}
                    >
                      <Globe size={15} />
                      View in Portal
                    </a>
                  </div>
                ) : effectiveStatus === 'SUBMITTED' || effectiveStatus === 'APPROVED' || effectiveStatus === 'REJECTED' ? (
                  <div className={styles.statusSubmitted}>
                    <div className={styles.submittedHeader}>
                      <CheckCircle size={18} className={styles.submittedIcon} />
                      <span className={styles.submittedText}>
                        {effectiveStatus === 'APPROVED'
                          ? `Manual approved on ${manual?.approvedAt ? formatDate(manual.approvedAt) : formatDate(lead.updatedAt)}`
                          : effectiveStatus === 'REJECTED'
                          ? 'Changes requested — awaiting resubmission'
                          : `Manual submitted on ${manual?.submittedAt ? formatDate(manual.submittedAt) : formatDate(lead.updatedAt)}`}
                      </span>
                    </div>

                    {/* Management review controls (only for SUBMITTED) */}
                    {effectiveStatus === 'SUBMITTED' && (
                      <div className={styles.reviewSection}>
                        <h4 className={styles.reviewTitle}>Management Review</h4>
                        <p className={styles.reviewText}>
                          Review the submitted location manual and approve or request amendments
                          before proceeding to the proposal stage.
                        </p>
                        {mgmtManualAction === 'approved' ? (
                          <div className={styles.statusApproved} style={{ marginTop: '8px' }}>
                            <CheckCircle size={16} className={styles.approvedIcon} />
                            <span className={styles.approvedText}>
                              Manual approved — lead has been advanced to the proposal stage.
                            </span>
                          </div>
                        ) : mgmtManualAction === 'requested_changes' ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', padding: '10px 12px', background: 'var(--alert-warning-secondary)', borderRadius: 'var(--radius-m)', fontSize: '14px', color: 'var(--alert-warning-primary)' }}>
                            <AlertCircle size={16} />
                            Amendment request sent to lead. They can now revise and resubmit.
                          </div>
                        ) : (
                          <>
                            <div className={styles.mgmtNotesField}>
                              <label className={styles.manualFieldLabel} style={{ display: 'block', marginBottom: '6px' }}>
                                Review notes (optional)
                              </label>
                              <textarea
                                className={styles.mgmtNotesTextarea}
                                placeholder="Add notes for the lead or internal comments…"
                                value={mgmtManualNotes}
                                onChange={(e) => setMgmtManualNotes(e.target.value)}
                                rows={3}
                              />
                            </div>
                            <div className={styles.reviewActions}>
                              <button
                                className={styles.approveBtn}
                                type="button"
                                onClick={() => {
                                  setManualStatus('APPROVED');
                                  setMgmtManualAction('approved');
                                }}
                              >
                                <CheckCircle size={15} />
                                Approve Manual
                              </button>
                              <button
                                className={styles.rejectBtn}
                                type="button"
                                onClick={() => {
                                  setManualStatus('REJECTED');
                                  setMgmtManualAction('requested_changes');
                                }}
                              >
                                <XCircle size={15} />
                                Request Amendments
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {/* Key details from the manual */}
                    {manual && (
                      <div className={styles.manualFields}>
                        <h4 className={styles.manualFieldsTitle}>Key Details (from submission)</h4>
                        <div className={styles.manualField}>
                          <span className={styles.manualFieldLabel}>Site Address</span>
                          <span className={styles.manualFieldValue}>{manual.siteAddress || lead.location}</span>
                        </div>
                        {manual.operatingHours && (
                          <div className={styles.manualField}>
                            <span className={styles.manualFieldLabel}>Operating Hours</span>
                            <span className={styles.manualFieldValue}>
                              Mon–Fri: {manual.operatingHours.monday || '—'} &nbsp;|&nbsp;
                              Sat: {manual.operatingHours.saturday || 'Closed'} &nbsp;|&nbsp;
                              Sun: {manual.operatingHours.sunday || 'Closed'}
                            </span>
                          </div>
                        )}
                        {manual.contacts && manual.contacts.length > 0 && (
                          <div className={styles.manualField}>
                            <span className={styles.manualFieldLabel}>Primary Contact</span>
                            <span className={styles.manualFieldValue}>
                              {manual.contacts[0].name} ({manual.contacts[0].role}) — {manual.contacts[0].phone}
                            </span>
                          </div>
                        )}
                        {manual.parkingSpecs && (
                          <div className={styles.manualField}>
                            <span className={styles.manualFieldLabel}>Parking & Wash Bay</span>
                            <span className={styles.manualFieldValue}>{manual.parkingSpecs}</span>
                          </div>
                        )}
                        {manual.waterSupply && (
                          <div className={styles.manualField}>
                            <span className={styles.manualFieldLabel}>Water Supply</span>
                            <span className={styles.manualFieldValue}>{manual.waterSupply}</span>
                          </div>
                        )}
                        {manual.specialInstructions && (
                          <div className={styles.manualField}>
                            <span className={styles.manualFieldLabel}>Special Instructions</span>
                            <span className={styles.manualFieldValue}>{manual.specialInstructions}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={styles.statusEmpty}>
                    <AlertCircle size={40} strokeWidth={1.2} className={styles.statusEmptyIcon} />
                    <p className={styles.statusEmptyTitle}>No location manual data</p>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* ================================================================
            TAB: AGREEMENT
            ================================================================ */}
        {activeTab === 'agreement' && (() => {
          const leadAgreements = agreements.filter((a) => a.leadId === lead.id);

          const formatPrice = (amount, currency) =>
            new Intl.NumberFormat('nl-NL', {
              style: 'currency', currency: currency || 'EUR', minimumFractionDigits: 2,
            }).format(amount);

          const statusBadgeStyle = (status) => {
            if (status === 'ACCEPTED') return { background: 'var(--alert-success-secondary)', color: 'var(--alert-success-primary)' };
            if (status === 'AWAITING_ACCEPTANCE' || status === 'AMENDED') return { background: 'var(--alert-warning-secondary)', color: 'var(--alert-warning-primary)' };
            if (status === 'DRAFT') return { background: 'var(--neutral-60)', color: 'var(--neutral-20)' };
            return {};
          };

          const statusLabel = (status) => {
            if (status === 'AWAITING_ACCEPTANCE') return 'Awaiting Acceptance';
            if (status === 'ACCEPTED') return 'Accepted';
            if (status === 'AMENDED') return 'Amendment Requested';
            if (status === 'DRAFT') return 'Draft';
            if (status === 'SENT') return 'Sent';
            return status;
          };

          return (
            <div className={styles.tabContent}>
              <div className={styles.statusCard}>
                <div className={styles.statusCardHeader}>
                  <FileText size={20} className={styles.statusCardIcon} />
                  <h3 className={styles.statusCardTitle}>Service Agreement</h3>
                </div>

                {/* No agreement / LOST */}
                {lead.status === 'LOST' ? (
                  <div className={styles.statusEmpty}>
                    <XCircle size={40} strokeWidth={1.2} className={styles.statusEmptyIcon} />
                    <p className={styles.statusEmptyTitle}>Lead closed as lost</p>
                    <p className={styles.statusEmptyText}>No agreement was finalised.</p>
                  </div>
                ) : leadAgreements.length === 0 ? (
                  <div className={styles.statusEmpty}>
                    <AlertCircle size={40} strokeWidth={1.2} className={styles.statusEmptyIcon} />
                    <p className={styles.statusEmptyTitle}>No agreement generated yet</p>
                    <p className={styles.statusEmptyText}>
                      A service agreement will be drafted in Moneybird once the location manual has
                      been reviewed and approved by BTC management.
                    </p>
                  </div>
                ) : (
                  /* Agreement cards — one per agreement, collapsed by default */
                  <AgreementCardList
                    leadAgreements={leadAgreements}
                    formatPrice={formatPrice}
                    statusBadgeStyle={statusBadgeStyle}
                    statusLabel={statusLabel}
                    styles={styles}
                    lead={lead}
                  />
                )}
              </div>
            </div>
          );
        })()}

        {/* ================================================================
            TAB: ACTIVITY
            ================================================================ */}
        {activeTab === 'activity' && (
          <>
            {/* Centre: Activity feed */}
            <main className={styles.centrePanel}>
              <div className={styles.centreHeader}>
                <span>Activity for </span>
                <strong>{lead.companyName}</strong>
              </div>

              {leadActivitiesFiltered.length > 0 ? (
                <div className={styles.activityList}>
                  {leadActivitiesFiltered.map((activity) => (
                    <ActivityCard key={activity.id} activity={activity} />
                  ))}
                </div>
              ) : (
                <div className={styles.noActivity}>No activity yet for this lead.</div>
              )}

              {/* Make Note form */}
              <div className={styles.noteForm}>
                <h4 className={styles.noteFormTitle}>Make Note</h4>
                <textarea
                  className={styles.noteTextarea}
                  placeholder="Write a note about this lead…"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  rows={4}
                />
                <div className={styles.noteFormFooter}>
                  <button className={styles.noteSubmitBtn} type="button">
                    Submit Note
                  </button>
                </div>
              </div>
            </main>

            {/* Right: Filters */}
            <aside className={styles.rightPanel}>
              <div className={styles.rightSearch}>
                <Search size={14} className={styles.rightSearchIcon} />
                <input
                  type="text"
                  className={styles.rightSearchInput}
                  placeholder="Search"
                  value={filterSearch}
                  onChange={(e) => setFilterSearch(e.target.value)}
                />
              </div>

              <div className={styles.filterHeader}>
                <span className={styles.filterTitle}>
                  Filter ({typeFilter !== 'all' ? 1 : 0})
                </span>
                <div className={styles.filterHeaderRight}>
                  <button
                    className={styles.resetBtn}
                    onClick={() => { setTypeFilter('all'); setFilterSearch(''); }}
                    type="button"
                  >
                    <RotateCcw size={13} />
                    Reset
                  </button>
                  <ChevronDown size={14} className={styles.filterChevron} />
                </div>
              </div>

              <div className={styles.filterSection}>
                <span className={styles.filterSectionLabel}>Type</span>
                <div className={styles.typeToggleGroup}>
                  <button
                    className={`${styles.typeToggle} ${
                      typeFilter === 'all' || typeFilter === 'notes' ? styles.typeToggleActive : ''
                    }`}
                    onClick={() => setTypeFilter(typeFilter === 'notes' ? 'all' : 'notes')}
                    type="button"
                  >
                    Notes
                  </button>
                  <button
                    className={`${styles.typeToggle} ${
                      typeFilter === 'system' ? styles.typeToggleSystem : ''
                    }`}
                    onClick={() => setTypeFilter(typeFilter === 'system' ? 'all' : 'system')}
                    type="button"
                  >
                    System
                  </button>
                </div>
              </div>

              <div className={styles.archivedRow}>
                <span className={styles.archivedLabel}>Show Archived Notes</span>
                <button
                  className={styles.toggleBtn}
                  onClick={() => setShowArchived((s) => !s)}
                  type="button"
                  aria-label="Toggle archived notes"
                >
                  {showArchived ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
              </div>
            </aside>
          </>
        )}

      </div>

      {/* Approve Modal */}
      <ApproveModal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        contactPerson={lead.contactPerson}
        contactEmail={lead.contactEmail}
        onConfirm={handleApproveConfirm}
      />

      {/* Convert Modal */}
      <ConvertModal
        isOpen={showConvertModal}
        onClose={() => setShowConvertModal(false)}
        companyName={lead.companyName}
        onConfirm={handleConvertConfirm}
      />
    </div>
  );
}
