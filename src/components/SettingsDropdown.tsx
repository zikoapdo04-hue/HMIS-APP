import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { COLORS, RADIUS, FONT, SHADOWS } from '../core/theme';
import type { Screen } from '../types';

interface Props { setScreen: (s: Screen) => void }

export function SettingsDropdown({ setScreen }: Props) {
  const { logout } = useAuth();
  const { theme, lang, setTheme, setLang } = useSettings();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    setScreen('login');
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background: 'rgba(255,255,255,0.18)', border: 'none',
          borderRadius: RADIUS.sm, width: 40, height: 40,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'background 0.18s',
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
          <path d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96a6.96 6.96 0 0 0-1.62-.94l-.36-2.54A.484.484 0 0 0 14 2h-4a.484.484 0 0 0-.48.41l-.36 2.54a6.96 6.96 0 0 0-1.62.94l-2.39-.96a.48.48 0 0 0-.59.22L2.64 8.47a.48.48 0 0 0 .12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.36 1.05.66 1.62.94l.36 2.54c.05.24.27.41.48.41h4c.24 0 .44-.17.47-.41l.36-2.54a6.96 6.96 0 0 0 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.49.49 0 0 0-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
        </svg>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div style={{
          position: 'fixed', top: 72,
          ...(lang === 'ar' ? { right: 12 } : { left: 12 }),
          zIndex: 1000,
          background: 'var(--dropdown-bg)',
          border: `1.5px solid var(--dropdown-border)`,
          borderRadius: RADIUS.lg,
          boxShadow: SHADOWS.cardHov,
          minWidth: 220,
          overflow: 'hidden',
        }} dir="rtl">

          {/* Section: Theme */}
          <div style={{ padding: '12px 16px 8px', borderBottom: `1px solid var(--dropdown-border)` }}>
            <p style={{ fontFamily: FONT.cairo, fontSize: 11, fontWeight: 700, color: COLORS.primary, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {lang === 'ar' ? 'المظهر' : 'Theme'}
            </p>
            <div style={{ display: 'flex', gap: 6 }}>
              {([['light', '☀️', lang === 'ar' ? 'فاتح' : 'Light'], ['dark', '🌙', lang === 'ar' ? 'داكن' : 'Dark']] as const).map(([val, icon, label]) => (
                <button
                  key={val}
                  onClick={() => setTheme(val)}
                  style={{
                    flex: 1, padding: '8px 4px', border: 'none', borderRadius: RADIUS.sm,
                    fontFamily: FONT.cairo, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                    background: theme === val ? COLORS.primary : 'var(--input-bg)',
                    color: theme === val ? 'white' : COLORS.textSec,
                    transition: 'all 0.15s',
                  }}
                >
                  {icon} {label}
                </button>
              ))}
            </div>
          </div>

          {/* Section: Language */}
          <div style={{ padding: '12px 16px 8px', borderBottom: `1px solid var(--dropdown-border)` }}>
            <p style={{ fontFamily: FONT.cairo, fontSize: 11, fontWeight: 700, color: COLORS.primary, margin: '0 0 8px', letterSpacing: 0.5 }}>
              {lang === 'ar' ? 'اللغة' : 'Language'}
            </p>
            <div style={{ display: 'flex', gap: 6 }}>
              {([['ar', '🇸🇦', 'العربية'], ['en', '🇬🇧', 'English']] as const).map(([val, flag, label]) => (
                <button
                  key={val}
                  onClick={() => setLang(val)}
                  style={{
                    flex: 1, padding: '8px 4px', border: 'none', borderRadius: RADIUS.sm,
                    fontFamily: val === 'ar' ? FONT.cairo : FONT.inter, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                    background: lang === val ? COLORS.primary : 'var(--input-bg)',
                    color: lang === val ? 'white' : COLORS.textSec,
                    transition: 'all 0.15s',
                  }}
                >
                  {flag} {label}
                </button>
              ))}
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            style={{
              width: '100%', padding: '14px 16px', border: 'none',
              background: 'transparent', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 10,
              fontFamily: FONT.cairo, fontSize: 15, fontWeight: 700,
              color: COLORS.danger, transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--dropdown-item-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.danger} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            {lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}
          </button>
        </div>
      )}
    </div>
  );
}
