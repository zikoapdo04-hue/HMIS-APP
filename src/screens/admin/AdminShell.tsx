import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { appointmentService } from '../../services/appointment.service';
import { userService } from '../../services/user.service';
import { formatDate, formatTime } from '../../utils/timestamp.utils';
import { AppointmentStatus, DoctorStatus } from '../../core/enums';
import { COLORS, GRADIENTS, SHADOWS, RADIUS, FONT } from '../../core/theme';
import { SettingsDropdown } from '../../components/SettingsDropdown';
import type { Screen, PatientInfo } from '../../types';
import type { AppointmentModel } from '../../models/appointment.model';
import type { UserModel } from '../../models/user.model';

type Tab = 'home' | 'patients' | 'doctors';

interface Props {
  setScreen: (s: Screen) => void;
  initialTab?: Tab;
  onSelectPatient: (p: PatientInfo) => void;
  onSelectDoctor: (d: UserModel) => void;
}

/* ─── Status badges ─────────────────────────────────── */
const APPT_STATUS: Record<string, { label: string; color: string; bg: string }> = {
  [AppointmentStatus.Pending]:   { label: 'انتظار',  color: COLORS.warning, bg: COLORS.warningLight },
  [AppointmentStatus.Confirmed]: { label: 'مؤكد',    color: COLORS.primary, bg: COLORS.primaryLight },
  [AppointmentStatus.Completed]: { label: 'مكتمل',   color: COLORS.success, bg: COLORS.successLight },
  [AppointmentStatus.Cancelled]: { label: 'ملغي',    color: COLORS.danger,  bg: COLORS.dangerLight  },
  [AppointmentStatus.NoShow]:    { label: 'لم يحضر', color: '#92400E',      bg: '#FEF3C7'           },
};

/* ═══════════════════════════════════════════════════════════
   HOME TAB
══════════════════════════════════════════════════════════════ */
function HomeTab({ setScreen }: { setScreen: (s: Screen) => void }) {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<AppointmentModel[]>([]);
  const [patientCount, setPatientCount] = useState(0);
  const [doctorCount,  setDoctorCount]  = useState(0);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    Promise.all([
      appointmentService.getAll_admin(),
      userService.getAllPatients(),
      userService.getAllDoctors(),
    ]).then(([appts, patients, doctors]) => {
      setAppointments(appts);
      setPatientCount(patients.length);
      setDoctorCount(doctors.length);
      setLoading(false);
    });
  }, []);

  const active = appointments.filter(a =>
    a.status === AppointmentStatus.Pending || a.status === AppointmentStatus.Confirmed
  );
  const today = new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const adminName = user?.name ?? 'المدير';
  const avatarSrc = user?.imageUrl ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(adminName)}&background=0D9BAB&color=fff&size=100`;

  const handleCancel = async (id: string) => {
    await appointmentService.cancelAppointment(id);
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: AppointmentStatus.Cancelled } : a));
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      {/* Hero */}
      <div style={{ background: GRADIENTS.heroBg, padding: '24px 20px 28px', flexShrink: 0, borderRadius: `0 0 ${RADIUS.xxl} ${RADIUS.xxl}`, boxShadow: SHADOWS.header }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <SettingsDropdown setScreen={setScreen} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} dir="rtl">
            <div>
              <p style={{ fontFamily: FONT.cairo, fontSize: 13, color: 'rgba(255,255,255,0.75)', margin: 0, textAlign: 'right' }}>لوحة التحكم</p>
              <h2 style={{ fontFamily: FONT.cairo, fontSize: 20, fontWeight: 800, color: 'white', margin: '2px 0 0', textAlign: 'right' }}>{adminName}</h2>
            </div>
            <img src={avatarSrc} alt={adminName} style={{ width: 52, height: 52, borderRadius: RADIUS.full, objectFit: 'cover', border: '3px solid rgba(255,255,255,0.5)', flexShrink: 0 }} />
          </div>
        </div>
        <p style={{ fontFamily: FONT.cairo, fontSize: 12, color: 'rgba(255,255,255,0.65)', margin: '0 0 16px', textAlign: 'right' }}>{today}</p>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
          {[
            { label: 'الحجوزات',  value: appointments.length, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
            { label: 'المرضى',    value: patientCount,        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg> },
            { label: 'الأطباء',   value: doctorCount,         icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg> },
          ].map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.18)', borderRadius: RADIUS.md, padding: '12px 8px', textAlign: 'center', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>{s.icon}</div>
              <p style={{ fontFamily: FONT.inter, fontSize: 22, fontWeight: 800, color: 'white', margin: 0 }}>{loading ? '—' : s.value}</p>
              <p style={{ fontFamily: FONT.cairo, fontSize: 11, color: 'rgba(255,255,255,0.8)', margin: '2px 0 0' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Active appointments */}
      <div style={{ flex: 1, padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <p style={{ fontFamily: FONT.cairo, fontSize: 17, fontWeight: 800, color: COLORS.textPrimary, margin: '0 0 4px' }} dir="rtl">
          الحجوزات النشطة {!loading && <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.textMuted }}>({active.length})</span>}
        </p>

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 40, flexDirection: 'column', gap: 12 }}>
            <div style={{ width: 36, height: 36, border: `3px solid ${COLORS.primaryLight}`, borderTopColor: COLORS.primary, borderRadius: RADIUS.full, animation: 'spin 0.8s linear infinite' }} />
            <p style={{ fontFamily: FONT.cairo, color: COLORS.textMuted, margin: 0 }}>جاري التحميل...</p>
          </div>
        )}

        {!loading && active.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 40, gap: 12 }}>
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={COLORS.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <p style={{ fontFamily: FONT.cairo, color: COLORS.textMuted, fontSize: 15, fontWeight: 600 }}>لا توجد حجوزات نشطة</p>
          </div>
        )}

        {!loading && active.map(a => {
          const badge = APPT_STATUS[a.status] ?? APPT_STATUS[AppointmentStatus.Pending];
          return (
            <div key={a.id} style={{ background: COLORS.card, border: `1.5px solid ${COLORS.cardBorder}`, borderRadius: RADIUS.xl, padding: '14px 16px', boxShadow: SHADOWS.card }} dir="rtl">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <img src={a.patientImageUrl ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(a.patientName)}&background=0D9BAB&color=fff&size=80`} alt={a.patientName} style={{ width: 46, height: 46, borderRadius: RADIUS.full, objectFit: 'cover', flexShrink: 0, border: `2px solid ${COLORS.primaryLight}` }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: FONT.cairo, fontSize: 15, fontWeight: 800, color: COLORS.textPrimary, margin: '0 0 2px' }}>{a.patientName}</p>
                  <p style={{ fontFamily: FONT.cairo, fontSize: 12, color: COLORS.primary, margin: 0, fontWeight: 600 }}>{a.doctorName} · {a.doctorSpecialty}</p>
                </div>
                <span style={{ fontFamily: FONT.cairo, fontSize: 11, fontWeight: 700, color: badge.color, background: badge.bg, padding: '3px 10px', borderRadius: RADIUS.full, flexShrink: 0 }}>{badge.label}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button
                  onClick={() => handleCancel(a.id)}
                  style={{ padding: '8px 18px', background: COLORS.dangerLight, color: COLORS.danger, border: `1.5px solid rgba(239,68,68,0.2)`, borderRadius: RADIUS.pill, fontFamily: FONT.cairo, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                >
                  إلغاء الحجز
                </button>
                <p style={{ fontFamily: FONT.cairo, fontSize: 12, color: COLORS.textMuted, margin: 0 }}>{formatDate(a.date, 'ar-EG')} · {formatTime(a.date, 'ar-EG')}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PATIENTS TAB
══════════════════════════════════════════════════════════════ */
function PatientsTab({ setScreen, onSelectPatient }: { setScreen: (s: Screen) => void; onSelectPatient: (p: PatientInfo) => void }) {
  const [patients, setPatients] = useState<UserModel[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');

  useEffect(() => {
    userService.getAllPatients().then(list => { setPatients(list); setLoading(false); });
  }, []);

  const filtered = search.trim()
    ? patients.filter(p => p.name.includes(search) || p.phone.includes(search))
    : patients;

  return (
    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: GRADIENTS.heroBg, padding: '24px 20px 28px', flexShrink: 0, borderRadius: `0 0 ${RADIUS.xxl} ${RADIUS.xxl}`, boxShadow: SHADOWS.header }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <SettingsDropdown setScreen={setScreen} />
          <div dir="rtl">
            <p style={{ fontFamily: FONT.cairo, fontSize: 13, color: 'rgba(255,255,255,0.75)', margin: 0 }}>قائمة المرضى</p>
            <h2 style={{ fontFamily: FONT.cairo, fontSize: 22, fontWeight: 800, color: 'white', margin: '2px 0 0' }}>إدارة المرضى</h2>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.18)', borderRadius: RADIUS.lg, padding: '4px 8px 4px 4px', border: '1.5px solid rgba(255,255,255,0.28)' }} dir="rtl">
          <input type="text" placeholder="ابحث بالاسم أو الهاتف..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: FONT.cairo, fontSize: 15, color: 'white', padding: '10px 12px' }} />
          <div style={{ width: 38, height: 38, borderRadius: RADIUS.sm, background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 40, flexDirection: 'column', gap: 12 }}>
            <div style={{ width: 36, height: 36, border: `3px solid ${COLORS.primaryLight}`, borderTopColor: COLORS.primary, borderRadius: RADIUS.full, animation: 'spin 0.8s linear infinite' }} />
            <p style={{ fontFamily: FONT.cairo, color: COLORS.textMuted, margin: 0 }}>جاري التحميل...</p>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 40, gap: 12 }}>
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={COLORS.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <p style={{ fontFamily: FONT.cairo, color: COLORS.textMuted, fontSize: 15, fontWeight: 600 }}>لا يوجد مرضى</p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <>
            <p style={{ fontFamily: FONT.cairo, fontSize: 13, color: COLORS.textMuted, margin: '0 4px 4px' }} dir="rtl">{filtered.length} مريض</p>
            {filtered.map(p => (
              <button
                key={p.id}
                onClick={() => onSelectPatient({ id: p.id, name: p.name, phone: p.phone, email: p.email, num: 0 })}
                style={{ background: COLORS.card, border: `1.5px solid ${COLORS.cardBorder}`, borderRadius: RADIUS.xl, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', boxShadow: SHADOWS.card, transition: 'transform 0.15s, box-shadow 0.15s', width: '100%', textAlign: 'right' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = SHADOWS.cardHov; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = SHADOWS.card; }}
                dir="rtl"
              >
                <img src={p.imageUrl ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=0D9BAB&color=fff&size=80`} alt={p.name} style={{ width: 52, height: 52, borderRadius: RADIUS.full, objectFit: 'cover', flexShrink: 0, border: `2px solid ${COLORS.primaryLight}` }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: FONT.cairo, fontSize: 16, fontWeight: 800, color: COLORS.textPrimary, margin: '0 0 4px' }}>{p.name}</p>
                  <p style={{ fontFamily: FONT.cairo, fontSize: 13, color: COLORS.textMuted, margin: '0 0 4px' }} dir="ltr">{p.phone}</p>
                  <p style={{ fontFamily: FONT.cairo, fontSize: 12, color: COLORS.textMuted, margin: 0 }}>{p.city || '—'} {p.age ? `· ${p.age} سنة` : ''}</p>
                </div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DOCTORS TAB
══════════════════════════════════════════════════════════════ */
function DoctorsTab({ setScreen, onSelectDoctor }: { setScreen: (s: Screen) => void; onSelectDoctor: (d: UserModel) => void }) {
  const { user: admin } = useAuth();
  const [doctors,  setDoctors]  = useState<UserModel[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');

  useEffect(() => {
    userService.getAllDoctors().then(list => { setDoctors(list); setLoading(false); });
  }, []);

  const filtered = search.trim()
    ? doctors.filter(d => d.name.includes(search) || (d.specialty ?? '').includes(search))
    : doctors;

  const handleApprove = async (doctorId: string) => {
    if (!admin) return;
    await userService.approveDoctor(doctorId, admin.id);
    setDoctors(prev => prev.map(d => d.id === doctorId ? { ...d, doctorStatus: DoctorStatus.Approved } : d));
  };

  const handleReject = async (doctorId: string) => {
    await userService.rejectDoctor(doctorId);
    setDoctors(prev => prev.map(d => d.id === doctorId ? { ...d, doctorStatus: DoctorStatus.Rejected } : d));
  };

  const STATUS_STYLE: Record<string, { label: string; color: string; bg: string }> = {
    [DoctorStatus.Approved]: { label: 'معتمد',       color: COLORS.success, bg: COLORS.successLight },
    [DoctorStatus.Rejected]: { label: 'مرفوض',        color: COLORS.danger,  bg: COLORS.dangerLight  },
    [DoctorStatus.Pending]:  { label: 'قيد المراجعة', color: COLORS.warning, bg: COLORS.warningLight },
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: GRADIENTS.heroBg, padding: '24px 20px 28px', flexShrink: 0, borderRadius: `0 0 ${RADIUS.xxl} ${RADIUS.xxl}`, boxShadow: SHADOWS.header }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <SettingsDropdown setScreen={setScreen} />
          <div dir="rtl">
            <p style={{ fontFamily: FONT.cairo, fontSize: 13, color: 'rgba(255,255,255,0.75)', margin: 0 }}>قائمة الأطباء</p>
            <h2 style={{ fontFamily: FONT.cairo, fontSize: 22, fontWeight: 800, color: 'white', margin: '2px 0 0' }}>إدارة الأطباء</h2>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.18)', borderRadius: RADIUS.lg, padding: '4px 8px 4px 4px', border: '1.5px solid rgba(255,255,255,0.28)' }} dir="rtl">
          <input type="text" placeholder="ابحث بالاسم أو التخصص..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: FONT.cairo, fontSize: 15, color: 'white', padding: '10px 12px' }} />
          <div style={{ width: 38, height: 38, borderRadius: RADIUS.sm, background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 40, flexDirection: 'column', gap: 12 }}>
            <div style={{ width: 36, height: 36, border: `3px solid ${COLORS.primaryLight}`, borderTopColor: COLORS.primary, borderRadius: RADIUS.full, animation: 'spin 0.8s linear infinite' }} />
            <p style={{ fontFamily: FONT.cairo, color: COLORS.textMuted, margin: 0 }}>جاري التحميل...</p>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 40, gap: 12 }}>
            <p style={{ fontFamily: FONT.cairo, color: COLORS.textMuted, fontSize: 15, fontWeight: 600 }}>لا يوجد أطباء</p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <>
            <p style={{ fontFamily: FONT.cairo, fontSize: 13, color: COLORS.textMuted, margin: '0 4px 4px' }} dir="rtl">{filtered.length} طبيب</p>
            {filtered.map(d => {
              const st = STATUS_STYLE[d.doctorStatus ?? DoctorStatus.Pending];
              return (
                <div
                  key={d.id}
                  style={{ background: COLORS.card, border: `1.5px solid ${COLORS.cardBorder}`, borderRadius: RADIUS.xl, padding: '14px 16px', boxShadow: SHADOWS.card }}
                  dir="rtl"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
                    <button onClick={() => onSelectDoctor(d)} style={{ display: 'contents', cursor: 'pointer' }}>
                      <img src={d.imageUrl ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(d.name)}&background=0D9BAB&color=fff&size=80`} alt={d.name} style={{ width: 52, height: 52, borderRadius: RADIUS.full, objectFit: 'cover', flexShrink: 0, border: `2px solid ${COLORS.primaryLight}` }} />
                    </button>
                    <div onClick={() => onSelectDoctor(d)} role="button" style={{ flex: 1, cursor: 'pointer' }}>
                      <p style={{ fontFamily: FONT.cairo, fontSize: 16, fontWeight: 800, color: COLORS.textPrimary, margin: '0 0 3px' }}>{d.name}</p>
                      <p style={{ fontFamily: FONT.cairo, fontSize: 13, color: COLORS.primary, margin: '0 0 4px', fontWeight: 600 }}>{d.specialty ?? '—'}</p>
                      <span style={{ fontFamily: FONT.cairo, fontSize: 11, fontWeight: 700, color: st.color, background: st.bg, padding: '3px 10px', borderRadius: RADIUS.full }}>{st.label}</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    {d.doctorStatus === DoctorStatus.Pending && (
                      <button
                        onClick={() => handleApprove(d.id)}
                        style={{ flex: 1, padding: '10px', background: COLORS.successLight, color: COLORS.success, border: `1.5px solid rgba(16,185,129,0.25)`, borderRadius: RADIUS.md, fontFamily: FONT.cairo, fontSize: 14, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={COLORS.success} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        اعتماد
                      </button>
                    )}
                    {d.doctorStatus === DoctorStatus.Approved && (
                      <button
                        onClick={() => handleReject(d.id)}
                        style={{ flex: 1, padding: '10px', background: COLORS.dangerLight, color: COLORS.danger, border: `1.5px solid rgba(239,68,68,0.2)`, borderRadius: RADIUS.md, fontFamily: FONT.cairo, fontSize: 14, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={COLORS.danger} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        إلغاء الاعتماد
                      </button>
                    )}
                    {d.doctorStatus === DoctorStatus.Rejected && (
                      <button
                        onClick={() => handleApprove(d.id)}
                        style={{ flex: 1, padding: '10px', background: COLORS.primaryLight, color: COLORS.primary, border: `1.5px solid rgba(13,155,171,0.2)`, borderRadius: RADIUS.md, fontFamily: FONT.cairo, fontSize: 14, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={COLORS.primary} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        إعادة اعتماد
                      </button>
                    )}
                    <button
                      onClick={() => onSelectDoctor(d)}
                      style={{ padding: '10px 16px', background: COLORS.card, color: COLORS.textPrimary, border: `1.5px solid ${COLORS.cardBorder}`, borderRadius: RADIUS.md, fontFamily: FONT.cairo, fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={COLORS.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      عرض
                    </button>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SHELL
══════════════════════════════════════════════════════════════ */
const NAV: { tab: Tab; labelAr: string; icon: (a: boolean) => React.JSX.Element }[] = [
  {
    tab: 'doctors',
    labelAr: 'الأطباء',
    icon: (a) => <svg width="22" height="22" viewBox="0 0 24 24" fill={a ? COLORS.navActive : 'var(--nav-inactive)'}><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/></svg>,
  },
  {
    tab: 'patients',
    labelAr: 'المرضى',
    icon: (a) => <svg width="22" height="22" viewBox="0 0 24 24" fill={a ? COLORS.navActive : 'var(--nav-inactive)'}><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>,
  },
  {
    tab: 'home',
    labelAr: 'الرئيسية',
    icon: (a) => <svg width="22" height="22" viewBox="0 0 24 24" fill={a ? COLORS.navActive : 'var(--nav-inactive)'}><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>,
  },
];

export function AdminShell({ setScreen, initialTab = 'home', onSelectPatient, onSelectDoctor }: Props) {
  const [tab, setTab] = useState<Tab>(initialTab);
  useEffect(() => { setTab(initialTab); }, [initialTab]);

  return (
    <div style={{ background: COLORS.bg, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {tab === 'home'     && <HomeTab     setScreen={setScreen} />}
        {tab === 'patients' && <PatientsTab setScreen={setScreen} onSelectPatient={onSelectPatient} />}
        {tab === 'doctors'  && <DoctorsTab  setScreen={setScreen} onSelectDoctor={onSelectDoctor} />}
      </div>

      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '10px 8px 16px', background: COLORS.navBg, borderTop: `1.5px solid ${COLORS.navBorder}`, boxShadow: SHADOWS.nav, flexShrink: 0 }} dir="rtl">
        {NAV.map(item => {
          const active = tab === item.tab;
          return (
            <button key={item.tab} onClick={() => setTab(item.tab)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, flex: 1, padding: '4px 0' }}>
              <div style={{ width: 44, height: 36, borderRadius: RADIUS.sm, display: 'flex', alignItems: 'center', justifyContent: 'center', background: active ? COLORS.primaryLight : 'transparent', transition: 'background 0.2s' }}>
                {item.icon(active)}
              </div>
              <span style={{ fontFamily: FONT.cairo, fontSize: 11, fontWeight: active ? 800 : 600, color: active ? COLORS.navActive : COLORS.navInactive, transition: 'color 0.2s' }}>{item.labelAr}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
