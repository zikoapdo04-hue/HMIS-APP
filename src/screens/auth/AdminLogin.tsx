import { useState } from 'react';
import type { Screen } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { COLORS, GRADIENTS, SHADOWS, RADIUS, FONT } from '../../core/theme';

interface Props { setScreen: (s: Screen) => void }

export function AdminLogin({ setScreen }: Props) {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) { setError('يرجى ملء جميع الحقول'); return; }
    setLoading(true);
    setError('');
    try {
      const user = await login(email, password);
      if (!user) { setError('بيانات الدخول غير صحيحة'); return; }
      if (user.role !== 'admin') { setError('هذا الحساب ليس حساب مدير'); return; }
      setScreen('admin-home');
    } catch {
      setError('بيانات الدخول غير صحيحة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ height: '100vh', background: GRADIENTS.heroBg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', overflow: 'hidden' }}>

      {/* Glow blobs */}
      <div style={{ position: 'absolute', top: -80, left: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -60, right: -60, width: 250, height: 250, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 36 }}>
        <div style={{ width: 52, height: 52, borderRadius: RADIUS.md, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <div>
          <p style={{ fontFamily: FONT.inter, fontSize: 24, fontWeight: 800, color: 'white', margin: 0, letterSpacing: 2 }}>HMIS</p>
          <p style={{ fontFamily: FONT.cairo, fontSize: 12, color: 'rgba(255,255,255,0.7)', margin: 0 }}>لوحة تحكم المدير</p>
        </div>
      </div>

      {/* Card */}
      <div style={{ width: '100%', maxWidth: 400, background: COLORS.card, borderRadius: RADIUS.xxl, padding: '32px 28px', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }} dir="rtl">
        <h2 style={{ fontFamily: FONT.cairo, fontSize: 22, fontWeight: 800, color: COLORS.textPrimary, margin: '0 0 6px', textAlign: 'center' }}>تسجيل دخول المدير</h2>
        <p style={{ fontFamily: FONT.cairo, fontSize: 13, color: COLORS.textMuted, margin: '0 0 28px', textAlign: 'center' }}>أدخل بيانات الدخول للمتابعة</p>

        {error && (
          <div style={{ background: COLORS.dangerLight, border: `1.5px solid rgba(239,68,68,0.2)`, borderRadius: RADIUS.md, padding: '12px 16px', marginBottom: 20, textAlign: 'center' }}>
            <p style={{ fontFamily: FONT.cairo, fontSize: 13, color: COLORS.danger, margin: 0, fontWeight: 600 }}>{error}</p>
          </div>
        )}

        {/* Email */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontFamily: FONT.cairo, fontSize: 13, fontWeight: 700, color: COLORS.textSec, display: 'block', marginBottom: 8 }}>البريد الإلكتروني</label>
          <div style={{ display: 'flex', alignItems: 'center', background: COLORS.inputBg, border: `1.5px solid ${COLORS.cardBorder}`, borderRadius: RADIUS.md, padding: '0 14px', gap: 10 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
            </svg>
            <input
              type="email" placeholder="admin@example.com" value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: FONT.inter, fontSize: 15, color: COLORS.textPrimary, padding: '14px 0', direction: 'ltr' }}
            />
          </div>
        </div>

        {/* Password */}
        <div style={{ marginBottom: 28 }}>
          <label style={{ fontFamily: FONT.cairo, fontSize: 13, fontWeight: 700, color: COLORS.textSec, display: 'block', marginBottom: 8 }}>كلمة المرور</label>
          <div style={{ display: 'flex', alignItems: 'center', background: COLORS.inputBg, border: `1.5px solid ${COLORS.cardBorder}`, borderRadius: RADIUS.md, padding: '0 14px', gap: 10 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <input
              type={showPass ? 'text' : 'password'} placeholder="••••••••" value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: FONT.inter, fontSize: 15, color: COLORS.textPrimary, padding: '14px 0', direction: 'ltr' }}
            />
            <button type="button" onClick={() => setShowPass(p => !p)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', color: COLORS.textMuted }}>
              {showPass
                ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              }
            </button>
          </div>
        </div>

        {/* Login button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: '100%', padding: '16px', background: loading ? COLORS.textMuted : GRADIENTS.primarySm,
            color: 'white', border: 'none', borderRadius: RADIUS.pill,
            fontFamily: FONT.cairo, fontSize: 17, fontWeight: 800,
            cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : SHADOWS.btn,
            transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          {loading
            ? <><div style={{ width: 20, height: 20, border: '3px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> جاري الدخول...</>
            : 'دخول'
          }
        </button>

        <button
          onClick={() => setScreen('role')}
          style={{ width: '100%', marginTop: 14, padding: '12px', background: 'transparent', color: COLORS.textMuted, border: 'none', fontFamily: FONT.cairo, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
        >
          ← العودة لاختيار الدور
        </button>
      </div>
    </div>
  );
}
