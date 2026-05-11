import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { COLORS, GRADIENTS, SHADOWS, RADIUS, FONT } from '../../core/theme';
import type { Screen } from '../../types';

interface Props { setScreen: (s: Screen) => void; onBack?: () => void }

export function Notifications({ setScreen, onBack }: Props) {
  const { user } = useAuth();
  const { lang } = useSettings();
  const patientName = user?.name ?? (lang === 'ar' ? 'مريض' : 'Patient');

  return (
    <div style={{ background: COLORS.bg, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Header */}
      <header style={{ background: GRADIENTS.heroBg, padding: '20px 20px 28px', flexShrink: 0, boxShadow: SHADOWS.header, borderRadius: `0 0 ${RADIUS.xxl} ${RADIUS.xxl}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => onBack ? onBack() : setScreen('patient-home')}
            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: RADIUS.sm, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: lang === 'en' ? 'rotate(180deg)' : 'none' }}><polyline points="9 18 15 12 9 6"/></svg>
          </button>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: FONT.cairo, fontSize: 12, color: 'rgba(255,255,255,0.7)', margin: 0 }}>{lang === 'ar' ? 'آخر التحديثات' : 'Latest Updates'}</p>
            <h2 style={{ fontFamily: FONT.cairo, fontSize: 22, fontWeight: 800, color: 'white', margin: 0 }}>{lang === 'ar' ? 'الإشعارات' : 'Notifications'}</h2>
          </div>
          <div style={{ width: 40 }} />
        </div>
      </header>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {/* Welcome notification */}
        {user && (
          <div style={{ background: COLORS.card, border: `1.5px solid ${COLORS.cardBorder}`, borderRadius: RADIUS.xl, padding: '16px 20px', boxShadow: SHADOWS.card, marginBottom: 16, display: 'flex', alignItems: 'flex-start', gap: 14 }} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <div style={{ width: 44, height: 44, borderRadius: RADIUS.full, background: COLORS.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill={COLORS.primary}><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: FONT.cairo, fontSize: 15, fontWeight: 800, color: COLORS.textPrimary, margin: '0 0 4px' }}>{lang === 'ar' ? `مرحباً ${patientName}!` : `Welcome ${patientName}!`}</p>
              <p style={{ fontFamily: FONT.cairo, fontSize: 13, fontWeight: 500, color: COLORS.textSec, margin: 0, lineHeight: 1.5 }}>{lang === 'ar' ? 'تم تسجيل دخولك بنجاح إلى نظام HMIS. يمكنك الآن حجز مواعيدك ومتابعة سجلاتك الطبية.' : 'You have successfully logged into the HMIS system. You can now book appointments and track your medical records.'}</p>
              <p style={{ fontFamily: FONT.inter, fontSize: 11, color: COLORS.textMuted, margin: '6px 0 0' }}>{lang === 'ar' ? 'الآن' : 'Just now'}</p>
            </div>
          </div>
        )}

        {/* Empty state */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 40, gap: 16 }}>
          <div style={{ width: 80, height: 80, borderRadius: RADIUS.full, background: COLORS.inputBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={COLORS.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </div>
          <p style={{ fontFamily: FONT.cairo, fontSize: 16, fontWeight: 700, color: COLORS.textMuted, margin: 0 }}>{lang === 'ar' ? 'لا توجد إشعارات سابقة' : 'No previous notifications'}</p>
          <p style={{ fontFamily: FONT.cairo, fontSize: 13, color: COLORS.textMuted, margin: 0, textAlign: 'center' }}>{lang === 'ar' ? 'ستظهر هنا إشعارات مواعيدك وتحديثات النظام' : 'Your appointment notifications and system updates will appear here'}</p>
        </div>
      </div>
    </div>
  );
}
