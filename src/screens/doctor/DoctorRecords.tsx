import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { appointmentService } from '../../services/appointment.service';
import { formatDate, formatTime } from '../../utils/timestamp.utils';
import { AppointmentStatus } from '../../core/enums';
import type { AppointmentModel } from '../../models/appointment.model';
import type { Screen, PatientInfo } from '../../types';

interface Props {
  setScreen: (s: Screen) => void;
  onSelectPatient: (p: PatientInfo) => void;
}

export function DoctorRecords({ setScreen, onSelectPatient }: Props) {
  const { user } = useAuth();
  const [records, setRecords] = useState<AppointmentModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    appointmentService.getByDoctor(user.id).then(appts => {
      // Only show completed appointments as records
      setRecords(appts.filter(a => a.status === AppointmentStatus.Completed));
      setLoading(false);
    });
  }, [user]);

  const handleCardClick = (a: AppointmentModel) => {
    onSelectPatient({ id: a.patientId, name: a.patientName, phone: a.patientPhone, email: a.patientUserId, num: a.number });
    setScreen('admin-patient-detail');
  };

  return (
    <div className="dash-screen">
      <header className="records-top-bar"><h2>السجل</h2></header>
      <div className="dash-content mt-16">
        <h3 className="dash-section-title" dir="rtl">اخر الحالات</h3>
        {loading && <p style={{ textAlign: 'center', fontFamily: 'Cairo', color: '#8898AA' }}>جاري التحميل...</p>}
        {!loading && records.length === 0 && (
          <p style={{ textAlign: 'center', fontFamily: 'Cairo', color: '#8898AA' }}>لا يوجد سجلات</p>
        )}
        <div className="dash-cards">
          {records.map(a => (
            <div key={a.id} className="dash-card" dir="rtl" onClick={() => handleCardClick(a)}>
              <img
                src={a.patientImageUrl ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(a.patientName)}&background=random`}
                alt={a.patientName}
                className="dash-card-avatar"
              />
              <div className="dash-card-info">
                <p className="dash-card-name">{a.patientName}</p>
                <p className="dash-card-time">{formatTime(a.date)}</p>
              </div>
              <span className="dash-card-num">{formatDate(a.date)}</span>
            </div>
          ))}
        </div>
      </div>
      <nav className="dash-nav">
        <button className="dash-nav-icon" aria-label="profile" onClick={() => setScreen('doctor-profile')}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
        </button>
        <button className="dash-nav-active" aria-label="records" dir="rtl">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/></svg>
          السجل
        </button>
        <button className="dash-nav-icon" aria-label="home" onClick={() => setScreen('doctor-home')}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
        </button>
      </nav>
    </div>
  );
}
