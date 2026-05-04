import { useState } from 'react';
import type { Screen } from '../../types';
import { HMISGlobe, HMISShieldLogo, EyeOpen } from '../../components/Icons';

interface Props { setScreen: (s: Screen) => void }

export function AdminPatients({ setScreen }: Props) {
  const [search, setSearch] = useState('');

  const patients = [
    { id: '387', name: 'احمد محمد', phone: '01234567890', lastVisit: '4-3-2026', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop' },
    { id: '786', name: 'مصطفي كمال', phone: '01234567890', lastVisit: '4-3-2026', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop' },
    { id: '623', name: 'اسلام محمد', phone: '01234567890', lastVisit: '4-3-2026', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&auto=format&fit=crop' },
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
            placeholder="ابحث عن مريض" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            className="admin-search-input"
          />
        </div>

        {/* Patients List */}
        <div className="admin-patients-list">
          {patients.map(p => (
            <div key={p.id} className="admin-patient-card" dir="rtl">
              <img src={p.avatar} alt={p.name} className="admin-patient-avatar" />
              
              <div className="admin-patient-info">
                <span className="admin-patient-name">{p.name}</span>
                <span className="admin-patient-id">{p.id} ID</span>
                <span className="admin-patient-phone">
                  {p.phone}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: 4}}>
                    <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
                  </svg>
                </span>
              </div>

              <div className="admin-patient-actions">
                <button className="admin-btn-view" onClick={() => setScreen('admin-patient-detail')}>
                  <EyeOpen size={16} />
                  عرض
                </button>
                <span className="admin-patient-date">اخر زيارة {p.lastVisit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Card */}
        <div className="admin-summary-card" dir="rtl">
          <div className="admin-summary-text">
            <span className="admin-summary-label">اجمالي المرضي</span>
            <span className="admin-summary-value">800</span>
          </div>
          <div className="admin-summary-icon">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="#178CA1">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
            </svg>
          </div>
        </div>

      </div>

      {/* Bottom Navigation */}
      <nav className="admin-bottom-nav" dir="rtl">
        <button className="admin-nav-item" onClick={() => setScreen('admin-home')}>
          ادارة الحسابات
        </button>
        <button className="admin-nav-item active">
          ادارة المرضي
        </button>
        <button className="admin-nav-item" onClick={() => setScreen('admin-doctors')}>
          ادارة الاطباء
        </button>
      </nav>
    </div>
  );
}
