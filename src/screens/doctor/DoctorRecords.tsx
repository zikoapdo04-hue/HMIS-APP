import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import type { Screen } from '../../types';

interface Props { setScreen: (s: Screen) => void }

interface Record {
  id:         string;
  patientName: string;
  date:       string;
  time:       string;
  specialty:  string;
  patientId:  string;
}

export function DoctorRecords({ setScreen }: Props) {
  const { user } = useAuth();
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    async function load() {
      try {
        // Show all completed (cancelled or past) appointments for this doctor
        const q    = query(
          collection(db, 'appointments'),
          where('doctorId', '==', user!.uid),
        );
        const snap = await getDocs(q);
        const list: Record[] = [];
        snap.forEach(d => {
          const data = d.data();
          list.push({
            id:          d.id,
            patientName: data.patientName ?? 'مريض',
            date:        data.date        ?? '',
            time:        data.time        ?? '',
            specialty:   data.specialty   ?? '',
            patientId:   data.patientId   ?? '',
          });
        });
        // Sort most recent first (by id insertion order as proxy)
        list.reverse();
        setRecords(list);
      } catch { /* silent */ }
      setLoading(false);
    }
    load();
  }, [user]);

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
          {records.map(r => (
            <div key={r.id} className="dash-card" dir="rtl" onClick={() => setScreen('patient-profile')}>
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
