import { useState, useEffect } from 'react';
import { userService } from '../../services/user.service';
import { useAuth } from '../../context/AuthContext';
import type { UserModel } from '../../models/user.model';
import type { Screen } from '../../types';
import { HMISGlobe, HMISShieldLogo, EyeOpen } from '../../components/Icons';

interface Props { setScreen: (s: Screen) => void; onSelectPatient?: (p: UserModel) => void }

export function AdminPatients({ setScreen, onSelectPatient }: Props) {
  const { user }    = useAuth();
  const [search, setSearch]     = useState('');
  const [patients, setPatients] = useState<UserModel[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    userService.getAllPatients().then(list => {
      setPatients(list);
      setLoading(false);
    });
  }, []);

  const filtered = patients.filter(p =>
    p.name.includes(search) || p.phone.includes(search)
  );

  const today = new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' });

  return (
    <div className="admin-dash-screen">
      <div className="admin-dash-header">
        <div className="admin-dash-logo">
          <HMISGlobe size={60} color="#1DB8C8" />
          <span className="admin-dash-hmis">HMIS</span>
          <HMISShieldLogo size={46} color="#1DB8C8" />
        </div>
        <div className="admin-dash-profile">
          <div className="admin-dash-profile-info">
            <span className="admin-dash-role">المدير</span>
            <span className="admin-dash-name">{user?.name ?? 'Admin'}</span>
          </div>
          <img src={user?.imageUrl ?? `https://ui-avatars.com/api/?name=Admin&background=1DB8C8&color=fff&size=100`} alt="Admin" className="admin-dash-avatar" />
        </div>
      </div>

      <div className="admin-dash-date-wrap">
        <span className="admin-dash-date" dir="rtl">{today}</span>
      </div>

      <div className="admin-dash-content">
        <div className="admin-search-bar" dir="rtl">
          <button className="admin-search-icon-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>
          <input type="text" placeholder="ابحث عن مريض" value={search} onChange={e => setSearch(e.target.value)} className="admin-search-input" />
        </div>

        {loading && <p style={{ textAlign: 'center', fontFamily: 'Cairo', color: '#8898AA', padding: 16 }}>جاري التحميل...</p>}

        <div className="admin-patients-list">
          {filtered.map(p => (
            <div key={p.id} className="admin-patient-card" dir="rtl">
              <img
                src={p.imageUrl ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=random&size=100`}
                alt={p.name}
                className="admin-patient-avatar"
              />
              <div className="admin-patient-info">
                <span className="admin-patient-name">{p.name}</span>
                <span className="admin-patient-id">{p.id.slice(0, 6)} ID</span>
                <span className="admin-patient-phone">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 4 }}><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/></svg>
                  {p.phone}
                </span>
              </div>
              <div className="admin-patient-actions">
                <button className="admin-btn-view" onClick={() => { onSelectPatient?.(p); setScreen('admin-patient-detail'); }}>
                  <EyeOpen size={16} />عرض
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="admin-summary-card" dir="rtl">
          <div className="admin-summary-text">
            <span className="admin-summary-label">اجمالي المرضي</span>
            <span className="admin-summary-value">{patients.length}</span>
          </div>
          <div className="admin-summary-icon">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="#178CA1"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
          </div>
        </div>
      </div>

      <nav className="admin-bottom-nav" dir="rtl">
        <button className="admin-nav-item" onClick={() => setScreen('admin-home')}>ادارة الحسابات</button>
        <button className="admin-nav-item active">ادارة المرضي</button>
        <button className="admin-nav-item" onClick={() => setScreen('admin-doctors')}>ادارة الاطباء</button>
      </nav>
    </div>
  );
}
