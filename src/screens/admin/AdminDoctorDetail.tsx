import { useSettings } from '../../context/SettingsContext';
import { COLORS, GRADIENTS, SHADOWS, RADIUS, FONT } from '../../core/theme';
import { DoctorStatus } from '../../core/enums';
import type { Screen } from '../../types';
import type { UserModel } from '../../models/user.model';

interface Props {
  setScreen: (s: Screen) => void;
  doctor?: UserModel | null;
  onBack?: () => void;
}

export function AdminDoctorDetail({ setScreen, doctor, onBack }: Props) {
  const { lang } = useSettings();
  const name      = doctor?.name           ?? '—';
  const specialty = doctor?.specialty      ?? '—';
  const hospital  = doctor?.hospital       ?? '—';
  const address   = doctor?.hospitalAddress ?? '—';
  const phone     = doctor?.phone          ?? '—';
  const email     = doctor?.email          ?? '—';
  const rating    = doctor?.rating         ?? 0;
  const days      = doctor?.workDays?.join(' — ') ?? '—';
  const bio       = doctor?.bio            ?? '—';
  const avatarSrc = doctor?.imageUrl
    ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D9BAB&color=fff&size=200`;

  const STATUS_STYLE: Record<string, { label: string; color: string; bg: string }> = {
    [DoctorStatus.Approved]: { label: lang === 'ar' ? 'معتمد' : 'Approved',        color: COLORS.success, bg: COLORS.successLight },
    [DoctorStatus.Rejected]: { label: lang === 'ar' ? 'مرفوض' : 'Rejected',         color: COLORS.danger,  bg: COLORS.dangerLight  },
    [DoctorStatus.Pending]:  { label: lang === 'ar' ? 'قيد المراجعة' : 'Under Review',  color: COLORS.warning, bg: COLORS.warningLight },
  };
  const st = STATUS_STYLE[doctor?.doctorStatus ?? DoctorStatus.Pending];

  const infoRows = [
    { label: lang === 'ar' ? 'التخصص' : 'Specialty',    value: specialty, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill={COLORS.primary}><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/></svg>, bg: COLORS.primaryLight },
    { label: lang === 'ar' ? 'المستشفى' : 'Hospital',  value: hospital,  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, bg: '#EDE9FE' },
    { label: lang === 'ar' ? 'العنوان' : 'Address',   value: address,   icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>, bg: '#FEF3C7' },
    { label: lang === 'ar' ? 'أيام العمل' : 'Work Days', value: days,     icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.success} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>, bg: COLORS.successLight },
    { label: lang === 'ar' ? 'الهاتف' : 'Phone',    value: phone,     icon: <svg width="18" height="18" viewBox="0 0 24 24" fill={COLORS.primary}><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>, bg: COLORS.primaryLight },
    { label: lang === 'ar' ? 'البريد' : 'Email',    value: email,     icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>, bg: COLORS.primaryLight },
  ];

  return (
    <div style={{ background: COLORS.bg, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Hero */}
      <div style={{ background: GRADIENTS.heroBg, padding: '24px 20px 32px', flexShrink: 0, borderRadius: `0 0 ${RADIUS.xxl} ${RADIUS.xxl}`, boxShadow: SHADOWS.header, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <div style={{ width: 40 }} />
          <p style={{ fontFamily: FONT.cairo, fontSize: 16, fontWeight: 800, color: 'white', margin: 0 }}>{lang === 'ar' ? 'بيانات الطبيب' : 'Doctor Details'}</p>
          <button
            onClick={() => onBack ? onBack() : setScreen('admin-doctors')}
            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: RADIUS.sm, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: lang === 'en' ? 'rotate(180deg)' : 'none' }}><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>

        <img src={avatarSrc} alt={name} style={{ width: 90, height: 90, borderRadius: RADIUS.full, objectFit: 'cover', border: '3px solid rgba(255,255,255,0.6)', marginBottom: 12 }} />
        <h2 style={{ fontFamily: FONT.cairo, fontSize: 22, fontWeight: 800, color: 'white', margin: '0 0 4px' }}>{lang === 'ar' ? `د. ${name}` : `Dr. ${name}`}</h2>
        <p style={{ fontFamily: FONT.cairo, fontSize: 14, color: 'rgba(255,255,255,0.8)', margin: '0 0 8px' }}>{specialty}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="#FCD34D"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <span style={{ fontFamily: FONT.inter, fontSize: 14, fontWeight: 700, color: '#FCD34D' }}>{rating}</span>
          </div>
          <span style={{ fontFamily: FONT.cairo, fontSize: 12, fontWeight: 700, color: st.color, background: 'rgba(255,255,255,0.2)', padding: '3px 12px', borderRadius: RADIUS.full }}>{st.label}</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 10 }} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        {/* Bio */}
        {bio !== '—' && (
          <div style={{ background: COLORS.card, border: `1.5px solid ${COLORS.cardBorder}`, borderRadius: RADIUS.xl, padding: '16px', boxShadow: SHADOWS.card }}>
            <p style={{ fontFamily: FONT.cairo, fontSize: 12, color: COLORS.textMuted, margin: '0 0 6px', fontWeight: 700 }}>{lang === 'ar' ? 'نبذة تعريفية' : 'Biography'}</p>
            <p style={{ fontFamily: FONT.cairo, fontSize: 14, color: COLORS.textPrimary, margin: 0, lineHeight: 1.7 }}>{bio}</p>
          </div>
        )}

        {infoRows.map((row, i) => (
          <div key={i} style={{ background: COLORS.card, border: `1.5px solid ${COLORS.cardBorder}`, borderRadius: RADIUS.xl, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: SHADOWS.card }}>
            <div style={{ width: 42, height: 42, borderRadius: RADIUS.md, background: row.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {row.icon}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: FONT.cairo, fontSize: 12, color: COLORS.textMuted, margin: '0 0 2px', fontWeight: 600 }}>{row.label}</p>
              <p style={{ fontFamily: FONT.cairo, fontSize: 15, fontWeight: 700, color: COLORS.textPrimary, margin: 0 }}>{row.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
