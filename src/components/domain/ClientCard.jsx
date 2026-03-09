import { MessageCircle, MoreVertical, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AvatarInitials from '../shared/AvatarInitials';
import styles from './ClientCard.module.css';

export default function ClientCard({ client }) {
  const navigate = useNavigate();

  const primaryContact = client.contacts[0] ?? null;

  function handleClick(e) {
    // Don't navigate if clicking the action icons
    if (e.target.closest(`.${styles.actions}`)) return;
    navigate(`/clients/${client.id}`);
  }

  function handleMenuClick(e) {
    e.stopPropagation();
  }

  return (
    <div className={styles.card} onClick={handleClick} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/clients/${client.id}`)}>

      {/* Card header row */}
      <div className={styles.header}>
        <div className={styles.identity}>
          <AvatarInitials
            initials={client.avatarInitials ?? client.companyName.slice(0, 2)}
            color={client.avatarColor}
            size="md"
          />
          <div className={styles.nameBlock}>
            <span className={styles.companyName}>{client.companyName}</span>
            <span className={styles.address} title={client.address}>{client.address}</span>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.iconBtn}
            onClick={handleMenuClick}
            aria-label="Message"
            type="button"
          >
            <MessageCircle size={16} className={styles.messageIcon} />
          </button>
          <button
            className={styles.iconBtn}
            onClick={handleMenuClick}
            aria-label="More options"
            type="button"
          >
            <MoreVertical size={16} className={styles.moreIcon} />
          </button>
        </div>
      </div>

      {/* Contact section */}
      <div className={styles.contact}>
        {primaryContact ? (
          <>
            <span className={styles.contactRole}>{primaryContact.role}</span>
            <span className={styles.contactName}>{primaryContact.name}</span>
            <div className={styles.phoneRow}>
              <Phone size={13} className={styles.phoneIcon} />
              <span className={styles.phoneNumber}>{primaryContact.phone}</span>
            </div>
          </>
        ) : (
          <span className={styles.contactRole}>No contacts added</span>
        )}
      </div>

      {/* Status accent bar */}
      <div
        className={styles.accentBar}
        style={{
          backgroundColor:
            client.status === 'active'
              ? 'var(--primary-10)'
              : 'var(--neutral-40)',
        }}
      />
    </div>
  );
}
