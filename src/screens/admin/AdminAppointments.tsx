import type { Screen } from '../../types';
import { HMISGlobe, HMISShieldLogo } from '../../components/Icons';
import { useSettings } from '../../context/SettingsContext';

interface Props {
  setScreen: (s: Screen) => void;
}

const TODAY_APPOINTMENTS = [
  { id: 1, time: '08:00 AM', name: 'احمد محمد',    doctor: 'د.خالد توفيق',  specialty: 'قلب',   location: 'مدينة نصر',   status: 'confirmed' },
  { id: 2, time: '09:30 AM', name: 'يوسف حمدي',    doctor: 'د.انس احمد',    specialty: 'عظام',  location: 'الدقي',       status: 'pending'   },
  { id: 3, time: '11:00 AM', name: 'احمد وليد',    doctor: 'د.احمد ناصر',   specialty: 'اطفال', location: 'مصر الجديدة', status: 'confirmed' },
  { id: 4, time: '12:30 PM', name: 'مصطفي كمال',   doctor: 'د.خالد توفيق',  specialty: 'قلب',   location: 'مدينة نصر',   status: 'cancelled' },
  { id: 5, time: '02:00 PM', name: 'اسلام محمد',   doctor: 'د.انس احمد',    specialty: 'عظام',  location: 'الدقي',       status: 'confirmed' },
  { id: 6, time: '03:30 PM', name: 'كريم علي',     doctor: 'د.احمد ناصر',   specialty: 'اطفال', location: 'مصر الجديدة', status: 'pending'   },
];

const STATUS_LABEL: Record<string, string> = {
  confirmed: 'مؤكد',
  pending:   'قيد الانتظار',
  cancelled: 'ملغي',
};

const STATUS_COLOR: Record<string, string> = {
  confirmed: '#38a169',
  pending:   '#d97706',
  cancelled: '#e53e3e',
};

const STATUS_BG: Record<string, string> = {
  confirmed: '#f0fff4',
  pending:   '#fffbeb',
  cancelled: '#fff5f5',
};

const STATUS_BG_DARK: Record<string, string> = {
  confirmed: '#1c4532',
  pending:   '#3d2a05',
  cancelled: '#4a1010',
};

export function AdminAppointments({ setScreen }: Props) {
  const { fontSize, darkMode } = useSettings();
  const bg       = darkMode ? '#1a202c' : '#f7fafc';
  const cardBg   = darkMode ? '#2d3748' : '#ffffff';
  const textMain = darkMode ? '#e2e8f0' : '#4A5568';
  const textSub  = darkMode ? '#a0aec0' : '#718096';
  const border   = darkMode ? '#4a5568' : '#E2E8F0';

  const confirmed = TODAY_APPOINTMENTS.filter(a => a.status === 'confirmed').length;
  const pending   = TODAY_APPOINTMENTS.filter(a => a.status === 'pending').length;
  const cancelled = TODAY_APPOINTMENTS.filter(a => a.status === 'cancelled').length;

  return (
    <div className="admin-dash-screen" style={{ background: bg, fontSize: `${fontSize}px`, minHeight: '100vh' }}>

      {/* ── HEADER ── */}
      <div dir="ltr" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 16px', background: cardBg,
        boxShadow: '0 1px 6px rgba(0,0,0,0.07)',
      }}>
        <div style={{ width: 40 }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <HMISGlobe size={48} color="#1DB8C8" />
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '28px', fontWeight: 800, color: '#1DB8C8', letterSpacing: '1px' }}>HMIS</span>
          <HMISShieldLogo size={38} color="#1DB8C8" />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontFamily: 'Cairo, sans-serif', fontSize: '17px', fontWeight: 800, color: textMain, lineHeight: 1.2 }}>المدير</span>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: 700, color: textMain, lineHeight: 1.2 }}>Admin</span>
            <span style={{ fontFamily: 'Cairo, sans-serif', fontSize: '13px', fontWeight: 700, color: '#1DB8C8', marginTop: '2px' }}>الاثنين</span>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 600, color: textSub }}>10-3-2026</span>
          </div>
          <img src="https://ui-avatars.com/api/?name=Admin&background=random&size=100" alt="Admin" className="admin-dash-avatar" />
          <button onClick={() => setScreen('admin-home')} style={{
            width: 36, height: 36, borderRadius: '50%',
            border: `1.5px solid ${border}`, background: cardBg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke={textMain} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="admin-dash-content">

        {/* Summary chips */}
        <div dir="rtl" style={{ display: 'flex', gap: 10, padding: '16px 16px 4px', flexWrap: 'wrap' }}>
          {[
            { label: 'مؤكدة', count: confirmed, color: '#38a169', bg: darkMode ? '#1c4532' : '#f0fff4' },
            { label: 'انتظار', count: pending,   color: '#d97706', bg: darkMode ? '#3d2a05' : '#fffbeb' },
            { label: 'ملغية',  count: cancelled, color: '#e53e3e', bg: darkMode ? '#4a1010' : '#fff5f5' },
            { label: 'الإجمالي', count: TODAY_APPOINTMENTS.length, color: '#178CA1', bg: darkMode ? '#0d3740' : '#e0f7fa' },
          ].map(chip => (
            <div key={chip.label} style={{
              flex: 1, minWidth: 70,
              background: chip.bg, borderRadius: 12, padding: '10px 14px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              border: `1px solid ${chip.color}22`,
            }}>
              <span style={{ fontFamily: 'Cairo,sans-serif', fontSize: fontSize + 2, fontWeight: 800, color: chip.color }}>{chip.count}</span>
              <span style={{ fontFamily: 'Cairo,sans-serif', fontSize: fontSize - 2, fontWeight: 600, color: chip.color }}>{chip.label}</span>
            </div>
          ))}
        </div>

        {/* Page title */}
        <div dir="rtl" style={{ padding: '12px 16px 4px' }}>
          <h2 style={{ fontFamily: 'Cairo,sans-serif', fontSize: fontSize + 4, fontWeight: 800, color: textMain, margin: 0 }}>
            مواعيد اليوم
          </h2>
          <span style={{ fontFamily: 'Cairo,sans-serif', fontSize: fontSize - 1, color: textSub }}>الاثنين — 10-3-2026</span>
        </div>

        {/* Appointments list */}
        <div style={{ padding: '8px 16px 100px', display: 'flex', flexDirection: 'column', gap: 12 }} dir="rtl">
          {TODAY_APPOINTMENTS.map(appt => (
            <div key={appt.id} style={{
              background: cardBg, borderRadius: 14,
              border: `1px solid ${border}`,
              padding: '14px 16px',
              display: 'flex', alignItems: 'center', gap: 12,
              boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
            }}>
              {/* Time badge */}
              <div style={{
                background: darkMode ? '#374151' : '#EDF2F7',
                borderRadius: 10, padding: '8px 10px',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                minWidth: 60, flexShrink: 0,
              }}>
                <span style={{ fontFamily: 'Inter,sans-serif', fontSize: fontSize - 1, fontWeight: 800, color: '#1DB8C8', lineHeight: 1 }}>
                  {appt.time.split(' ')[0]}
                </span>
                <span style={{ fontFamily: 'Inter,sans-serif', fontSize: fontSize - 3, fontWeight: 600, color: textSub }}>
                  {appt.time.split(' ')[1]}
                </span>
              </div>

              {/* Info */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontFamily: 'Cairo,sans-serif', fontSize: fontSize + 1, fontWeight: 800, color: '#178CA1' }}>{appt.name}</span>
                <span style={{ fontFamily: 'Cairo,sans-serif', fontSize: fontSize - 1, fontWeight: 700, color: textMain }}>{appt.doctor} — {appt.specialty}</span>
                <span style={{ fontFamily: 'Cairo,sans-serif', fontSize: fontSize - 2, fontWeight: 600, color: textSub }}>📍 {appt.location}</span>
              </div>

              {/* Status badge */}
              <div style={{
                background: darkMode ? STATUS_BG_DARK[appt.status] : STATUS_BG[appt.status],
                borderRadius: 50, padding: '5px 12px',
                flexShrink: 0,
              }}>
                <span style={{
                  fontFamily: 'Cairo,sans-serif',
                  fontSize: fontSize - 2,
                  fontWeight: 700,
                  color: STATUS_COLOR[appt.status],
                }}>{STATUS_LABEL[appt.status]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="admin-bottom-nav" dir="rtl" style={{ background: cardBg, borderTop: `1px solid ${border}` }}>
        <button className="admin-nav-item" onClick={() => setScreen('admin-home')}>الاحصائيات</button>
        <button className="admin-nav-item" onClick={() => setScreen('admin-patients')}>ادارة المرضي</button>
        <button className="admin-nav-item" onClick={() => setScreen('admin-doctors')}>ادارة الاطباء</button>
        <button className="admin-nav-item active">مواعيد اليوم</button>
      </nav>
    </div>
  );
}
