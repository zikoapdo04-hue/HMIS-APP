import { COLORS, GRADIENTS, SHADOWS, RADIUS, FONT } from '../../core/theme';
import type { Screen } from '../../types';

export interface DoctorInfo {
  uid:       string;
  name:      string;
  specialty: string;
  rating:    number;
  phone:     string;
  address?:  string;
  avatar?:   string;
}

interface Props { setScreen: (s: Screen) => void; onBack?: () => void; doctor: DoctorInfo | null }

export function DoctorDetail({ setScreen, onBack, doctor }: Props) {
  if (!doctor) { setScreen('patient-home'); return null; }

  const avatarSrc = doctor.avatar
    ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=0D9BAB&color=fff&size=200`;

  const stars = Math.round(doctor.rating);

  return (
    <div style={{ background: COLORS.bg, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Hero */}
      <div style={{ background: GRADIENTS.heroBg, padding: '20px 20px 32px', flexShrink: 0, position: 'relative' }}>
        <button
          onClick={() => onBack ? onBack() : setScreen('patient-home')}
          style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: RADIUS.sm, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginBottom: 20 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }} dir="rtl">
          <img
            src={avatarSrc}
            alt={doctor.name}
            style={{ width: 88, height: 88, borderRadius: RADIUS.full, objectFit: 'cover', border: '3px solid rgba(255,255,255,0.6)', boxShadow: SHADOWS.avatar, flexShrink: 0 }}
          />
          <div>
            <h2 style={{ fontFamily: FONT.cairo, fontSize: 22, fontWeight: 800, color: 'white', margin: '0 0 4px' }}>{doctor.name}</h2>
            <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.22)', border: '1px solid rgba(255,255,255,0.35)', borderRadius: RADIUS.pill, padding: '3px 14px', marginBottom: 8 }}>
              <span style={{ fontFamily: FONT.cairo, fontSize: 13, color: 'rgba(255,255,255,0.95)', fontWeight: 600 }}>{doctor.specialty}</span>
            </div>
            {/* Stars */}
            <div style={{ display: 'flex', gap: 3 }}>
              {[1,2,3,4,5].map(n => (
                <svg key={n} width="16" height="16" viewBox="0 0 24 24" fill={n <= stars ? COLORS.star : 'rgba(255,255,255,0.3)'}>
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              ))}
              <span style={{ fontFamily: FONT.inter, fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.85)', marginRight: 4 }}>{doctor.rating}/5</span>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px 24px' }}>

        {/* Info cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} dir="rtl">

          {/* Phone */}
          <div style={{ background: COLORS.card, border: `1.5px solid ${COLORS.cardBorder}`, borderRadius: RADIUS.xl, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: SHADOWS.card }}>
            <div style={{ width: 44, height: 44, borderRadius: RADIUS.md, background: '#E0F6F9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={COLORS.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </div>
            <div>
              <p style={{ fontFamily: FONT.cairo, fontSize: 12, color: COLORS.textMuted, margin: '0 0 2px', fontWeight: 600 }}>رقم التواصل</p>
              <p style={{ fontFamily: FONT.inter, fontSize: 16, fontWeight: 700, color: COLORS.textPrimary, margin: 0 }} dir="ltr">{doctor.phone}</p>
            </div>
          </div>

          {/* Address */}
          {doctor.address && (
            <div style={{ background: COLORS.card, border: `1.5px solid ${COLORS.cardBorder}`, borderRadius: RADIUS.xl, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: SHADOWS.card }}>
              <div style={{ width: 44, height: 44, borderRadius: RADIUS.md, background: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div>
                <p style={{ fontFamily: FONT.cairo, fontSize: 12, color: COLORS.textMuted, margin: '0 0 2px', fontWeight: 600 }}>موقع العيادة</p>
                <p style={{ fontFamily: FONT.cairo, fontSize: 15, fontWeight: 700, color: COLORS.textPrimary, margin: 0 }}>{doctor.address}</p>
              </div>
            </div>
          )}

          {/* Specialty */}
          <div style={{ background: COLORS.card, border: `1.5px solid ${COLORS.cardBorder}`, borderRadius: RADIUS.xl, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: SHADOWS.card }}>
            <div style={{ width: 44, height: 44, borderRadius: RADIUS.md, background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
            </div>
            <div>
              <p style={{ fontFamily: FONT.cairo, fontSize: 12, color: COLORS.textMuted, margin: '0 0 2px', fontWeight: 600 }}>التخصص</p>
              <p style={{ fontFamily: FONT.cairo, fontSize: 15, fontWeight: 700, color: COLORS.textPrimary, margin: 0 }}>{doctor.specialty}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Book button */}
      <div style={{ padding: '16px 16px 24px', flexShrink: 0, background: COLORS.navBg, borderTop: `1.5px solid ${COLORS.navBorder}` }}>
        <button
          onClick={() => setScreen('book-appointment')}
          style={{
            width: '100%', padding: '18px',
            background: GRADIENTS.primarySm, color: 'white', border: 'none',
            borderRadius: RADIUS.pill, fontFamily: FONT.cairo, fontSize: 18, fontWeight: 800,
            cursor: 'pointer', boxShadow: SHADOWS.btn, transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = SHADOWS.btnHov; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = SHADOWS.btn; }}
        >
          احجز موعداً الآن
        </button>
      </div>
    </div>
  );
}
