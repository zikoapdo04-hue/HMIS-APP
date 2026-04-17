import type { Screen } from '../../types';

interface Props { setScreen: (s: Screen) => void }

export function BookingSuccess({ setScreen }: Props) {
  return (
    <div style={{ backgroundColor: '#fff', width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
      <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="m9 12 2 2 4-4"/>
      </svg>
      <h2 style={{ fontFamily: 'Cairo, sans-serif', fontSize: '26px', fontWeight: 700, color: '#6B7280', margin: '24px 0 48px 0', textAlign: 'center' }}>تم الحجز بنجاح</h2>
      <button onClick={() => setScreen('patient-home')} style={{ width: '100%', maxWidth: '340px', background: '#148C9E', color: 'white', borderRadius: '16px', padding: '16px', fontFamily: 'Cairo, sans-serif', fontSize: '22px', fontWeight: 800, border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(20,140,158,0.2)' }}>
        العودة للقائمة الرئيسية
      </button>
    </div>
  );
}
