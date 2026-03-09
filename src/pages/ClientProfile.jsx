import { useState, useMemo } from 'react';
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
  FolderOpen,
  FileCheck,
  BookOpen,
  Calendar,
} from 'lucide-react';
import { clients } from '../data/clients';
import { activities } from '../data/activities';
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

  const client = clients.find((c) => String(c.id) === String(id));

  const [activeTab, setActiveTab] = useState(initialTab);
  const [leftTab, setLeftTab] = useState('contacts'); // 'contacts' | 'details'

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

  const TABS = [
    { key: 'timeline', label: 'Timeline', path: `/clients/${id}` },
    { key: 'files', label: 'Files', path: `/clients/${id}/files` },
    { key: 'manuals', label: 'Location Manuals', path: `/clients/${id}/manuals` },
    { key: 'agreements', label: 'Agreements', path: `/clients/${id}/agreements` },
  ];

  return (
    <div className={styles.page}>
      {/* ── Top Bar ── */}
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <h1 className={styles.pageTitle}>CLIENTS</h1>
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
            <button className={styles.leftTabMenu} type="button" aria-label="More options">
              <MoreVertical size={14} />
            </button>
          </div>

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
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Company</span>
                <span className={styles.detailValue}>{client.companyName}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Address</span>
                <span className={styles.detailValue}>{client.address}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Phone</span>
                <span className={styles.detailValue}>{client.phone}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Email</span>
                <span className={styles.detailValue}>{client.email}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Department</span>
                <span className={styles.detailValue}>{client.department}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Status</span>
                <span className={`${styles.detailValue} ${client.status === 'active' ? styles.statusActive : styles.statusInactive}`}>
                  {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Created</span>
                <span className={styles.detailValue}>{new Date(client.createdDate).toLocaleDateString('en-GB')}</span>
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

          {activeTab === 'files' && <EmptyTab icon={FolderOpen} label="files" />}
          {activeTab === 'manuals' && <EmptyTab icon={BookOpen} label="location manuals" />}
          {activeTab === 'agreements' && <EmptyTab icon={FileCheck} label="agreements" />}
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
    </div>
  );
}
