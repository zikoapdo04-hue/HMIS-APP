import { useTranslation } from 'react-i18next';
import type { Screen, Role } from '../types';
import { HMISGlobe, HMISShieldLogo } from '../components/Icons';
import { LanguageSwitcher } from '../components/LanguageSwitcher';

interface Props { setScreen: (s: Screen) => void; setRole: (r: Role) => void }

export function RoleSelection({ setScreen, setRole }: Props) {
  const { t } = useTranslation();

  return (
    <div className="role-screen">
      <LanguageSwitcher />
      <div className="role-glow one" />
      <div className="role-glow two" />
      <div className="role-card">
        <div className="role-welcome-text">
          <span className="role-welcome-ar">{t('roleSelection.welcome')}</span>
          <span className="role-brand">HMIS</span>
        </div>
        <div className="role-logo-row">
          <HMISGlobe size={74} />
          <span className="role-logo-text">HMIS</span>
          <HMISShieldLogo size={46} />
        </div>

        <div className="role-btn-group">
          {/* Login — global, works for all roles */}
          <button
            id="login-btn"
            className="role-btn role-btn-primary"
            onClick={() => setScreen('login')}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1DB8C8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
              <polyline points="10 17 15 12 10 7"/>
              <line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
            <span>{t('roleSelection.login')}</span>
          </button>

          <p className="role-label" style={{ marginTop: 20 }}>{t('auth.registerNow')}</p>

          {/* Doctor register */}
          <button id="doctor-btn" className="role-btn" onClick={() => { setRole('doctor'); setScreen('register-doctor'); }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1DB8C8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="7" r="4"/><path d="M4 21v-1a8 8 0 0 1 16 0v1"/>
              <line x1="15" y1="10" x2="15" y2="16"/><line x1="12" y1="13" x2="18" y2="13"/>
            </svg>
            <span>{t('roleSelection.doctor')}</span>
          </button>

          {/* Patient register */}
          <button id="patient-btn" className="role-btn" onClick={() => { setRole('patient'); setScreen('register'); }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1DB8C8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="7" r="4"/><path d="M4 21v-1a8 8 0 0 1 16 0v1"/>
            </svg>
            <span>{t('roleSelection.patient')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
