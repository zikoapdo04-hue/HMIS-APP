import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import type { Screen, PatientInfo } from '../../types';

interface Props {
  setScreen: (s: Screen) => void;
  onSelectPatient: (p: PatientInfo) => void;
}

interface Record {
  id:          string;
  patientName: string;
  date:        string;
  time:        string;
  specialty:   string;
  patientId:   string;
  phone:       string;
  email:       string;
}

const MOCK_RECORDS: Record[] = [
  { id: '1', patientName: 'سعيد عبدالهادي', date: '20-12-2023', time: '10:00 ص', specialty: 'جراحة عامة', patientId: 'p1', phone: '01012345678', email: 'saeed@gmail.com'   },
  { id: '2', patientName: 'فاطمة محمود',    date: '18-12-2023', time: '12:00 م', specialty: 'جراحة عامة', patientId: 'p2', phone: '01198765432', email: 'fatma@gmail.com'   },
  { id: '3', patientName: 'محمد أحمد',      date: '15-12-2023', time: '01:30 م', specialty: 'جراحة عامة', patientId: 'p3', phone: '01223344556', email: 'mohamed@gmail.com' },
];

export function DoctorRecords({ setScreen, onSelectPatient }: Props) {
  const { user } = useAuth();
  const [records, setRecords] = useState<Record[]>([]);

  useEffect(() => {
    if (!user) return;
    setRecords(MOCK_RECORDS);
  }, [user]);

  const handleCardClick = (r: Record) => {
    onSelectPatient({ id: r.patientId, name: r.patientName, phone: r.phone, email: r.email, num: parseInt(r.id) });
  };

  return (
    <div className="dash-screen">
      <header className="records-top-bar"><h2>السجل</h2></header>
      <div className="dash-content mt-16">
        <h3 className="dash-section-title" dir="rtl">اخر الحالات</h3>

        {records.length === 0 && (
          <p style={{ textAlign: 'center', fontFamily: 'Cairo', color: '#8898AA' }}>لا يوجد سجلات</p>
        )}

        <div className="dash-cards">
          {records.map(r => (
            <div key={r.id} className="dash-card" dir="rtl" onClick={() => handleCardClick(r)}>
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(r.patientName)}&background=random`}
                alt={r.patientName}
                className="dash-card-avatar"
              />
              <div className="dash-card-info">
                <p className="dash-card-name">{r.patientName}</p>
                <p className="dash-card-time">{r.time}</p>
              </div>
              <span className="dash-card-num">{r.date}</span>
            </div>
          ))}
        </div>
      </div>

      <nav className="dash-nav">
        <button className="dash-nav-icon" aria-label="profile" onClick={() => setScreen('doctor-profile')}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
        </button>
        <button className="dash-nav-active" aria-label="records" dir="rtl">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" /></svg>
          السجل
        </button>
        <button className="dash-nav-icon" aria-label="home" onClick={() => setScreen('doctor-home')}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>
        </button>
      </nav>
    </div>
  );
}
