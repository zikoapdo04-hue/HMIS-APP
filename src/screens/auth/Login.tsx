import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Screen, Role } from '../../types';
import { HMISGlobe, HMISShieldLogo, EyeOpen, EyeOff } from '../../components/Icons';
import { useAuth } from '../../context/AuthContext';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';

interface Props { setScreen: (s: Screen) => void; role: Role }

export function Login({ setScreen, role }: Props) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const { login } = useAuth();
  const { t } = useTranslation();

  const handleLogin = () => {
    if (!email || !password) { setError(t('auth.errEmpty')); return; }

    if (role === 'admin') {
      if (email !== 'admin@hmis.com' || password !== 'admin123') {
        setError(t('auth.errAdmin'));
        return;
      }
    }

    setLoading(true);
    setError('');
    
    setTimeout(() => {
      // Mock login validation
      login({
        uid: Math.random().toString(),
        email: email,
        name: 'مستخدم تجريبي',
        role: role
      });
      
      const home: Screen =
        role === 'doctor' ? 'doctor-home' :
        role === 'admin'  ? 'admin-home'  : 'patient-home';
      setScreen(home);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="auth-screen">
      <LanguageSwitcher />
      <div className="auth-glow one" /><div className="auth-glow two" />
      <div className="auth-card">
        <div className="auth-logo-row">
          <HMISGlobe size={80} /><span className="auth-hmis-text">HMIS</span><HMISShieldLogo size={48} />
        </div>
        <h2 className="auth-heading">{t('auth.dataEntry')}</h2>

        {error && (
          <p style={{ color: '#e53e3e', fontFamily: 'Cairo', fontSize: 15, textAlign: 'center', margin: '0 0 8px' }}>
            {error}
          </p>
        )}

        <div className="auth-field">
          <input id="login-email" type="email" placeholder={t('auth.email')} value={email}
            onChange={e => setEmail(e.target.value)} className="auth-input" />
        </div>
        <div className="auth-field">
          <button type="button" className="eye-btn" onClick={() => setShowPass(p => !p)} aria-label="toggle password">
            {showPass ? <EyeOpen /> : <EyeOff />}
          </button>
          <input id="login-password" type={showPass ? 'text' : 'password'} placeholder={t('auth.password')}
            value={password} onChange={e => setPassword(e.target.value)} className="auth-input with-icon" />
        </div>
        <p className="forgot-link">{t('auth.forgot')}</p>
        <button
          id="login-submit"
          className="auth-submit-btn"
          onClick={handleLogin}
          disabled={loading}
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          {loading ? '...' : t('auth.login')}
        </button>
        <p className="auth-bottom-link">
          {t('auth.noAccount')} <span onClick={() => setScreen('role')}>{t('auth.registerNow')}</span>
        </p>
      </div>
    </div>
  );
}
