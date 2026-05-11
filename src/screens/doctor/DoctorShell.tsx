import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { appointmentService } from '../../services/appointment.service';
import { storageService } from '../../services/storage.service';
import { userService } from '../../services/user.service';
import { formatDate, formatTime } from '../../utils/timestamp.utils';
import { AppointmentStatus } from '../../core/enums';
import { COLORS, GRADIENTS, SHADOWS, RADIUS, FONT } from '../../core/theme';
import { SettingsDropdown } from '../../components/SettingsDropdown';
import type { Screen, PatientInfo } from '../../types';
import type { AppointmentModel } from '../../models/appointment.model';

type Tab = 'home' | 'records' | 'profile';

interface Props {
  setScreen: (s: Screen) => void;
  initialTab?: Tab;
  onSelectPatient: (p: PatientInfo) => void;
}

/* ─── Status badge ─────────────────────────────────────── */
const getStatusMap = (lang: string): Record<AppointmentStatus, { label: string; bg: string; color: string }> => ({
  [AppointmentStatus.Pending]:   { label: lang==='ar' ? 'قيد الانتظار' : 'Pending',   bg: COLORS.warningLight, color: COLORS.warning },
  [AppointmentStatus.Confirmed]: { label: lang==='ar' ? 'مؤكد'          : 'Confirmed', bg: COLORS.successLight,  color: COLORS.success },
  [AppointmentStatus.Completed]: { label: lang==='ar' ? 'مكتمل'         : 'Completed', bg: COLORS.successLight,  color: COLORS.success },
  [AppointmentStatus.Cancelled]: { label: lang==='ar' ? 'ملغي'          : 'Cancelled', bg: COLORS.dangerLight,   color: COLORS.danger  },
  [AppointmentStatus.NoShow]:    { label: lang==='ar' ? 'لم يحضر'       : 'No Show',   bg: '#FEF3C7',            color: '#92400E'      },
});

/* ═══════════════════════════════════════════════════════════
   HOME TAB — today's appointments (real-time)
══════════════════════════════════════════════════════════════ */
function HomeTab({ onSelectPatient, setScreen }: { onSelectPatient: (p: PatientInfo) => void; setScreen: (s: Screen) => void }) {
  const { user } = useAuth();
  const { lang } = useSettings();
  const STATUS_MAP = getStatusMap(lang);
  const [appts, setAppts]   = useState<AppointmentModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const unsub = appointmentService.subscribeToTodayForDoctor(user.id, data => {
      setAppts(data);
      setLoading(false);
    });
    return unsub;
  }, [user]);

  const doctorName = user?.name ?? (lang==='ar' ? 'الطبيب' : 'Doctor');
  const avatarSrc  = user?.imageUrl
    ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(doctorName)}&background=0D9BAB&color=fff&size=120`;

  const handleCard = (a: AppointmentModel) => {
    onSelectPatient({ id: a.patientId, name: a.patientName, phone: a.patientPhone, email: '', num: a.number, imageUrl: a.patientImageUrl ?? undefined, appointmentId: a.id });
  };

  const handleConfirm = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await appointmentService.updateStatus(id, AppointmentStatus.Confirmed);
    setAppts(prev => prev.map(a => a.id === id ? { ...a, status: AppointmentStatus.Confirmed } : a));
  };

  const today = new Date().toLocaleDateString(lang==='ar' ? 'ar-EG' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      {/* Hero welcome */}
      <div style={{ background: GRADIENTS.heroBg, padding: '28px 20px 32px', flexShrink: 0, borderRadius: `0 0 ${RADIUS.xxl} ${RADIUS.xxl}`, boxShadow: SHADOWS.header }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img
              src={avatarSrc} alt={doctorName}
              style={{ width: 56, height: 56, borderRadius: RADIUS.full, objectFit: 'cover', border: '3px solid rgba(255,255,255,0.5)', flexShrink: 0 }}
            />
            <div>
              <p style={{ fontFamily: FONT.cairo, fontSize: 13, color: 'rgba(255,255,255,0.75)', margin: 0 }}>{lang==='ar' ? 'مرحباً' : 'Hello'}</p>
              <h2 style={{ fontFamily: FONT.cairo, fontSize: 20, fontWeight: 800, color: 'white', margin: '2px 0 0' }}>{lang==='ar' ? 'د.' : 'Dr.'} {doctorName}</h2>
            </div>
          </div>
          <SettingsDropdown setScreen={setScreen} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <p style={{ fontFamily: FONT.cairo, fontSize: 12, color: 'rgba(255,255,255,0.65)', margin: 0 }}>{today}</p>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
          {[
            { label: lang==='ar' ? 'مواعيد اليوم'  : "Today's Appts",  value: appts.length },
            { label: lang==='ar' ? 'مكتملة'         : 'Completed',      value: appts.filter(a => a.status === AppointmentStatus.Completed).length },
            { label: lang==='ar' ? 'قيد الانتظار' : 'Pending',         value: appts.filter(a => a.status === AppointmentStatus.Pending || a.status === AppointmentStatus.Confirmed).length },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, background: 'rgba(255,255,255,0.18)', borderRadius: RADIUS.md, padding: '12px 8px', textAlign: 'center', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)' }}>
              <p style={{ fontFamily: FONT.inter, fontSize: 24, fontWeight: 800, color: 'white', margin: 0 }}>{s.value}</p>
              <p style={{ fontFamily: FONT.cairo, fontSize: 11, color: 'rgba(255,255,255,0.8)', margin: '2px 0 0' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Appointments list */}
      <div style={{ flex: 1, padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <p style={{ fontFamily: FONT.cairo, fontSize: 17, fontWeight: 800, color: COLORS.textPrimary, margin: '0 0 4px' }} dir="rtl">
          {lang==='ar' ? 'مواعيد اليوم' : "Today's Appointments"}
        </p>

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 40, flexDirection: 'column', gap: 12 }}>
            <div style={{ width: 36, height: 36, border: `3px solid ${COLORS.primaryLight}`, borderTopColor: COLORS.primary, borderRadius: RADIUS.full, animation: 'spin 0.8s linear infinite' }} />
            <p style={{ fontFamily: FONT.cairo, color: COLORS.textMuted, margin: 0 }}>{lang==='ar' ? 'جاري التحميل...' : 'Loading...'}</p>
          </div>
        )}

        {!loading && appts.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 40, gap: 12 }}>
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={COLORS.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <p style={{ fontFamily: FONT.cairo, color: COLORS.textMuted, fontSize: 15, fontWeight: 600 }}>{lang==='ar' ? 'لا توجد مواعيد اليوم' : 'No appointments today'}</p>
          </div>
        )}

        {!loading && appts.map(a => {
          const badge = STATUS_MAP[a.status] ?? STATUS_MAP[AppointmentStatus.Pending];
          return (
            <button
              key={a.id}
              onClick={() => handleCard(a)}
              style={{
                background: COLORS.card, border: `1.5px solid ${COLORS.cardBorder}`,
                borderRadius: RADIUS.xl, padding: '14px 16px',
                display: 'flex', alignItems: 'center', gap: 14,
                cursor: 'pointer', boxShadow: SHADOWS.card,
                transition: 'transform 0.15s, box-shadow 0.15s', width: '100%', textAlign: 'right',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = SHADOWS.cardHov; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = SHADOWS.card; }}
              dir="rtl"
            >
              <img
                src={a.patientImageUrl ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(a.patientName)}&background=0D9BAB&color=fff&size=80`}
                alt={a.patientName}
                style={{ width: 52, height: 52, borderRadius: RADIUS.full, objectFit: 'cover', flexShrink: 0, border: `2px solid ${COLORS.primaryLight}` }}
              />
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: FONT.cairo, fontSize: 16, fontWeight: 800, color: COLORS.textPrimary, margin: '0 0 3px' }}>{a.patientName}</p>
                <p style={{ fontFamily: FONT.cairo, fontSize: 13, color: COLORS.textMuted, margin: '0 0 6px' }}>{formatTime(a.date, lang==='ar' ? 'ar-EG' : 'en-US')}</p>
                {a.status === AppointmentStatus.Pending ? (
                  <button 
                    onClick={(e) => handleConfirm(e, a.id)}
                    style={{ fontFamily: FONT.cairo, fontSize: 11, fontWeight: 700, color: '#fff', background: COLORS.success, padding: '4px 12px', borderRadius: RADIUS.full, border: 'none', cursor: 'pointer', boxShadow: SHADOWS.btn, zIndex: 2 }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
                  >
                    {lang === 'ar' ? 'تأكيد الحجز' : 'Confirm'}
                  </button>
                ) : (
                  <span style={{ fontFamily: FONT.cairo, fontSize: 11, fontWeight: 700, color: badge.color, background: badge.bg, padding: '3px 10px', borderRadius: RADIUS.full }}>
                    {badge.label}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ background: COLORS.primaryLight, borderRadius: RADIUS.sm, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: FONT.inter, fontSize: 14, fontWeight: 800, color: COLORS.primary }}>#{a.number}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   RECORDS TAB — completed appointments
══════════════════════════════════════════════════════════════ */
function RecordsTab({ onSelectPatient, setScreen }: { onSelectPatient: (p: PatientInfo) => void; setScreen: (s: Screen) => void }) {
  const { user } = useAuth();
  const { lang } = useSettings();
  const [records, setRecords] = useState<AppointmentModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');

  useEffect(() => {
    if (!user) return;
    appointmentService.getByDoctor(user.id).then(appts => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      setRecords(appts.filter(a => {
        if (a.status === AppointmentStatus.Completed || a.status === AppointmentStatus.Cancelled || a.status === AppointmentStatus.NoShow) return true;
        
        const apptDate = a.date?.toDate?.() || new Date(0);
        return apptDate < today;
      }).sort((a, b) => (b.date?.toMillis?.() || 0) - (a.date?.toMillis?.() || 0)));
      setLoading(false);
    });
  }, [user]);

  const filtered = search.trim()
    ? records.filter(r => r.patientName.includes(search))
    : records;

  return (
    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ background: GRADIENTS.heroBg, padding: '24px 20px 28px', flexShrink: 0, borderRadius: `0 0 ${RADIUS.xxl} ${RADIUS.xxl}`, boxShadow: SHADOWS.header }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <div>
            <p style={{ fontFamily: FONT.cairo, fontSize: 13, color: 'rgba(255,255,255,0.75)', margin: 0 }}>{lang==='ar' ? 'الحالات المنتهية' : 'Completed Cases'}</p>
            <h2 style={{ fontFamily: FONT.cairo, fontSize: 22, fontWeight: 800, color: 'white', margin: '2px 0 0' }}>{lang==='ar' ? 'السجل الطبي' : 'Medical Records'}</h2>
          </div>
          <SettingsDropdown setScreen={setScreen} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.18)', borderRadius: RADIUS.lg, padding: '4px 8px 4px 4px', border: '1.5px solid rgba(255,255,255,0.28)' }} dir="rtl">
          <input
            type="text" placeholder={lang==='ar' ? 'ابحث باسم المريض...' : 'Search by patient name...'} value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: FONT.cairo, fontSize: 15, color: 'white', padding: '10px 12px' }}
          />
          <div style={{ width: 38, height: 38, borderRadius: RADIUS.sm, background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: '16px 16px 8px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 40, flexDirection: 'column', gap: 12 }}>
            <div style={{ width: 36, height: 36, border: `3px solid ${COLORS.primaryLight}`, borderTopColor: COLORS.primary, borderRadius: RADIUS.full, animation: 'spin 0.8s linear infinite' }} />
            <p style={{ fontFamily: FONT.cairo, color: COLORS.textMuted, margin: 0 }}>{lang==='ar' ? 'جاري التحميل...' : 'Loading...'}</p>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 40, gap: 12 }}>
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={COLORS.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
            </svg>
            <p style={{ fontFamily: FONT.cairo, color: COLORS.textMuted, fontSize: 15, fontWeight: 600 }}>{lang==='ar' ? 'لا يوجد سجلات' : 'No records found'}</p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <>
            <p style={{ fontFamily: FONT.cairo, fontSize: 13, color: COLORS.textMuted, margin: '0 4px 4px' }} dir="rtl">{filtered.length} {lang==='ar' ? 'حالة مكتملة' : 'completed case(s)'}</p>
            {filtered.map(a => (
              <button
                onClick={() => onSelectPatient({ id: a.patientId, name: a.patientName, phone: a.patientPhone, email: '', num: a.number, imageUrl: a.patientImageUrl ?? undefined, appointmentId: a.id })}
                style={{
                  background: COLORS.card, border: `1.5px solid ${COLORS.cardBorder}`,
                  borderRadius: RADIUS.xl, padding: '14px 16px',
                  display: 'flex', alignItems: 'center', gap: 14,
                  cursor: 'pointer', boxShadow: SHADOWS.card,
                  transition: 'transform 0.15s, box-shadow 0.15s', width: '100%', textAlign: 'right',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = SHADOWS.cardHov; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = SHADOWS.card; }}
                dir="rtl"
              >
                <img
                  src={a.patientImageUrl ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(a.patientName)}&background=0D9BAB&color=fff&size=80`}
                  alt={a.patientName}
                  style={{ width: 52, height: 52, borderRadius: RADIUS.full, objectFit: 'cover', flexShrink: 0, border: `2px solid ${COLORS.primaryLight}` }}
                />
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: FONT.cairo, fontSize: 16, fontWeight: 800, color: COLORS.textPrimary, margin: '0 0 3px' }}>{a.patientName}</p>
                  <p style={{ fontFamily: FONT.cairo, fontSize: 13, color: COLORS.textMuted, margin: 0 }}>{formatDate(a.date, lang==='ar' ? 'ar-EG' : 'en-US')} · {formatTime(a.date, lang==='ar' ? 'ar-EG' : 'en-US')}</p>
                </div>
                <span style={{ fontFamily: FONT.cairo, fontSize: 11, fontWeight: 700, color: COLORS.success, background: COLORS.successLight, padding: '3px 10px', borderRadius: RADIUS.full, flexShrink: 0 }}>
                  {lang==='ar' ? 'مكتمل' : 'Completed'}
                </span>
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PROFILE TAB
══════════════════════════════════════════════════════════════ */
function ProfileTab({ setScreen }: { setScreen: (s: Screen) => void }) {
  const { user, updateUser, logout } = useAuth();
  const { lang } = useSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [modal, setModal]         = useState<'none' | 'viewer' | 'menu'>('none');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const name      = user?.name           ?? '—';
  const specialty = user?.specialty      ?? '—';
  const hospital  = user?.hospital       ?? '—';
  const address   = user?.hospitalAddress ?? '—';
  const phone     = user?.phone          ?? '—';
  const email     = user?.email          ?? '—';
  const rating    = user?.rating         ?? 0;
  const days      = user?.workDays?.join(' — ') ?? '—';
  const avatarSrc = user?.imageUrl
    ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D9BAB&color=fff&size=260`;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    try {
      const url = await storageService.uploadAvatar(user.id, file);
      await userService.update(user.id, { imageUrl: url });
      updateUser({ imageUrl: url });
    } catch { /* silent */ }
    finally { setUploading(false); e.target.value = ''; }
  };

  const handleLogout = async () => {
    await logout();
    setScreen('login');
  };

  const infoRows = [
    { label: lang==='ar' ? 'التخصص'    : 'Specialty',  value: specialty, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill={COLORS.primary}><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/></svg>, bg: COLORS.primaryLight },
    { label: lang==='ar' ? 'المستشفى'  : 'Hospital',   value: hospital,  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, bg: '#EDE9FE' },
    { label: lang==='ar' ? 'العنوان'   : 'Address',    value: address,   icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>, bg: '#FEF3C7' },
    { label: lang==='ar' ? 'أيام العمل' : 'Work Days',  value: days,     icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.success} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>, bg: COLORS.successLight },
    { label: lang==='ar' ? 'الهاتف'    : 'Phone',      value: phone,     icon: <svg width="18" height="18" viewBox="0 0 24 24" fill={COLORS.primary}><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>, bg: COLORS.primaryLight },
    { label: lang==='ar' ? 'البريد'    : 'Email',      value: email,     icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>, bg: COLORS.primaryLight },
  ];

  return (
    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      {/* Fullscreen image viewer */}
      {modal === 'viewer' && (
        <div onClick={() => setModal('none')} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <button onClick={() => setModal('none')} style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: RADIUS.full, width: 44, height: 44, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <img src={avatarSrc} alt={name} onClick={e => e.stopPropagation()} style={{ maxWidth: '90vw', maxHeight: '85vh', borderRadius: RADIUS.lg, objectFit: 'contain', boxShadow: '0 8px 48px rgba(0,0,0,0.6)' }} />
        </div>
      )}

      {/* Photo action sheet */}
      {modal === 'menu' && (
        <div onClick={() => setModal('none')} style={{ position: 'fixed', inset: 0, zIndex: 900, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 480, background: COLORS.card, borderRadius: `${RADIUS.xxl} ${RADIUS.xxl} 0 0`, padding: '28px 24px 40px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ width: 40, height: 5, borderRadius: 99, background: COLORS.cardBorder, margin: '0 auto 8px' }} />
            <p style={{ fontFamily: FONT.cairo, fontSize: 19, fontWeight: 800, color: COLORS.textPrimary, textAlign: 'center', margin: '0 0 4px' }}>{lang==='ar' ? 'الصورة الشخصية' : 'Profile Photo'}</p>
            <button onClick={() => setModal('viewer')} style={{ display: 'flex', alignItems: 'center', gap: 14, background: COLORS.primaryLight, border: `1.5px solid ${COLORS.primary}`, borderRadius: RADIUS.md, padding: '14px 18px', cursor: 'pointer', width: '100%' }}>
              <div style={{ background: COLORS.primary, borderRadius: RADIUS.full, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </div>
              <span style={{ fontFamily: FONT.cairo, fontSize: 17, fontWeight: 700, color: COLORS.primary }}>{lang==='ar' ? 'عرض الصورة' : 'View Photo'}</span>
            </button>
            <button onClick={() => { setModal('none'); fileInputRef.current?.click(); }} style={{ display: 'flex', alignItems: 'center', gap: 14, background: COLORS.card, border: `1.5px solid ${COLORS.cardBorder}`, borderRadius: RADIUS.md, padding: '14px 18px', cursor: 'pointer', width: '100%' }}>
              <div style={{ background: COLORS.textMuted, borderRadius: RADIUS.full, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="19" height="19" viewBox="0 0 24 24" fill="white"><path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4z"/><path d="M9 3L7.17 5H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3.17L15 3H9z"/></svg>
              </div>
              <span style={{ fontFamily: FONT.cairo, fontSize: 17, fontWeight: 700, color: COLORS.textPrimary }}>{lang==='ar' ? 'تغيير الصورة' : 'Change Photo'}</span>
            </button>
            <button onClick={() => setModal('none')} style={{ background: 'transparent', border: 'none', fontFamily: FONT.cairo, fontSize: 16, fontWeight: 600, color: COLORS.textMuted, cursor: 'pointer', padding: '8px' }}>{lang==='ar' ? 'إلغاء' : 'Cancel'}</button>
          </div>
        </div>
      )}

      {/* Logout confirm */}
      {showLogoutConfirm && (
        <div onClick={() => setShowLogoutConfirm(false)} style={{ position: 'fixed', inset: 0, zIndex: 900, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: COLORS.card, borderRadius: RADIUS.xl, padding: '28px 24px', width: '100%', maxWidth: 340, textAlign: 'center' }}>
            <p style={{ fontFamily: FONT.cairo, fontSize: 18, fontWeight: 800, color: COLORS.textPrimary, margin: '0 0 8px' }}>{lang==='ar' ? 'تسجيل الخروج' : 'Logout'}</p>
            <p style={{ fontFamily: FONT.cairo, fontSize: 14, color: COLORS.textMuted, margin: '0 0 24px' }}>{lang==='ar' ? 'هل أنت متأكد من تسجيل الخروج؟' : 'Are you sure you want to logout?'}</p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setShowLogoutConfirm(false)} style={{ flex: 1, padding: '14px', background: COLORS.card, color: COLORS.textPrimary, border: `1.5px solid ${COLORS.cardBorder}`, borderRadius: RADIUS.md, fontFamily: FONT.cairo, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>{lang==='ar' ? 'إلغاء' : 'Cancel'}</button>
              <button onClick={handleLogout} style={{ flex: 1, padding: '14px', background: COLORS.danger, color: 'white', border: 'none', borderRadius: RADIUS.md, fontFamily: FONT.cairo, fontSize: 15, fontWeight: 800, cursor: 'pointer' }}>{lang==='ar' ? 'خروج' : 'Logout'}</button>
            </div>
          </div>
        </div>
      )}

      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />

      {/* Hero */}
      <div style={{ background: GRADIENTS.heroBg, padding: '24px 20px 32px', flexShrink: 0, borderRadius: `0 0 ${RADIUS.xxl} ${RADIUS.xxl}`, boxShadow: SHADOWS.header, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '100%', display: 'flex', justifyContent: lang === 'ar' ? 'flex-end' : 'flex-start', marginBottom: 16 }}>
          <SettingsDropdown setScreen={setScreen} />
        </div>
        <div onClick={() => setModal('menu')} style={{ position: 'relative', width: 100, height: 100, borderRadius: RADIUS.full, cursor: 'pointer', marginBottom: 16 }}>
          <img src={avatarSrc} alt={name} style={{ width: 100, height: 100, borderRadius: RADIUS.full, objectFit: 'cover', border: '3px solid rgba(255,255,255,0.6)' }} />
          {uploading ? (
            <div style={{ position: 'absolute', inset: 0, borderRadius: RADIUS.full, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 28, height: 28, border: '3px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: RADIUS.full, animation: 'spin 0.7s linear infinite' }} />
            </div>
          ) : (
            <div style={{ position: 'absolute', bottom: 2, right: 2, background: COLORS.primary, borderRadius: RADIUS.full, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4z"/><path d="M9 3L7.17 5H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3.17L15 3H9z"/></svg>
            </div>
          )}
        </div>
        <h2 style={{ fontFamily: FONT.cairo, fontSize: 22, fontWeight: 800, color: 'white', margin: '0 0 4px' }}>د. {name}</h2>
        <p style={{ fontFamily: FONT.cairo, fontSize: 14, color: 'rgba(255,255,255,0.8)', margin: '0 0 8px' }}>{specialty}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#FCD34D"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <span style={{ fontFamily: FONT.inter, fontSize: 15, fontWeight: 700, color: '#FCD34D' }}>{rating}</span>
        </div>
      </div>

      {/* Info fields */}
      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 10 }} dir="rtl">
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

        {/* Logout */}
        <button
          onClick={() => setShowLogoutConfirm(true)}
          style={{ width: '100%', background: COLORS.dangerLight, color: COLORS.danger, border: `1.5px solid rgba(239,68,68,0.2)`, borderRadius: RADIUS.xl, padding: '18px', fontFamily: FONT.cairo, fontSize: 17, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 8, transition: 'background 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.background = '#FCA5A5'}
          onMouseLeave={e => e.currentTarget.style.background = COLORS.dangerLight}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.danger} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          {lang==='ar' ? 'تسجيل الخروج' : 'Logout'}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SHELL — persistent nav + tab switching
══════════════════════════════════════════════════════════════ */
const NAV: { tab: Tab; labelAr: string; labelEn: string; icon: (active: boolean) => React.JSX.Element }[] = [
  {
    tab: 'home',
    labelAr: 'الرئيسية', labelEn: 'Home',
    icon: (a) => <svg width="22" height="22" viewBox="0 0 24 24" fill={a ? COLORS.navActive : 'var(--nav-inactive)'}><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>,
  },
  {
    tab: 'records',
    labelAr: 'السجل', labelEn: 'Records',
    icon: (a) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a ? COLORS.navActive : 'var(--nav-inactive)'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  },
  {
    tab: 'profile',
    labelAr: 'حسابي', labelEn: 'Profile',
    icon: (a) => <svg width="22" height="22" viewBox="0 0 24 24" fill={a ? COLORS.navActive : 'var(--nav-inactive)'}><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>,
  },
];

export function DoctorShell({ setScreen, initialTab = 'home', onSelectPatient }: Props) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const { lang } = useSettings();
  useEffect(() => { setTab(initialTab); }, [initialTab]);

  const handleSelectPatient = async (p: PatientInfo) => {
    try {
      const userDoc = await userService.getById(p.id);
      if (userDoc) {
        onSelectPatient({
          id: userDoc.id,
          name: userDoc.name,
          phone: userDoc.phone || p.phone,
          email: userDoc.email || '',
          num: p.num,
          imageUrl: userDoc.imageUrl ?? p.imageUrl ?? undefined,
          appointmentId: p.appointmentId
        });
        return;
      }
    } catch (e) {
      console.error(e);
    }
    onSelectPatient(p);
  };

  return (
    <div style={{ background: COLORS.bg, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Tab content */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {tab === 'home'    && <HomeTab    onSelectPatient={handleSelectPatient} setScreen={setScreen} />}
        {tab === 'records' && <RecordsTab onSelectPatient={handleSelectPatient} setScreen={setScreen} />}
        {tab === 'profile' && <ProfileTab setScreen={setScreen} />}
      </div>

      {/* Bottom nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '10px 8px 16px', background: COLORS.navBg, borderTop: `1.5px solid ${COLORS.navBorder}`, boxShadow: SHADOWS.nav, flexShrink: 0 }} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        {NAV.map(item => {
          const active = tab === item.tab;
          return (
            <button
              key={item.tab}
              onClick={() => setTab(item.tab)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, flex: 1, padding: '4px 0' }}
            >
              <div style={{
                width: 44, height: 36, borderRadius: RADIUS.sm,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: active ? COLORS.primaryLight : 'transparent',
                transition: 'background 0.2s',
              }}>
                {item.icon(active)}
              </div>
              <span style={{ fontFamily: FONT.cairo, fontSize: 11, fontWeight: active ? 800 : 600, color: active ? COLORS.navActive : COLORS.navInactive, transition: 'color 0.2s' }}>
                {lang==='ar' ? item.labelAr : item.labelEn}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
