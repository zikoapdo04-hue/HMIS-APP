import type { Screen } from '../../types';

interface Props {
  setScreen: (s: Screen) => void;
}

export function AdminDoctorDetail({ setScreen }: Props) {
  return (
    <div className="admin-dash-screen" style={{ overflowY: 'auto', background: '#f5f7f9' }}>
      {/* Container simulating the card from the mockup */}
      <div className="admin-doctor-detail-container">
        
        {/* Header / Back button (added for usability even if not fully visible in crop) */}
        <div style={{ display: 'flex', padding: '16px', justifyContent: 'flex-start' }}>
          <button className="admin-detail-back" style={{ color: '#178CA1' }} onClick={() => setScreen('admin-doctors')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(180deg)' }}>
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
        </div>

        <div className="admin-detail-body" style={{ paddingTop: 0 }}>
          
          {/* Profile Section */}
          <div className="admin-doc-detail-profile" dir="rtl">
            <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=150&auto=format&fit=crop" alt="د.مصطفي محمد" className="admin-doc-detail-avatar" />
            
            <div className="admin-doc-detail-info">
              <span className="admin-doc-detail-name">د.مصطفي محمد</span>
              <div className="admin-doc-detail-rating-row">
                <span className="admin-doc-detail-spec">قلب</span>
                <span className="admin-doc-detail-rating">
                  5
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#ECC94B" stroke="#ECC94B">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                </span>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="admin-doc-detail-bio" dir="rtl">
            <h3 className="admin-doc-detail-bio-title">نبذه تعريفية</h3>
            <p className="admin-doc-detail-bio-text">استاذ ودكتور قلب بكلية الطب جامعة القاهرة</p>
          </div>

          {/* Schedule & Location */}
          <div className="admin-detail-card" dir="rtl" style={{ marginTop: '16px' }}>
            <div className="admin-detail-row" style={{ justifyContent: 'flex-start' }}>
              <span className="admin-detail-icon-light">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </span>
              <div className="admin-doc-sched" style={{ fontSize: '16px', flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
                <span className="admin-doc-sched-days">يوم الاثنين , الاربع</span>
                <span className="admin-doc-sched-time">04:00 - 08:00 PM</span>
              </div>
            </div>
            
            <div className="admin-detail-row" style={{ marginTop: '8px', justifyContent: 'flex-start' }}>
              <span className="admin-detail-icon-light">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </span>
              <span className="admin-doc-location" style={{ fontSize: '16px' }}>23 شارع الحجاز, مصر الجديد, القاهرة</span>
            </div>
          </div>

          {/* Contact Info */}
          <div className="admin-detail-section" dir="rtl" style={{ marginTop: '24px' }}>
            <h2 className="admin-detail-section-title">معلومات التواصل</h2>
            <div className="admin-detail-card">
              <div className="admin-detail-row" style={{ justifyContent: 'flex-start' }}>
                <span className="admin-detail-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </span>
                <span className="admin-detail-value">dm hmis@gmail.com</span>
              </div>
              <div className="admin-detail-row" style={{ justifyContent: 'flex-start' }}>
                <span className="admin-detail-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                </span>
                <span className="admin-detail-value">01144748738</span>
              </div>
              <div className="admin-detail-row" style={{ justifyContent: 'flex-start' }}>
                <span className="admin-detail-icon" style={{fontFamily: 'Inter', fontWeight: 800, fontSize: 18}}>ID</span>
                <span className="admin-detail-value">447</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
