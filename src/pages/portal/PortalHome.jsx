import { Link, useOutletContext } from 'react-router-dom';
import {
  FileText, FilePen, Truck, Droplets, Award, Receipt,
  ChevronRight, CheckCircle2, Lock, ArrowRight
} from 'lucide-react';
import { isStageAvailable } from '../../components/portal/PortalShell';
import styles from './PortalHome.module.css';

const STAGE_LABELS = {
  INTAKE:              'Intake',
  CONTRACT_REVIEW:     'Contract Review',
  VEHICLE_ASSIGNMENT:  'Vehicle Assignment',
  OPERATIONAL:         'Operational',
  ACTIVE:              'Active',
};

const STAGE_DESCRIPTIONS = {
  INTAKE:             'Complete your location manual so BTC can prepare your service proposal.',
  CONTRACT_REVIEW:    'Your location manual has been received. Review and accept your service agreement.',
  VEHICLE_ASSIGNMENT: 'Your agreement is active. Assign your vehicles to begin the wash programme.',
  OPERATIONAL:        'Washes are underway. Track real-time status of your vehicles.',
  ACTIVE:             'Your account is fully active. Download certificates and manage your vehicles.',
};

const SECTION_CARDS = [
  // Row 1
  {
    icon: FilePen,
    label: 'Agreement',
    desc: 'Service contract terms and digital acceptance',
    to: (portalId) => `/portal/${portalId}/agreement`,
    requiredStage: 'CONTRACT_REVIEW',
    role: ['lead', 'client', 'management'],
  },
  {
    icon: Truck,
    label: 'Vehicles',
    desc: 'Assign, manage, and swap your registered vehicles',
    to: (portalId) => `/portal/${portalId}/vehicles`,
    requiredStage: 'VEHICLE_ASSIGNMENT',
    role: ['client', 'management'],
  },
  {
    icon: Receipt,
    label: 'Invoices',
    desc: 'View and download your monthly billing invoices',
    to: (portalId) => `/portal/${portalId}/invoices`,
    requiredStage: 'OPERATIONAL',
    role: ['client', 'management'],
  },
  // Row 2
  {
    icon: Award,
    label: 'Certificates',
    desc: 'Download cleaning certificates and HACCP records',
    to: (portalId) => `/portal/${portalId}/certificates`,
    requiredStage: 'ACTIVE',
    role: ['client', 'management'],
  },
  {
    icon: FileText,
    label: 'Location Manual',
    desc: 'Site information, access details, bay specifications',
    to: (portalId) => `/portal/${portalId}/manual`,
    requiredStage: 'INTAKE',
    role: ['lead', 'client', 'management'],
  },
  {
    icon: Droplets,
    label: 'Wash Status',
    desc: 'Confirm completed washes and report exceptions',
    to: (portalId) => `/portal/${portalId}/washes`,
    requiredStage: 'OPERATIONAL',
    role: ['employee', 'management'],
  },
];

export default function PortalHome() {
  const { portal, role } = useOutletContext();
  const currentStage = portal.stage;

  const visibleCards = SECTION_CARDS.filter(
    (c) => c.role.includes(role) || role === 'management'
  );

  return (
    <div className={styles.page}>
      {/* Welcome banner */}
      <div className={styles.welcomeBanner}>
        <div className={styles.welcomeText}>
          <div className={styles.welcomeLabel}>Welcome back</div>
          <h1 className={styles.welcomeTitle}>{portal.companyName}</h1>
          <p className={styles.welcomeDesc}>{STAGE_DESCRIPTIONS[currentStage]}</p>
        </div>
        <div className={styles.stageBadge}>
          <span className={styles.stageBadgeLabel}>Current stage</span>
          <span className={styles.stageBadgeValue}>{STAGE_LABELS[currentStage]}</span>
        </div>
      </div>

      {/* Section cards */}
      <div className={styles.cardGrid}>
        {visibleCards.map(({ icon: Icon, label, desc, to, requiredStage }) => {
          const available = isStageAvailable(currentStage, requiredStage);
          const href = to(portal.id);

          if (!available) {
            return (
              <div key={label} className={`${styles.card} ${styles.cardLocked}`}>
                <div className={styles.cardIconWrap}>
                  <Lock size={20} strokeWidth={1.5} />
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.cardLabel}>{label}</div>
                  <div className={styles.cardDesc}>{desc}</div>
                </div>
                <span className={styles.lockedTag}>
                  Available from {STAGE_LABELS[requiredStage]}
                </span>
              </div>
            );
          }

          return (
            <Link key={label} to={href} className={styles.card}>
              <div className={styles.cardIconWrapActive}>
                <Icon size={20} strokeWidth={1.8} />
              </div>
              <div className={styles.cardContent}>
                <div className={styles.cardLabel}>{label}</div>
                <div className={styles.cardDesc}>{desc}</div>
              </div>
              <ArrowRight size={16} strokeWidth={2} className={styles.cardArrow} />
            </Link>
          );
        })}
      </div>

      {/* Contact footer */}
      <div className={styles.contactBox}>
        <div className={styles.contactTitle}>Need help?</div>
        <div className={styles.contactDesc}>
          Contact your BTC account manager at{' '}
          <a href="mailto:info@basiqtruckcleaning.nl" className={styles.contactLink}>
            info@basiqtruckcleaning.nl
          </a>
          {' '}or call{' '}
          <a href="tel:+31773512244" className={styles.contactLink}>+31 77 351 22 44</a>.
        </div>
      </div>
    </div>
  );
}
