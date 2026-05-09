import { COLORS, GRADIENTS, SHADOWS, RADIUS, FONT } from '../../core/theme';
import type { Screen } from '../../types';

interface Props { setScreen: (s: Screen) => void; onBack?: () => void }

export function BookingSuccess({ setScreen }: Props) {
  return (
    <div style={{ background: COLORS.bg, height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', overflow: 'hidden' }}>

      {/* Success illustration */}
      <div style={{ width: 120, height: 120, borderRadius: RADIUS.full, background: COLORS.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32, boxShadow: `0 0 0 16px rgba(13,155,171,0.08)` }}>
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke={COLORS.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="m9 12 2 2 4-4"/>
        </svg>
      </div>

      <h2 style={{ fontFamily: FONT.cairo, fontSize: 26, fontWeight: 800, color: COLORS.textPrimary, margin: '0 0 12px', textAlign: 'center' }} dir="rtl">
        تم الحجز بنجاح!
      </h2>
      <p style={{ fontFamily: FONT.cairo, fontSize: 15, fontWeight: 500, color: COLORS.textSec, margin: '0 0 48px', textAlign: 'center', lineHeight: 1.6 }} dir="rtl">
        سيتم تأكيد موعدك قريباً<br/>يمكنك متابعة حجزك من قسم المواعيد
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 340 }}>
        <button
          onClick={() => setScreen('patient-appointments')}
          style={{ width: '100%', padding: '16px', background: GRADIENTS.primarySm, color: 'white', border: 'none', borderRadius: RADIUS.pill, fontFamily: FONT.cairo, fontSize: 17, fontWeight: 800, cursor: 'pointer', boxShadow: SHADOWS.btn }}
        >
          عرض المواعيد
        </button>
        <button
          onClick={() => setScreen('patient-home')}
          style={{ width: '100%', padding: '16px', background: COLORS.card, color: COLORS.primary, border: `1.5px solid ${COLORS.cardBorder}`, borderRadius: RADIUS.pill, fontFamily: FONT.cairo, fontSize: 17, fontWeight: 700, cursor: 'pointer', boxShadow: SHADOWS.card }}
        >
          الصفحة الرئيسية
        </button>
      </div>
    </div>
  );
}
