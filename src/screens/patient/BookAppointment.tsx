import { useState } from 'react';
import { Timestamp } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { appointmentService } from '../../services/appointment.service';
import { AppointmentStatus, UserRole } from '../../core/enums';
import { COLORS, GRADIENTS, SHADOWS, RADIUS, FONT } from '../../core/theme';
import type { Screen } from '../../types';
import type { DoctorInfo } from './DoctorDetail';

interface Props { setScreen: (s: Screen) => void; onBack?: () => void; doctor?: DoctorInfo | null }

const TIME_SLOTS = ['04:00PM','04:30PM','05:00PM','05:30PM','06:00PM','06:30PM','07:00PM','07:30PM'];

export function BookAppointment({ setScreen, onBack, doctor }: Props) {
  const { user } = useAuth();
  const { lang } = useSettings();
  const [selectedTime, setSelectedTime] = useState('04:30PM');
  const [symptoms, setSymptoms]         = useState('');
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');
  const [takenSlots, setTakenSlots]     = useState<Set<string>>(new Set());

  const DOCTOR_NAME = doctor?.name      ?? '—';
  const SPECIALTY   = doctor?.specialty ?? '—';
  const RATING      = doctor?.rating    ?? 0;
  const avatarSrc   = doctor?.avatar
    ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(DOCTOR_NAME)}&background=0D9BAB&color=fff`;

  const today   = new Date();
  const dateStr = today.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const handleConfirm = async () => {
    if (!user || !doctor) { setError(lang === 'ar' ? 'بيانات الطبيب غير متاحة' : 'Doctor data unavailable'); return; }
    setLoading(true); setError('');
    try {
      const [timePart, period] = [selectedTime.slice(0, -2), selectedTime.slice(-2)];
      const [h, m] = timePart.split(':').map(Number);
      const hours  = period === 'PM' && h !== 12 ? h + 12 : (period === 'AM' && h === 12 ? 0 : h);
      const apptDate = new Date(today);
      apptDate.setHours(hours, m, 0, 0);

      await appointmentService.create({
        patientId: user.id, patientUserId: user.id, patientName: user.name,
        patientPhone: user.phone, patientImageUrl: user.imageUrl ?? null,
        doctorId: doctor.uid, doctorName: DOCTOR_NAME, doctorSpecialty: SPECIALTY,
        doctorImageUrl: doctor.avatar ?? null,
        date: Timestamp.fromDate(apptDate), time: selectedTime,
        number: Math.floor(Math.random() * 20) + 1, symptoms,
        status: AppointmentStatus.Pending, address: doctor.address ?? '—',
        timeSlotId: null, actorRole: UserRole.Patient, createdBy: user.id,
        updatedAt: Timestamp.fromDate(new Date()), attachments: [],
      });

      setTakenSlots(prev => new Set(prev).add(selectedTime));
      setScreen('booking-success');
    } catch {
      setError(lang === 'ar' ? 'حدث خطأ، يرجى المحاولة مجدداً' : 'An error occurred, please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: COLORS.bg, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Header */}
      <header style={{ background: GRADIENTS.heroBg, padding: '20px 20px 24px', flexShrink: 0, boxShadow: SHADOWS.header, borderRadius: `0 0 ${RADIUS.xxl} ${RADIUS.xxl}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => onBack ? onBack() : setScreen('doctor-detail')} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: RADIUS.sm, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
          {/* Doctor mini card */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <img src={avatarSrc} alt={DOCTOR_NAME} style={{ width: 52, height: 52, borderRadius: RADIUS.full, objectFit: 'cover', border: '2.5px solid rgba(255,255,255,0.6)', flexShrink: 0 }} />
            <div>
              <p style={{ fontFamily: FONT.cairo, fontSize: 17, fontWeight: 800, color: 'white', margin: '0 0 2px' }}>{DOCTOR_NAME}</p>
              <p style={{ fontFamily: FONT.cairo, fontSize: 13, color: 'rgba(255,255,255,0.8)', margin: 0 }}>{SPECIALTY}</p>
            </div>
            <div style={{ [lang === 'ar' ? 'marginRight' : 'marginLeft']: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill={COLORS.star}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              <span style={{ fontFamily: FONT.inter, fontSize: 13, fontWeight: 700, color: 'white' }}>{RATING}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Scrollable form */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px 16px' }}>

        {/* Form fields */}
        <div style={{ background: COLORS.card, border: `1.5px solid ${COLORS.cardBorder}`, borderRadius: RADIUS.xl, padding: '20px 16px', boxShadow: SHADOWS.card, marginBottom: 16 }} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <p style={{ fontFamily: FONT.cairo, fontSize: 16, fontWeight: 800, color: COLORS.textPrimary, margin: '0 0 16px' }}>{lang === 'ar' ? 'بيانات الحجز' : 'Booking Details'}</p>

          {/* Patient name */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontFamily: FONT.cairo, fontSize: 13, fontWeight: 700, color: COLORS.textSec, display: 'block', marginBottom: 6 }}>{lang === 'ar' ? 'اسم المريض' : 'Patient Name'}</label>
            <div style={{ background: COLORS.inputBg, borderRadius: RADIUS.md, padding: '12px 16px', fontFamily: FONT.cairo, fontSize: 15, fontWeight: 600, color: COLORS.textPrimary }}>
              {user?.name ?? ''}
            </div>
          </div>

          {/* Date */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontFamily: FONT.cairo, fontSize: 13, fontWeight: 700, color: COLORS.textSec, display: 'block', marginBottom: 6 }}>{lang === 'ar' ? 'تاريخ الحجز' : 'Booking Date'}</label>
            <div style={{ background: COLORS.inputBg, borderRadius: RADIUS.md, padding: '12px 16px', fontFamily: FONT.cairo, fontSize: 15, fontWeight: 600, color: COLORS.textPrimary }}>
              {dateStr}
            </div>
          </div>

          {/* Symptoms */}
          <div>
            <label style={{ fontFamily: FONT.cairo, fontSize: 13, fontWeight: 700, color: COLORS.textSec, display: 'block', marginBottom: 6 }}>{lang === 'ar' ? 'أعراض الحالة' : 'Symptoms'}</label>
            <textarea
              placeholder={lang === 'ar' ? 'اكتب أعراضك هنا...' : 'Write your symptoms here...'}
              value={symptoms}
              onChange={e => setSymptoms(e.target.value)}
              rows={3}
              style={{ width: '100%', background: COLORS.inputBg, border: `1.5px solid transparent`, borderRadius: RADIUS.md, padding: '12px 16px', fontFamily: FONT.cairo, fontSize: 15, fontWeight: 500, color: COLORS.textPrimary, outline: 'none', resize: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
              onFocus={e => e.currentTarget.style.borderColor = COLORS.primary}
              onBlur={e => e.currentTarget.style.borderColor = 'transparent'}
            />
          </div>
        </div>

        {/* Time slots */}
        <div style={{ background: COLORS.card, border: `1.5px solid ${COLORS.cardBorder}`, borderRadius: RADIUS.xl, padding: '20px 16px', boxShadow: SHADOWS.card }} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <p style={{ fontFamily: FONT.cairo, fontSize: 16, fontWeight: 800, color: COLORS.textPrimary, margin: '0 0 14px' }}>{lang === 'ar' ? 'اختر الوقت' : 'Select Time'}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {TIME_SLOTS.map(t => {
              const taken  = takenSlots.has(t);
              const active = selectedTime === t && !taken;
              return (
                <button
                  key={t}
                  onClick={() => !taken && setSelectedTime(t)}
                  disabled={taken}
                  style={{
                    padding: '10px 4px', border: 'none', borderRadius: RADIUS.md,
                    fontFamily: FONT.inter, fontSize: 12, fontWeight: 700, cursor: taken ? 'not-allowed' : 'pointer',
                    background: taken ? '#F1F5F9' : active ? COLORS.primary : COLORS.inputBg,
                    color: taken ? COLORS.textMuted : active ? 'white' : COLORS.textSec,
                    boxShadow: active ? SHADOWS.btn : 'none',
                    opacity: taken ? 0.5 : 1,
                    transition: 'all 0.18s',
                    textDecoration: taken ? 'line-through' : 'none',
                  }}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <p style={{ fontFamily: FONT.cairo, color: COLORS.danger, textAlign: 'center', fontSize: 14, margin: '12px 0 0', fontWeight: 600 }}>{error}</p>
        )}
      </div>

      {/* Confirm button */}
      <div style={{ padding: '16px 16px 24px', flexShrink: 0, background: COLORS.navBg, borderTop: `1.5px solid ${COLORS.navBorder}` }}>
        <button
          onClick={handleConfirm}
          disabled={loading || !doctor}
          style={{
            width: '100%', padding: '18px', background: loading ? COLORS.textMuted : GRADIENTS.primarySm,
            color: 'white', border: 'none', borderRadius: RADIUS.pill,
            fontFamily: FONT.cairo, fontSize: 18, fontWeight: 800,
            cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : SHADOWS.btn,
            transition: 'all 0.2s',
          }}
        >
          {loading ? (lang === 'ar' ? 'جاري الحجز...' : 'Booking...') : (lang === 'ar' ? 'تأكيد الحجز' : 'Confirm Booking')}
        </button>
      </div>
    </div>
  );
}
