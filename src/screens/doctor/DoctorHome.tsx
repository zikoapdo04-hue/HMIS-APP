import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { appointmentService } from '../../services/appointment.service';
import { formatTime } from '../../utils/timestamp.utils';
import type { Screen, PatientInfo } from '../../types';
import type { AppointmentModel } from '../../models/appointment.model';

interface Props {
  setScreen: (s: Screen) => void;
  onSelectPatient: (p: PatientInfo) => void;
}

export function DoctorHome({ setScreen, onSelectPatient }: Props) {
  const { user } = useAuth();
  const [todayAppts, setTodayAppts] = useState<AppointmentModel[]>([]);
  const [loading, setLoading]       = useState(true);
  const { lang } = useSettings();

  useEffect(() => {
    if (!user) return;
    // Real-time subscription — updates whenever Firestore changes
    const unsub = appointmentService.subscribeToTodayForDoctor(user.id, appts => {
      setTodayAppts(appts);
      setLoading(false);
    });
    return unsub;
  }, [user]);

  const doctorName = user?.name ?? (lang === 'ar' ? 'الطبيب' : 'Doctor');

  const handleCardClick = (a: AppointmentModel) => {
    onSelectPatient({
      id:    a.patientId,
      name:  a.patientName,
      phone: a.patientPhone,
      email: a.patientUserId,
      num:   a.number,
    });
  };

  return (
    <div className="dash-screen">
      <header className="dash-header">
        <div className="dash-logo-row">
          <span className="dash-hmis-text">HMIS</span>
        </div>
        <button className="dash-call-btn" aria-label="call">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A202C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.27 6.27l1.68-1.68a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </button>
      </header>

      <div className="dash-welcome" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <div className="dash-doctor-avatar">
          <img
            src={user?.imageUrl ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(doctorName)}&background=1DB8C8&color=fff&size=120`}
            alt="Doctor"
          />
        </div>
        <div className="dash-welcome-text">
          <span className="dash-greeting-label">{lang === 'ar' ? 'مرحبا :' : 'Welcome :'} </span>
          <span className="dash-greeting-name">{lang === 'ar' ? `دكتور ${doctorName}` : `Dr. ${doctorName}`}</span>
        </div>
      </div>

      <div className="dash-content">
        <h3 className="dash-section-title" dir={lang === 'ar' ? 'rtl' : 'ltr'}>{lang === 'ar' ? 'مواعيد اليوم' : "Today's Appointments"}</h3>
        {loading && <p style={{ textAlign: 'center', fontFamily: 'Cairo', color: '#8898AA' }}>{lang === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>}
        {!loading && todayAppts.length === 0 && (
          <p style={{ textAlign: 'center', fontFamily: 'Cairo', color: '#8898AA' }}>{lang === 'ar' ? 'لا توجد مواعيد اليوم' : 'No appointments today'}</p>
        )}
        <div className="dash-cards">
          {todayAppts.map(a => (
            <div key={a.id} className="dash-card" dir={lang === 'ar' ? 'rtl' : 'ltr'} onClick={() => handleCardClick(a)}>
              <img
                src={a.patientImageUrl ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(a.patientName)}&background=random`}
                alt={a.patientName}
                className="dash-card-avatar"
              />
              <div className="dash-card-info">
                <p className="dash-card-name">{a.patientName}</p>
                <p className="dash-card-time">{formatTime(a.date, lang === 'ar' ? 'ar-EG' : 'en-US')}</p>
              </div>
              <span className="dash-card-num">{lang === 'ar' ? 'رقم' : 'No.'} {a.number}</span>
            </div>
          ))}
        </div>
      </div>

      <nav className="dash-nav">
        <button className="dash-nav-icon" aria-label="profile" onClick={() => setScreen('doctor-profile')}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
        </button>
        <button className="dash-nav-icon" aria-label="records" onClick={() => setScreen('doctor-records')}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" /></svg>
        </button>
        <button id="home-btn" className="dash-nav-active" aria-label="home" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>
          {lang === 'ar' ? 'الرئيسية' : 'Home'}
        </button>
      </nav>
    </div>
  );
}
