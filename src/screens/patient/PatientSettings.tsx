import { useAuth } from '../../context/AuthContext';
import type { Screen } from '../../types';

interface Props { setScreen: (s: Screen) => void }

export function PatientSettings({ setScreen }: Props) {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    setScreen('role');
  };

  return (
    <div style={{ width: '100%', height: '100vh', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '24px', textAlign: 'center', position: 'relative', background: '#148C9E', flexShrink: 0 }}>
        <button aria-label="back" onClick={() => setScreen('patient-profile')} style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
        <span style={{ color: 'white', fontSize: '28px', fontFamily: 'Cairo, sans-serif', fontWeight: 800 }}>الاعدادات</span>
      </header>
      <div style={{ padding: '32px 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {[
          { label: 'اعداد الحساب',      action: () => setScreen('patient-account-settings') },
          { label: 'كلمة السر',          action: undefined },
          { label: 'اعداد الاشعارات',    action: undefined },
          { label: 'المساعدة والدعم',    action: () => setScreen('support') },
        ].map((item, i) => (
          <button key={i} onClick={item.action} style={{ width: '100%', background: '#EAF0F6', borderRadius: '16px', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: 'none', cursor: 'pointer' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4A5568" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            <span style={{ fontFamily: 'Cairo, sans-serif', fontSize: '20px', fontWeight: 700, color: '#718096' }}>{item.label}</span>
          </button>
        ))}
      </div>
      <div style={{ padding: '24px', paddingBottom: '40px' }}>
        <button
          onClick={handleLogout}
          style={{ width: '100%', background: '#E55451', color: 'white', border: 'none', borderRadius: '16px', padding: '20px', fontFamily: 'Cairo, sans-serif', fontSize: '24px', fontWeight: 800, cursor: 'pointer' }}>
          تسجيل الخروج
        </button>
      </div>
    </div>
  );
}
