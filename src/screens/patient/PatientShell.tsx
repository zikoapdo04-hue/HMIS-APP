import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { useSpecialties } from '../../hooks/use-specialties';
import { storageService } from '../../services/storage.service';
import { userService } from '../../services/user.service';
import { appointmentService } from '../../services/appointment.service';
import { medicalRecordService } from '../../services/medical-record.service';
import { formatDate, formatTime } from '../../utils/timestamp.utils';
import { AppointmentStatus } from '../../core/enums';
import { HMISGlobe, HMISShieldLogo } from '../../components/Icons';
import { SettingsDropdown } from '../../components/SettingsDropdown';
import { COLORS, GRADIENTS, SHADOWS, RADIUS, FONT } from '../../core/theme';
import type { AppointmentModel } from '../../models/appointment.model';
import type { MedicalRecordDoc } from '../../firebase/types/models';
import type { UserModel } from '../../models/user.model';
import type { Screen } from '../../types';
import type { DoctorInfo } from './DoctorDetail';

type Tab = 'home' | 'search' | 'appointments' | 'profile'

interface Props {
  setScreen: (s: Screen) => void
  initialTab?: Tab
  setSpecialty: (s: string) => void
  onSelectDoctor: (d: DoctorInfo) => void
}

const SPECIALTY_ICONS: Record<string, string> = {
  'القلب': '❤️', 'المخ والأعصاب': '🧠', 'العظام': '🦴', 'الأطفال': '👶',
  'الجلدية': '🧬', 'النساء والتوليد': '🌸', 'العيون': '👁️', 'الأنف والأذن': '👂',
  'المسالك البولية': '💊', 'الجهاز الهضمي': '🫀', 'الطب النفسي': '🧘',
  'الغدد الصماء': '⚕️', 'الصدر والرئة': '🫁', 'الروماتيزم': '🦵',
  'الكلى': '🫘', 'الأورام': '🔬', 'الطب العام': '🩺', 'الطوارئ': '🚑',
}

const STATUS_MAP: Record<string, { label: string; bg: string; color: string }> = {
  [AppointmentStatus.Pending]:   { label: 'في الانتظار', bg: '#FEF3C7', color: '#92400E' },
  [AppointmentStatus.Confirmed]: { label: 'مؤكد',        bg: '#D1FAE5', color: '#065F46' },
}

// ─── NAV DEFINITION ──────────────────────────────────────────────────────────
const NAV: { tab: Tab; labelAr: string; labelEn: string; icon: (c: string, filled?: boolean) => React.JSX.Element }[] = [
  {
    tab: 'profile', labelAr: 'حسابي', labelEn: 'Profile',
    icon: (c) => <svg width="22" height="22" viewBox="0 0 24 24" fill={c}><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>,
  },
  {
    tab: 'appointments', labelAr: 'المواعيد', labelEn: 'Appointments',
    icon: (c) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  },
  {
    tab: 'search', labelAr: 'بحث', labelEn: 'Search',
    icon: (c) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  },
  {
    tab: 'home', labelAr: 'الرئيسية', labelEn: 'Home',
    icon: (c) => <svg width="22" height="22" viewBox="0 0 24 24" fill={c}><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>,
  },
]

// ─── SUB-SCREENS (content only, no nav) ──────────────────────────────────────

function HomeTab({ setScreen, setSpecialty }: { setScreen: (s: Screen) => void; setSpecialty: (s: string) => void }) {
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
    <>
      <header style={{ background: GRADIENTS.heroBg, padding: '20px 20px 28px', flexShrink: 0, boxShadow: SHADOWS.header, borderRadius: `0 0 ${RADIUS.xxl} ${RADIUS.xxl}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <SettingsDropdown setScreen={setScreen} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <HMISGlobe size={32} color="white" />
            <span style={{ fontFamily: FONT.inter, fontSize: 22, fontWeight: 800, color: 'white', letterSpacing: 2 }}>HMIS</span>
            <HMISShieldLogo size={24} color="white" />
          </div>
          <button onClick={() => setScreen('notifications')} style={{ background: 'rgba(255,255,255,0.18)', border: 'none', borderRadius: RADIUS.sm, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }} dir="rtl">
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <img src={avatarSrc} alt={patientName} onClick={() => fileRef.current?.click()} style={{ width: 52, height: 52, borderRadius: RADIUS.full, objectFit: 'cover', border: '2.5px solid rgba(255,255,255,0.7)', cursor: 'pointer', boxShadow: SHADOWS.avatar }} />
            <div style={{ position: 'absolute', bottom: 0, right: 0, background: COLORS.primary, borderRadius: RADIUS.full, width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid white' }}>
              <svg width="8" height="8" viewBox="0 0 24 24" fill="white"><path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4z"/><path d="M9 3L7.17 5H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3.17L15 3H9z"/></svg>
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
          </div>
          <div>
            <p style={{ fontFamily: FONT.cairo, fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.75)', margin: 0 }}>{lang === 'ar' ? 'مرحباً بك' : 'Welcome back'}</p>
            <p style={{ fontFamily: FONT.cairo, fontSize: 20, fontWeight: 800, color: 'white', margin: '2px 0 0' }}>{patientName}</p>
          </div>
        </div>
      </header>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 12px 8px' }}>
        {/* Quick actions */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }} dir="rtl">
          <button onClick={() => setScreen('patient-search')} style={{ flex: 1, padding: '14px 10px', background: GRADIENTS.primarySm, border: 'none', borderRadius: RADIUS.lg, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: SHADOWS.btn }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <span style={{ fontFamily: FONT.cairo, fontSize: 14, fontWeight: 700, color: 'white' }}>{lang === 'ar' ? 'ابحث عن طبيب' : 'Find a Doctor'}</span>
          </button>
          <button onClick={() => setScreen('patient-appointments')} style={{ flex: 1, padding: '14px 10px', background: COLORS.card, border: `1.5px solid ${COLORS.cardBorder}`, borderRadius: RADIUS.lg, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: SHADOWS.card }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.primary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <span style={{ fontFamily: FONT.cairo, fontSize: 14, fontWeight: 700, color: COLORS.primary }}>{lang === 'ar' ? 'مواعيدي' : 'My Appointments'}</span>
          </button>
        </div>

        {/* Specialties */}
        <div dir="rtl">
          <p style={{ fontFamily: FONT.cairo, fontSize: 16, fontWeight: 800, color: COLORS.textPrimary, margin: '0 0 12px' }}>{lang === 'ar' ? 'التخصصات' : 'Specialties'}</p>
          {specLoading ? (
            <p style={{ textAlign: 'center', fontFamily: FONT.cairo, color: COLORS.textMuted, padding: 24 }}>{lang === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))', gap: 8 }}>
              {specialties.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { setSpecialty(s.nameAr); setScreen('clinics'); }}
                  style={{ background: COLORS.card, border: `1.5px solid ${COLORS.cardBorder}`, borderRadius: RADIUS.md, padding: '12px 6px 10px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, boxShadow: SHADOWS.card, transition: 'transform 0.18s, box-shadow 0.18s', position: 'relative', overflow: 'hidden' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = SHADOWS.cardHov; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = SHADOWS.card; }}
                >
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: s.color, borderRadius: `${RADIUS.md} ${RADIUS.md} 0 0` }} />
                  <div style={{ width: 38, height: 38, borderRadius: RADIUS.sm, background: `${s.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                    {SPECIALTY_ICONS[s.nameAr] ?? '⚕️'}
                  </div>
                  <span style={{ fontFamily: FONT.cairo, fontSize: 11, fontWeight: 700, color: COLORS.textPrimary, textAlign: 'center', lineHeight: 1.3 }}>
                    {lang === 'ar' ? s.nameAr : (s.nameEn ?? s.nameAr)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function SearchTab({ onSelectDoctor }: { onSelectDoctor: (d: DoctorInfo) => void }) {
  const { lang } = useSettings();
  const [query, setQuery]     = useState('');
  const [allDocs, setAll]     = useState<UserModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userService.getApprovedDoctors().then(docs => { setAll(docs); setLoading(false); });
  }, []);

  const results = query.trim()
    ? allDocs.filter(d => d.name.includes(query) || (d.specialty ?? '').includes(query))
    : allDocs;

  const handleSelect = (d: UserModel) => {
    onSelectDoctor({ uid: d.id, name: d.name, specialty: d.specialty ?? '', rating: d.rating ?? 0, phone: d.phone, address: d.hospitalAddress ?? '', avatar: d.imageUrl ?? undefined });
  };

  return (
    <>
      <header style={{ background: GRADIENTS.heroBg, padding: '20px 20px 20px', flexShrink: 0, boxShadow: SHADOWS.header, borderRadius: `0 0 ${RADIUS.xxl} ${RADIUS.xxl}` }}>
        <p style={{ fontFamily: FONT.cairo, fontSize: 12, color: 'rgba(255,255,255,0.75)', margin: '0 0 2px', textAlign: 'right' }}>{lang === 'ar' ? 'اعثر على طبيبك' : 'Find your doctor'}</p>
        <h2 style={{ fontFamily: FONT.cairo, fontSize: 22, fontWeight: 800, color: 'white', margin: '0 0 14px', textAlign: 'right' }}>{lang === 'ar' ? 'ابحث عن طبيب' : 'Search Doctors'}</h2>
        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.18)', borderRadius: RADIUS.lg, padding: '4px 8px 4px 4px', border: '1.5px solid rgba(255,255,255,0.28)' }} dir="rtl">
          <input type="text" placeholder={lang === 'ar' ? 'اسم الطبيب أو التخصص...' : 'Doctor name or specialty...'} value={query} onChange={e => setQuery(e.target.value)}
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: FONT.cairo, fontSize: 15, color: 'white', padding: '10px 12px' }} />
          <div style={{ width: 36, height: 36, borderRadius: RADIUS.sm, background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
        </div>
      </header>

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 12px 8px' }}>
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 60, gap: 12 }}>
            <div style={{ width: 36, height: 36, border: `3px solid ${COLORS.primaryLight}`, borderTopColor: COLORS.primary, borderRadius: RADIUS.full, animation: 'spin 0.8s linear infinite' }} />
            <p style={{ fontFamily: FONT.cairo, color: COLORS.textMuted }}>{lang === 'ar' ? 'جاري البحث...' : 'Searching...'}</p>
          </div>
        )}
        {!loading && results.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 60, gap: 12 }}>
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={COLORS.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <p style={{ fontFamily: FONT.cairo, color: COLORS.textMuted, fontSize: 15, fontWeight: 600 }}>{lang === 'ar' ? 'لا توجد نتائج' : 'No results found'}</p>
          </div>
        )}
        {!loading && results.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }} dir="rtl">
            <p style={{ fontFamily: FONT.cairo, fontSize: 12, color: COLORS.textMuted, margin: '0 4px 4px' }}>{results.length} {lang === 'ar' ? 'طبيب متاح' : 'doctors available'}</p>
            {results.map(dr => (
              <button key={dr.id} onClick={() => handleSelect(dr)}
                style={{ background: COLORS.card, border: `1.5px solid ${COLORS.cardBorder}`, borderRadius: RADIUS.xl, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', boxShadow: SHADOWS.card, transition: 'transform 0.18s, box-shadow 0.18s', width: '100%', textAlign: 'right' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = SHADOWS.cardHov; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = SHADOWS.card; }}>
                <img src={dr.imageUrl ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(dr.name)}&background=0D9BAB&color=fff&size=100`} alt={dr.name}
                  style={{ width: 54, height: 54, borderRadius: RADIUS.full, objectFit: 'cover', flexShrink: 0, border: `2px solid ${COLORS.primaryLight}` }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: FONT.cairo, fontSize: 15, fontWeight: 800, color: COLORS.textPrimary, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{dr.name}</p>
                  <p style={{ fontFamily: FONT.cairo, fontSize: 12, fontWeight: 600, color: COLORS.primary, margin: '0 0 4px' }}>{dr.specialty}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill={COLORS.star}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      <span style={{ fontFamily: FONT.inter, fontSize: 12, fontWeight: 700, color: COLORS.textSec }}>{dr.rating ?? '—'}</span>
                    </div>
                    <span style={{ fontFamily: FONT.inter, fontSize: 11, color: COLORS.textMuted }} dir="ltr">{dr.phone}</span>
                  </div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={COLORS.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function AppointmentsTab({ setScreen }: { setScreen: (s: Screen) => void }) {
  const { user } = useAuth();
  const { lang } = useSettings();
  const [appointments, setAppointments] = useState<AppointmentModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const unsub = appointmentService.subscribeByPatient(user.id, appts => {
      setAppointments(appts.filter(a => a.status === AppointmentStatus.Pending || a.status === AppointmentStatus.Confirmed));
      setLoading(false);
    });
    return unsub;
  }, [user]);

  return (
    <>
      <header style={{ background: GRADIENTS.heroBg, padding: '20px 20px 24px', flexShrink: 0, boxShadow: SHADOWS.header, borderRadius: `0 0 ${RADIUS.xxl} ${RADIUS.xxl}` }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: FONT.cairo, fontSize: 12, color: 'rgba(255,255,255,0.7)', margin: '0 0 2px' }}>{lang === 'ar' ? 'قائمة الحجوزات' : 'Your bookings'}</p>
          <h2 style={{ fontFamily: FONT.cairo, fontSize: 22, fontWeight: 800, color: 'white', margin: 0 }}>{lang === 'ar' ? 'مواعيدي' : 'My Appointments'}</h2>
        </div>
        {!loading && (
          <div style={{ textAlign: 'center', marginTop: 10 }}>
            <span style={{ fontFamily: FONT.cairo, fontSize: 13, color: 'rgba(255,255,255,0.85)', background: 'rgba(255,255,255,0.15)', padding: '4px 16px', borderRadius: RADIUS.pill, fontWeight: 600 }}>
              {appointments.length} {lang === 'ar' ? 'حجز نشط' : 'active bookings'}
            </span>
          </div>
        )}
      </header>

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 12px 8px' }}>
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 60, gap: 12 }}>
            <div style={{ width: 36, height: 36, border: `3px solid ${COLORS.primaryLight}`, borderTopColor: COLORS.primary, borderRadius: RADIUS.full, animation: 'spin 0.8s linear infinite' }} />
            <p style={{ fontFamily: FONT.cairo, color: COLORS.textMuted }}>{lang === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
          </div>
        )}
        {!loading && appointments.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 60, gap: 14 }}>
            <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke={COLORS.primaryLight} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <p style={{ fontFamily: FONT.cairo, fontSize: 16, fontWeight: 700, color: COLORS.textMuted }}>{lang === 'ar' ? 'لا توجد حجوزات نشطة' : 'No active appointments'}</p>
            <button onClick={() => setScreen('patient-search')} style={{ background: GRADIENTS.primarySm, color: 'white', border: 'none', borderRadius: RADIUS.pill, padding: '12px 28px', fontFamily: FONT.cairo, fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: SHADOWS.btn }}>
              {lang === 'ar' ? 'احجز موعد الآن' : 'Book Now'}
            </button>
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} dir="rtl">
          {appointments.map(appt => {
            const st = STATUS_MAP[appt.status] ?? STATUS_MAP[AppointmentStatus.Pending];
            return (
              <div key={appt.id} style={{ background: COLORS.card, border: `1.5px solid ${COLORS.cardBorder}`, borderRadius: RADIUS.xl, padding: '14px 14px', boxShadow: SHADOWS.card }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <img src={appt.doctorImageUrl ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(appt.doctorName)}&background=0D9BAB&color=fff&size=100`} alt={appt.doctorName}
                    style={{ width: 48, height: 48, borderRadius: RADIUS.full, objectFit: 'cover', flexShrink: 0, border: `2px solid ${COLORS.primaryLight}` }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: FONT.cairo, fontSize: 15, fontWeight: 800, color: COLORS.textPrimary, margin: '0 0 1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{appt.doctorName}</p>
                    <p style={{ fontFamily: FONT.cairo, fontSize: 12, color: COLORS.primary, fontWeight: 600, margin: 0 }}>{appt.doctorSpecialty}</p>
                  </div>
                  <span style={{ fontFamily: FONT.cairo, fontSize: 11, fontWeight: 700, background: st.bg, color: st.color, borderRadius: RADIUS.pill, padding: '3px 8px', flexShrink: 0 }}>{st.label}</span>
                </div>
                <div style={{ height: 1, background: COLORS.cardBorder, margin: '0 0 12px' }} />
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={COLORS.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    <span style={{ fontFamily: FONT.inter, fontSize: 12, fontWeight: 700, color: COLORS.textSec }}>{formatDate(appt.date)}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={COLORS.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    <span style={{ fontFamily: FONT.inter, fontSize: 12, fontWeight: 700, color: COLORS.textSec }}>{formatTime(appt.date)}</span>
                  </div>
                  {appt.address && appt.address !== '—' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={COLORS.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      <span style={{ fontFamily: FONT.cairo, fontSize: 12, fontWeight: 600, color: COLORS.textSec }}>{appt.address}</span>
                    </div>
                  )}
                </div>
                <button onClick={() => appointmentService.cancelAppointment(appt.id)}
                  style={{ width: '100%', background: COLORS.dangerLight, color: COLORS.danger, border: 'none', borderRadius: RADIUS.md, padding: '10px', fontFamily: FONT.cairo, fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#FCA5A5'}
                  onMouseLeave={e => e.currentTarget.style.background = COLORS.dangerLight}>
                  {lang === 'ar' ? 'إلغاء الحجز' : 'Cancel'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

function ProfileTab({ setScreen }: { setScreen: (s: Screen) => void }) {
  const { user } = useAuth();
  const { lang } = useSettings();
  const [appointments, setAppointments] = useState<AppointmentModel[]>([]);
  const [records, setRecords]           = useState<MedicalRecordDoc[]>([]);
  const [loading, setLoading]           = useState(true);
  const [tab, setTab]                   = useState<'appointments' | 'records'>('appointments');

  const patientName = user?.name ?? (lang === 'ar' ? 'مريض' : 'Patient');
  const avatarUrl   = user?.imageUrl ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(patientName)}&background=0D9BAB&color=fff&size=128`;

  useEffect(() => {
    if (!user) return;
    Promise.all([
      appointmentService.getByPatient(user.id),
      medicalRecordService.getByPatient(user.id),
    ]).then(([appts, recs]) => { setAppointments(appts); setRecords(recs); setLoading(false); });
  }, [user]);

  return (
    <>
      <header style={{ background: GRADIENTS.heroBg, padding: '20px 20px 24px', flexShrink: 0, boxShadow: SHADOWS.header, borderRadius: `0 0 ${RADIUS.xxl} ${RADIUS.xxl}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <button onClick={() => setScreen('patient-settings')} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: RADIUS.sm, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96a6.96 6.96 0 0 0-1.62-.94l-.36-2.54A.484.484 0 0 0 14 2h-4a.484.484 0 0 0-.48.41l-.36 2.54a6.96 6.96 0 0 0-1.62.94l-2.39-.96a.48.48 0 0 0-.59.22L2.64 8.47a.48.48 0 0 0 .12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.36 1.05.66 1.62.94l.36 2.54c.05.24.27.41.48.41h4c.24 0 .44-.17.47-.41l.36-2.54a6.96 6.96 0 0 0 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.49.49 0 0 0-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>
          </button>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: FONT.cairo, fontSize: 12, color: 'rgba(255,255,255,0.7)', margin: 0 }}>{lang === 'ar' ? 'الحساب الشخصي' : 'My Account'}</p>
            <h2 style={{ fontFamily: FONT.cairo, fontSize: 22, fontWeight: 800, color: 'white', margin: 0 }}>{lang === 'ar' ? 'ملفي الطبي' : 'Medical File'}</h2>
          </div>
          <div style={{ width: 40 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.15)', borderRadius: RADIUS.lg, padding: '12px 14px' }} dir="rtl">
          <img src={avatarUrl} alt={patientName} style={{ width: 50, height: 50, borderRadius: RADIUS.full, objectFit: 'cover', border: '2.5px solid rgba(255,255,255,0.7)', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: FONT.cairo, fontSize: 16, fontWeight: 800, color: 'white', margin: '0 0 1px' }}>{patientName}</p>
            <p style={{ fontFamily: FONT.cairo, fontSize: 12, color: 'rgba(255,255,255,0.75)', margin: 0 }}>{user?.phone ?? ''}</p>
          </div>
          <button onClick={() => setScreen('patient-account-settings')} style={{ background: 'rgba(255,255,255,0.25)', border: 'none', borderRadius: RADIUS.sm, padding: '7px 12px', fontFamily: FONT.cairo, fontSize: 12, fontWeight: 700, color: 'white', cursor: 'pointer', flexShrink: 0 }}>
            {lang === 'ar' ? 'تعديل' : 'Edit'}
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div style={{ display: 'flex', margin: '12px 12px 0', background: COLORS.inputBg, borderRadius: RADIUS.md, padding: 4 }}>
        {(['appointments', 'records'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: '9px', border: 'none', borderRadius: RADIUS.sm, cursor: 'pointer', fontFamily: FONT.cairo, fontSize: 13, fontWeight: 700, transition: 'all 0.2s', background: tab === t ? COLORS.primary : 'transparent', color: tab === t ? 'white' : COLORS.textSec, boxShadow: tab === t ? SHADOWS.btn : 'none' }}>
            {t === 'appointments' ? `${lang === 'ar' ? 'المواعيد' : 'Appointments'} (${appointments.length})` : `${lang === 'ar' ? 'السجلات' : 'Records'} (${records.length})`}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 60, gap: 12 }}>
            <div style={{ width: 36, height: 36, border: `3px solid ${COLORS.primaryLight}`, borderTopColor: COLORS.primary, borderRadius: RADIUS.full, animation: 'spin 0.8s linear infinite' }} />
          </div>
        )}

        {!loading && tab === 'appointments' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }} dir="rtl">
            {appointments.length === 0 && <p style={{ textAlign: 'center', fontFamily: FONT.cairo, color: COLORS.textMuted, paddingTop: 40 }}>{lang === 'ar' ? 'لا يوجد مواعيد' : 'No appointments'}</p>}
            {appointments.map(apt => (
              <div key={apt.id} style={{ background: COLORS.card, border: `1.5px solid ${COLORS.cardBorder}`, borderRadius: RADIUS.xl, padding: '14px', boxShadow: SHADOWS.card }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <img src={apt.doctorImageUrl ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(apt.doctorName)}&background=0D9BAB&color=fff&size=100`} alt={apt.doctorName}
                    style={{ width: 46, height: 46, borderRadius: RADIUS.full, objectFit: 'cover', flexShrink: 0, border: `2px solid ${COLORS.primaryLight}` }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: FONT.cairo, fontSize: 14, fontWeight: 800, color: COLORS.textPrimary, margin: '0 0 1px' }}>{apt.doctorName}</p>
                    <p style={{ fontFamily: FONT.cairo, fontSize: 12, fontWeight: 600, color: COLORS.primary, margin: '0 0 2px' }}>{apt.doctorSpecialty}</p>
                    <p style={{ fontFamily: FONT.inter, fontSize: 11, color: COLORS.textMuted, margin: 0 }}>{formatDate(apt.date)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && tab === 'records' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }} dir="rtl">
            {records.length === 0 && <p style={{ textAlign: 'center', fontFamily: FONT.cairo, color: COLORS.textMuted, paddingTop: 40 }}>{lang === 'ar' ? 'لا يوجد سجلات طبية' : 'No medical records'}</p>}
            {records.map(rec => (
              <div key={rec.id} style={{ background: COLORS.card, border: `1.5px solid ${COLORS.cardBorder}`, borderRadius: RADIUS.xl, padding: '14px', boxShadow: SHADOWS.card }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(rec.doctorName)}&background=0D9BAB&color=fff&size=100`} alt={rec.doctorName}
                    style={{ width: 44, height: 44, borderRadius: RADIUS.full, objectFit: 'cover', flexShrink: 0, border: `2px solid ${COLORS.primaryLight}` }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: FONT.cairo, fontSize: 14, fontWeight: 800, color: COLORS.textPrimary, margin: '0 0 1px' }}>{rec.doctorName}</p>
                    <p style={{ fontFamily: FONT.cairo, fontSize: 12, fontWeight: 600, color: COLORS.primary, margin: '0 0 2px' }}>{rec.specialty}</p>
                    <p style={{ fontFamily: FONT.inter, fontSize: 11, color: COLORS.textMuted, margin: 0 }}>{formatDate(rec.date)}</p>
                  </div>
                </div>
                <div style={{ height: 1, background: COLORS.cardBorder, margin: '0 0 10px' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {rec.diagnosis && <div style={{ display: 'flex', gap: 6 }}><span style={{ fontFamily: FONT.cairo, fontSize: 12, fontWeight: 700, color: COLORS.textSec, flexShrink: 0 }}>{lang === 'ar' ? 'التشخيص:' : 'Diagnosis:'}</span><span style={{ fontFamily: FONT.cairo, fontSize: 12, color: COLORS.textPrimary }}>{rec.diagnosis}</span></div>}
                  {rec.medications?.length > 0 && <div style={{ display: 'flex', gap: 6 }}><span style={{ fontFamily: FONT.cairo, fontSize: 12, fontWeight: 700, color: COLORS.textSec, flexShrink: 0 }}>{lang === 'ar' ? 'الأدوية:' : 'Meds:'}</span><span style={{ fontFamily: FONT.cairo, fontSize: 12, color: COLORS.textPrimary }}>{rec.medications.join(' — ')}</span></div>}
                </div>
                {rec.xrayUrl && <div style={{ marginTop: 10, borderRadius: RADIUS.md, overflow: 'hidden' }}><img src={rec.xrayUrl} alt="X-Ray" style={{ width: '100%', display: 'block', maxHeight: 180, objectFit: 'cover' }} /></div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// ─── SHELL ────────────────────────────────────────────────────────────────────
export function PatientShell({ setScreen, initialTab = 'home', setSpecialty, onSelectDoctor }: Props) {
  const { lang } = useSettings();
  const [tab, setTab] = useState<Tab>(initialTab);

  // sync when App.tsx changes initialTab (e.g. deep-link from other screen)
  useEffect(() => { setTab(initialTab); }, [initialTab]);

  const handleSelectDoctor = (d: DoctorInfo) => {
    onSelectDoctor(d);
    setScreen('doctor-detail');
  };

  const renderContent = () => {
    switch (tab) {
      case 'home':         return <HomeTab setScreen={setScreen} setSpecialty={setSpecialty} />;
      case 'search':       return <SearchTab onSelectDoctor={handleSelectDoctor} />;
      case 'appointments': return <AppointmentsTab setScreen={setScreen} />;
      case 'profile':      return <ProfileTab setScreen={setScreen} />;
    }
  };

  return (
    <div style={{ background: COLORS.bg, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Content area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
        {renderContent()}
      </div>

      {/* ── Persistent Bottom Nav ── */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '10px 8px 14px', background: COLORS.navBg, borderTop: `1.5px solid ${COLORS.navBorder}`, boxShadow: SHADOWS.nav, flexShrink: 0 }}>
        {NAV.map(item => {
          const active = tab === item.tab;
          const color  = active ? COLORS.primary : COLORS.navInactive;
          return (
            <button
              key={item.tab}
              onClick={() => setTab(item.tab)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '0 4px' }}
            >
              <div style={{ width: 44, height: 36, borderRadius: active ? RADIUS.pill : RADIUS.sm, background: active ? COLORS.primaryLight : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
                {item.icon(color)}
              </div>
              <span style={{ fontFamily: FONT.cairo, fontSize: 11, fontWeight: active ? 700 : 600, color, transition: 'color 0.2s' }}>
                {lang === 'ar' ? item.labelAr : item.labelEn}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
