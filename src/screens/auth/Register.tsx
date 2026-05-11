import { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import type { Screen, Role } from '../../types';
import { HMISGlobe, HMISShieldLogo, EyeOpen, EyeOff } from '../../components/Icons';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';

interface Props { setScreen: (s: Screen) => void; role: Role }

export function Register({ setScreen, role }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { lang, t } = useSettings();

  const handleRegister = async () => {
    if (!name || !email || !password || !phone) { setError(t('الرجاء إدخال جميع البيانات', 'Please fill all fields')); return; }
    setLoading(true);
    setError('');
    try {
      const { AuthService } = await import('../../services/auth.service');
      if (role === 'doctor') {
        await AuthService.registerDoctor({ name, email, password, phone, specialty: '', hospital: '', address: '' });
      } else {
        await AuthService.registerPatient({ name, email, password, phone, city, age: Number(age) || 0 });
      }
      const home: Screen = role === 'doctor' ? 'doctor-home' : 'patient-home';
      setScreen(home);
    } catch (e: unknown) {
      const code = (e as { code?: string }).code ?? '';
      if (code === 'auth/email-already-in-use') {
        setError(lang === 'ar' ? 'البريد الإلكتروني مستخدم بالفعل' : 'Email is already in use');
      } else if (code === 'auth/weak-password') {
        setError(lang === 'ar' ? 'كلمة المرور ضعيفة — 6 أحرف على الأقل' : 'Weak password — at least 6 characters');
      } else {
        setError(lang === 'ar' ? 'حدث خطأ، حاول مرة أخرى' : 'An error occurred, please try again');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <LanguageSwitcher />
      <div className="auth-glow one" /><div className="auth-glow two" />
      <div className="auth-card reg-card">
        <div className="auth-logo-row">
          <HMISGlobe size={80} /><span className="auth-hmis-text">HMIS</span><HMISShieldLogo size={48} />
        </div>
        <h2 className="auth-heading">{lang === 'ar' ? 'إنشاء حساب جديد' : 'Create New Account'}</h2>

        {error && (
          <p style={{ color: '#e53e3e', fontFamily: 'Cairo', fontSize: 13, textAlign: 'center', margin: '0 0 8px' }}>
            {error}
          </p>
        )}

        <div className="auth-field"><input type="text" placeholder={lang === 'ar' ? 'الاسم' : 'Name'} value={name} onChange={e => setName(e.target.value)} className="auth-input" /></div>
        <div className="auth-field"><input type="email" placeholder={lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'} value={email} onChange={e => setEmail(e.target.value)} className="auth-input" /></div>

        <div className="auth-field">
          <button type="button" className="eye-btn" onClick={() => setShowPass(p => !p)}>
            {showPass ? <EyeOpen /> : <EyeOff />}
          </button>
          <input type={showPass ? 'text' : 'password'} placeholder={lang === 'ar' ? 'كلمة المرور' : 'Password'} value={password} onChange={e => setPassword(e.target.value)} className="auth-input with-icon" />
        </div>

        <div className="auth-field"><input type="text" placeholder={lang === 'ar' ? 'المدينة' : 'City'} value={city} onChange={e => setCity(e.target.value)} className="auth-input" /></div>
        <div className="auth-field"><input type="number" placeholder={lang === 'ar' ? 'العمر' : 'Age'} value={age} onChange={e => setAge(e.target.value)} className="auth-input" /></div>
        <div className="auth-field"><input type="tel" placeholder={lang === 'ar' ? 'رقم الهاتف' : 'Phone Number'} value={phone} onChange={e => setPhone(e.target.value)} className="auth-input" /></div>

        <button className="auth-submit-btn" style={{ marginTop: 24, opacity: loading ? 0.7 : 1 }} onClick={handleRegister} disabled={loading}>
          {loading ? '...' : (lang === 'ar' ? 'تأكيد التسجيل' : 'Confirm Registration')}
        </button>
        <p className="auth-bottom-link">
          {lang === 'ar' ? 'لديك حساب بالفعل؟ ' : 'Already have an account? '} <span onClick={() => setScreen('login')}>{lang === 'ar' ? 'تسجيل الدخول' : 'Login'}</span>
        </p>
      </div>
    </div>
  );
}
