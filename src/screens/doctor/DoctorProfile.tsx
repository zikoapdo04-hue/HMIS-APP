import { useAuth } from '../../context/AuthContext';
import type { Screen } from '../../types';

interface Props { setScreen: (s: Screen) => void }

export function DoctorProfile({ setScreen }: Props) {
  const { user } = useAuth();

  const name      = user?.name      ?? '—';
  const specialty = user?.specialty ?? '—';
  const hospital  = user?.hospital  ?? '—';
  const address   = user?.address   ?? '—';
  const phone     = user?.phone     ?? '—';
  const email     = user?.email     ?? '—';
  const rating    = user?.rating    ?? 0;
  const days      = user?.days      ?? '—';

  return (
    <div style={{ width: '100%', height: '100vh', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <header style={{ padding: '24px', textAlign: 'center', position: 'relative', background: '#168A9E', flexShrink: 0 }}>
        <button aria-label="settings" onClick={() => setScreen('doctor-settings')} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1A202C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33h.09a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </button>
        <span style={{ color: 'white', fontSize: '26px', fontFamily: 'Cairo, sans-serif', fontWeight: 800 }}>بيانات الطبيب</span>
      </header>

      {/* Scrollable Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '32px 24px' }}>

        {/* Profile: Name and Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px', marginBottom: '32px', padding: '0 16px' }} dir="rtl">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=130`}
            alt={name}
            style={{ width: '130px', height: '130px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontFamily: 'Cairo, sans-serif', fontSize: '26px', fontWeight: 800, color: '#3197A7', marginBottom: '8px', textAlign: 'center' }}>
              د.{name}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <span style={{ fontFamily: 'Cairo, sans-serif', fontSize: '18px', fontWeight: 600, color: '#A0ABC0' }}>{specialty}</span>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '18px', fontWeight: 600, color: '#A0ABC0', marginRight: '6px' }}>{rating}</span>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#ECC94B" stroke="#ECC94B">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Schedule & Location Card */}
        <div dir="rtl" style={{ marginBottom: '32px' }}>
          <div style={{ backgroundColor: '#E6EEF5', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span style={{ fontFamily: 'Cairo, sans-serif', fontSize: '18px', fontWeight: 600, color: '#8898AA' }}>{days}</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span style={{ fontFamily: 'Cairo, sans-serif', fontSize: '18px', fontWeight: 600, color: '#8898AA' }}>{hospital} — {address}</span>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div dir="rtl" style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#3197A7', marginBottom: '16px', fontFamily: 'Cairo, sans-serif', paddingRight: '8px' }}>
            معلومات التواصل
          </h3>
          <div style={{ backgroundColor: '#E6EEF5', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Email */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '32px', display: 'flex', justifyContent: 'center' }}>
                <svg width="30" height="22" viewBox="0 0 32 24"><rect width="32" height="24" rx="4" fill="#000" /><path d="M 2 4 L 16 14 L 30 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
              </div>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', fontWeight: 700, color: '#8898AA' }}>{email}</span>
            </div>
            {/* Phone */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '32px', display: 'flex', justifyContent: 'center' }}>
                <div style={{ backgroundColor: '#000', borderRadius: '6px', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                </div>
              </div>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', fontWeight: 700, color: '#8898AA' }}>{phone}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav dir="rtl" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', flexShrink: 0 }}>
        <button onClick={() => setScreen('doctor-home')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="black"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
        </button>
        <button
          style={{ padding: '14px 28px', border: 'none', borderRadius: '24px', background: '#168A9E', color: 'white', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
          <span style={{ fontFamily: 'Cairo', fontSize: '20px', fontWeight: 800 }}>الحساب</span>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
        </button>
      </nav>
    </div>
  );
}
