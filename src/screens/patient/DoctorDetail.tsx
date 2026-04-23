import type { Screen } from '../../types';

export interface DoctorInfo {
  uid:       string;
  name:      string;
  specialty: string;
  rating:    number;
  phone:     string;
  address?:  string;
}

interface Props {
  setScreen: (s: Screen) => void;
  doctor: DoctorInfo | null;
}

const STAR_SVG = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#ECC94B" stroke="#ECC94B">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

export function DoctorDetail({ setScreen, doctor }: Props) {
  if (!doctor) {
    setScreen('clinics');
    return null;
  }

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=0e7490&color=fff&size=128`;

  return (
    <div className="doctor-detail-screen" dir="rtl">
      {/* Header */}
      <header className="booking-header">
        <h2>ملف الطبيب</h2>
      </header>

      <div className="dd-body">
        {/* Hero card */}
        <div className="dd-hero-card">
          <div className="dd-avatar-wrap">
            <img src={avatarUrl} alt={doctor.name} className="dd-avatar" />
            <div className="dd-rating-badge">
              {STAR_SVG}
              <span>{doctor.rating}</span>
            </div>
          </div>
          <h2 className="dd-name">{doctor.name}</h2>
          <span className="dd-specialty-pill">{doctor.specialty}</span>
        </div>

        {/* Info cards */}
        <div className="dd-info-grid">
          {/* Phone */}
          <div className="dd-info-card">
            <div className="dd-info-icon" style={{ background: '#e0f7f9' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0e7490" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </div>
            <div className="dd-info-text">
              <span className="dd-info-label">رقم الهاتف</span>
              <span className="dd-info-value" dir="ltr">{doctor.phone}</span>
            </div>
          </div>

          {/* Specialty */}
          <div className="dd-info-card">
            <div className="dd-info-icon" style={{ background: '#fef3c7' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a5 5 0 1 1 0 10A5 5 0 0 1 12 2z"/><path d="M4 20c0-4 3.58-7 8-7s8 3 8 7"/>
              </svg>
            </div>
            <div className="dd-info-text">
              <span className="dd-info-label">التخصص</span>
              <span className="dd-info-value">{doctor.specialty}</span>
            </div>
          </div>

          {/* Address */}
          {doctor.address && (
            <div className="dd-info-card">
              <div className="dd-info-icon" style={{ background: '#ede9fe' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div className="dd-info-text">
                <span className="dd-info-label">العيادة</span>
                <span className="dd-info-value">{doctor.address}</span>
              </div>
            </div>
          )}

          {/* Rating */}
          <div className="dd-info-card">
            <div className="dd-info-icon" style={{ background: '#fef9c3' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#ECC94B" stroke="#ECC94B">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>
            <div className="dd-info-text">
              <span className="dd-info-label">التقييم</span>
              <span className="dd-info-value">{doctor.rating} / 5</span>
            </div>
          </div>
        </div>

        {/* Book button */}
        <button
          className="dd-book-btn"
          onClick={() => setScreen('book-appointment')}
        >
          احجز موعداً الآن
        </button>
      </div>
    </div>
  );
}
