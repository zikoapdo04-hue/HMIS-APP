import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Screen } from '../../types';
import { HMISGlobe, HMISShieldLogo, EyeOpen, EyeOff } from '../../components/Icons';
import { useAuth } from '../../context/AuthContext';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';

interface Props { setScreen: (s: Screen) => void; role?: string }

export function Login({ setScreen }: Props) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const { login } = useAuth();
  const { t } = useTranslation();

  const handleLogin = async () => {
    if (!email || !password) { setError(t('auth.errEmpty')); return; }
    setLoading(true);
    setError('');
    try {
      const user = await login(email, password);
      if (!user) { setError(t('auth.errEmpty')); return; }
      const home: Screen =
        user.role === 'doctor' ? 'doctor-home' :
        user.role === 'admin'  ? 'admin-home'  : 'patient-home';
      setScreen(home);
    } catch {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    } finally {
      setLoading(false);
    }
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
