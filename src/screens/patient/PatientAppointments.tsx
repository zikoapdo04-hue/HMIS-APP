import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { appointmentService } from '../../services/appointment.service';
import { formatDate, formatTime } from '../../utils/timestamp.utils';
import { AppointmentStatus } from '../../core/enums';
import { COLORS, GRADIENTS, SHADOWS, RADIUS, FONT } from '../../core/theme';
import type { AppointmentModel } from '../../models/appointment.model';
import type { Screen } from '../../types';

interface Props { setScreen: (s: Screen) => void }

const STATUS_MAP: Record<string, { label: string; bg: string; color: string }> = {
  [AppointmentStatus.Pending]:   { label: 'في الانتظار', bg: '#FEF3C7', color: '#92400E' },
  [AppointmentStatus.Confirmed]: { label: 'مؤكد',        bg: '#D1FAE5', color: '#065F46' },
}

export function PatientAppointments({ setScreen }: Props) {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<AppointmentModel[]>([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    if (!user) return;
    const unsub = appointmentService.subscribeByPatient(user.id, appts => {
      setAppointments(appts.filter(a => a.status === AppointmentStatus.Pending || a.status === AppointmentStatus.Confirmed));
      setLoading(false);
    });
    return unsub;
  }, [user]);

  const cancel = async (id: string) => {
    await appointmentService.cancelAppointment(id);
  };

  return (
    <div style={{ background: COLORS.bg, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Header */}
      <header style={{ background: GRADIENTS.heroBg, padding: '20px 20px 28px', flexShrink: 0, boxShadow: SHADOWS.header, borderRadius: `0 0 ${RADIUS.xxl} ${RADIUS.xxl}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <button onClick={() => setScreen('patient-home')} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: RADIUS.sm, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: FONT.cairo, fontSize: 12, color: 'rgba(255,255,255,0.7)', margin: 0 }}>قائمة الحجوزات</p>
            <h2 style={{ fontFamily: FONT.cairo, fontSize: 22, fontWeight: 800, color: 'white', margin: 0 }}>مواعيدي</h2>
          </div>
          <div style={{ width: 40 }} />
        </div>
        {/* Count badge */}
        {!loading && (
          <div style={{ textAlign: 'center', marginTop: 8 }}>
            <span style={{ fontFamily: FONT.cairo, fontSize: 13, color: 'rgba(255,255,255,0.8)', background: 'rgba(255,255,255,0.15)', padding: '4px 16px', borderRadius: RADIUS.pill, fontWeight: 600 }}>
              {appointments.length} حجز نشط
            </span>
          </div>
        )}
      </header>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 8px' }}>
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 60, gap: 12 }}>
            <div style={{ width: 40, height: 40, border: `3px solid ${COLORS.primaryLight}`, borderTopColor: COLORS.primary, borderRadius: RADIUS.full, animation: 'spin 0.8s linear infinite' }} />
            <p style={{ fontFamily: FONT.cairo, color: COLORS.textMuted }}>جاري التحميل...</p>
          </div>
        )}

        {!loading && appointments.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 60, gap: 16 }}>
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke={COLORS.primaryLight} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <p style={{ fontFamily: FONT.cairo, fontSize: 17, fontWeight: 700, color: COLORS.textMuted }}>لا توجد حجوزات نشطة</p>
            <button
              onClick={() => setScreen('patient-search')}
              style={{ background: GRADIENTS.primarySm, color: 'white', border: 'none', borderRadius: RADIUS.pill, padding: '12px 28px', fontFamily: FONT.cairo, fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: SHADOWS.btn }}
            >
              احجز موعد الآن
            </button>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }} dir="rtl">
          {appointments.map(appt => {
            const st = STATUS_MAP[appt.status] ?? STATUS_MAP[AppointmentStatus.Pending];
            return (
              <div key={appt.id} style={{ background: COLORS.card, border: `1.5px solid ${COLORS.cardBorder}`, borderRadius: RADIUS.xl, padding: '18px 16px', boxShadow: SHADOWS.card }}>
                {/* Doctor row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <img
                    src={appt.doctorImageUrl ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(appt.doctorName)}&background=0D9BAB&color=fff&size=100`}
                    alt={appt.doctorName}
                    style={{ width: 52, height: 52, borderRadius: RADIUS.full, objectFit: 'cover', flexShrink: 0, border: `2px solid ${COLORS.primaryLight}` }}
                  />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: FONT.cairo, fontSize: 16, fontWeight: 800, color: COLORS.textPrimary, margin: '0 0 2px' }}>{appt.doctorName}</p>
                    <p style={{ fontFamily: FONT.cairo, fontSize: 13, color: COLORS.primary, fontWeight: 600, margin: 0 }}>{appt.doctorSpecialty}</p>
                  </div>
                  <span style={{ fontFamily: FONT.cairo, fontSize: 12, fontWeight: 700, background: st.bg, color: st.color, borderRadius: RADIUS.pill, padding: '3px 10px' }}>{st.label}</span>
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: COLORS.cardBorder, margin: '0 0 14px' }} />

                {/* Details */}
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={COLORS.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    <span style={{ fontFamily: FONT.inter, fontSize: 13, fontWeight: 700, color: COLORS.textSec }}>{formatDate(appt.date)}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={COLORS.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    <span style={{ fontFamily: FONT.inter, fontSize: 13, fontWeight: 700, color: COLORS.textSec }}>{formatTime(appt.date)}</span>
                  </div>
                  {appt.address && appt.address !== '—' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={COLORS.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      <span style={{ fontFamily: FONT.cairo, fontSize: 13, fontWeight: 600, color: COLORS.textSec }}>{appt.address}</span>
                    </div>
                  )}
                </div>

                {/* Cancel */}
                <button
                  onClick={() => cancel(appt.id)}
                  style={{ width: '100%', background: COLORS.dangerLight, color: COLORS.danger, border: 'none', borderRadius: RADIUS.md, padding: '12px', fontFamily: FONT.cairo, fontSize: 15, fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#FCA5A5'}
                  onMouseLeave={e => e.currentTarget.style.background = COLORS.dangerLight}
                >
                  إلغاء الحجز
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '12px 8px 16px', background: COLORS.navBg, borderTop: `1.5px solid ${COLORS.navBorder}`, boxShadow: SHADOWS.nav, flexShrink: 0 }}>
        {[
          { key: 'patient-profile',      label: 'حسابي',    active: false, icon: (c: string) => <svg width="22" height="22" viewBox="0 0 24 24" fill={c}><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg> },
          { key: 'appointments',         label: 'المواعيد',  active: true,  icon: (c: string) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
          { key: 'patient-search',       label: 'بحث',       active: false, icon: (c: string) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> },
          { key: 'patient-home',         label: 'الرئيسية',  active: false, icon: (c: string) => <svg width="22" height="22" viewBox="0 0 24 24" fill={c}><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg> },
        ].map(item => {
          const color = item.active ? COLORS.primary : COLORS.navInactive;
          return (
            <button key={item.key} onClick={() => !item.active && setScreen(item.key as Screen)} style={{ background: 'none', border: 'none', cursor: item.active ? 'default' : 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 44, height: 44, borderRadius: RADIUS.sm, background: item.active ? COLORS.primaryLight : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {item.icon(color)}
              </div>
              <span style={{ fontFamily: FONT.cairo, fontSize: 11, fontWeight: item.active ? 700 : 600, color }}>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
