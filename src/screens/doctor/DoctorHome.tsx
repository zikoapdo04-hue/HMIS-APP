import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import type { Screen, PatientInfo } from '../../types';

interface Props {
  setScreen: (s: Screen) => void;
  onSelectPatient: (p: PatientInfo) => void;
}

interface Appointment {
  id:          string;
  patientName: string;
  time:        string;
  num:         number;
  patientId:   string;
  phone:       string;
  email:       string;
}

const MOCK_TODAY_APPTS: Appointment[] = [
  { id: '1', patientId: 'p1', patientName: 'أحمد محمود',  time: '10:00 ص', num: 1, phone: '01012345678', email: 'ahmed@gmail.com' },
  { id: '2', patientId: 'p2', patientName: 'سارة محمد',   time: '11:30 ص', num: 2, phone: '01198765432', email: 'sara@gmail.com'  },
  { id: '3', patientId: 'p3', patientName: 'عمر علي',     time: '01:00 م', num: 3, phone: '01223344556', email: 'omar@gmail.com'  },
];

export function DoctorHome({ setScreen, onSelectPatient }: Props) {
  const { user } = useAuth();
  const [todayAppts, setTodayAppts] = useState<Appointment[]>([]);

  useEffect(() => {
    if (!user) return;
    setTodayAppts(MOCK_TODAY_APPTS);
  }, [user]);

  const doctorName = user?.name ?? 'الطبيب';

  const handleCardClick = (a: Appointment) => {
    onSelectPatient({ id: a.patientId, name: a.patientName, phone: a.phone, email: a.email, num: a.num });
  };

  const Card = ({ num, patientName, time, ...rest }: Appointment) => (
    <div className="dash-card" dir="rtl" onClick={() => handleCardClick({ num, patientName, time, ...rest })}>
      <img
        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(patientName)}&background=random`}
        alt={patientName}
        className="dash-card-avatar"
      />
      <div className="dash-card-info">
        <p className="dash-card-name">{patientName}</p>
        <p className="dash-card-time">{time}</p>
      </div>
      <span className="dash-card-num">رقم {num}</span>
    </div>
  );

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
      <div className="dash-welcome" dir="rtl">
        <div className="dash-doctor-avatar">
          <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(doctorName)}&background=random&size=120`} alt="Doctor" />
        </div>
        <div className="dash-welcome-text">
          <span className="dash-greeting-label">مرحبا : </span>
          <span className="dash-greeting-name">دكتور {doctorName}</span>
        </div>
      </div>
      <div className="dash-content">
        <h3 className="dash-section-title" dir="rtl">مواعيد اليوم</h3>
        {todayAppts.length === 0 && (
          <p style={{ textAlign: 'center', fontFamily: 'Cairo', color: '#8898AA' }}>لا توجد مواعيد اليوم</p>
        )}
        <div className="dash-cards">
          {todayAppts.map(a => <Card key={a.id} {...a} />)}
        </div>
      </div>
      <nav className="dash-nav">
        <button className="dash-nav-icon" aria-label="profile" onClick={() => setScreen('doctor-profile')}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
        </button>
        <button className="dash-nav-icon" aria-label="records" onClick={() => setScreen('doctor-records')}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" /></svg>
        </button>
        <button id="home-btn" className="dash-nav-active" aria-label="home" dir="rtl">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>
          الرئيسية
        </button>
      </nav>
    </div>
  );
}
