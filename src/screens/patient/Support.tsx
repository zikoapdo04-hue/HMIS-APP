import { useAuth } from '../../context/AuthContext';
import type { Screen } from '../../types';

interface Props { setScreen: (s: Screen) => void }

export function Support({ setScreen }: Props) {
  const { user } = useAuth();
  const patientName = user?.name ?? 'مريض';

  return (
    <div style={{ width: '100%', height: '100vh', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <header style={{ padding: '24px', textAlign: 'center', position: 'relative', background: '#168A9E', flexShrink: 0 }}>
        <button aria-label="back" onClick={() => setScreen('patient-home')} style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px' }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
        <span style={{ color: 'white', fontSize: '26px', fontFamily: 'Cairo, sans-serif', fontWeight: 800 }}>الدعم والمساعدة</span>
      </header>

      {/* Scrollable Chat Area */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 24px' }}>

        {/* Doctor Illustration */}
        <div style={{ width: '280px', height: '280px', background: '#168A9E', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '32px', overflow: 'hidden' }}>
          <img src="/doctor_avatar.png" alt="Doctor Support" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>

        {/* Chat bubble — personalised with real name */}
        <div style={{ display: 'flex', alignItems: 'flex-start', width: '100%', marginTop: 'auto', gap: '12px' }}>
          <div style={{ background: '#F4F7F9', borderRadius: '50%', width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="black" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              <path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94" fill="none" strokeWidth="2.5" />
            </svg>
          </div>
          <div style={{ background: '#A9CFF5', padding: '16px 20px', borderRadius: '16px', borderBottomLeftRadius: 0 }} dir="rtl">
            <span style={{ fontFamily: 'Cairo, sans-serif', fontSize: '18px', fontWeight: 600, color: '#1A202C' }}>
              مرحبا {patientName} كيف يمكن مساعدتك؟
            </span>
          </div>
        </div>
      </div>

      {/* Message Input Bottom Bar */}
      <div style={{ padding: '16px 24px 24px 24px', flexShrink: 0 }}>
        <div style={{ background: '#EAF0F6', borderRadius: '24px', display: 'flex', alignItems: 'center', padding: '6px 24px', height: '64px', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '18px', color: '#8A9BB4', fontWeight: 500 }}>Text Message</span>
          <button style={{ width: '48px', height: '48px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: 0 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="black"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
          </button>
        </div>
      </div>

    </div>
  );
}
