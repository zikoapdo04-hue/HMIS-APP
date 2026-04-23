import type { Screen } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface Props { setScreen: (s: Screen) => void }

/* ── Mock data ── */
const APPOINTMENTS = [
  {
    id: 'a1',
    date: '10-3-2026',
    type: 'حجز',
    doctor: 'دكتور خالد توفيق',
    specialty: 'جراحة عامة',
    imgUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=150&h=150',
  },
];

const RECORDS = [
  {
    id: 'r1',
    date: '1-3-2026',
    doctor: 'دكتور مصطفي محمد',
    specialty: 'قلب',
    imgUrl: 'https://images.unsplash.com/photo-1537368910025-702800a4465b?auto=format&fit=crop&q=80&w=150&h=150',
    status: '',
    meds: 'Entresto',
    tests: 'التحليل والاشعات المطلوبة :',
    showXray: true,
  },
  {
    id: 'r2',
    date: '8-3-2026',
    doctor: 'دكتور مصطفي محمد',
    specialty: 'قلب',
    imgUrl: 'https://images.unsplash.com/photo-1537368910025-702800a4465b?auto=format&fit=crop&q=80&w=150&h=150',
    status: '',
    meds: 'Prolia',
    tests: 'التحليل والاشعات المطلوبة :',
    showXray: true,
  },
  {
    id: 'r3',
    date: '20-3-2026',
    doctor: 'دكتور يوسف يحي',
    specialty: 'عظام',
    imgUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=150&h=150',
    status: '',
    meds: 'Prolia',
    tests: 'التحليل والاشعات المطلوبة :',
    showXray: true,
  },
];

const PRINT_ICON = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#2B2E60">
    <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-2-9H7v4h10V3z"/>
  </svg>
);

export function PatientProfile({ setScreen }: Props) {
  const { user } = useAuth();
  const patientName = user?.name ?? 'احمد محمد';
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(patientName)}&background=0e7490&color=fff&size=128`;

  return (
    <div className="pp-screen" dir="rtl">

      {/* ── Header ── */}
      <header className="pp-header">
        <button className="pp-settings-btn" onClick={() => setScreen('patient-settings')} aria-label="settings">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96a6.96 6.96 0 0 0-1.62-.94l-.36-2.54A.484.484 0 0 0 14 2h-4a.484.484 0 0 0-.48.41l-.36 2.54a6.96 6.96 0 0 0-1.62.94l-2.39-.96a.48.48 0 0 0-.59.22L2.64 8.47a.48.48 0 0 0 .12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.36 1.05.66 1.62.94l.36 2.54c.05.24.27.41.48.41h4c.24 0 .44-.17.47-.41l.36-2.54a6.96 6.96 0 0 0 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.49.49 0 0 0-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
          </svg>
        </button>
        <span className="pp-header-title">الحساب الشخصي</span>
      </header>

      {/* ── Scrollable body ── */}
      <div className="pp-body">

        {/* ── Patient info ── */}
        <div className="pp-patient-card">
          <div className="pp-patient-info">
            <img src={avatarUrl} alt={patientName} className="pp-avatar" />
            <span className="pp-patient-name">{patientName}</span>
          </div>
          <button className="pp-contact-btn" onClick={() => setScreen('patient-account-settings')}>
            معلومات التواصل
          </button>
        </div>

        {/* ── Appointments section ── */}
        <h3 className="pp-section-title">المواعيد المحجوزة</h3>
        {APPOINTMENTS.map(apt => (
          <div key={apt.id} className="pp-card" dir="rtl">
            <p className="pp-card-date">تم حجز يوم {apt.date}</p>
            <div className="pp-card-doctor-row">
              <img src={apt.imgUrl} alt={apt.doctor} className="pp-card-avatar" />
              <div className="pp-card-doctor-info">
                <span className="pp-card-doctor-name">{apt.doctor}</span>
                <span className="pp-card-specialty">{apt.specialty}</span>
              </div>
            </div>
          </div>
        ))}

        {/* ── Medical history section ── */}
        <h3 className="pp-section-title">التاريخ المرضي</h3>
        {RECORDS.map(rec => (
          <div key={rec.id} className="pp-card" dir="rtl">
            {/* Print icon */}
            <div className="pp-print-icon">{PRINT_ICON}</div>

            <p className="pp-card-date">تم الكشف يوم {rec.date}</p>

            <div className="pp-card-doctor-row">
              <img src={rec.imgUrl} alt={rec.doctor} className="pp-card-avatar" />
              <div className="pp-card-doctor-info">
                <span className="pp-card-doctor-name">{rec.doctor}</span>
                <span className="pp-card-specialty">{rec.specialty}</span>
              </div>
            </div>

            <div className="pp-card-details">
              {rec.status ? <p className="pp-card-detail-row">حالة الحالة : {rec.status}</p> : null}
              {rec.meds   ? <p className="pp-card-detail-row">الادوية المطلوبة : <span style={{ color: '#1A3A4A' }}>{rec.meds}</span></p> : null}
              <p className="pp-card-detail-row">{rec.tests}</p>
            </div>

            {rec.showXray && (
              <div className="pp-xray-wrap">
                <img
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=300"
                  alt="X-Ray"
                  className="pp-xray-img"
                />
                <div className="pp-xray-plus">
                  <div className="pp-plus-h" /><div className="pp-plus-v" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Bottom nav ── */}
      <nav className="dash-nav">
        <button className="dash-nav-active" aria-label="account">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
          الحساب
        </button>
        <button className="dash-nav-icon" aria-label="appointments" onClick={() => setScreen('patient-appointments')}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </button>
        <button className="dash-nav-icon" aria-label="search" onClick={() => setScreen('patient-search')}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </button>
        <button className="dash-nav-icon" aria-label="home" onClick={() => setScreen('patient-home')}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
        </button>
      </nav>
    </div>
  );
}
