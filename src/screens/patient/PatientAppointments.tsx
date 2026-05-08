import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import type { Screen } from '../../types';
import { PatientBottomNav } from '../../components/PatientBottomNav';

interface Props { setScreen: (s: Screen) => void }

interface Appointment {
  id:          string;
  patientName: string;
  doctorName:  string;
  specialty:   string;
  date:        string;
  time:        string;
  address:     string;
}

const MOCK_APPOINTMENTS: Appointment[] = [
  { id: '1', patientName: 'أحمد محمد', doctorName: 'د. خالد توفيق', specialty: 'جراحة عامة', date: '21-12-2023', time: '04:30PM', address: 'عيادة دجلة' },
  { id: '2', patientName: 'أحمد محمد', doctorName: 'د. منى حسن', specialty: 'اطفال', date: '25-12-2023', time: '10:00AM', address: 'مستشفى السلام' },
];

export function PatientAppointments({ setScreen }: Props) {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    if (!user) return;
    setAppointments(MOCK_APPOINTMENTS);
  }, [user]);

  const cancelAppointment = (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="search-screen">
      <header className="search-top-bar" style={{ padding: '24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '26px' }}>مواعيد الحجز</h2>
      </header>
      <div className="search-main-content" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {appointments.length === 0 && (
          <p style={{ textAlign: 'center', fontFamily: 'Cairo', color: '#8898AA' }}>لا يوجد حجوزات نشطة</p>
        )}

        {appointments.map(appt => (
          <div key={appt.id} className="appt-card" dir="rtl">
            <div className="appt-header">
              <span className="appt-doctor-label">الطبيب : </span>
              <span className="appt-doctor-name">{appt.doctorName}</span>
            </div>
            <p className="appt-doctor-spec">{appt.specialty}</p>
            <div className="appt-row">
              <svg className="appt-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span className="appt-value" dir="ltr">{appt.date}</span>
            </div>
            <div className="appt-row">
              <svg className="appt-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              <span className="appt-value" dir="ltr">{appt.time}</span>
            </div>
            <div className="appt-info-row">
              <span className="appt-label">اسم المريض : </span>
              <span className="appt-val-blue">{appt.patientName}</span>
            </div>
            <div className="appt-location">
              <svg className="appt-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              <span className="appt-loc-text">{appt.address || '—'}</span>
            </div>
            <button className="appt-delete-btn" onClick={() => cancelAppointment(appt.id)}>حذف الحجز</button>
          </div>
        ))}
      </div>

      <PatientBottomNav activeScreen="patient-appointments" setScreen={setScreen} />
    </div>
  );
}
