import { useState } from 'react';
import type { Screen } from '../../types';
import { HMISGlobe, HMISShieldLogo } from '../../components/Icons';

interface Props {
  setScreen: (s: Screen) => void;
}

export function AdminHome({ setScreen }: Props) {
  const [appointments, setAppointments] = useState([
    { id: 1, name: 'احمد محمد', doctor: 'خالد توفيق', specialty: 'قلب', date: 'الاثنين 10-4-2026', time: '04:00Pm', location: 'مدينة نصر' },
    { id: 2, name: 'يوسف حمدي', doctor: 'انس احمد', specialty: 'عظام', date: 'الاثنين 10-4-2026', time: '05:30Pm', location: 'الدقي' },
    { id: 3, name: 'احمد وليد', doctor: 'احمد ناصر', specialty: 'اطفال', date: 'الاثنين 10-4-2026', time: '06:00Pm', location: 'مصر الجديدة' },
  ]);

  const handleDelete = (id: number) => {
    setAppointments(appointments.filter(a => a.id !== id));
  };

  return (
    <div className="admin-dash-screen">
      
      {/* Header */}
      <div className="admin-dash-header">
        <div className="admin-dash-logo">
          <HMISGlobe size={60} color="#1DB8C8" />
          <span className="admin-dash-hmis">HMIS</span>
          <HMISShieldLogo size={46} color="#1DB8C8" />
        </div>
        <div className="admin-dash-profile">
          <div className="admin-dash-profile-info">
            <span className="admin-dash-role">المدير</span>
            <span className="admin-dash-name">Admin</span>
          </div>
          <img 
            src="https://ui-avatars.com/api/?name=Admin&background=random&size=100" 
            alt="Admin" 
            className="admin-dash-avatar"
          />
        </div>
      </div>
      
      {/* Date */}
      <div className="admin-dash-date-wrap">
        <span className="admin-dash-day">الاثنين</span>
        <span className="admin-dash-date">10-3-2026</span>
      </div>

      {/* Scrollable Content */}
      <div className="admin-dash-content">
        
        {/* Stat Cards */}
        <div className="admin-stat-cards" dir="rtl">
          <div className="admin-stat-card" style={{ background: '#7498a5' }}>
            <span className="admin-stat-title">عدد الكشفات</span>
            <div className="admin-stat-inner">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
                <circle cx="16" cy="16" r="4"></circle>
                <polyline points="16 14 16 16 18 16"></polyline>
              </svg>
              <span className="admin-stat-num">476</span>
            </div>
          </div>

          <div className="admin-stat-card" style={{ background: '#41b1be' }}>
            <span className="admin-stat-title">عدد المرضي</span>
            <div className="admin-stat-inner">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              <span className="admin-stat-num">389</span>
            </div>
          </div>

          <div className="admin-stat-card" style={{ background: '#97cae1' }}>
            <span className="admin-stat-title">عدد الاطباء</span>
            <div className="admin-stat-inner">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                <circle cx="20" cy="8" r="3" fill="currentColor"/>
                <path d="M24 16v-2c0-1.66-1.34-3-3-3h-2c1.66 0 3 1.34 3 3v2h2z" fill="currentColor"/>
                <circle cx="4" cy="8" r="3" fill="currentColor"/>
                <path d="M2 16v-2c0-1.66 1.34-3 3-3h2c-1.66 0-3 1.34-3 3v2H2z" fill="currentColor"/>
              </svg>
              <span className="admin-stat-num">50</span>
            </div>
          </div>
        </div>

        {/* Chart Area Mockup */}
        <div className="admin-chart-box">
          <div className="admin-chart-header">
            <span className="admin-chart-title">Appointments Over Time</span>
            <div className="admin-chart-legend">
              <span className="admin-chart-dot"></span>
              <span className="admin-chart-label">Appointments</span>
            </div>
          </div>
          {/* Mockup Chart Visual */}
          <div className="admin-chart-visual">
            <div className="admin-chart-y">
              <span>30</span><span>20</span><span>10</span><span>0</span>
            </div>
            <div className="admin-chart-graph">
              <div className="admin-chart-line-bg">
                <div className="grid-line" style={{bottom: '0%'}}></div>
                <div className="grid-line" style={{bottom: '33%'}}></div>
                <div className="grid-line" style={{bottom: '66%'}}></div>
                <div className="grid-line" style={{bottom: '100%'}}></div>
              </div>
              <div className="admin-chart-bars">
                <div className="chart-bar" style={{height: '15%'}}></div>
                <div className="chart-bar" style={{height: '30%'}}></div>
                <div className="chart-bar" style={{height: '25%'}}></div>
                <div className="chart-bar" style={{height: '40%'}}></div>
                <div className="chart-bar" style={{height: '35%'}}></div>
                <div className="chart-bar" style={{height: '50%'}}></div>
                <div className="chart-bar" style={{height: '45%'}}></div>
                <div className="chart-bar" style={{height: '60%'}}></div>
                <div className="chart-bar" style={{height: '35%'}}></div>
                <div className="chart-bar" style={{height: '75%'}}></div>
              </div>
              <svg width="100%" height="100%" className="admin-chart-svg" preserveAspectRatio="none">
                <path d="M0 90 Q 20 70 40 85 T 80 75 T 120 85 T 160 50 T 200 60 T 240 30 T 280 40 T 320 15" fill="none" stroke="#2596be" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke"/>
                <circle cx="40" cy="85" r="4" fill="white" stroke="#2596be" strokeWidth="2" vectorEffect="non-scaling-stroke"/>
                <circle cx="80" cy="75" r="4" fill="white" stroke="#2596be" strokeWidth="2" vectorEffect="non-scaling-stroke"/>
                <circle cx="120" cy="85" r="4" fill="white" stroke="#2596be" strokeWidth="2" vectorEffect="non-scaling-stroke"/>
                <circle cx="160" cy="50" r="4" fill="white" stroke="#2596be" strokeWidth="2" vectorEffect="non-scaling-stroke"/>
                <circle cx="200" cy="60" r="4" fill="white" stroke="#2596be" strokeWidth="2" vectorEffect="non-scaling-stroke"/>
                <circle cx="240" cy="30" r="4" fill="white" stroke="#2596be" strokeWidth="2" vectorEffect="non-scaling-stroke"/>
                <circle cx="280" cy="40" r="4" fill="white" stroke="#2596be" strokeWidth="2" vectorEffect="non-scaling-stroke"/>
                <circle cx="320" cy="15" r="4" fill="white" stroke="#2596be" strokeWidth="2" vectorEffect="non-scaling-stroke"/>
              </svg>
            </div>
          </div>
          <div className="admin-chart-x">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        {/* Appointments Section */}
        <div className="admin-appointments-section" dir="rtl">
          <h2 className="admin-appts-title">الكشفات</h2>
          
          <div className="admin-appts-table">
            <div className="admin-appts-header">
              <div style={{flex: 1.2}}>الاسم</div>
              <div style={{flex: 1.5}}>الطبيب</div>
              <div style={{flex: 1.5}}>المواعيد</div>
              <div style={{flex: 1.5}}>موقع العيادة</div>
              <div style={{flex: 1}}>الحجوزات</div>
            </div>

            <div className="admin-appts-list">
              {appointments.map((appt) => (
                <div key={appt.id} className="admin-appt-row">
                  <div style={{flex: 1.2, color: '#178CA1', fontWeight: 700, fontSize: 15}}>{appt.name}</div>
                  <div style={{flex: 1.5, display: 'flex', flexDirection: 'column', color: '#4A5568', fontSize: 14, fontWeight: 700}}>
                    <span>{appt.doctor}</span>
                    <span style={{fontSize: 12, fontWeight: 600}}>{appt.specialty}</span>
                  </div>
                  <div style={{flex: 1.5, display: 'flex', flexDirection: 'column', color: '#4A5568', fontSize: 13, fontWeight: 600}}>
                    <span>{appt.date}</span>
                    <span>{appt.time}</span>
                  </div>
                  <div style={{flex: 1.5, color: '#4A5568', fontWeight: 600, fontSize: 14}}>{appt.location}</div>
                  <div style={{flex: 1}}>
                    <button className="admin-appt-delete-btn" onClick={() => handleDelete(appt.id)}>حذف الحجز</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="admin-bottom-nav" dir="rtl">
        <button className="admin-nav-item active">
          ادارة الحسابات
        </button>
        <button className="admin-nav-item" onClick={() => setScreen('admin-patients')}>
          ادارة المرضي
        </button>
        <button className="admin-nav-item" onClick={() => setScreen('admin-doctors')}>
          ادارة الاطباء
        </button>
      </nav>
    </div>
  );
}
