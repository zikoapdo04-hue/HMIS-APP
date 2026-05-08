import { useState, useRef } from 'react';
import type { Screen } from '../../types';
import { PatientBottomNav } from '../../components/PatientBottomNav';
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

const INITIAL_RECORDS = [
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
    uploadedImgs: [] as string[],
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
    uploadedImgs: [] as string[],
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
    uploadedImgs: [] as string[],
  },
];

const PRINT_ICON = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#2B2E60">
    <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-2-9H7v4h10V3z"/>
  </svg>
);

export function PatientProfile({ setScreen }: Props) {
  const { user } = useAuth();
  const [records, setRecords] = useState(INITIAL_RECORDS);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeRecordId, setActiveRecordId] = useState<string | null>(null);

  const handleImageClick = (recordId: string) => {
    setActiveRecordId(recordId);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0 && activeRecordId) {
      const newImgUrls = files.map(file => URL.createObjectURL(file));
      
      let allNewImgs: string[] = [];
      setRecords(prev => {
        const updated = prev.map(rec => {
          if (rec.id === activeRecordId) {
            allNewImgs = [...rec.uploadedImgs, ...newImgUrls];
            return { ...rec, uploadedImgs: allNewImgs };
          }
          return rec;
        });
        
        const globalRecords = JSON.parse(localStorage.getItem('patient_radiology_records') || '[]');
        const toAdd = newImgUrls.map((url, idx) => ({
          id: Date.now() + idx,
          type: 'أشعة وتحاليل مرفقة',
          date: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
          doctor: 'مرسلة من المريض',
          imageUrl: url,
          tag: 'xray'
        }));
        localStorage.setItem('patient_radiology_records', JSON.stringify([...globalRecords, ...toAdd]));
        
        return updated;
      });
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const patientName = user?.name ?? 'احمد محمد';
  const avatarUrl = localStorage.getItem('global_patient_avatar') || user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(patientName)}&background=0e7490&color=fff&size=128`;

  return (
    <div className="pp-screen" dir="rtl">

      {/* ── Header ── */}
      <header className="pp-header">
        <button className="pp-settings-btn" onClick={() => setScreen('patient-settings')} aria-label="settings">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96a6.96 6.96 0 0 0-1.62-.94l-.36-2.54A.484.484 0 0 0 14 2h-4a.484.484 0 0 0-.48.41l-.36 2.54a6.96 6.96 0 0 0-1.62.94l-2.39-.96a.48.48 0 0 0-.59.22L2.64 8.47a.48.48 0 0 0 .12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.36 1.05.66 1.62.94l.36 2.54c.05.24.27.41.48.41h4c.24 0 .44-.17.47-.41l.36-2.54a6.96 6.96 0 0 0 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.49.49 0 0 0-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
          </svg>
        </button>
        <span className="pp-header-title">الحساب الشخصي للمريض</span>
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

        {/* ── Radiology & Tests Button ── */}
        <div dir="rtl" style={{ margin: '4px 0 16px' }}>
          <button
            onClick={() => setScreen('patient-radiology-record' as any)}
            style={{
              width: '100%', padding: '16px',
              background: 'linear-gradient(135deg, #7B5EA7, #5B3F8A)',
              color: 'white', border: 'none', borderRadius: '50px',
              fontFamily: 'Cairo', fontSize: '18px', fontWeight: 800,
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '10px',
              boxShadow: '0 6px 20px rgba(123,94,167,0.35)',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="3" ry="3"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            سجل الأشعة والتحاليل
          </button>
        </div>

        {/* ── Medical history section ── */}
        <h3 className="pp-section-title">التاريخ المرضي</h3>

        {/* Hidden file input for xray uploads */}
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept="image/*" 
          multiple
          onChange={handleFileChange} 
        />

        {records.map(rec => (
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
              <div 
                className="pp-xray-wrap" 
                onClick={() => handleImageClick(rec.id)}
                style={{ cursor: 'pointer', position: 'relative' }}
              >
                <img
                  src={rec.uploadedImgs.length > 0 ? rec.uploadedImgs[0] : "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=300"}
                  alt="X-Ray"
                  className="pp-xray-img"
                  style={rec.uploadedImgs.length > 0 ? { opacity: 1, filter: 'none' } : {}}
                />
                {rec.uploadedImgs.length === 0 && (
                  <div className="pp-xray-plus">
                    <div className="pp-plus-h" /><div className="pp-plus-v" />
                  </div>
                )}
                {rec.uploadedImgs.length > 0 && (
                  <div style={{
                    position: 'absolute', top: '8px', right: '8px', 
                    background: 'rgba(29, 184, 200, 0.9)', color: 'white', 
                    padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold'
                  }}>
                    تم ارسال {rec.uploadedImgs.length} صور للطبيب
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Bottom nav ── */}
      <PatientBottomNav activeScreen="patient-profile" setScreen={setScreen} />
    </div>
  );
}
