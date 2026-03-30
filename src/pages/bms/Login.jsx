import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Crown, CalendarClock } from 'lucide-react';
import { useBMSAuth } from '../../context/BMSAuthContext';
import styles from './Login.module.css';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useBMSAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  function handleQuickLogin(role) {
    login(role);
    navigate('/');
  }

  return (
    <div className={styles.page}>
      {/* ── Left Panel — Dark branding ─────────────────────────────────── */}
      <div className={styles.leftPanel}>
        <div className={styles.logoBlock}>
          <span className={styles.logoBasiq}>BASIQ</span>
          <span className={styles.logoManagement}>MANAGEMENT</span>
          <div className={styles.logoSystemRow}>
            <span className={styles.logoSystem}>SYSTEM</span>
            <div className={styles.decorBars}>
              <span className={styles.barWhite} />
              <span className={styles.barGray} />
              <span className={styles.barBlue} />
              <span className={styles.barGrayLight} />
            </div>
          </div>
          <span className={styles.tagline}>WE SIMPLIFY THE JOB YOU HATE</span>
        </div>
      </div>

      {/* ── Right Panel — Login form ───────────────────────────────────── */}
      <div className={styles.rightPanel}>
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <span className={styles.headerLabel}>BASIQ MANAGEMENT SYSTEM</span>
          </div>

          <h1 className={styles.heading}>INLOGGEN</h1>

          {/* Decorative form — not wired to real auth */}
          <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            <div className={styles.field}>
              <input
                type="email"
                className={styles.input}
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className={styles.field}>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={styles.input}
                  placeholder="Wachtwoord"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword
                    ? <EyeOff size={16} strokeWidth={1.8} />
                    : <Eye size={16} strokeWidth={1.8} />}
                </button>
              </div>
            </div>

            <button type="button" className={styles.submitBtn} disabled>
              Inloggen
            </button>

            <p className={styles.forgotLink}>Ik ben mijn wachtwoord vergeten</p>
          </form>

          {/* ── Quick Login Buttons ──────────────────────────────────── */}
          <div className={styles.quickLoginSection}>
            <div className={styles.quickLoginLabel}>Quick demo login</div>

            <button
              type="button"
              className={`${styles.quickBtn} ${styles.quickOwner}`}
              onClick={() => handleQuickLogin('owner')}
            >
              <Crown size={18} strokeWidth={1.8} />
              <div className={styles.quickBtnText}>
                <span className={styles.quickBtnRole}>Login as Owner</span>
                <span className={styles.quickBtnDesc}>
                  Full management access &mdash; agreements, approvals &amp; oversight
                </span>
              </div>
            </button>

            <button
              type="button"
              className={`${styles.quickBtn} ${styles.quickPlanner}`}
              onClick={() => handleQuickLogin('planner')}
            >
              <CalendarClock size={18} strokeWidth={1.8} />
              <div className={styles.quickBtnText}>
                <span className={styles.quickBtnRole}>Login as Planner</span>
                <span className={styles.quickBtnDesc}>
                  Operational view &mdash; follow-ups, compliance &amp; scheduling
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
