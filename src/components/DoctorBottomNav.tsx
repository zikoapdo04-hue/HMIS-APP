import { useState } from 'react';
import type { Screen } from '../types';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';

interface Props {
  activeScreen: 'doctor-home' | 'doctor-records' | 'doctor-profile';
  setScreen: (s: Screen) => void;
}

const FONT_SIZES = [12, 14, 16, 18, 20];

export function DoctorBottomNav({ activeScreen, setScreen }: Props) {
  const [showSettings, setShowSettings] = useState(false);
  const { fontSize, setFontSize, darkMode, setDarkMode } = useSettings();
  const { logout } = useAuth();
  return (
    <nav className="dash-nav" dir="rtl">
      {/* Home */}
      <button
        id={activeScreen === 'doctor-home' ? "home-btn" : undefined}
        className={activeScreen === 'doctor-home' ? "dash-nav-active" : "dash-nav-icon"}
        onClick={() => setScreen('doctor-home')}
        aria-label="home"
      >
        <svg width={activeScreen === 'doctor-home' ? "22" : "28"} height={activeScreen === 'doctor-home' ? "22" : "28"} viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
        {activeScreen === 'doctor-home' && <span>الرئيسية</span>}
      </button>

      {/* Records */}
      <button
        className={activeScreen === 'doctor-records' ? "dash-nav-active" : "dash-nav-icon"}
        onClick={() => setScreen('doctor-records')}
        aria-label="records"
      >
        <svg width={activeScreen === 'doctor-records' ? "22" : "28"} height={activeScreen === 'doctor-records' ? "22" : "28"} viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
        </svg>
        {activeScreen === 'doctor-records' && <span>السجلات</span>}
      </button>

      {/* Profile */}
      <button
        className={activeScreen === 'doctor-profile' ? "dash-nav-active" : "dash-nav-icon"}
        onClick={() => setScreen('doctor-profile')}
        aria-label="profile"
      >
        <svg width={activeScreen === 'doctor-profile' ? "22" : "28"} height={activeScreen === 'doctor-profile' ? "22" : "28"} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
        {activeScreen === 'doctor-profile' && <span>الحساب</span>}
      </button>

      {/* Settings (Hamburger) */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setShowSettings(!showSettings)}
          aria-label="settings"
          style={{
            width: 44, height: 44, borderRadius: '50%',
            background: darkMode ? '#374151' : '#F0F4F8',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: showSettings ? '0 0 0 2px #1DB8C8' : 'none',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1DB8C8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        {showSettings && (
          <>
            {/* Click away overlay */}
            <div 
              style={{ position: 'fixed', inset: 0, zIndex: 99 }} 
              onClick={() => setShowSettings(false)}
            />
            
            {/* Popup Menu */}
            <div dir="rtl" className="settings-popup" style={{
              background: darkMode ? '#2d3748' : '#ffffff',
              border: `1px solid ${darkMode ? '#4a5568' : '#E2E8F0'}`,
            }}>
              {/* Font Size Section */}
              <div style={{ padding: '20px 20px 16px', borderBottom: `1px solid ${darkMode ? '#4a5568' : '#E2E8F0'}` }}>
                <span style={{ fontFamily: 'Cairo,sans-serif', fontWeight: 700, fontSize: '16px', color: darkMode ? '#a0aec0' : '#4A5568', display: 'block', marginBottom: '12px' }}>حجم الخط</span>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {FONT_SIZES.map(s => (
                    <button
                      key={s}
                      onClick={() => setFontSize(s)}
                      style={{
                        width: '42px', height: '42px', borderRadius: '10px',
                        border: fontSize === s ? '2px solid #1DB8C8' : `1px solid ${darkMode ? '#4a5568' : '#E2E8F0'}`,
                        background: fontSize === s ? (darkMode ? '#234e52' : '#E6F7FA') : 'transparent',
                        color: fontSize === s ? (darkMode ? '#4fd1c5' : '#178CA1') : (darkMode ? '#e2e8f0' : '#2D3748'),
                        fontWeight: 700, fontSize: '15px', cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dark Mode Toggle */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px 20px', borderBottom: `1px solid ${darkMode ? '#4a5568' : '#E2E8F0'}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {darkMode ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="#a0aec0">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                  ) : (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="#F6AD55">
                      <circle cx="12" cy="12" r="5"></circle>
                      <line x1="12" y1="1" x2="12" y2="3"></line>
                      <line x1="12" y1="21" x2="12" y2="23"></line>
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                      <line x1="1" y1="12" x2="3" y2="12"></line>
                      <line x1="21" y1="12" x2="23" y2="12"></line>
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                    </svg>
                  )}
                  <span style={{ fontFamily: 'Cairo,sans-serif', fontWeight: 700, fontSize: '16px', color: darkMode ? '#e2e8f0' : '#2D3748' }}>
                    {darkMode ? 'الوضع الداكن' : 'الوضع الفاتح'}
                  </span>
                </div>
                <div
                  onClick={() => setDarkMode(!darkMode)}
                  style={{
                    width: '46px', height: '26px', borderRadius: '13px',
                    background: darkMode ? '#1DB8C8' : '#CBD5E0',
                    position: 'relative', cursor: 'pointer',
                    transition: 'background 0.3s'
                  }}
                >
                  <div style={{
                    position: 'absolute', top: '2px', left: darkMode ? '22px' : '2px',
                    width: '22px', height: '22px', borderRadius: '50%',
                    background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                    transition: 'left 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)'
                  }} />
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={() => { setShowSettings(false); logout(); setScreen('login'); }}
                style={{
                  width: '100%', padding: '16px 20px',
                  background: 'none', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '12px',
                  fontFamily: 'Cairo,sans-serif', fontWeight: 700, fontSize: '16px',
                  color: '#E53E3E', textAlign: 'right',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = darkMode ? '#374151' : '#FFF5F5'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E53E3E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                تسجيل الخروج
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
