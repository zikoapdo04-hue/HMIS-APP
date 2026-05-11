// ─────────────────────────────────────────────────────────────────────────────
// Design tokens — single source of truth for the whole app
// ─────────────────────────────────────────────────────────────────────────────

export const COLORS = {
  // Brand
  primary:      '#0D9BAB',
  primaryDark:  '#0B7A88',
  primaryLight: '#E0F6F9',
  primaryGlow:  'rgba(13,155,171,0.18)',

  // Surface (light mode defaults — overridden by CSS vars in dark mode)
  white:        '#FFFFFF',
  bg:           'var(--bg)',
  card:         'var(--card)',
  cardBorder:   'var(--card-border)',
  inputBg:      'var(--input-bg)',

  // Text
  textPrimary:  'var(--text-primary)',
  textSec:      'var(--text-sec)',
  textMuted:    'var(--text-muted)',
  textWhite:    '#FFFFFF',

  // Status
  success:      '#10B981',
  successLight: '#D1FAE5',
  danger:       '#EF4444',
  dangerLight:  '#FEE2E2',
  warning:      '#F59E0B',
  warningLight: '#FEF3C7',

  // Nav
  navBg:        'var(--nav-bg)',
  navBorder:    'var(--nav-border)',
  navActive:    '#0D9BAB',
  navInactive:  'var(--nav-inactive)',

  // Star
  star:         '#F59E0B',
} as const

export const GRADIENTS = {
  primary:   'linear-gradient(135deg, #0B7A88 0%, #0D9BAB 50%, #1AC8DA 100%)',
  primarySm: 'linear-gradient(135deg, #0B7A88, #0D9BAB)',
  card:      'linear-gradient(145deg, #FFFFFF 0%, #F0F9FC 100%)',
  heroBg:    'linear-gradient(160deg, #0B7A88 0%, #0D9BAB 45%, #17C5D8 100%)',
} as const

export const SHADOWS = {
  card:    'var(--shadow-card)',
  cardHov: 'var(--shadow-card-hov)',
  header:  '0 4px 20px rgba(11,122,136,0.22)',
  nav:     'var(--shadow-nav)',
  btn:     '0 6px 20px rgba(13,155,171,0.32)',
  btnHov:  '0 10px 28px rgba(13,155,171,0.44)',
  avatar:  '0 4px 16px rgba(0,0,0,0.12)',
} as const

export const RADIUS = {
  xs:   '8px',
  sm:   '12px',
  md:   '16px',
  lg:   '20px',
  xl:   '24px',
  xxl:  '32px',
  pill: '50px',
  full: '9999px',
} as const

export const FONT = {
  cairo: "'Cairo', sans-serif",
  inter: "'Inter', sans-serif",
} as const
