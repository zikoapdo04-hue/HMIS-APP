import { useAuth } from '../../context/AuthContext';
import type { Screen } from '../../types';

interface Props { setScreen: (s: Screen) => void }

export function Notifications({ setScreen }: Props) {
  const { user } = useAuth();
  const patientName = user?.name ?? 'مريض';

  return (
    <div style={{ width: '100%', height: '100vh', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '24px', textAlign: 'center', position: 'relative', background: '#168A9E', flexShrink: 0 }}>
        <button aria-label="back" onClick={() => setScreen('patient-home')} style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
        <span style={{ color: 'white', fontSize: '26px', fontFamily: 'Cairo, sans-serif', fontWeight: 800 }}>الاشعارات</span>
      </header>

      {/* System notification for the logged-in user */}
      {user && (
        <div style={{ margin: '24px', background: '#E6F4EA', borderRadius: '16px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', direction: 'rtl' }}>
          <div style={{ width: '40px', height: '40px', background: '#168A9E', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: 'Cairo', fontSize: 16, fontWeight: 700, color: '#1A202C', margin: 0 }}>مرحباً {patientName}!</p>
            <p style={{ fontFamily: 'Cairo', fontSize: 14, fontWeight: 500, color: '#4A5568', margin: '4px 0 0' }}>تم تسجيل دخولك بنجاح إلى نظام HMIS.</p>
          </div>
        </div>
      )}

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', paddingBottom: '64px' }}>
        <img src={`${import.meta.env.BASE_URL}security_illustration.png`} alt="Empty Notifications" style={{ width: '85%', maxWidth: '360px', objectFit: 'contain' }} />
        <span style={{ fontFamily: 'Cairo, sans-serif', fontSize: '22px', fontWeight: 800, color: '#8898AA', marginTop: '32px' }}>لاتوجد اشعارات سابقة</span>
      </div>
    </div>
  );
}
