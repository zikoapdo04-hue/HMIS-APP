import { useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { useSpecialties } from '../../hooks/use-specialties';
import { storageService } from '../../services/storage.service';
import { userService } from '../../services/user.service';
import { HMISGlobe, HMISShieldLogo } from '../../components/Icons';
import { SettingsDropdown } from '../../components/SettingsDropdown';
import { COLORS, GRADIENTS, SHADOWS, RADIUS, FONT } from '../../core/theme';
import type { Screen } from '../../types';

interface Props { setScreen: (s: Screen) => void; setSpecialty?: (s: string) => void }

const SPECIALTY_ICONS: Record<string, string> = {
  'القلب': '❤️', 'المخ والأعصاب': '🧠', 'العظام': '🦴', 'الأطفال': '👶',
  'الجلدية': '🧬', 'النساء والتوليد': '🌸', 'العيون': '👁️', 'الأنف والأذن': '👂',
  'المسالك البولية': '💊', 'الجهاز الهضمي': '🫀', 'الطب النفسي': '🧘',
  'الغدد الصماء': '⚕️', 'الصدر والرئة': '🫁', 'الروماتيزم': '🦵',
  'الكلى': '🫘', 'الأورام': '🔬', 'الطب العام': '🩺', 'الطوارئ': '🚑',
}

export function PatientHome({ setScreen, setSpecialty }: Props) {
  const { user, updateUser } = useAuth();
  const { lang } = useSettings();
  const { specialties, loading: specLoading } = useSpecialties();
  const fileRef = useRef<HTMLInputElement>(null);
  const patientName = user?.name ?? (lang === 'ar' ? 'مريض' : 'Patient');
  const avatarSrc = user?.imageUrl
    ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(patientName)}&background=0D9BAB&color=fff&size=128`;

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    try {
      const url = await storageService.uploadAvatar(user.id, file);
      await userService.update(user.id, { imageUrl: url });
      updateUser({ imageUrl: url });
    } catch { /* silent */ } finally { e.target.value = ''; }
  };

  return (
    <div style={{ background: COLORS.bg, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* ── Header ── */}
      <header style={{
        background: GRADIENTS.heroBg,
        padding: '20px 20px 28px',
        flexShrink: 0,
        boxShadow: SHADOWS.header,
        borderRadius: `0 0 ${RADIUS.xxl} ${RADIUS.xxl}`,
      }}>
        {/* Top row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          {/* Settings dropdown (left in RTL = right visually) */}
          <SettingsDropdown setScreen={setScreen} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <HMISGlobe size={36} color="white" />
            <span style={{ fontFamily: FONT.inter, fontSize: 26, fontWeight: 800, color: 'white', letterSpacing: 2 }}>HMIS</span>
            <HMISShieldLogo size={28} color="white" />
          </div>

          {/* Notifications bell */}
          <button
            onClick={() => setScreen('notifications')}
            style={{ background: 'rgba(255,255,255,0.18)', border: 'none', borderRadius: RADIUS.sm, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
            </svg>
          </button>
        </div>

        {/* Welcome row: avatar + text */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }} dir="rtl">
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <img
              src={avatarSrc}
              alt={patientName}
              onClick={() => fileRef.current?.click()}
              style={{ width: 52, height: 52, borderRadius: RADIUS.full, objectFit: 'cover', border: '2.5px solid rgba(255,255,255,0.7)', cursor: 'pointer', boxShadow: SHADOWS.avatar }}
            />
            <div style={{ position: 'absolute', bottom: 0, right: 0, background: COLORS.primary, borderRadius: RADIUS.full, width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid white' }}>
              <svg width="8" height="8" viewBox="0 0 24 24" fill="white"><path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4z"/><path d="M9 3L7.17 5H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3.17L15 3H9z"/></svg>
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
          </div>
          <div>
            <p style={{ fontFamily: FONT.cairo, fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.75)', margin: 0 }}>
              {lang === 'ar' ? 'مرحباً بك' : 'Welcome back'}
            </p>
            <p style={{ fontFamily: FONT.cairo, fontSize: 20, fontWeight: 800, color: 'white', margin: '2px 0 0' }}>{patientName}</p>
          </div>
        </div>
      </header>

      {/* ── Scrollable Content ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px 16px' }}>

        {/* Quick actions */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }} dir="rtl">
          <button
            onClick={() => setScreen('patient-search')}
            style={{ flex: 1, padding: '16px 12px', background: GRADIENTS.primarySm, border: 'none', borderRadius: RADIUS.lg, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: SHADOWS.btn }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <span style={{ fontFamily: FONT.cairo, fontSize: 15, fontWeight: 700, color: 'white' }}>
              {lang === 'ar' ? 'ابحث عن طبيب' : 'Find a Doctor'}
            </span>
          </button>
          <button
            onClick={() => setScreen('patient-appointments')}
            style={{ flex: 1, padding: '16px 12px', background: COLORS.card, border: `1.5px solid ${COLORS.cardBorder}`, borderRadius: RADIUS.lg, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: SHADOWS.card }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.primary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <span style={{ fontFamily: FONT.cairo, fontSize: 15, fontWeight: 700, color: COLORS.primary }}>
              {lang === 'ar' ? 'مواعيدي' : 'My Appointments'}
            </span>
          </button>
        </div>

        {/* Specialties */}
        <div dir="rtl">
          <p style={{ fontFamily: FONT.cairo, fontSize: 18, fontWeight: 800, color: COLORS.textPrimary, margin: '0 0 14px' }}>
            {lang === 'ar' ? 'التخصصات' : 'Specialties'}
          </p>

          {specLoading ? (
            <p style={{ textAlign: 'center', fontFamily: FONT.cairo, color: COLORS.textMuted, padding: 24 }}>
              {lang === 'ar' ? 'جاري التحميل...' : 'Loading...'}
            </p>
          ) : (
            /* Responsive grid: auto-fill columns min 100px — gives 3 on narrow, 4-5 on wider */
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 10 }}>
              {specialties.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { setSpecialty?.(s.nameAr); setScreen('clinics'); }}
                  style={{
                    background: COLORS.card,
                    border: `1.5px solid ${COLORS.cardBorder}`,
                    borderRadius: RADIUS.lg,
                    padding: '14px 8px 12px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    boxShadow: SHADOWS.card,
                    transition: 'transform 0.18s, box-shadow 0.18s',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = SHADOWS.cardHov; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = SHADOWS.card; }}
                >
                  {/* Color accent top bar */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: s.color, borderRadius: `${RADIUS.lg} ${RADIUS.lg} 0 0` }} />
                  {/* Icon */}
                  <div style={{ width: 44, height: 44, borderRadius: RADIUS.md, background: `${s.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                    {SPECIALTY_ICONS[s.nameAr] ?? '⚕️'}
                  </div>
                  <span style={{ fontFamily: FONT.cairo, fontSize: 12, fontWeight: 700, color: COLORS.textPrimary, textAlign: 'center', lineHeight: 1.3 }}>
                    {lang === 'ar' ? s.nameAr : (s.nameEn ?? s.nameAr)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom Nav ── */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '12px 8px 16px', background: COLORS.navBg, borderTop: `1.5px solid ${COLORS.navBorder}`, boxShadow: SHADOWS.nav, flexShrink: 0 }}>
        {/* Home — active */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 44, height: 44, borderRadius: RADIUS.sm, background: COLORS.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill={COLORS.primary}><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          </div>
          <span style={{ fontFamily: FONT.cairo, fontSize: 11, fontWeight: 700, color: COLORS.primary }}>
            {lang === 'ar' ? 'الرئيسية' : 'Home'}
          </span>
        </div>
        <button onClick={() => setScreen('patient-search')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 44, height: 44, borderRadius: RADIUS.sm, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={COLORS.navInactive} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
          <span style={{ fontFamily: FONT.cairo, fontSize: 11, fontWeight: 600, color: COLORS.navInactive }}>
            {lang === 'ar' ? 'بحث' : 'Search'}
          </span>
        </button>
        <button onClick={() => setScreen('patient-appointments')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 44, height: 44, borderRadius: RADIUS.sm, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={COLORS.navInactive} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <span style={{ fontFamily: FONT.cairo, fontSize: 11, fontWeight: 600, color: COLORS.navInactive }}>
            {lang === 'ar' ? 'المواعيد' : 'Appointments'}
          </span>
        </button>
        <button onClick={() => setScreen('patient-profile')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 44, height: 44, borderRadius: RADIUS.sm, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill={COLORS.navInactive}><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          </div>
          <span style={{ fontFamily: FONT.cairo, fontSize: 11, fontWeight: 600, color: COLORS.navInactive }}>
            {lang === 'ar' ? 'حسابي' : 'Profile'}
          </span>
        </button>
      </nav>
    </div>
  );
}
