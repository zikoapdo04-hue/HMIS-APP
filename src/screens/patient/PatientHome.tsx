import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import type { Screen } from '../../types';
import { HMISGlobe, HMISShieldLogo } from '../../components/Icons';
import { PatientBottomNav } from '../../components/PatientBottomNav';

interface Props { setScreen: (s: Screen) => void; setSpecialty?: (s: string) => void }

const specialties = [
  { name: 'عظام',         color: '#6CD4C4', screen: 'clinics' as Screen },
  { name: 'جراحة عامة',  color: '#8DBDF8', screen: 'clinics' as Screen },
  { name: 'نساء وتوليد', color: '#42685B', screen: 'clinics' as Screen },
  { name: 'قلب',          color: '#F99E8F', screen: 'clinics' as Screen },
  { name: 'مخ واعصاب',   color: '#26873F', screen: 'clinics' as Screen },
  { name: 'اطفال',        color: '#E53E17', screen: 'clinics' as Screen },
];

const ILL = `${import.meta.env.BASE_URL}doctors_illustration.png`;

export function PatientHome({ setScreen, setSpecialty }: Props) {
  const { user, updateUser } = useAuth();
  const patientName = user?.name ?? 'مريض';
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [hasUnread, setHasUnread] = useState(localStorage.getItem('patient_notifications_read') !== 'true');

  return (
    <div style={{ backgroundColor: '#ffffff', height: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 24px', flexShrink: 0, position: 'relative', zIndex: 50 }}>
        <button 
          style={{ position: 'absolute', left: '24px', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }} 
          onClick={() => {
            setHasUnread(false);
            localStorage.setItem('patient_notifications_read', 'true');
            setScreen('notifications');
          }}
        >
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="black"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
            {hasUnread && (
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                background: '#E53E3E',
                color: 'white',
                borderRadius: '50%',
                fontSize: '11px',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                border: '2px solid white',
                boxSizing: 'content-box'
              }}>1</span>
            )}
          </div>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <HMISGlobe size={56} />
          <span style={{ fontFamily: 'Inter', fontSize: 36, fontWeight: 300, color: '#168A9E', letterSpacing: '2px' }}>HMIS</span>
          <HMISShieldLogo size={36} />
        </div>

        <div style={{ position: 'absolute', right: '24px' }}>
          <div 
            onClick={() => setShowAvatarMenu(!showAvatarMenu)} 
            style={{ cursor: 'pointer', display: 'block', position: 'relative' }}
          >
            <img
              src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(patientName)}&background=168A9E&color=fff`}
              alt="Profile"
              style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #E6EEF5', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
            />
            <div style={{ position: 'absolute', bottom: 0, right: 0, background: '#168A9E', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white' }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            </div>
          </div>

          {/* Dropdown Menu */}
          {showAvatarMenu && (
            <div style={{
              position: 'absolute',
              top: '64px',
              right: '0',
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              padding: '8px',
              zIndex: 100,
              width: '140px',
              border: '1px solid #E2E8F0'
            }}>
              <button 
                onClick={() => { setShowFullImage(true); setShowAvatarMenu(false); }}
                style={{ width: '100%', padding: '10px', background: 'none', border: 'none', fontFamily: 'Cairo', fontSize: '15px', fontWeight: 600, color: '#2D3748', textAlign: 'right', cursor: 'pointer', borderRadius: '8px' }}
                onMouseEnter={e => e.currentTarget.style.background = '#F7FAFC'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                عرض الصورة
              </button>

              <input
                type="file"
                accept="image/*"
                id="avatar-upload-menu"
                style={{ display: 'none' }}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const url = URL.createObjectURL(e.target.files[0]);
                    updateUser({ photoURL: url });
                    localStorage.setItem('global_patient_avatar', url);
                    setShowAvatarMenu(false);
                  }
                }}
              />
              <label 
                htmlFor="avatar-upload-menu"
                style={{ width: '100%', padding: '10px', background: 'none', border: 'none', fontFamily: 'Cairo', fontSize: '15px', fontWeight: 600, color: '#168A9E', textAlign: 'right', cursor: 'pointer', display: 'block', borderRadius: '8px', marginTop: '4px' }}
                onMouseEnter={e => e.currentTarget.style.background = '#F0F9FA'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                تغيير الصورة
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area (Scrollable) */}
      <div style={{ flex: 1, overflowY: 'auto' }}>

        {/* Welcome Section */}
        <div dir="rtl" style={{ padding: '0 24px', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '68px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #1DB8C8, #0E8A96)',
            borderRadius: '50px',
            padding: '10px 32px',
            display: 'inline-flex',
            alignItems: 'center',
            boxShadow: '0 4px 16px rgba(29,184,200,0.35)',
          }}>
            <h1 style={{ fontFamily: 'Cairo', fontSize: 20, fontWeight: 800, color: '#ffffff', margin: 0, whiteSpace: 'nowrap' }}>
              حجز موعد بالعيادة
            </h1>
          </div>
        </div>



        {/* Specialties Grid */}
        <div dir="rtl" style={{ padding: '24px 24px 32px 24px' }}>
          <h3 style={{ fontFamily: 'Cairo', fontSize: 18, fontWeight: 800, color: '#3197A7', margin: '0 0 16px 0', textAlign: 'right' }}>التخصصات</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {specialties.map((s, i) => (
              <div key={i} onClick={() => { if (setSpecialty) setSpecialty(s.name); setScreen(s.screen); }}
                style={{
                  backgroundColor: s.color,
                  borderRadius: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  cursor: 'pointer',
                  height: '230px',
                  overflow: 'hidden',
                  position: 'relative',
                  transition: 'transform 0.18s, box-shadow 0.18s',
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              >
                {/* Full doctor illustration */}
                <img
                  src={ILL}
                  alt={s.name}
                  style={{
                    position: 'absolute',
                    top: 0, left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    objectPosition: 'center top',
                    padding: '12px 8px 44px 8px',
                  }}
                />
                {/* Label bar pinned at bottom */}
                <div style={{
                  position: 'absolute',
                  bottom: 0, left: 0, right: 0,
                  padding: '10px 0',
                  textAlign: 'center',
                  background: 'rgba(0,0,0,0.18)',
                  zIndex: 1,
                }}>
                  <span style={{ fontFamily: 'Cairo', fontSize: '18px', fontWeight: 800, color: 'white' }}>
                    {s.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <PatientBottomNav activeScreen="patient-home" setScreen={setScreen} />

      {/* Full Image Modal */}
      {showFullImage && (
        <div 
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
          onClick={() => setShowFullImage(false)}
        >
          <div style={{ position: 'relative', maxWidth: '100%', maxHeight: '100%' }}>
            <img 
              src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(patientName)}&background=168A9E&color=fff`} 
              alt="Profile" 
              style={{ width: '320px', height: '320px', borderRadius: '50%', objectFit: 'cover', border: '4px solid white' }}
            />
            <button 
              onClick={() => setShowFullImage(false)}
              style={{ position: 'absolute', top: '-40px', right: '0', background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '8px' }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
