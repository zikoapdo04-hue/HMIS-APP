import { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  type AuthError,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import type { Screen, Role } from '../../types';
import { HMISGlobe, HMISShieldLogo, EyeOpen, EyeOff } from '../../components/Icons';

interface Props { setScreen: (s: Screen) => void; setRole: (r: Role) => void }

function mapError(code: string): string {
  if (code === 'auth/email-already-in-use') return 'هذا الايميل مستخدم بالفعل';
  if (code === 'auth/weak-password')        return 'كلمة السر يجب أن تكون 6 أحرف على الأقل';
  if (code === 'auth/invalid-email')        return 'صيغة الايميل غير صحيحة';
  return 'حدث خطأ، حاول مرة أخرى';
}

export function RegisterDoctor({ setScreen, setRole }: Props) {
  const [docName, setDocName]         = useState('');
  const [docEmail, setDocEmail]       = useState('');
  const [docPhone, setDocPhone]       = useState('');
  const [docSpecialty, setDocSpecialty] = useState('');
  const [docHospital, setDocHospital] = useState('');
  const [docAddress, setDocAddress]   = useState('');
  const [docPass, setDocPass]         = useState('');
  const [docConfirm, setDocConfirm]   = useState('');
  const [showDocPass, setShowDocPass]     = useState(false);
  const [showDocConfirm, setShowDocConfirm] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');

  const handleRegister = async () => {
    setError('');
    if (!docName || !docEmail || !docPass) { setError('يرجى ملء جميع الحقول المطلوبة'); return; }
    if (docPass !== docConfirm)            { setError('كلمتا السر غير متطابقتين'); return; }
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, docEmail, docPass);
      const uid  = cred.user.uid;

      // Write base user doc
      await setDoc(doc(db, 'users', uid), {
        role:  'doctor',
        name:  docName,
        email: docEmail,
      });

      // Write doctor profile doc
      await setDoc(doc(db, 'doctors', uid), {
        uid,
        phone:     docPhone,
        specialty: docSpecialty,
        hospital:  docHospital,
        address:   docAddress,
        rating:    0,
        days:      '',
      });

      setRole('doctor');
      setScreen('doctor-home');
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
        <h2 className="auth-heading">تسجيل بيانات الطبيب</h2>

        {error && (
          <p style={{ color: '#e53e3e', fontFamily: 'Cairo', fontSize: 15, textAlign: 'center', margin: '0 0 8px' }}>
            {error}
          </p>
        )}

        <div className="auth-field"><input id="doc-name"      type="text"  placeholder="الاسم:"             value={docName}      onChange={e => setDocName(e.target.value)}      className="auth-input" dir="rtl" /></div>
        <div className="auth-field"><input id="doc-email"     type="email" placeholder="الايميل:"           value={docEmail}     onChange={e => setDocEmail(e.target.value)}     className="auth-input" dir="rtl" /></div>
        <div className="auth-field"><input id="doc-phone"     type="tel"   placeholder="رقم الهاتف:"       value={docPhone}     onChange={e => setDocPhone(e.target.value)}     className="auth-input" dir="rtl" /></div>
        <div className="auth-field"><input id="doc-specialty" type="text"  placeholder="التخصص:"           value={docSpecialty} onChange={e => setDocSpecialty(e.target.value)} className="auth-input" dir="rtl" /></div>
        <div className="auth-field"><input id="doc-hospital"  type="text"  placeholder="اسم المستشفى:"     value={docHospital}  onChange={e => setDocHospital(e.target.value)}  className="auth-input" dir="rtl" /></div>
        <div className="auth-field"><input id="doc-address"   type="text"  placeholder="عنوان المستشفى:"   value={docAddress}   onChange={e => setDocAddress(e.target.value)}   className="auth-input" dir="rtl" /></div>

        <div className="auth-field">
          <button type="button" className="eye-btn" onClick={() => setShowDocPass(p => !p)} aria-label="toggle password">
            {showDocPass ? <EyeOpen /> : <EyeOff />}
          </button>
          <input id="doc-pass" type={showDocPass ? 'text' : 'password'} placeholder="انشاء كلمة السر:" value={docPass} onChange={e => setDocPass(e.target.value)} className="auth-input with-icon" dir="rtl" />
        </div>
        <div className="auth-field">
          <button type="button" className="eye-btn" onClick={() => setShowDocConfirm(p => !p)} aria-label="toggle confirm">
            {showDocConfirm ? <EyeOpen /> : <EyeOff />}
          </button>
          <input id="doc-confirm" type={showDocConfirm ? 'text' : 'password'} placeholder="تاكيد كلمة السر:" value={docConfirm} onChange={e => setDocConfirm(e.target.value)} className="auth-input with-icon" dir="rtl" />
        </div>

        <button
          id="doc-submit"
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
