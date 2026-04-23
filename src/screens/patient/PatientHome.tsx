import { useAuth } from '../../context/AuthContext';
import type { Screen } from '../../types';
import { HMISGlobe, HMISShieldLogo } from '../../components/Icons';

interface Props { setScreen: (s: Screen) => void }

const specialties = [
  { name: 'عظام',         color: '#6CD4C4', screen: 'clinics' as Screen },
  { name: 'جراحة عامة',  color: '#8DBDF8', screen: 'clinics' as Screen },
  { name: 'نساء وتوليد', color: '#42685B', screen: 'clinics' as Screen },
  { name: 'قلب',          color: '#F99E8F', screen: 'clinics' as Screen },
  { name: 'مخ واعصاب',   color: '#26873F', screen: 'clinics' as Screen },
  { name: 'اطفال',        color: '#E53E17', screen: 'clinics' as Screen },
];

const ILL = `${import.meta.env.BASE_URL}doctors_illustration.png`;

export function PatientHome({ setScreen }: Props) {
  const { user } = useAuth();
  const patientName = user?.name ?? 'مريض';

  return (
    <div style={{ backgroundColor: '#ffffff', height: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', flexShrink: 0 }}>
        <button style={{ background: 'transparent', border: 'none', cursor: 'pointer' }} onClick={() => setScreen('notifications')}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="black"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <HMISGlobe size={56} />
          <span style={{ fontFamily: 'Inter', fontSize: 36, fontWeight: 300, color: '#168A9E', letterSpacing: '2px' }}>HMIS</span>
          <HMISShieldLogo size={36} />
        </div>
        <button style={{ background: 'transparent', border: 'none', cursor: 'pointer' }} onClick={() => setScreen('support')}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        </button>
      </div>

      {/* Main Content Area (Scrollable) */}
      <div style={{ flex: 1, overflowY: 'auto' }}>

        {/* Welcome Section — shows real patient name */}
        <div dir="rtl" style={{ padding: '0 24px', marginTop: '8px' }}>
          <h2 style={{ fontFamily: 'Cairo', fontSize: 24, fontWeight: 800, color: '#1A202C', margin: 0 }}>
            مرحبا : <span style={{ color: '#168A9E' }}>{patientName}</span>
          </h2>
          <h1 style={{ fontFamily: 'Cairo', fontSize: 32, fontWeight: 800, color: '#1A202C', margin: '4px 0 0 0' }}>
            احجز الان
          </h1>
        </div>

        {/* Search */}
        <div dir="rtl" style={{ padding: '0 24px', marginTop: '24px' }}>
          <div style={{ background: '#E6EEF5', borderRadius: '24px', display: 'flex', alignItems: 'center', height: '64px', padding: '6px', width: '100%' }}>
            <input
              type="text"
              placeholder="ابحث عن الطبيب"
              style={{ flex: 1, border: 'none', background: 'transparent', padding: '0 20px', fontSize: 18, fontFamily: 'Cairo', fontWeight: 600, outline: 'none', color: '#1A202C' }}
              onKeyDown={e => e.key === 'Enter' && setScreen('patient-search')}
            />
            <button
              onClick={() => setScreen('patient-search')}
              style={{ width: '56px', height: '56px', background: '#168A9E', border: 'none', borderRadius: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1A202C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>
          </div>
        </div>

        {/* Specialties Grid */}
        <div dir="rtl" style={{ padding: '24px 24px 32px 24px' }}>
          <h3 style={{ fontFamily: 'Cairo', fontSize: 22, fontWeight: 800, color: '#3197A7', margin: '0 0 16px 0', textAlign: 'right' }}>التخصصات</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {specialties.map((s, i) => (
              <div key={i} onClick={() => setScreen(s.screen)}
                style={{
                  backgroundColor: s.color,
                  borderRadius: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  cursor: 'pointer',
                  height: '230px',
                  overflow: 'hidden',
                  position: 'relative',
                  transition: 'transform 0.18s, box-shadow 0.18s',
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              >
                {/* Full doctor illustration */}
                <img
                  src={ILL}
                  alt={s.name}
                  style={{
                    position: 'absolute',
                    top: 0, left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    objectPosition: 'center top',
                    padding: '12px 8px 44px 8px',
                  }}
                />
                {/* Label bar pinned at bottom */}
                <div style={{
                  position: 'absolute',
                  bottom: 0, left: 0, right: 0,
                  padding: '10px 0',
                  textAlign: 'center',
                  background: 'rgba(0,0,0,0.18)',
                  zIndex: 1,
                }}>
                  <span style={{ fontFamily: 'Cairo', fontSize: '22px', fontWeight: 800, color: 'white' }}>
                    {s.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav dir="rtl" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', flexShrink: 0, boxShadow: '0 -4px 16px rgba(0,0,0,0.02)' }}>
        <button style={{ padding: '14px 28px', border: 'none', borderRadius: '24px', background: '#168A9E', color: 'white', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
          <span style={{ fontFamily: 'Cairo', fontSize: '20px', fontWeight: 800 }}>الرئيسية</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
        </button>
        <button onClick={() => setScreen('patient-search')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1A202C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </button>
        <button onClick={() => setScreen('patient-appointments')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1A202C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            <circle cx="8" cy="14" r="1.5" fill="#1A202C" stroke="none" /><circle cx="12" cy="14" r="1.5" fill="#1A202C" stroke="none" />
            <circle cx="16" cy="14" r="1.5" fill="#1A202C" stroke="none" /><circle cx="8" cy="18" r="1.5" fill="#1A202C" stroke="none" />
            <circle cx="12" cy="18" r="1.5" fill="#1A202C" stroke="none" /><circle cx="16" cy="18" r="1.5" fill="#1A202C" stroke="none" />
          </svg>
        </button>
        <button onClick={() => setScreen('patient-profile')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="#1A202C"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
        </button>
      </nav>
    </div>
  );
}
