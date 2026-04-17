import { useAuth } from '../../context/AuthContext';
import type { Screen } from '../../types';

interface Props { setScreen: (s: Screen) => void }

export function PatientAccountSettings({ setScreen }: Props) {
  const { user } = useAuth();

  const fields = [
    { label: 'الاسم',      value: user?.name  ?? '—' },
    { label: 'رقم الهاتف', value: user?.phone ?? '—' },
    { label: 'المدينة',    value: user?.city  ?? '—' },
    { label: 'العمر',      value: user?.age   ?? '—' },
  ];

  return (
    <div style={{ width: '100%', height: '100vh', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '24px', textAlign: 'center', position: 'relative', background: '#148C9E', flexShrink: 0 }}>
        <button aria-label="back" onClick={() => setScreen('patient-settings')} style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
        <span style={{ color: 'white', fontSize: '28px', fontFamily: 'Cairo, sans-serif', fontWeight: 800 }}>اعدادات الحساب</span>
      </header>
      <div style={{ padding: '32px 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {fields.map((f, i) => (
          <div key={i} style={{ background: '#EAF0F6', borderRadius: '16px', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'Cairo, sans-serif', fontSize: '20px', fontWeight: 600, color: '#A0ABC0' }}>{f.value}</span>
            <span style={{ fontFamily: 'Cairo, sans-serif', fontSize: '20px', fontWeight: 800, color: '#4A5568' }}>{f.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
