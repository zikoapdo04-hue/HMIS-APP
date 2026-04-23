import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Screen, Role } from '../../types';
import { HMISGlobe, HMISShieldLogo, EyeOpen, EyeOff } from '../../components/Icons';
import { useAuth } from '../../context/AuthContext';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';

interface Props { setScreen: (s: Screen) => void; role: Role }

export function RegisterDoctor({ setScreen, role }: Props) {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [phone, setPhone]       = useState('');
  const [password, setPassword] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [hospital, setHospital]   = useState('');
  const [address, setAddress]     = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const { login } = useAuth();
  const { t } = useTranslation();

  const handleRegister = () => {
    if (!name || !email || !password || !phone || !specialty) { setError(t('auth.errFill')); return; }
    setLoading(true);
    setError('');

    setTimeout(() => {
      login({
        uid: Math.random().toString(),
        email,
        name,
        role,
        phone,
        specialty,
        hospital,
        address
      });
      setScreen('doctor-home');
      setLoading(false);
    }, 500);
  };

  return (
    <div className="auth-screen">
      <LanguageSwitcher />
      <div className="auth-glow one" /><div className="auth-glow two" />
      <div className="auth-card reg-card">
        <div className="auth-logo-row">
          <HMISGlobe size={80} /><span className="auth-hmis-text">HMIS</span><HMISShieldLogo size={48} />
        </div>
        <h2 className="auth-heading">{t('auth.registerDoctor')}</h2>

        {error && (
          <p style={{ color: '#e53e3e', fontFamily: 'Cairo', fontSize: 13, textAlign: 'center', margin: '0 0 8px' }}>
            {error}
          </p>
        )}

        <div className="auth-field"><input type="text" placeholder={t('auth.name')} value={name} onChange={e => setName(e.target.value)} className="auth-input" /></div>
        <div className="auth-field"><input type="email" placeholder={t('auth.email')} value={email} onChange={e => setEmail(e.target.value)} className="auth-input" /></div>
        <div className="auth-field"><input type="tel" placeholder={t('auth.phone')} value={phone} onChange={e => setPhone(e.target.value)} className="auth-input" /></div>
        
        <div className="auth-field">
          <button type="button" className="eye-btn" onClick={() => setShowPass(p => !p)}>
            {showPass ? <EyeOpen /> : <EyeOff />}
          </button>
          <input type={showPass ? 'text' : 'password'} placeholder={t('auth.password')} value={password} onChange={e => setPassword(e.target.value)} className="auth-input with-icon" />
        </div>

        <div className="auth-field"><input type="text" placeholder={t('auth.specialty')} value={specialty} onChange={e => setSpecialty(e.target.value)} className="auth-input" /></div>
        <div className="auth-field"><input type="text" placeholder={t('auth.hospital')} value={hospital} onChange={e => setHospital(e.target.value)} className="auth-input" /></div>
        <div className="auth-field"><input type="text" placeholder={t('auth.address')} value={address} onChange={e => setAddress(e.target.value)} className="auth-input" /></div>

        <button className="auth-submit-btn" style={{ marginTop: 24, opacity: loading ? 0.7 : 1 }} onClick={handleRegister} disabled={loading}>
          {loading ? '...' : t('auth.confirmRegister')}
        </button>
        <p className="auth-bottom-link">
          {t('auth.haveAccount')} <span onClick={() => setScreen('login')}>{t('auth.login')}</span>
        </p>
      </div>
    </div>
  );
}
