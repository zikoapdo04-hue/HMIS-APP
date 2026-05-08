import { useState } from 'react';
import type { Screen } from '../../types';
import { HMISGlobe, HMISShieldLogo } from '../../components/Icons';
import { useSettings } from '../../context/SettingsContext';

interface Props {
  setScreen: (s: Screen) => void;
}

const FONT_SIZES = [12, 14, 16, 18, 20];

export function AdminHome({ setScreen }: Props) {
  const { fontSize, setFontSize, darkMode, setDarkMode } = useSettings();
  const [menuOpen, setMenuOpen] = useState(false);

  /* ── theme tokens ── */
  const bg       = darkMode ? '#1a202c' : '#f7fafc';
  const cardBg   = darkMode ? '#2d3748' : '#ffffff';
  const textMain = darkMode ? '#e2e8f0' : '#4A5568';
  const textSub  = darkMode ? '#a0aec0' : '#718096';
  const border   = darkMode ? '#4a5568' : '#E2E8F0';
  const menuBg   = darkMode ? '#2d3748' : '#ffffff';

  return (
    <div className="admin-dash-screen" style={{ background: bg, fontSize: `${fontSize}px`, minHeight: '100vh', position: 'relative' }}>

      {/* ── HEADER ── */}
      <div dir="ltr" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 16px', background: cardBg,
        boxShadow: '0 1px 6px rgba(0,0,0,0.07)', position: 'relative', zIndex: 20,
      }}>

        {/* Left: hamburger */}
        <div style={{ position: 'relative' }}>
          <button
            id="admin-menu-btn"
            onClick={() => setMenuOpen(o => !o)}
            style={{
              width: 40, height: 40, borderRadius: '50%',
              background: darkMode ? '#374151' : '#F0F4F8',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="#178CA1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6"  x2="21" y2="6"  />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          {/* ── DROPDOWN MENU ── */}
          {menuOpen && (
            <>
              {/* backdrop */}
              <div
                onClick={() => setMenuOpen(false)}
                style={{ position: 'fixed', inset: 0, zIndex: 30 }}
              />
              <div style={{
                position: 'absolute', top: 48, left: 0, zIndex: 40,
                background: menuBg, borderRadius: 16,
                boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                border: `1px solid ${border}`,
                minWidth: 230, padding: '8px 0', overflow: 'hidden',
              }}>

                {/* Font Size */}
                <div style={{ padding: '10px 18px 6px', borderBottom: `1px solid ${border}` }}>
                  <span style={{ fontFamily: 'Cairo,sans-serif', fontWeight: 700, fontSize: 13, color: textSub }}>
                    حجم الخط
                  </span>
                  <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                    {FONT_SIZES.map(s => (
                      <button
                        key={s}
                        onClick={() => setFontSize(s)}
                        style={{
                          width: 36, height: 36, borderRadius: 8,
                          border: fontSize === s ? '2px solid #1DB8C8' : `1.5px solid ${border}`,
                          background: fontSize === s ? '#e0f7fa' : 'transparent',
                          color: fontSize === s ? '#178CA1' : textMain,
                          fontWeight: 700, fontSize: 13, cursor: 'pointer',
                          transition: 'all .15s',
                        }}
                      >{s}</button>
                    ))}
                  </div>
                </div>

                {/* Dark Mode */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 18px', borderBottom: `1px solid ${border}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 18 }}>{darkMode ? '🌙' : '☀️'}</span>
                    <span style={{ fontFamily: 'Cairo,sans-serif', fontWeight: 700, fontSize: 14, color: textMain }}>
                      {darkMode ? 'الوضع الداكن' : 'الوضع الفاتح'}
                    </span>
                  </div>
                  {/* Toggle switch */}
                  <div
                    onClick={() => setDarkMode(!darkMode)}
                    style={{
                      width: 44, height: 24, borderRadius: 12,
                      background: darkMode ? '#1DB8C8' : '#CBD5E0',
                      position: 'relative', cursor: 'pointer',
                      transition: 'background .25s',
                    }}
                  >
                    <div style={{
                      position: 'absolute', top: 3,
                      left: darkMode ? 23 : 3,
                      width: 18, height: 18, borderRadius: '50%',
                      background: '#fff',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                      transition: 'left .25s',
                    }} />
                  </div>
                </div>

                {/* Logout */}
                <button
                  onClick={() => { setMenuOpen(false); setScreen('login'); }}
                  style={{
                    width: '100%', padding: '14px 18px',
                    background: 'none', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 10,
                    fontFamily: 'Cairo,sans-serif', fontWeight: 700, fontSize: 14,
                    color: '#e53e3e', textAlign: 'right',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="#e53e3e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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

        {/* Center: HMIS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <HMISGlobe size={48} color="#1DB8C8" />
          <span style={{
            fontFamily: 'Inter, sans-serif', fontSize: '28px',
            fontWeight: 800, color: '#1DB8C8', letterSpacing: '1px',
          }}>HMIS</span>
          <HMISShieldLogo size={38} color="#1DB8C8" />
        </div>

        {/* Right: name + date + avatar + back btn */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontFamily: 'Cairo, sans-serif', fontSize: '17px', fontWeight: 800, color: textMain, lineHeight: 1.2 }}>المدير</span>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: 700, color: textMain, lineHeight: 1.2 }}>Admin</span>
            <span style={{ fontFamily: 'Cairo, sans-serif', fontSize: '13px', fontWeight: 700, color: '#1DB8C8', marginTop: '2px' }}>الاثنين</span>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 600, color: textSub }}>10-3-2026</span>
          </div>
          <img
            src="https://ui-avatars.com/api/?name=Admin&background=random&size=100"
            alt="Admin"
            className="admin-dash-avatar"
          />
          <button
            onClick={() => setScreen('login')}
            style={{
              width: 36, height: 36, borderRadius: '50%',
              border: `1.5px solid ${border}`,
              background: cardBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke={textMain} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

      </div>

      {/* ── SCROLLABLE CONTENT ── */}
      <div className="admin-dash-content">

        {/* Stat Cards */}
        <div className="admin-stat-cards" dir="rtl">
          <div className="admin-stat-card" style={{ background: '#7498a5' }}>
            <span className="admin-stat-title">عدد الكشفات</span>
            <div className="admin-stat-inner">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
                <circle cx="16" cy="16" r="4"></circle>
                <polyline points="16 14 16 16 18 16"></polyline>
              </svg>
              <span className="admin-stat-num">476</span>
            </div>
          </div>

          <div className="admin-stat-card" style={{ background: '#41b1be' }}>
            <span className="admin-stat-title">عدد المرضي</span>
            <div className="admin-stat-inner">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              <span className="admin-stat-num">389</span>
            </div>
          </div>

          <div className="admin-stat-card" style={{ background: '#97cae1' }}>
            <span className="admin-stat-title">عدد الاطباء</span>
            <div className="admin-stat-inner">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                <circle cx="20" cy="8" r="3" fill="currentColor"/>
                <path d="M24 16v-2c0-1.66-1.34-3-3-3h-2c1.66 0 3 1.34 3 3v2h2z" fill="currentColor"/>
                <circle cx="4" cy="8" r="3" fill="currentColor"/>
                <path d="M2 16v-2c0-1.66 1.34-3 3-3h2c-1.66 0-3 1.34-3 3v2H2z" fill="currentColor"/>
              </svg>
              <span className="admin-stat-num">50</span>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="admin-chart-box" style={{ background: cardBg }}>
          <div className="admin-chart-header">
            <span className="admin-chart-title" style={{ color: textMain }}>Appointments Over Time</span>
            <div className="admin-chart-legend">
              <span className="admin-chart-dot"></span>
              <span className="admin-chart-label" style={{ color: textSub }}>Appointments</span>
            </div>
          </div>
          <div className="admin-chart-visual">
            <div className="admin-chart-y" style={{ color: textSub }}>
              <span>30</span><span>20</span><span>10</span><span>0</span>
            </div>
            <div className="admin-chart-graph">
              <div className="admin-chart-line-bg">
                <div className="grid-line" style={{bottom: '0%'}}></div>
                <div className="grid-line" style={{bottom: '33%'}}></div>
                <div className="grid-line" style={{bottom: '66%'}}></div>
                <div className="grid-line" style={{bottom: '100%'}}></div>
              </div>
              <div className="admin-chart-bars">
                <div className="chart-bar" style={{height: '15%'}}></div>
                <div className="chart-bar" style={{height: '30%'}}></div>
                <div className="chart-bar" style={{height: '25%'}}></div>
                <div className="chart-bar" style={{height: '40%'}}></div>
                <div className="chart-bar" style={{height: '35%'}}></div>
                <div className="chart-bar" style={{height: '50%'}}></div>
                <div className="chart-bar" style={{height: '45%'}}></div>
                <div className="chart-bar" style={{height: '60%'}}></div>
                <div className="chart-bar" style={{height: '35%'}}></div>
                <div className="chart-bar" style={{height: '75%'}}></div>
              </div>
              <svg width="100%" height="100%" className="admin-chart-svg" preserveAspectRatio="none">
                <path d="M0 90 Q 20 70 40 85 T 80 75 T 120 85 T 160 50 T 200 60 T 240 30 T 280 40 T 320 15" fill="none" stroke="#2596be" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke"/>
                <circle cx="40" cy="85" r="4" fill="white" stroke="#2596be" strokeWidth="2" vectorEffect="non-scaling-stroke"/>
                <circle cx="80" cy="75" r="4" fill="white" stroke="#2596be" strokeWidth="2" vectorEffect="non-scaling-stroke"/>
                <circle cx="120" cy="85" r="4" fill="white" stroke="#2596be" strokeWidth="2" vectorEffect="non-scaling-stroke"/>
                <circle cx="160" cy="50" r="4" fill="white" stroke="#2596be" strokeWidth="2" vectorEffect="non-scaling-stroke"/>
                <circle cx="200" cy="60" r="4" fill="white" stroke="#2596be" strokeWidth="2" vectorEffect="non-scaling-stroke"/>
                <circle cx="240" cy="30" r="4" fill="white" stroke="#2596be" strokeWidth="2" vectorEffect="non-scaling-stroke"/>
                <circle cx="280" cy="40" r="4" fill="white" stroke="#2596be" strokeWidth="2" vectorEffect="non-scaling-stroke"/>
                <circle cx="320" cy="15" r="4" fill="white" stroke="#2596be" strokeWidth="2" vectorEffect="non-scaling-stroke"/>
              </svg>
            </div>
          </div>
          <div className="admin-chart-x" style={{ color: textSub }}>
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>


      </div>

      {/* Bottom Navigation */}
      <nav className="admin-bottom-nav" dir="rtl" style={{ background: cardBg, borderTop: `1px solid ${border}` }}>
        <button className="admin-nav-item active">الاحصائيات</button>
        <button className="admin-nav-item" onClick={() => setScreen('admin-patients')}>ادارة المرضي</button>
        <button className="admin-nav-item" onClick={() => setScreen('admin-doctors')}>ادارة الاطباء</button>
        <button className="admin-nav-item" onClick={() => setScreen('admin-appointments')}>مواعيد اليوم</button>
      </nav>
    </div>
  );
}
