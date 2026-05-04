import { useState } from 'react';
import type { Screen } from '../../types';
import { HMISGlobe, HMISShieldLogo } from '../../components/Icons';

interface Props { setScreen: (s: Screen) => void }

export function AdminDoctors({ setScreen }: Props) {
  const [search, setSearch] = useState('');

  const doctors = [
    { id: '447', name: 'د.مصطفي محمد', specialty: 'تخصص قلب', phone: '01144748738', avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=100&auto=format&fit=crop' },
    { id: '908', name: 'د.انس احمد', specialty: 'تخصص عظام', phone: '01283693461', avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=100&auto=format&fit=crop' },
    { id: '689', name: 'د.احمد ناصر', specialty: 'تخصص اطفال', phone: '01123872198', avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=100&auto=format&fit=crop' },
  ];

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

      <div className="admin-dash-content">
        {/* Search */}
        <div className="admin-search-bar" dir="rtl">
          <button className="admin-search-icon-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
          <input 
            type="text" 
            placeholder="ابحث عن طبيب" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            className="admin-search-input"
          />
        </div>

        {/* Doctors List */}
        <div className="admin-patients-list">
          {doctors.map(d => (
            <div key={d.id} className="admin-patient-card" dir="rtl">
              <img src={d.avatar} alt={d.name} className="admin-patient-avatar" />
              
              <div className="admin-patient-info" style={{ alignItems: 'center', cursor: 'pointer' }} onClick={() => setScreen('admin-doctor-detail')}>
                <span className="admin-patient-name" style={{ fontSize: 20 }}>{d.name}</span>
                <span className="admin-patient-phone" style={{ marginTop: 0, fontWeight: 600 }}>{d.specialty}</span>
                <span className="admin-patient-id" style={{ marginTop: 4 }}>{d.id} ID</span>
                <span className="admin-patient-phone" style={{ marginTop: 0 }}>
                  {d.phone}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: 4}}>
                    <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
                  </svg>
                </span>
              </div>

              <div className="admin-doctor-actions">
                <button className="admin-btn-edit">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
                <button className="admin-btn-delete">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Bottom Navigation */}
      <nav className="admin-bottom-nav" dir="rtl">
        <button className="admin-nav-item" onClick={() => setScreen('admin-home')}>
          ادارة الحسابات
        </button>
        <button className="admin-nav-item" onClick={() => setScreen('admin-patients')}>
          ادارة المرضي
        </button>
        <button className="admin-nav-item active">
          ادارة الاطباء
        </button>
      </nav>
    </div>
  );
}
