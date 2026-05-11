import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { COLORS, GRADIENTS, SHADOWS, RADIUS, FONT } from '../../core/theme';
import type { Screen } from '../../types';

interface Props { setScreen: (s: Screen) => void; onBack?: () => void }

export function PatientSettings({ setScreen, onBack }: Props) {
  const { logout } = useAuth();
  const { lang, theme, setTheme, setLang } = useSettings();

  const handleLogout = async () => {
    await logout();
    setScreen('login');
  };

  const SETTINGS_ITEMS = [
    {
      label: lang === 'ar' ? 'إعداد الحساب' : 'Account Settings',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill={COLORS.primary}><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>,
      iconBg: COLORS.primaryLight,
      action: () => setScreen('patient-account-settings'),
    },
    {
      label: lang === 'ar' ? 'كلمة السر' : 'Password',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
      iconBg: '#EDE9FE',
      action: undefined as (() => void) | undefined,
    },
    {
      label: lang === 'ar' ? 'إعداد الإشعارات' : 'Notification Settings',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="#D97706"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>,
      iconBg: '#FEF3C7',
      action: undefined as (() => void) | undefined,
    },
  ];

  return (
    <div style={{ background: COLORS.bg, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Header */}
      <header style={{ background: GRADIENTS.heroBg, padding: '20px 20px 28px', flexShrink: 0, boxShadow: SHADOWS.header, borderRadius: `0 0 ${RADIUS.xxl} ${RADIUS.xxl}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => onBack ? onBack() : setScreen('patient-profile')}
            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: RADIUS.sm, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: lang === 'en' ? 'rotate(180deg)' : 'none' }}><polyline points="9 18 15 12 9 6"/></svg>
          </button>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: FONT.cairo, fontSize: 12, color: 'rgba(255,255,255,0.7)', margin: 0 }}>{lang === 'ar' ? 'تخصيص تجربتك' : 'Customize Experience'}</p>
            <h2 style={{ fontFamily: FONT.cairo, fontSize: 22, fontWeight: 800, color: 'white', margin: 0 }}>{lang === 'ar' ? 'الإعدادات' : 'Settings'}</h2>
          </div>
          <div style={{ width: 40 }} />
        </div>
      </header>

      {/* Settings List */}
      <div style={{ flex: 1, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' }} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        {SETTINGS_ITEMS.map((item, i) => (
          <button
            key={i}
            onClick={item.action}
            disabled={!item.action}
            style={{
              width: '100%', background: COLORS.card, border: `1.5px solid ${COLORS.cardBorder}`,
              borderRadius: RADIUS.xl, padding: '16px 20px', display: 'flex', alignItems: 'center',
              gap: 14, cursor: item.action ? 'pointer' : 'default', boxShadow: SHADOWS.card,
              opacity: item.action ? 1 : 0.5, transition: 'all 0.18s',
            }}
          >
            <div style={{ width: 44, height: 44, borderRadius: RADIUS.md, background: item.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {item.icon}
            </div>
            <span style={{ flex: 1, fontFamily: FONT.cairo, fontSize: 16, fontWeight: 700, color: COLORS.textPrimary, textAlign: lang === 'ar' ? 'right' : 'left' }}>{item.label}</span>
            {item.action && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: lang === 'en' ? 'rotate(180deg)' : 'none' }}><polyline points="15 18 9 12 15 6"/></svg>
            )}
          </button>
        ))}

        {/* ── Appearance ── */}
        <div style={{ background: COLORS.card, border: `1.5px solid ${COLORS.cardBorder}`, borderRadius: RADIUS.xl, padding: '16px 20px', boxShadow: SHADOWS.card }} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <p style={{ fontFamily: FONT.cairo, fontSize: 12, fontWeight: 700, color: COLORS.primary, margin: '0 0 12px', letterSpacing: 0.5 }}>
            {lang === 'ar' ? 'المظهر' : 'APPEARANCE'}
          </p>
          {/* Theme toggle */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            {([['light', '☀️', lang === 'ar' ? 'فاتح' : 'Light'], ['dark', '🌙', lang === 'ar' ? 'داكن' : 'Dark']] as const).map(([val, icon, label]) => (
              <button key={val} onClick={() => setTheme(val)} style={{ flex: 1, padding: '12px 4px', border: 'none', borderRadius: RADIUS.md, fontFamily: FONT.cairo, fontSize: 14, fontWeight: 700, cursor: 'pointer', background: theme === val ? COLORS.primary : COLORS.inputBg, color: theme === val ? 'white' : COLORS.textSec, transition: 'all 0.18s', boxShadow: theme === val ? SHADOWS.btn : 'none' }}>
                {icon} {label}
              </button>
            ))}
          </div>
          {/* Language toggle */}
          <div style={{ display: 'flex', gap: 8 }}>
            {([['ar', '🇸🇦', 'العربية'], ['en', '🇬🇧', 'English']] as const).map(([val, flag, label]) => (
              <button key={val} onClick={() => setLang(val)} style={{ flex: 1, padding: '12px 4px', border: 'none', borderRadius: RADIUS.md, fontFamily: val === 'ar' ? FONT.cairo : FONT.inter, fontSize: 14, fontWeight: 700, cursor: 'pointer', background: lang === val ? COLORS.primary : COLORS.inputBg, color: lang === val ? 'white' : COLORS.textSec, transition: 'all 0.18s', boxShadow: lang === val ? SHADOWS.btn : 'none' }}>
                {flag} {label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1 }} />

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            width: '100%', background: COLORS.dangerLight, color: COLORS.danger,
            border: `1.5px solid rgba(239,68,68,0.2)`, borderRadius: RADIUS.xl,
            padding: '18px', fontFamily: FONT.cairo, fontSize: 17, fontWeight: 800,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#FCA5A5'}
          onMouseLeave={e => e.currentTarget.style.background = COLORS.dangerLight}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.danger} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          {lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}
        </button>
      </div>
    </div>
  );
}
