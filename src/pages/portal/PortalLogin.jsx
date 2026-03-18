import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { usePortalAuth } from '../../context/PortalAuthContext';
import styles from './PortalLogin.module.css';

export default function PortalLogin() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = usePortalAuth();

  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter your email address and password.');
      return;
    }

    setIsLoading(true);
    // Simulate a brief async delay to feel authentic
    await new Promise((r) => setTimeout(r, 400));

    const portal = login(email.trim(), password);
    setIsLoading(false);

    if (!portal) {
      setError('Incorrect email address or password. Please try again.');
      return;
    }

    // Navigate to the matched portal
    navigate(portal.portalUrl);
  }

  function fillDemo(demoEmail) {
    setEmail(demoEmail);
    setPassword('btc2026');
    setError('');
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* BTC Wordmark */}
        <div className={styles.logoArea}>
          <div className={styles.logoMark}>
            <span className={styles.logoInitials}>BTC</span>
          </div>
          <div className={styles.logoText}>
            <span className={styles.logoName}>Basiq Truckcleaning</span>
            <span className={styles.logoSub}>Client Portal</span>
          </div>
        </div>

        <div className={styles.divider} />

        <h1 className={styles.heading}>Welcome to the BTC Client Portal</h1>
        <p className={styles.subheading}>
          Sign in to view your location manual, agreement, and vehicle details.
        </p>

        {/* Login Form */}
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {error && (
            <div className={styles.errorBanner} role="alert">
              <AlertCircle size={16} strokeWidth={2} />
              <span>{error}</span>
            </div>
          )}

          <div className={styles.field}>
            <label className={styles.label} htmlFor="portal-email">
              Email address
            </label>
            <input
              id="portal-email"
              type="email"
              className={styles.input}
              placeholder="you@company.nl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="portal-password">
              Password
            </label>
            <div className={styles.passwordWrapper}>
              <input
                id="portal-password"
                type={showPassword ? 'text' : 'password'}
                className={styles.input}
                placeholder="Enter your password"
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

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className={styles.loadingDots}>
                <span /><span /><span />
              </span>
            ) : 'Sign In'}
          </button>
        </form>

        {/* Demo Accounts Helper */}
        <div className={styles.demoBox}>
          <div className={styles.demoLabel}>Demo accounts</div>
          <div className={styles.demoRows}>
            <button
              type="button"
              className={styles.demoRow}
              onClick={() => fillDemo('j.vandenberg@vdb.nl')}
            >
              <span className={styles.demoRole}>Lead — Stage 1 (Intake)</span>
              <span className={styles.demoCreds}>j.vandenberg@vdb.nl&nbsp;/&nbsp;btc2026</span>
            </button>
            <button
              type="button"
              className={styles.demoRow}
              onClick={() => fillDemo('m.verhoeven@zuidwestcargo.nl')}
            >
              <span className={styles.demoRole}>Lead — Stage 2 (Contract Review)</span>
              <span className={styles.demoCreds}>m.verhoeven@zuidwestcargo.nl&nbsp;/&nbsp;btc2026</span>
            </button>
            <button
              type="button"
              className={styles.demoRow}
              onClick={() => fillDemo('info@koelmantruck.nl')}
            >
              <span className={styles.demoRole}>Client — Stage 3 (Vehicle Assignment)</span>
              <span className={styles.demoCreds}>info@koelmantruck.nl&nbsp;/&nbsp;btc2026</span>
            </button>
            <button
              type="button"
              className={styles.demoRow}
              onClick={() => fillDemo('jan@vandenbergtransport.nl')}
            >
              <span className={styles.demoRole}>Client — Stage 4 (Operational)</span>
              <span className={styles.demoCreds}>jan@vandenbergtransport.nl&nbsp;/&nbsp;btc2026</span>
            </button>
            <button
              type="button"
              className={styles.demoRow}
              onClick={() => fillDemo('j.hermans@btc.nl')}
            >
              <span className={styles.demoRole}>Employee (Wash Technician)</span>
              <span className={styles.demoCreds}>j.hermans@btc.nl&nbsp;/&nbsp;btc2026</span>
            </button>
          </div>
          <p className={styles.demoHint}>Click any row to pre-fill the form.</p>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        &copy; {new Date().getFullYear()} Basiq Truckcleaning B.V. — All rights reserved.
      </div>
    </div>
  );
}
