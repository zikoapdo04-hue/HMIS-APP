import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
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
  const { user } = useAuth();
  const patientName  = patient?.name  ?? 'احمد محمد';
  const patientEmail = patient?.email ?? 'ahmed@gmail.com';
  const patientPhone = patient?.phone ?? '01234567890';
  const patientId    = patient?.id    ?? '387';

  const [showModal, setShowModal]   = useState(false);
  const [condition, setCondition]   = useState('');
  const [meds, setMeds]             = useState('');
  const [tests, setTests]           = useState('');

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([
    { id: 1, date: '1-3-2026',  condition: '', meds: 'Aspirin',      tests: '', doctorName: 'دكتور مصطفي محمد' },
    { id: 2, date: '8-3-2026',  condition: '', meds: 'Osteoporosis', tests: '', doctorName: 'دكتور مصطفي محمد' },
    { id: 3, date: '20-3-2026', condition: '', meds: 'Prolia',       tests: '', doctorName: 'دكتور يوسف يحي'  },
  ]);

  const today    = new Date();
  const todayStr = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
  const doctorName = user?.name ?? 'الطبيب';

  const handleSave = () => {
    if (!condition && !meds && !tests) return;
    setPrescriptions(prev => [
      { id: Date.now(), date: todayStr, condition, meds, tests, doctorName: `د. ${doctorName}` },
      ...prev,
    ]);
    setCondition(''); setMeds(''); setTests('');
    setShowModal(false);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', border: '1.5px solid #CBD5E0', borderRadius: '12px',
    padding: '12px 16px', fontFamily: 'Cairo', fontSize: '15px',
    outline: 'none', background: '#F8FAFC', color: '#1A202C',
    resize: 'none', direction: 'rtl',
  };

  return (
    <div className="admin-dash-screen" style={{ overflowY: 'auto' }}>

      {/* ── Prescription Modal ── */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            dir="rtl"
            style={{ background: '#fff', borderRadius: '24px', width: '100%', maxWidth: '480px', padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontFamily: 'Cairo', fontSize: '22px', fontWeight: 800, color: '#178CA1', margin: 0 }}>كتابة روشتة</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A0AEC0', fontSize: '24px', lineHeight: 1 }}>✕</button>
            </div>

            <p style={{ fontFamily: 'Cairo', fontSize: '15px', color: '#718096', margin: 0 }}>
              المريض : <strong style={{ color: '#1A202C' }}>{patientName}</strong>
            </p>

            <div>
              <label style={{ fontFamily: 'Cairo', fontSize: '14px', fontWeight: 700, color: '#4A5568', display: 'block', marginBottom: '6px' }}>حالة الحالة</label>
              <textarea rows={2} style={inputStyle} placeholder="اكتب تشخيص الحالة..." value={condition} onChange={e => setCondition(e.target.value)} />
            </div>

            <div>
              <label style={{ fontFamily: 'Cairo', fontSize: '14px', fontWeight: 700, color: '#4A5568', display: 'block', marginBottom: '6px' }}>الأدوية المطلوبة</label>
              <textarea rows={2} style={inputStyle} placeholder="اكتب الأدوية..." value={meds} onChange={e => setMeds(e.target.value)} />
            </div>

            <div>
              <label style={{ fontFamily: 'Cairo', fontSize: '14px', fontWeight: 700, color: '#4A5568', display: 'block', marginBottom: '6px' }}>التحاليل والاشعاعات المطلوبة</label>
              <textarea rows={2} style={inputStyle} placeholder="اكتب التحاليل المطلوبة..." value={tests} onChange={e => setTests(e.target.value)} />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleSave}
                style={{ flex: 1, padding: '14px', background: 'linear-gradient(135deg,#1DB8C8,#0E8A96)', color: 'white', border: 'none', borderRadius: '50px', fontFamily: 'Cairo', fontSize: '16px', fontWeight: 800, cursor: 'pointer' }}
              >
                حفظ الروشتة
              </button>
              <button
                onClick={() => setShowModal(false)}
                style={{ flex: 1, padding: '14px', background: '#EDF2F7', color: '#4A5568', border: 'none', borderRadius: '50px', fontFamily: 'Cairo', fontSize: '16px', fontWeight: 700, cursor: 'pointer' }}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

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
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(patientName)}&background=random&size=150`}
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

        {/* ── Write Prescription Button ── */}
        <div dir="rtl" style={{ margin: '16px 0' }}>
          <button
            onClick={() => setShowModal(true)}
            style={{
              width: '100%', padding: '16px',
              background: 'linear-gradient(135deg, #1DB8C8, #0E8A96)',
              color: 'white', border: 'none', borderRadius: '50px',
              fontFamily: 'Cairo', fontSize: '18px', fontWeight: 800,
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '10px',
              boxShadow: '0 6px 20px rgba(29,184,200,0.38)',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            كتابة روشتة
          </button>
        </div>

        {/* Medical History */}
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
