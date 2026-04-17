/* ── Eye Icons ── */
export const EyeOpen = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)
export const EyeOff = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
)

/* ── SVG Icons ── */
export const ShieldIcon = () => (
  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <rect x="9" y="11" width="6" height="5" rx="1"/>
    <path d="M12 11V8a2 2 0 0 0-4 0"/>
  </svg>
)
export const CalendarIcon = () => (
  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)
export const StethoIcon = () => (
  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="19" cy="19" r="2"/>
    <path d="M7 5a5 5 0 0 0 5 5 5 5 0 0 1 5 5"/>
    <path d="M5 5h4"/>
    <path d="M5 5a2 2 0 0 0-2 2v2a5 5 0 0 0 10 0V7a2 2 0 0 0-2-2"/>
  </svg>
)
export const ArrowLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
)

/* ── HMIS Logo ── */
export const HMISGlobe = ({ size = 90 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 90">
    <defs>
      <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4DD0E1"/>
        <stop offset="100%" stopColor="#1976D2"/>
      </linearGradient>
    </defs>
    {/* Globe */}
    <circle cx="50" cy="36" r="26" fill="url(#g1)"/>
    <ellipse cx="50" cy="36" rx="11" ry="26" fill="rgba(255,255,255,0.15)"/>
    <line x1="24" y1="36" x2="76" y2="36" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5"/>
    {/* Cross */}
    <rect x="43" y="28" width="14" height="3.5" rx="1.5" fill="white"/>
    <rect x="47" y="24" width="6" height="12" rx="1.5" fill="white"/>
    {/* Hands */}
    <path d="M20 72 Q12 58 22 52 Q28 50 30 56 L36 64" fill="#1565C0" opacity="0.9"/>
    <path d="M80 72 Q88 58 78 52 Q72 50 70 56 L64 64" fill="#1565C0" opacity="0.9"/>
    <path d="M20 72 Q24 68 36 68 L50 65 L64 68 Q76 68 80 72 Q74 68 50 70 Q26 68 20 72Z" fill="#1976D2" opacity="0.85"/>
  </svg>
)

export const HMISShieldLogo = ({ size = 52 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 52 60" fill="none">
    <path d="M26 4L4 13V30C4 43 14 54 26 58C38 54 48 43 48 30V13L26 4Z"
      stroke="#1DB8C8" strokeWidth="2.5" fill="rgba(29,184,200,0.07)"/>
    <line x1="26" y1="20" x2="26" y2="42" stroke="#1DB8C8" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="15" y1="31" x2="37" y2="31" stroke="#1DB8C8" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
)
