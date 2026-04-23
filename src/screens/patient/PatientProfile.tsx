import type { Screen } from '../../types';

interface Props { setScreen: (s: Screen) => void }

export function PatientProfile({ }: Props) {
  const records = [
    {
      id: 1,
      date: '1-3-2026',
      doctor: 'دكتور مصطفي محمد',
      specialty: 'قلب',
      imgUrl: 'https://images.unsplash.com/photo-1537368910025-702800a4465b?auto=format&fit=crop&q=80&w=150&h=150',
      status: '',
      meds: '',
      tests: 'التحاليل والاشعات المطلوبة :',
      showXray: true,
    },
    {
      id: 2,
      date: '8-3-2026',
      doctor: 'دكتور مصطفي محمد',
      specialty: 'قلب',
      imgUrl: 'https://images.unsplash.com/photo-1537368910025-702800a4465b?auto=format&fit=crop&q=80&w=150&h=150',
      status: '',
      meds: '',
      tests: 'التحاليل والاشعات المطلوبة :',
      showXray: true,
    },
    {
      id: 3,
      date: '20-3-2026',
      doctor: 'دكتور يوسف يحي',
      specialty: 'عظام',
      imgUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=150&h=150',
      status: '',
      meds: 'Prolia',
      tests: 'التحاليل والاشعات المطلوبة :',
      showXray: true,
    }
  ];

  return (
    <div style={{ width: '100%', height: '100vh', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <header style={{ padding: '24px', textAlign: 'center', position: 'relative', background: '#148C9E', flexShrink: 0 }}>
        {/* Title */}
        <span style={{ color: 'white', fontSize: '28px', fontFamily: 'Cairo, sans-serif', fontWeight: 800 }}>الحساب الشخصي</span>
        {/* Print Icon in Header */}
        <button style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: '1.5px solid #2B2E60', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#2B2E60"><path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-2-9H7v4h10V3z"/></svg>
        </button>
      </header>

      {/* Main List */}
      <div style={{ padding: '24px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px', background: '#FFFFFF' }}>
        {records.map((rec) => (
          <div key={rec.id} style={{ backgroundColor: '#E4ECF4', borderRadius: '16px', padding: '20px', position: 'relative' }} dir="rtl">
            
            {/* Print Icon on top left of card */}
            <div style={{ position: 'absolute', top: '20px', left: '20px', width: '36px', height: '36px', borderRadius: '50%', border: '2px solid #2B2E60', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#2B2E60"><path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-2-9H7v4h10V3z"/></svg>
            </div>

            <p style={{ color: '#4A5568', fontFamily: 'Cairo, sans-serif', fontSize: '18px', fontWeight: 600, margin: 0, textAlign: 'right' }}>
              تم الكشف يوم {rec.date}
            </p>
            
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '16px', gap: '16px' }}>
              <img src={rec.imgUrl} alt={rec.doctor} style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover' }} />
              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'right' }}>
                <span style={{ color: '#3197A7', fontFamily: 'Cairo, sans-serif', fontSize: '20px', fontWeight: 800 }}>{rec.doctor}</span>
                <span style={{ color: '#4A5568', fontFamily: 'Cairo, sans-serif', fontSize: '18px', fontWeight: 700 }}>{rec.specialty}</span>
              </div>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p style={{ color: '#4A5568', fontFamily: 'Cairo, sans-serif', fontSize: '16px', fontWeight: 700, margin: 0, textAlign: 'right' }}>
                حالة الحالة : {rec.status}
              </p>
              <p style={{ color: '#4A5568', fontFamily: 'Cairo, sans-serif', fontSize: '16px', fontWeight: 700, margin: 0, textAlign: 'right' }}>
                الادوية المطلوبة : {rec.meds}
              </p>
              <p style={{ color: '#4A5568', fontFamily: 'Cairo, sans-serif', fontSize: '16px', fontWeight: 700, margin: 0, textAlign: 'right' }}>
                {rec.tests}
              </p>
            </div>

            {rec.showXray && (
               <div style={{ marginTop: '16px', position: 'relative', width: '100%', maxWidth: '160px', marginRight: 'auto' }}>
                 <img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=300" alt="X-Ray Scans" style={{ width: '100%', borderRadius: '8px', opacity: 0.8, filter: 'grayscale(100%) contrast(1.2)' }} />
                 {/* Plus Overlay */}
                 <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '40px', height: '40px', pointerEvents: 'none' }}>
                   <div style={{ position: 'absolute', top: '16px', left: '0', right: '0', height: '8px', backgroundColor: 'black' }} />
                   <div style={{ position: 'absolute', left: '16px', top: '0', bottom: '0', width: '8px', backgroundColor: 'black' }} />
                 </div>
              </div>
            )}
            
          </div>
        ))}
      </div>
      
    </div>
  );
}
