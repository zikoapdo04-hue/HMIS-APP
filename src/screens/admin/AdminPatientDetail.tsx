import { useState } from 'react';
import type { Screen, PatientInfo } from '../../types';

interface Props {
  setScreen: (s: Screen) => void;
  patient?:  PatientInfo | null;
}

interface Prescription {
  id:        number;
  date:      string;
  condition: string;
  meds:      string;
  tests:     string;
  doctorName: string;
}

export function AdminPatientDetail({ setScreen, patient }: Props) {
  const patientName  = patient?.name  ?? 'احمد محمد';
  const patientEmail = patient?.email ?? 'ahmed@gmail.com';
  const patientPhone = patient?.phone ?? '01234567890';
  const patientId    = patient?.id    ?? '387';
  const avatarUrl    = patient?.photoURL || localStorage.getItem('global_patient_avatar') || `https://ui-avatars.com/api/?name=${encodeURIComponent(patientName)}&background=random&size=150`;

  const [prescriptions] = useState<Prescription[]>([
    { id: 1, date: '1-3-2026',  condition: '', meds: 'Aspirin',      tests: '', doctorName: 'دكتور مصطفي محمد' },
    { id: 2, date: '8-3-2026',  condition: '', meds: 'Osteoporosis', tests: '', doctorName: 'دكتور مصطفي محمد' },
    { id: 3, date: '20-3-2026', condition: '', meds: 'Prolia',       tests: '', doctorName: 'دكتور يوسف يحي'  },
  ]);

  return (
    <div className="admin-dash-screen" style={{ overflowY: 'auto' }}>


      {/* Header */}
      <div className="admin-detail-header" dir="rtl">
        <button className="admin-detail-back" onClick={() => setScreen('admin-patients')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(180deg)' }}>
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <span className="admin-detail-title">بيانات المريض</span>
        <button className="admin-detail-print" onClick={() => window.print()}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 6 2 18 2 18 9"></polyline>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
            <rect x="6" y="14" width="12" height="8"></rect>
          </svg>
        </button>
      </div>

      <div className="admin-detail-body">

        {/* Profile */}
        <div className="admin-detail-profile">
          <span className="admin-detail-name">{patientName}</span>
          <img
            src={avatarUrl}
            alt={patientName}
            className="admin-detail-avatar"
          />
        </div>

        {/* Contact Info */}
        <div className="admin-detail-section" dir="rtl">
          <h2 className="admin-detail-section-title">معلومات التواصل</h2>
          <div className="admin-detail-card">
            <div className="admin-detail-row">
              <span className="admin-detail-value" dir="ltr">{patientEmail}</span>
              <span className="admin-detail-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </span>
            </div>
            <div className="admin-detail-row">
              <span className="admin-detail-value" dir="ltr">{patientPhone}</span>
              <span className="admin-detail-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
              </span>
            </div>
            <div className="admin-detail-row">
              <span className="admin-detail-value" dir="ltr">{patientId}</span>
              <span className="admin-detail-icon" style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 18 }}>ID</span>
            </div>
          </div>
        </div>

        {/* ── Radiology & Tests Button ── */}
        <div dir="rtl" style={{ margin: '4px 0 0' }}>
          <button
            onClick={() => setScreen('admin-radiology-record')}
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

        <div className="admin-detail-section" dir="rtl">
          <h2 className="admin-detail-section-title">التاريخ المرضي</h2>

          {prescriptions.map(rx => (
            <div key={rx.id} className="admin-detail-card" style={{ padding: '24px', position: 'relative', marginBottom: '12px' }}>
              <button className="admin-history-print" onClick={() => window.print()}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 6 2 18 2 18 9"></polyline>
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                  <rect x="6" y="14" width="12" height="8"></rect>
                </svg>
              </button>

              <div className="admin-history-header">تم الكشف يوم {rx.date}</div>

              <div className="admin-history-doctor">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(rx.doctorName)}&background=random&size=80`}
                  alt={rx.doctorName}
                  className="admin-history-doc-avatar"
                />
                <div className="admin-history-doc-info">
                  <span className="admin-history-doc-name">{rx.doctorName}</span>
                </div>
              </div>

              <div className="admin-history-details">
                {rx.condition && <p>حالة الحالة : {rx.condition}</p>}
                {rx.meds      && <p>الادوية المطلوبة : {rx.meds}</p>}
                {rx.tests     && <p style={{ marginTop: 8 }}>التحاليل والاشعات : {rx.tests}</p>}
              </div>


            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
