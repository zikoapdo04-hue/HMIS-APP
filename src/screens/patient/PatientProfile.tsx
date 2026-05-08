import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { appointmentService } from '../../services/appointment.service';
import { medicalRecordService } from '../../services/medical-record.service';
import { formatDate } from '../../utils/timestamp.utils';
import { COLORS, GRADIENTS, SHADOWS, RADIUS, FONT } from '../../core/theme';
import type { AppointmentModel } from '../../models/appointment.model';
import type { MedicalRecordDoc } from '../../firebase/types/models';
import type { Screen } from '../../types';

interface Props { setScreen: (s: Screen) => void }

export function PatientProfile({ setScreen }: Props) {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<AppointmentModel[]>([]);
  const [records, setRecords]           = useState<MedicalRecordDoc[]>([]);
  const [loading, setLoading]           = useState(true);
  const [tab, setTab]                   = useState<'appointments' | 'records'>('appointments');

  const patientName = user?.name ?? 'مريض';
  const avatarUrl   = user?.imageUrl
    ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(patientName)}&background=0D9BAB&color=fff&size=128`;

  useEffect(() => {
    if (!user) return;
    Promise.all([
      appointmentService.getByPatient(user.id),
      medicalRecordService.getByPatient(user.id),
    ]).then(([appts, recs]) => {
      setAppointments(appts);
      setRecords(recs);
      setLoading(false);
    });
  }, [user]);

  return (
    <div style={{ background: COLORS.bg, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Header */}
      <header style={{ background: GRADIENTS.heroBg, padding: '20px 20px 28px', flexShrink: 0, boxShadow: SHADOWS.header, borderRadius: `0 0 ${RADIUS.xxl} ${RADIUS.xxl}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <button
            onClick={() => setScreen('patient-settings')}
            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: RADIUS.sm, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96a6.96 6.96 0 0 0-1.62-.94l-.36-2.54A.484.484 0 0 0 14 2h-4a.484.484 0 0 0-.48.41l-.36 2.54a6.96 6.96 0 0 0-1.62.94l-2.39-.96a.48.48 0 0 0-.59.22L2.64 8.47a.48.48 0 0 0 .12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.36 1.05.66 1.62.94l.36 2.54c.05.24.27.41.48.41h4c.24 0 .44-.17.47-.41l.36-2.54a6.96 6.96 0 0 0 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.49.49 0 0 0-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>
          </button>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: FONT.cairo, fontSize: 12, color: 'rgba(255,255,255,0.7)', margin: 0 }}>الحساب الشخصي</p>
            <h2 style={{ fontFamily: FONT.cairo, fontSize: 22, fontWeight: 800, color: 'white', margin: 0 }}>ملفي الطبي</h2>
          </div>
          <div style={{ width: 40 }} />
        </div>

        {/* Patient card */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(255,255,255,0.15)', borderRadius: RADIUS.lg, padding: '14px 16px', backdropFilter: 'blur(8px)' }} dir="rtl">
          <img src={avatarUrl} alt={patientName} style={{ width: 56, height: 56, borderRadius: RADIUS.full, objectFit: 'cover', border: '2.5px solid rgba(255,255,255,0.7)', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: FONT.cairo, fontSize: 18, fontWeight: 800, color: 'white', margin: '0 0 2px' }}>{patientName}</p>
            <p style={{ fontFamily: FONT.cairo, fontSize: 13, color: 'rgba(255,255,255,0.75)', margin: 0 }}>{user?.phone ?? ''}</p>
          </div>
          <button
            onClick={() => setScreen('patient-account-settings')}
            style={{ background: 'rgba(255,255,255,0.25)', border: 'none', borderRadius: RADIUS.sm, padding: '8px 14px', fontFamily: FONT.cairo, fontSize: 13, fontWeight: 700, color: 'white', cursor: 'pointer', flexShrink: 0 }}
          >
            تعديل
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, margin: '16px 16px 0', background: COLORS.inputBg, borderRadius: RADIUS.md, padding: 4 }}>
        {(['appointments', 'records'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1, padding: '10px', border: 'none', borderRadius: RADIUS.sm, cursor: 'pointer',
              fontFamily: FONT.cairo, fontSize: 14, fontWeight: 700, transition: 'all 0.2s',
              background: tab === t ? COLORS.primary : 'transparent',
              color: tab === t ? 'white' : COLORS.textSec,
              boxShadow: tab === t ? SHADOWS.btn : 'none',
            }}
          >
            {t === 'appointments' ? `المواعيد (${appointments.length})` : `السجلات (${records.length})`}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 60, gap: 12 }}>
            <div style={{ width: 40, height: 40, border: `3px solid ${COLORS.primaryLight}`, borderTopColor: COLORS.primary, borderRadius: RADIUS.full, animation: 'spin 0.8s linear infinite' }} />
            <p style={{ fontFamily: FONT.cairo, color: COLORS.textMuted }}>جاري التحميل...</p>
          </div>
        )}

        {!loading && tab === 'appointments' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} dir="rtl">
            {appointments.length === 0 && (
              <div style={{ textAlign: 'center', paddingTop: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={COLORS.primaryLight} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <p style={{ fontFamily: FONT.cairo, fontSize: 16, fontWeight: 600, color: COLORS.textMuted }}>لا يوجد مواعيد</p>
              </div>
            )}
            {appointments.map(apt => (
              <div key={apt.id} style={{ background: COLORS.card, border: `1.5px solid ${COLORS.cardBorder}`, borderRadius: RADIUS.xl, padding: '16px', boxShadow: SHADOWS.card }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img
                    src={apt.doctorImageUrl ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(apt.doctorName)}&background=0D9BAB&color=fff&size=100`}
                    alt={apt.doctorName}
                    style={{ width: 50, height: 50, borderRadius: RADIUS.full, objectFit: 'cover', flexShrink: 0, border: `2px solid ${COLORS.primaryLight}` }}
                  />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: FONT.cairo, fontSize: 15, fontWeight: 800, color: COLORS.textPrimary, margin: '0 0 2px' }}>{apt.doctorName}</p>
                    <p style={{ fontFamily: FONT.cairo, fontSize: 13, fontWeight: 600, color: COLORS.primary, margin: '0 0 4px' }}>{apt.doctorSpecialty}</p>
                    <p style={{ fontFamily: FONT.inter, fontSize: 12, color: COLORS.textMuted, margin: 0 }}>{formatDate(apt.date)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && tab === 'records' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} dir="rtl">
            {records.length === 0 && (
              <div style={{ textAlign: 'center', paddingTop: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={COLORS.primaryLight} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                </svg>
                <p style={{ fontFamily: FONT.cairo, fontSize: 16, fontWeight: 600, color: COLORS.textMuted }}>لا يوجد سجلات طبية</p>
              </div>
            )}
            {records.map(rec => (
              <div key={rec.id} style={{ background: COLORS.card, border: `1.5px solid ${COLORS.cardBorder}`, borderRadius: RADIUS.xl, padding: '16px', boxShadow: SHADOWS.card }}>
                {/* Doctor row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(rec.doctorName)}&background=0D9BAB&color=fff&size=100`}
                    alt={rec.doctorName}
                    style={{ width: 48, height: 48, borderRadius: RADIUS.full, objectFit: 'cover', flexShrink: 0, border: `2px solid ${COLORS.primaryLight}` }}
                  />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: FONT.cairo, fontSize: 15, fontWeight: 800, color: COLORS.textPrimary, margin: '0 0 2px' }}>{rec.doctorName}</p>
                    <p style={{ fontFamily: FONT.cairo, fontSize: 13, fontWeight: 600, color: COLORS.primary, margin: '0 0 4px' }}>{rec.specialty}</p>
                    <p style={{ fontFamily: FONT.inter, fontSize: 12, color: COLORS.textMuted, margin: 0 }}>{formatDate(rec.date)}</p>
                  </div>
                  <div style={{ width: 36, height: 36, background: COLORS.primaryLight, borderRadius: RADIUS.sm, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill={COLORS.primary}>
                      <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-2-9H7v4h10V3z"/>
                    </svg>
                  </div>
                </div>

                {/* Details */}
                <div style={{ height: 1, background: COLORS.cardBorder, margin: '0 0 12px' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {rec.diagnosis && (
                    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <span style={{ fontFamily: FONT.cairo, fontSize: 13, fontWeight: 700, color: COLORS.textSec, flexShrink: 0 }}>التشخيص:</span>
                      <span style={{ fontFamily: FONT.cairo, fontSize: 13, fontWeight: 600, color: COLORS.textPrimary }}>{rec.diagnosis}</span>
                    </div>
                  )}
                  {rec.medications?.length > 0 && (
                    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <span style={{ fontFamily: FONT.cairo, fontSize: 13, fontWeight: 700, color: COLORS.textSec, flexShrink: 0 }}>الأدوية:</span>
                      <span style={{ fontFamily: FONT.cairo, fontSize: 13, fontWeight: 600, color: COLORS.textPrimary }}>{rec.medications.join(' — ')}</span>
                    </div>
                  )}
                  {rec.tests?.length > 0 && (
                    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <span style={{ fontFamily: FONT.cairo, fontSize: 13, fontWeight: 700, color: COLORS.textSec, flexShrink: 0 }}>التحاليل:</span>
                      <span style={{ fontFamily: FONT.cairo, fontSize: 13, fontWeight: 600, color: COLORS.textPrimary }}>{rec.tests.join(' — ')}</span>
                    </div>
                  )}
                </div>

                {rec.xrayUrl && (
                  <div style={{ marginTop: 12, borderRadius: RADIUS.md, overflow: 'hidden', border: `1.5px solid ${COLORS.cardBorder}` }}>
                    <img src={rec.xrayUrl} alt="X-Ray" style={{ width: '100%', display: 'block', objectFit: 'cover', maxHeight: 200 }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '12px 8px 16px', background: COLORS.navBg, borderTop: `1.5px solid ${COLORS.navBorder}`, boxShadow: SHADOWS.nav, flexShrink: 0 }}>
        {[
          { key: 'patient-profile',      label: 'حسابي',    active: true,  icon: (c: string) => <svg width="22" height="22" viewBox="0 0 24 24" fill={c}><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg> },
          { key: 'patient-appointments', label: 'المواعيد',  active: false, icon: (c: string) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
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
