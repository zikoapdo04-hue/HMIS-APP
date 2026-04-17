import { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  type AuthError,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import type { Screen } from '../../types';
import { HMISGlobe, HMISShieldLogo, EyeOpen, EyeOff } from '../../components/Icons';

interface Props { setScreen: (s: Screen) => void }

function mapError(code: string): string {
  if (code === 'auth/email-already-in-use') return 'هذا الايميل مستخدم بالفعل';
  if (code === 'auth/weak-password')        return 'كلمة السر يجب أن تكون 6 أحرف على الأقل';
  if (code === 'auth/invalid-email')        return 'صيغة الايميل غير صحيحة';
  return 'حدث خطأ، حاول مرة أخرى';
}

export function Register({ setScreen }: Props) {
  const [regName, setRegName]       = useState('');
  const [regEmail, setRegEmail]     = useState('');
  const [regCity, setRegCity]       = useState('');
  const [regAge, setRegAge]         = useState('');
  const [regPhone, setRegPhone]     = useState('');
  const [regPass, setRegPass]       = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [showPass, setShowPass]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');

  const handleRegister = async () => {
    setError('');
    if (!regName || !regEmail || !regPass) { setError('يرجى ملء جميع الحقول المطلوبة'); return; }
    if (regPass !== regConfirm)            { setError('كلمتا السر غير متطابقتين'); return; }
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, regEmail, regPass);
      const uid  = cred.user.uid;

      // Write base user doc
      await setDoc(doc(db, 'users', uid), {
        role:  'patient',
        name:  regName,
        email: regEmail,
      });

      // Write patient profile doc
      await setDoc(doc(db, 'patients', uid), {
        city:  regCity,
        age:   regAge,
        phone: regPhone,
      });

      setScreen('patient-home');
    } catch (e) {
      setError(mapError((e as AuthError).code ?? ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-glow one" /><div className="auth-glow two" />
      <div className="auth-card reg-card" dir="rtl">
        <div className="auth-logo-row">
          <HMISGlobe size={72} /><span className="auth-hmis-text">HMIS</span><HMISShieldLogo size={44} />
        </div>
        <h2 className="auth-heading">تسجيل بيانات المريض</h2>

        {error && (
          <p style={{ color: '#e53e3e', fontFamily: 'Cairo', fontSize: 15, textAlign: 'center', margin: '0 0 8px' }}>
            {error}
          </p>
        )}

        <div className="auth-field"><input id="reg-name"  type="text"   placeholder="الاسم:"        value={regName}    onChange={e => setRegName(e.target.value)}    className="auth-input" dir="rtl" /></div>
        <div className="auth-field"><input id="reg-email" type="email"  placeholder="الايميل:"      value={regEmail}   onChange={e => setRegEmail(e.target.value)}   className="auth-input" dir="rtl" /></div>
        <div className="auth-field"><input id="reg-city"  type="text"   placeholder="المدينة:"      value={regCity}    onChange={e => setRegCity(e.target.value)}    className="auth-input" dir="rtl" /></div>
        <div className="auth-field"><input id="reg-age"   type="number" placeholder="العمر:"        value={regAge}     onChange={e => setRegAge(e.target.value)}     className="auth-input" dir="rtl" /></div>
        <div className="auth-field"><input id="reg-phone" type="tel"    placeholder="رقم الهاتف:"   value={regPhone}   onChange={e => setRegPhone(e.target.value)}   className="auth-input" dir="rtl" /></div>

        <div className="auth-field">
          <button type="button" className="eye-btn" onClick={() => setShowPass(p => !p)} aria-label="toggle password">
            {showPass ? <EyeOpen /> : <EyeOff />}
          </button>
          <input id="reg-pass" type={showPass ? 'text' : 'password'} placeholder="انشاء كلمة السر:" value={regPass} onChange={e => setRegPass(e.target.value)} className="auth-input with-icon" dir="rtl" />
        </div>
        <div className="auth-field">
          <button type="button" className="eye-btn" onClick={() => setShowConfirm(p => !p)} aria-label="toggle confirm">
            {showConfirm ? <EyeOpen /> : <EyeOff />}
          </button>
          <input id="reg-confirm" type={showConfirm ? 'text' : 'password'} placeholder="تاكيد كلمة السر:" value={regConfirm} onChange={e => setRegConfirm(e.target.value)} className="auth-input with-icon" dir="rtl" />
        </div>

        <button
          id="reg-submit"
          className="auth-submit-btn"
          onClick={handleRegister}
          disabled={loading}
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          {loading ? '...' : 'تسجيل الدخول'}
        </button>
        <p className="auth-bottom-link">لديك حساب ؟ <span onClick={() => setScreen('login')}>تسجيل الدخول</span></p>
      </div>
    </div>
  );
}
