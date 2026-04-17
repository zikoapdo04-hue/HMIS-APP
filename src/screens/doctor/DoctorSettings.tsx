import { useAuth } from '../../context/AuthContext';
import type { Screen } from '../../types';

interface Props { setScreen: (s: Screen) => void }

export function DoctorSettings({ setScreen }: Props) {
  const { user, logout } = useAuth();

  const fields = [
    { label: 'الاسم',      value: user?.name      ?? '—' },
    { label: 'رقم الهاتف', value: user?.phone     ?? '—' },
    { label: 'المدينة',    value: user?.address   ?? '—' },
    { label: 'التخصص',    value: user?.specialty  ?? '—' },
    { label: 'مستشفي',    value: user?.hospital   ?? '—' },
  ];

  const handleLogout = async () => {
    await logout();
    setScreen('role');
  };

  return (
    <div style={{ width: '100%', height: '100vh', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <header style={{ padding: '24px', textAlign: 'center', position: 'relative', background: '#168A9E', flexShrink: 0 }}>
        <button aria-label="back" onClick={() => setScreen('doctor-profile')} style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
        <span style={{ color: 'white', fontSize: '26px', fontFamily: 'Cairo, sans-serif', fontWeight: 800 }}>اعدادات الحساب</span>
      </header>

      {/* Main Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '32px 24px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {fields.map((f, i) => (
            <div key={i} dir="rtl" style={{ background: '#EAF0F6', borderRadius: '16px', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'Cairo, sans-serif', fontSize: '20px', fontWeight: 800, color: '#4A5568' }}>{f.label}</span>
              <span style={{ fontFamily: 'Cairo, Inter, sans-serif', fontSize: '18px', fontWeight: 700, color: '#A0ABC0' }}>{f.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Logout */}
      <div style={{ padding: '24px 24px 32px 24px', flexShrink: 0 }}>
        <button
          onClick={handleLogout}
          style={{ width: '100%', padding: '16px', background: '#E54D4D', color: 'white', borderRadius: '16px', border: 'none', cursor: 'pointer', fontFamily: 'Cairo, sans-serif', fontSize: '24px', fontWeight: 800 }}>
          تسجيل الخروج
        </button>
      </div>
    </div>
  );
}
