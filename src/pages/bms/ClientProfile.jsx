import { useState, useMemo, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Home,
  ChevronRight,
  Mail,
  FileText,
  Plus,
  Star,
  ChevronDown,
  ChevronUp,
  Search,
  RotateCcw,
  Eye,
  EyeOff,
  MessageSquare,
  Phone,
  Paperclip,
  MoreVertical,
  CalendarClock,
  Calendar,
  Globe,
  ExternalLink,
  CheckCircle,
  Pencil,
  X,
  Clock,
} from 'lucide-react';
import { employees } from '../../data/bms/employees';
import { departments } from '../../data/bms/departments';
import { activities } from '../../data/bms/activities';
import { findPortalById } from '../../data/portal/portals';
import { getShiftsForClient } from '../../data/bms/shifts';
import { useChangeRequests } from '../../context/ChangeRequestsContext';
import { useData } from '../../context/DataContext';
import ShiftCard from '../../components/shared/ShiftCard';
import styles from './ClientProfile.module.css';

// ─── Role order for the contact list ───────────────────────────────────────
const ROLE_ORDER = [
  'Owner',
  'Administration',
  'Invoices',
  'Invoice reminder',
  'Technical Service',
  'Fleet Manager',
  'Planner',
  'Driver',
  'Other',
];

// ─── Helpers ───────────────────────────────────────────────────────────────
function formatDateBadge(isoString) {
  const d = new Date(isoString);
  return {
    day: String(d.getDate()).padStart(2, '0'),
    month: d.toLocaleString('en-GB', { month: 'short' }).toUpperCase(),
    year: d.getFullYear(),
  };
}

function formatTimestamp(isoString) {
  const d = new Date(isoString);
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }) + ', ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

// ─── Sub-components ────────────────────────────────────────────────────────

function ContactRoleRow({ role, contacts }) {
  const [open, setOpen] = useState(true);

  return (
    <div className={styles.roleGroup}>
      <button
        className={styles.roleHeader}
        onClick={() => setOpen((o) => !o)}
        type="button"
      >
        <span className={styles.roleLabel}>{role}</span>
        <div className={styles.roleHeaderRight}>
          <button
            className={styles.addContactBtn}
            onClick={(e) => e.stopPropagation()}
            type="button"
            aria-label={`Add ${role} contact`}
          >
            <Plus size={13} />
          </button>
          {open ? <ChevronUp size={14} className={styles.roleChevron} /> : <ChevronDown size={14} className={styles.roleChevron} />}
        </div>
      </button>

      {open && contacts.length > 0 && (
        <div className={styles.roleContacts}>
          {contacts.map((c) => (
            <div key={c.id} className={styles.contactRow}>
              <div className={styles.contactInfo}>
                <span className={styles.contactName}>{c.name}</span>
                <div className={styles.contactMeta}>
                  <Mail size={11} className={styles.metaIcon} />
                  <span className={styles.contactEmail}>{c.email}</span>
                </div>
                <div className={styles.contactMeta}>
                  <Phone size={11} className={styles.metaIcon} />
                  <span className={styles.contactPhone}>{c.phone}</span>
                </div>
              </div>
              <button
                className={`${styles.starBtn} ${c.starred ? styles.starActive : ''}`}
                type="button"
                aria-label="Star contact"
              >
                <Star size={14} fill={c.starred ? 'var(--alert-warning-primary)' : 'none'} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ActivityCard({ activity }) {
  const [expanded, setExpanded] = useState(false);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const badge = formatDateBadge(activity.createdAt);
  const isNote = activity.type === 'note';
  const TRUNCATE_AT = 200;
  const longContent = activity.content.length > TRUNCATE_AT;
  const displayContent = expanded || !longContent
    ? activity.content
    : activity.content.slice(0, TRUNCATE_AT) + '…';

  return (
    <div className={styles.activityRow}>
      {/* Date badge */}
      <div className={styles.dateBadge}>
        <span className={styles.dateBadgeDay}>{badge.day}</span>
        <span className={styles.dateBadgeMonth}>{badge.month}</span>
        <span className={styles.dateBadgeYear}>{badge.year}</span>
      </div>

      {/* Card */}
      <div className={`${styles.activityCard} ${isNote ? styles.activityNote : styles.activityComplaint}`}>
        <div className={styles.activityHeader}>
          <div className={styles.activityMeta}>
            <span className={`${styles.typeBadge} ${isNote ? styles.typeBadgeNote : styles.typeBadgeComplaint}`}>
              {isNote ? 'Note' : 'Complaint'}
            </span>
            <span className={styles.activityAuthor}>
              Note by {activity.authorName}
            </span>
            <span className={styles.activityTimestamp}>
              {formatTimestamp(activity.createdAt)}
            </span>
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

        {/* Replies */}
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

        {/* Reply button */}
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

function EmptyTab({ icon: Icon, label }) {
  return (
    <div className={styles.emptyTab}>
      <div className={styles.emptyTabIcon}>
        <Icon size={40} strokeWidth={1.2} />
      </div>
      <p className={styles.emptyTabText}>No {label} yet</p>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────
export default function ClientProfile({ initialTab = 'timeline' }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { clients, agreements } = useData();

  const client = clients.find((c) => String(c.id) === String(id));

  const [activeTab, setActiveTab] = useState(initialTab);
  const [leftTab, setLeftTab] = useState('contacts'); // 'contacts' | 'details'

  // Edit details state
  const { addRequests, getPendingForClient } = useChangeRequests();
  const [showEditMenu, setShowEditMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [showToast, setShowToast] = useState(false);
  const editMenuRef = useRef(null);
  const toastTimerRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!showEditMenu) return;
    function handleOutside(e) {
      if (editMenuRef.current && !editMenuRef.current.contains(e.target)) {
        setShowEditMenu(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [showEditMenu]);

  function handleEditDetails() {
    setEditForm({
      email: client.email,
      phone: client.phone,
      address: client.address,
    });
    setShowEditMenu(false);
    setIsEditing(true);
  }

  function handleCancelEdit() {
    setIsEditing(false);
    setEditForm({});
  }

  function handleSaveEdit() {
    const FIELD_LABELS = {
      email: 'Email',
      phone: 'Phone Number',
      address: 'Address',
    };

    const newRequests = Object.entries(FIELD_LABELS)
      .filter(([key]) => editForm[key] !== (client[key] || ''))
      .map(([key, label], i) => ({
        id: `cr-${Date.now()}-${i}`,
        requestedBy: 'Current User',
        requestedAt: new Date().toISOString(),
        status: 'PENDING',
        clientId: client.id,
        clientName: client.companyName,
        locationPath: `/clients/${client.id}`,
        locationLabel: `Clients → ${client.companyName}`,
        field: label,
        currentValue: client[key] || '—',
        requestedValue: editForm[key] || '—',
        description: null,
        reviewedBy: null,
        reviewedAt: null,
        reviewNotes: null,
      }));

    if (newRequests.length > 0) addRequests(newRequests);
    setIsEditing(false);
    setEditForm({});
    setShowToast(true);
    clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setShowToast(false), 3000);
  }

  function handleEditChange(field, value) {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  }

  // Filter panel state
  const [filterSearch, setFilterSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'notes' | 'complaints'
  const [showArchived, setShowArchived] = useState(false);

  // Note form
  const [noteText, setNoteText] = useState('');

  const clientActivities = useMemo(() => {
    if (!client) return [];
    return activities
      .filter((a) => a.clientId === client.id)
      .filter((a) => {
        if (typeFilter === 'notes') return a.type === 'note';
        if (typeFilter === 'complaints') return a.type === 'complaint';
        return true;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [client, typeFilter]);

  // Group contacts by role
  const contactsByRole = useMemo(() => {
    if (!client) return {};
    const grouped = {};
    ROLE_ORDER.forEach((role) => { grouped[role] = []; });
    (client.contacts || []).forEach((c) => {
      const role = c.role in grouped ? c.role : 'Other';
      grouped[role].push(c);
    });
    return grouped;
  }, [client]);

  if (!client) {
    return (
      <div className={styles.notFound}>
        <p>Client not found.</p>
        <button onClick={() => navigate('/clients')} type="button">
          Back to Clients
        </button>
      </div>
    );
  }

  const portal = client.portalId ? findPortalById(client.portalId) : null;
  const agreement = agreements.find((a) => a.portalId === client.portalId) || null;
  const pendingRequests = getPendingForClient(client.id);
  const hasPending = pendingRequests.length > 0;
  const clientDepts = departments.filter((d) => client.departments.includes(d.name));

  const clientShifts = useMemo(() => {
    const all = getShiftsForClient(client.id);
    const today = '2026-03-17';
    return {
      upcoming: all
        .filter((s) => s.date >= today && s.status !== 'cancelled')
        .sort((a, b) => a.date.localeCompare(b.date)),
      past: all
        .filter((s) => s.date < today || s.status === 'cancelled')
        .sort((a, b) => b.date.localeCompare(a.date)),
    };
  }, [client]);

  const STAGE_LABELS = {
    INTAKE: 'Intake',
    CONTRACT_REVIEW: 'Contract Review',
    VEHICLE_ASSIGNMENT: 'Vehicle Assignment',
    OPERATIONAL: 'Operational',
    ACTIVE: 'Active',
  };

  const TABS = [
    { key: 'timeline',   label: 'Timeline',   path: `/clients/${id}` },
    { key: 'shifts',     label: 'Shifts',      path: `/clients/${id}/shifts` },
    { key: 'agreements', label: 'Agreements',  path: `/clients/${id}/agreements` },
    { key: 'portal',     label: 'Portal',      path: `/clients/${id}/portal` },
  ];

  return (
    <div className={styles.page}>
      {/* ── Top Bar ── */}
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <h1 className={styles.pageTitle}>{client.name}</h1>
          <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
            <Link to="/" className={styles.breadcrumbLink}>
              <Home size={14} />
            </Link>
            <ChevronRight size={14} className={styles.breadcrumbSep} />
            <Link to="/clients" className={styles.breadcrumbLink}>
              Clients
            </Link>
            <ChevronRight size={14} className={styles.breadcrumbSep} />
            <span className={styles.breadcrumbCurrent}>Details</span>
          </nav>
        </div>

        {/* Tab bar top-right */}
        <nav className={styles.tabBar} aria-label="Profile tabs">
          {TABS.map((tab) => (
            <Link
              key={tab.key}
              to={tab.path}
              className={`${styles.tabLink} ${activeTab === tab.key ? styles.tabLinkActive : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {activeTab === tab.key && <span className={styles.tabDot} />}
              {tab.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* ── Body ── */}
      <div className={styles.body}>
        {/* ── LEFT PANEL ── */}
        <aside className={styles.leftPanel}>
          {/* Action buttons */}
          <div className={styles.actionButtons}>
            <button className={styles.actionBtn} type="button">
              <Mail size={14} />
              Sent email
            </button>
            <button className={styles.actionBtn} type="button">
              <FileText size={14} />
              Make note
            </button>
            <button className={`${styles.actionBtn} ${styles.actionBtnFull}`} type="button">
              <Paperclip size={14} />
              Add file
            </button>
          </div>

          {/* Left sub-tabs: Contacts / Details */}
          <div className={styles.leftTabBar}>
            <button
              className={`${styles.leftTab} ${leftTab === 'contacts' ? styles.leftTabActive : ''}`}
              onClick={() => setLeftTab('contacts')}
              type="button"
            >
              Contacts
            </button>
            <button
              className={`${styles.leftTab} ${leftTab === 'details' ? styles.leftTabActive : ''}`}
              onClick={() => setLeftTab('details')}
              type="button"
            >
              Details
            </button>
            {leftTab === 'contacts' && (
              <button
                className={styles.leftTabMenu}
                type="button"
                aria-label="Add contact"
                onClick={() => {}}
              >
                <MoreVertical size={14} />
              </button>
            )}
          </div>

          {hasPending && !isEditing && (
            <div className={styles.pendingBanner}>
              <Clock size={13} className={styles.pendingBannerIcon} />
              <span>
                {pendingRequests.length} change{pendingRequests.length > 1 ? 's' : ''} pending approval
              </span>
            </div>
          )}

          {leftTab === 'contacts' && (
            <div className={styles.contactList}>
              {ROLE_ORDER.map((role) => (
                <ContactRoleRow
                  key={role}
                  role={role}
                  contacts={contactsByRole[role] || []}
                />
              ))}
            </div>
          )}

          {leftTab === 'details' && (
            <div className={styles.detailsPanel}>

              {/* ── Department section ── */}
              <div className={styles.sectionCard}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionTitle}>Department</span>
                  <button className={styles.sectionMenuBtn} type="button" aria-label="Department options">
                    <MoreVertical size={14} />
                  </button>
                </div>
                {clientDepts.map((dept) => (
                  <div key={dept.id} className={styles.deptMemberRow}>
                    <div className={styles.deptMemberAvatar} style={{ background: 'var(--primary-10)' }}>
                      {dept.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className={styles.deptMemberInfo}>
                      <span className={styles.deptMemberName}>{dept.name}</span>
                    </div>
                  </div>
                ))}
                {clientDepts.length === 0 && (
                  <p className={styles.deptEmptyNote}>No department assigned.</p>
                )}
              </div>

              {/* ── Details section ── */}
              <div className={styles.sectionCard}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionTitle}>Details</span>
                  {!isEditing && (
                    <div className={styles.editMenuWrap} ref={editMenuRef}>
                      <button
                        className={styles.sectionMenuBtn}
                        type="button"
                        aria-label="Edit details"
                        onClick={() => setShowEditMenu((v) => !v)}
                      >
                        <MoreVertical size={14} />
                      </button>
                      {showEditMenu && (
                        <div className={styles.editMenuDropdown}>
                          <button
                            className={styles.editMenuItem}
                            type="button"
                            onClick={handleEditDetails}
                          >
                            <Pencil size={13} />
                            Edit Details
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {isEditing && (
                  <div className={styles.editActionBar}>
                    <button
                      className={styles.editCancelBtn}
                      type="button"
                      onClick={handleCancelEdit}
                      aria-label="Cancel editing"
                    >
                      <X size={14} />
                      Cancel
                    </button>
                    <button
                      className={styles.editSaveBtn}
                      type="button"
                      onClick={handleSaveEdit}
                    >
                      Save
                    </button>
                  </div>
                )}

                {[
                  { key: 'email',       label: 'Email' },
                  { key: 'phone',       label: 'Phone Number' },
                  { key: 'address',     label: 'Address' },
                  { key: 'moneybirdCN', label: 'Moneybird CN' },
                  { key: 'vatNumber',   label: 'VAT Number' },
                  { key: 'kvkNumber',   label: 'KVK Number' },
                ].map(({ key, label }) => (
                  <div key={key} className={styles.stackedField}>
                    <span className={styles.stackedLabel}>{label}</span>
                    {isEditing && ['email', 'phone', 'address'].includes(key) ? (
                      <input
                        className={styles.detailInput}
                        value={editForm[key] || ''}
                        onChange={(e) => handleEditChange(key, e.target.value)}
                      />
                    ) : (
                      <span className={styles.stackedValue}>{client[key] || '—'}</span>
                    )}
                  </div>
                ))}
              </div>

            </div>
          )}
        </aside>

        {/* ── CENTRE PANEL ── */}
        <main className={styles.centrePanel}>
          {activeTab === 'timeline' && (
            <>
              <div className={styles.centreHeader}>
                <span>Activity of all </span>
                <strong>#notes and complaints</strong>
              </div>

              {clientActivities.length > 0 ? (
                <div className={styles.activityList}>
                  {clientActivities.map((activity) => (
                    <ActivityCard key={activity.id} activity={activity} />
                  ))}
                </div>
              ) : (
                <div className={styles.noActivity}>No activity yet for this client.</div>
              )}

              {/* Make Note form */}
              <div className={styles.noteForm}>
                <h4 className={styles.noteFormTitle}>Make Note</h4>
                <textarea
                  className={styles.noteTextarea}
                  placeholder="Write a note or complaint…"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  rows={4}
                />
                <div className={styles.noteFormFooter}>
                  <button className={styles.noteSubmitBtn} type="button">
                    Submit
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === 'shifts' && (
            <div className={styles.shiftsContainer}>
              {/* ── Upcoming Shifts ── */}
              <div className={styles.shiftsSection}>
                <h3 className={styles.shiftsSectionTitle}>
                  <CalendarClock size={16} />
                  Upcoming Shifts
                  <span className={styles.shiftsCount}>{clientShifts.upcoming.length}</span>
                </h3>
                {clientShifts.upcoming.length > 0 ? (
                  <div className={styles.shiftsList}>
                    {clientShifts.upcoming.map((shift) => (
                      <ShiftCard key={shift.id} shift={shift} isPast={false} />
                    ))}
                  </div>
                ) : (
                  <p className={styles.shiftsEmpty}>No upcoming shifts</p>
                )}
              </div>

              {/* ── Past Shifts ── */}
              <div className={styles.shiftsSection}>
                <h3 className={styles.shiftsSectionTitle}>
                  <Clock size={16} />
                  Past Shifts
                  <span className={styles.shiftsCount}>{clientShifts.past.length}</span>
                </h3>
                {clientShifts.past.length > 0 ? (
                  <div className={styles.shiftsList}>
                    {clientShifts.past.map((shift) => (
                      <ShiftCard key={shift.id} shift={shift} isPast={true} />
                    ))}
                  </div>
                ) : (
                  <p className={styles.shiftsEmpty}>No past shifts</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'agreements' && (
            <div className={styles.agreementWrap}>
              {!agreement ? (
                <div className={styles.agreementEmpty}>
                  <FileText size={36} strokeWidth={1.2} />
                  <p>No agreement on file for this client.</p>
                </div>
              ) : (
                <>
                  {/* ── Header row ── */}
                  <div className={styles.agreementHeader}>
                    <div className={styles.agreementHeaderLeft}>
                      <span className={`${styles.agStatusBadge} ${styles[`agStatus_${agreement.status}`]}`}>
                        {agreement.status.replace(/_/g, ' ')}
                      </span>
                      <span className={styles.agRefChip}>
                        {agreement.moneybirdQuoteRef || 'No Moneybird ref'}
                      </span>
                    </div>
                    {agreement.moneybirdQuoteRef && (
                      <a
                        href="https://moneybird.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.moneybirdBtn}
                      >
                        <ExternalLink size={14} />
                        Open in Moneybird
                        <span className={styles.moneybirdRef}>{agreement.moneybirdQuoteRef}</span>
                      </a>
                    )}
                  </div>

                  {/* ── Terms grid ── */}
                  <div className={styles.agTermsCard}>
                    <h4 className={styles.agTermsTitle}>Contract Terms</h4>
                    <div className={styles.agTermsGrid}>
                      {[
                        { label: 'Vehicle Count',    value: `${agreement.vehicleCount} vehicles` },
                        { label: 'Wash Frequency',   value: agreement.washFrequency },
                        { label: 'Service Type',     value: agreement.serviceType },
                        { label: 'Price per Wash',   value: `€ ${Number(agreement.pricePerWash).toFixed(2)}` },
                        { label: 'Duration',         value: agreement.contractDuration },
                        { label: 'Start Date',       value: agreement.startDate ? new Date(agreement.startDate).toLocaleDateString('en-GB') : '—' },
                        { label: 'End Date',         value: agreement.endDate   ? new Date(agreement.endDate).toLocaleDateString('en-GB')   : '—' },
                        { label: 'Payment Terms',    value: agreement.paymentTerms },
                      ].map(({ label, value }) => (
                        <div key={label} className={styles.agTermRow}>
                          <span className={styles.agTermLabel}>{label}</span>
                          <span className={styles.agTermValue}>{value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Accepted by */}
                    {agreement.status === 'ACCEPTED' && agreement.acceptedBy && (
                      <div className={styles.agAcceptedRow}>
                        <CheckCircle size={14} className={styles.agAcceptedIcon} />
                        <span>
                          Accepted by <strong>{agreement.acceptedBy}</strong>
                          {agreement.acceptedAt && (
                            <> on {new Date(agreement.acceptedAt).toLocaleDateString('en-GB')}</>
                          )}
                        </span>
                      </div>
                    )}

                    {/* Awaiting note */}
                    {agreement.status === 'AWAITING_ACCEPTANCE' && (
                      <div className={styles.agAwaitingNote}>
                        <Clock size={14} />
                        Awaiting client signature via portal
                      </div>
                    )}

                    {/* Draft note */}
                    {agreement.status === 'DRAFT' && (
                      <div className={styles.agDraftNote}>
                        <Clock size={14} />
                        This draft has not been sent to the client yet. Finalise in Moneybird before sending.
                      </div>
                    )}
                  </div>

                  {/* ── Amendments ── */}
                  {agreement.amendments && agreement.amendments.length > 0 && (
                    <div className={styles.agAmendmentsCard}>
                      <h4 className={styles.agTermsTitle}>Amendments</h4>
                      {agreement.amendments.map((amd) => (
                        <div key={amd.id} className={styles.agAmendmentItem}>
                          <div className={styles.agAmendmentHeader}>
                            <span className={styles.agAmendmentTerm}>{amd.term}</span>
                            <span className={`${styles.agAmendBadge} ${styles[`agAmend_${amd.status}`]}`}>
                              {amd.status}
                            </span>
                          </div>
                          <p className={styles.agAmendmentComment}>{amd.comment}</p>
                          {amd.resolvedAt && (
                            <span className={styles.agAmendmentDate}>
                              Resolved {new Date(amd.resolvedAt).toLocaleDateString('en-GB')}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === 'portal' && (
            portal ? (
              <div className={styles.portalCard}>
                <div className={styles.portalCardHeader}>
                  <Globe size={20} className={styles.portalCardIcon} />
                  <h3 className={styles.portalCardTitle}>Client Portal</h3>
                </div>

                <div className={styles.portalGrid}>
                  {/* Portal info */}
                  <div className={styles.portalInfo}>
                    <div className={styles.portalInfoRow}>
                      <span className={styles.portalInfoLabel}>Portal ID</span>
                      <span className={styles.portalInfoValue}>{portal.id}</span>
                    </div>
                    <div className={styles.portalInfoRow}>
                      <span className={styles.portalInfoLabel}>Portal Stage</span>
                      <span className={styles.portalInfoValue}>
                        <span className={portal.stage === 'ACTIVE' ? styles.stageBadgeActive : styles.stageBadge}>
                          {STAGE_LABELS[portal.stage] || portal.stage}
                        </span>
                      </span>
                    </div>
                    <div className={styles.portalInfoRow}>
                      <span className={styles.portalInfoLabel}>Portal URL</span>
                      <span className={styles.portalInfoValue}>/portal/{portal.id}</span>
                    </div>
                    <div className={styles.portalInfoRow}>
                      <span className={styles.portalInfoLabel}>Client Email</span>
                      <span className={styles.portalInfoValue}>{portal.loginEmail}</span>
                    </div>
                    <div className={styles.portalInfoRow}>
                      <span className={styles.portalInfoLabel}>Last Portal Activity</span>
                      <span className={styles.portalInfoValue}>{formatTimestamp(portal.lastActivity)}</span>
                    </div>
                  </div>

                  {/* Portal actions */}
                  <div className={styles.portalActions}>
                    <div className={styles.portalActionCard}>
                      <Globe size={24} className={styles.portalActionIcon} />
                      <h4 className={styles.portalActionTitle}>Open Portal</h4>
                      <p className={styles.portalActionText}>
                        View this client's portal in management mode. No login required.
                      </p>
                      <a
                        href={`/portal/${portal.id}?mgmt=true`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.openPortalBtn}
                      >
                        <ExternalLink size={15} />
                        Open Portal
                      </a>
                    </div>

                    <div className={styles.portalActionCardActive}>
                      <CheckCircle size={24} className={styles.activeClientIcon} />
                      <h4 className={styles.portalActionTitle}>Active Client</h4>
                      <p className={styles.portalActionText}>
                        This client portal is fully active. Wash operations, vehicle management,
                        and certificates are all accessible.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <EmptyTab icon={Globe} label="portal" />
            )
          )}
        </main>

        {/* ── RIGHT PANEL ── */}
        <aside className={styles.rightPanel}>
          {activeTab === 'timeline' && (
            <>
              {/* Search */}
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

              {/* Filter header */}
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

              {/* Type filter */}
              <div className={styles.filterSection}>
                <span className={styles.filterSectionLabel}>Type</span>
                <div className={styles.typeToggleGroup}>
                  <button
                    className={`${styles.typeToggle} ${typeFilter === 'all' || typeFilter === 'notes' ? styles.typeToggleActive : ''}`}
                    onClick={() => setTypeFilter(typeFilter === 'notes' ? 'all' : 'notes')}
                    type="button"
                  >
                    Notes
                  </button>
                  <button
                    className={`${styles.typeToggle} ${typeFilter === 'complaints' ? styles.typeToggleComplaint : ''}`}
                    onClick={() => setTypeFilter(typeFilter === 'complaints' ? 'all' : 'complaints')}
                    type="button"
                  >
                    Complaints
                  </button>
                </div>
              </div>

              {/* Date section */}
              <div className={styles.filterSection}>
                <span className={styles.filterSectionLabel}>Date</span>
                <div className={styles.dateRow}>
                  <div className={styles.dateField}>
                    <span className={styles.dateFieldLabel}>Start Date</span>
                    <div className={styles.dateInput}>
                      <span>01/01/2023</span>
                      <Calendar size={13} />
                    </div>
                  </div>
                  <div className={styles.dateField}>
                    <span className={styles.dateFieldLabel}>End Date</span>
                    <div className={styles.dateInput}>
                      <span>09/03/2026</span>
                      <Calendar size={13} />
                    </div>
                  </div>
                </div>

                <div className={styles.quickDates}>
                  {['Last week', 'Last month'].map((label) => (
                    <label key={label} className={styles.quickDateOption}>
                      <input type="radio" name="quickDate" className={styles.radioInput} />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
                <div className={styles.quickDates}>
                  {['Last 3 months', '2025', '2024'].map((label) => (
                    <label key={label} className={styles.quickDateOption}>
                      <input type="radio" name="quickDate" className={styles.radioInput} />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Show archived */}
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
            </>
          )}
        </aside>
      </div>

      {/* ── Toast ── */}
      {showToast && (
        <div className={styles.toast} role="status" aria-live="polite">
          <Clock size={15} className={styles.toastIcon} />
          <span className={styles.toastText}>Pending approval</span>
          <button
            className={styles.toastClose}
            type="button"
            aria-label="Dismiss"
            onClick={() => setShowToast(false)}
          >
            <X size={13} />
          </button>
        </div>
      )}
    </div>
  );
}
