import { useState, useEffect } from 'react';
import { userService } from '../../services/user.service';
import { useAuth } from '../../context/AuthContext';
import { DoctorStatus } from '../../core/enums';
import type { UserModel } from '../../models/user.model';
import type { Screen } from '../../types';
import { HMISGlobe, HMISShieldLogo } from '../../components/Icons';

interface Props { setScreen: (s: Screen) => void }

export function AdminDoctors({ setScreen }: Props) {
  const { user } = useAuth();
  const [search, setSearch]   = useState('');
  const [doctors, setDoctors] = useState<UserModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userService.getAllDoctors().then(docs => {
      setDoctors(docs);
      setLoading(false);
    });
  }, []);

  const filtered = doctors.filter(d =>
    d.name.includes(search) || (d.specialty ?? '').includes(search)
  );

  const handleApprove = async (doctorId: string) => {
    if (!user) return;
    await userService.approveDoctor(doctorId, user.id);
    setDoctors(prev => prev.map(d => d.id === doctorId ? { ...d, doctorStatus: DoctorStatus.Approved } : d));
  };

  const handleReject = async (doctorId: string) => {
    await userService.rejectDoctor(doctorId);
    setDoctors(prev => prev.map(d => d.id === doctorId ? { ...d, doctorStatus: DoctorStatus.Rejected } : d));
  };

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
          <img src={user?.imageUrl ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name ?? 'Admin')}&background=1DB8C8&color=fff&size=100`} alt="Admin" className="admin-dash-avatar" />
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
          <input type="text" placeholder="ابحث عن طبيب" value={search} onChange={e => setSearch(e.target.value)} className="admin-search-input" />
        </div>

        {loading && <p style={{ textAlign: 'center', fontFamily: 'Cairo', color: '#8898AA', padding: 16 }}>جاري التحميل...</p>}

        <div className="admin-patients-list">
          {filtered.map(d => (
            <div key={d.id} className="admin-patient-card" dir="rtl">
              <img
                src={d.imageUrl ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(d.name)}&background=1DB8C8&color=fff&size=100`}
                alt={d.name}
                className="admin-patient-avatar"
              />
              <div className="admin-patient-info" style={{ alignItems: 'center', cursor: 'pointer' }} onClick={() => setScreen('admin-doctor-detail')}>
                <span className="admin-patient-name" style={{ fontSize: 20 }}>{d.name}</span>
                <span className="admin-patient-phone" style={{ marginTop: 0, fontWeight: 600 }}>{d.specialty}</span>
                <span className="admin-patient-id">{d.id.slice(0, 6)} ID</span>
                <span className="admin-patient-phone" style={{ marginTop: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 4 }}><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/></svg>
                  {d.phone}
                </span>
                {/* Status badge */}
                <span style={{
                  display: 'inline-block', marginTop: 4, padding: '2px 10px', borderRadius: 20, fontSize: 12, fontFamily: 'Cairo', fontWeight: 700,
                  background: d.doctorStatus === DoctorStatus.Approved ? '#D1FAE5' : d.doctorStatus === DoctorStatus.Rejected ? '#FEE2E2' : '#FEF3C7',
                  color:      d.doctorStatus === DoctorStatus.Approved ? '#065F46' : d.doctorStatus === DoctorStatus.Rejected ? '#991B1B' : '#92400E',
                }}>
                  {d.doctorStatus === DoctorStatus.Approved ? 'معتمد' : d.doctorStatus === DoctorStatus.Rejected ? 'مرفوض' : 'في الانتظار'}
                </span>
              </div>

              <div className="admin-doctor-actions">
                {d.doctorStatus === DoctorStatus.Pending && (
                  <button onClick={() => handleApprove(d.id)} className="admin-btn-edit" title="اعتماد" style={{ background: '#D1FAE5', color: '#065F46' }}>✓</button>
                )}
                <button onClick={() => handleReject(d.id)} className="admin-btn-delete" title="رفض">✕</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <nav className="admin-bottom-nav" dir="rtl">
        <button className="admin-nav-item" onClick={() => setScreen('admin-home')}>ادارة الحسابات</button>
        <button className="admin-nav-item" onClick={() => setScreen('admin-patients')}>ادارة المرضي</button>
        <button className="admin-nav-item active">ادارة الاطباء</button>
      </nav>
    </div>
  );
}
