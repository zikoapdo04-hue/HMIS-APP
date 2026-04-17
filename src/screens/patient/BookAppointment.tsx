import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import type { Screen } from '../../types';

interface Props { setScreen: (s: Screen) => void }

const TIME_SLOTS = ['04:00PM','04:30PM','05:00PM','05:30PM','06:00PM','06:30PM','07:00PM','07:30PM'];
// Slots already taken (would normally come from Firestore query)
const TAKEN = new Set(['04:00PM','05:00PM','07:00PM']);

export function BookAppointment({ setScreen }: Props) {
  const { user } = useAuth();
  const [selectedTime, setSelectedTime] = useState('04:30PM');
  const [symptoms, setSymptoms]         = useState('');
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');

  // Doctor info — in a real app this would be passed as a prop from the Clinics screen
  const DOCTOR_NAME    = 'خالد توفيق';
  const DOCTOR_ID      = 'placeholder-doctor-id';
  const SPECIALTY      = 'جراحة عامة';
  const ADDRESS        = '23 شارع الحجاز, مصر الجديد, القاهرة';
  const RATING         = 5;
  const AVAILABLE_DAYS = ['الاثنين', 'الاربع'];

  const today = new Date();
  const dateStr = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;

  const handleConfirm = async () => {
    if (!user) { setError('يجب تسجيل الدخول أولاً'); return; }
    setLoading(true);
    setError('');
    try {
      await addDoc(collection(db, 'appointments'), {
        patientId:   user.uid,
        patientName: user.name,
        doctorId:    DOCTOR_ID,
        doctorName:  DOCTOR_NAME,
        specialty:   SPECIALTY,
        address:     ADDRESS,
        date:        dateStr,
        time:        selectedTime,
        symptoms,
        status:      'active',
      });
      setScreen('booking-success');
    } catch {
      setError('حدث خطأ، حاول مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-screen">
      <header className="booking-header"><h2>احجز مع الطبيب</h2></header>
      <div className="booking-content">
        <div className="bk-doc-card">
          <div className="bk-doc-rating">
            <span className="rating-num">{RATING}</span>
            <svg viewBox="0 0 24 24" fill="#ECC94B" stroke="#ECC94B"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <div className="bk-doc-info">
            <div className="bk-doc-text">
              <span className="bk-doc-name">{DOCTOR_NAME}</span>
              <span className="bk-doc-spec">{SPECIALTY}</span>
            </div>
            <img src={`https://ui-avatars.com/api/?name=Khaled+Tawfik&background=random`} alt={DOCTOR_NAME} className="bk-doc-avatar" />
          </div>
        </div>

        <h3 className="bk-section-title">ادخال بيانات الحجز</h3>
        <div className="bk-form">
          <div className="bk-field">
            <span className="bk-label">اسم المريض</span>
            <input type="text" value={user?.name ?? ''} readOnly className="bk-input" />
          </div>
          <div className="bk-field">
            <span className="bk-label">اعراض الحالة</span>
            <input type="text" placeholder="اكتب أعراضك" value={symptoms} onChange={e => setSymptoms(e.target.value)} className="bk-input" />
          </div>
          <div className="bk-field">
            <span className="bk-label">تاريخ الحجز</span>
            <input type="text" value={dateStr} readOnly className="bk-input" />
          </div>
        </div>

        <div className="bk-days-row">
          {AVAILABLE_DAYS.map(day => (
            <button key={day} className="bk-day-btn inactive">{day}</button>
          ))}
        </div>

        <div className="bk-time-grid">
          {TIME_SLOTS.map(t => {
            const taken  = TAKEN.has(t);
            const active = selectedTime === t && !taken;
            return (
              <button
                key={t}
                className={`bk-time-pill ${active ? 'active' : 'inactive'} ${taken ? 'crossed' : ''}`}
                onClick={() => !taken && setSelectedTime(t)}
                disabled={taken}
              >
                {t}
              </button>
            );
          })}
        </div>

        {error && <p style={{ color: '#e53e3e', fontFamily: 'Cairo', textAlign: 'center', fontSize: 14 }}>{error}</p>}

        <button
          className="bk-confirm-submit"
          onClick={handleConfirm}
          disabled={loading}
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          {loading ? '...' : 'تاكيد الحجز'}
        </button>
      </div>
    </div>
  );
}
