import { useState } from 'react';
import {
  signInWithEmailAndPassword,
  type AuthError,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import type { Screen, Role } from '../../types';
import { HMISGlobe, HMISShieldLogo, EyeOpen, EyeOff } from '../../components/Icons';

interface Props { setScreen: (s: Screen) => void; role: Role }

function mapError(code: string): string {
  if (code === 'auth/user-not-found')   return 'لا يوجد حساب بهذا الايميل';
  if (code === 'auth/wrong-password')   return 'كلمة السر غير صحيحة';
  if (code === 'auth/invalid-credential') return 'بيانات الدخول غير صحيحة';
  if (code === 'auth/too-many-requests')  return 'محاولات كثيرة، حاول لاحقاً';
  return 'حدث خطأ، حاول مرة أخرى';
}

export function Login({ setScreen, role }: Props) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleLogin = async () => {
    if (!email || !password) { setError('يرجى إدخال الايميل وكلمة السر'); return; }
    setLoading(true);
    setError('');
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);

      // Read role from Firestore to route correctly regardless of the
      // role the user selected on the RoleSelection screen
      const userSnap = await getDoc(doc(db, 'users', cred.user.uid));
      const dbRole: Role = userSnap.exists()
        ? (userSnap.data().role as Role)
        : role;

      const home: Screen =
        dbRole === 'doctor' ? 'doctor-home' :
        dbRole === 'admin'  ? 'admin-home'  : 'patient-home';
      setScreen(home);
    } catch (e) {
      setError(mapError((e as AuthError).code ?? ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-glow one" /><div className="auth-glow two" />
      <div className="auth-card" dir="rtl">
        <div className="auth-logo-row">
          <HMISGlobe size={80} /><span className="auth-hmis-text">HMIS</span><HMISShieldLogo size={48} />
        </div>
        <h2 className="auth-heading">تسجيل البيانات</h2>

        {error && (
          <p style={{ color: '#e53e3e', fontFamily: 'Cairo', fontSize: 15, textAlign: 'center', margin: '0 0 8px' }}>
            {error}
          </p>
        )}

        <div className="auth-field">
          <input id="login-email" type="email" placeholder="الايميل :" value={email}
            onChange={e => setEmail(e.target.value)} className="auth-input" dir="rtl" />
        </div>
        <div className="auth-field">
          <button type="button" className="eye-btn" onClick={() => setShowPass(p => !p)} aria-label="toggle password">
            {showPass ? <EyeOpen /> : <EyeOff />}
          </button>
          <input id="login-password" type={showPass ? 'text' : 'password'} placeholder="كلمة السر :"
            value={password} onChange={e => setPassword(e.target.value)} className="auth-input with-icon" dir="rtl" />
        </div>
        <p className="forgot-link">نسيت كلمه السر؟</p>
        <button
          id="login-submit"
          className="auth-submit-btn"
          onClick={handleLogin}
          disabled={loading}
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          {loading ? '...' : 'تسجيل الدخول'}
        </button>
        <p className="auth-bottom-link">
          ليس لدي حساب ؟ <span onClick={() => setScreen('role')}>سجل الان</span>
        </p>
      </div>
    </div>
  );
}
