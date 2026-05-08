import { useAuth } from '../../context/AuthContext';
import { COLORS, GRADIENTS, SHADOWS, RADIUS, FONT } from '../../core/theme';
import type { Screen } from '../../types';

interface Props { setScreen: (s: Screen) => void; onBack?: () => void }

export function PatientAccountSettings({ setScreen, onBack }: Props) {
  const { user } = useAuth();

  const fields = [
    { label: 'الاسم الكامل', value: user?.name  ?? '—', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill={COLORS.primary}><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg> },
    { label: 'رقم الهاتف',   value: user?.phone ?? '—', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill={COLORS.primary}><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg> },
    { label: 'المدينة',       value: user?.city  ?? '—', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> },
    { label: 'العمر',         value: user?.age != null ? String(user.age) : '—', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  ];

  const iconBgs = [COLORS.primaryLight, COLORS.primaryLight, '#EDE9FE', '#FEF3C7'];

  return (
    <div style={{ background: COLORS.bg, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Header */}
      <header style={{ background: GRADIENTS.heroBg, padding: '20px 20px 28px', flexShrink: 0, boxShadow: SHADOWS.header, borderRadius: `0 0 ${RADIUS.xxl} ${RADIUS.xxl}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => onBack ? onBack() : setScreen('patient-settings')}
            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: RADIUS.sm, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: FONT.cairo, fontSize: 12, color: 'rgba(255,255,255,0.7)', margin: 0 }}>بيانات الحساب</p>
            <h2 style={{ fontFamily: FONT.cairo, fontSize: 22, fontWeight: 800, color: 'white', margin: 0 }}>معلوماتي</h2>
          </div>
          <div style={{ width: 40 }} />
        </div>
      </header>

      {/* Fields */}
      <div style={{ flex: 1, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' }} dir="rtl">
        {fields.map((f, i) => (
          <div key={i} style={{ background: COLORS.card, border: `1.5px solid ${COLORS.cardBorder}`, borderRadius: RADIUS.xl, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: SHADOWS.card }}>
            <div style={{ width: 44, height: 44, borderRadius: RADIUS.md, background: iconBgs[i], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {f.icon}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: FONT.cairo, fontSize: 12, color: COLORS.textMuted, margin: '0 0 3px', fontWeight: 600 }}>{f.label}</p>
              <p style={{ fontFamily: FONT.cairo, fontSize: 16, fontWeight: 700, color: COLORS.textPrimary, margin: 0 }}>{f.value}</p>
            </div>
          </div>
        ))}

        <div style={{ background: COLORS.primaryLight, border: `1.5px solid rgba(13,155,171,0.2)`, borderRadius: RADIUS.xl, padding: '16px 20px', marginTop: 8 }}>
          <p style={{ fontFamily: FONT.cairo, fontSize: 13, fontWeight: 600, color: COLORS.primary, margin: 0, textAlign: 'center' }}>
            لتعديل بياناتك، يرجى التواصل مع إدارة النظام
          </p>
        </div>
      </div>
    </div>
  );
}
