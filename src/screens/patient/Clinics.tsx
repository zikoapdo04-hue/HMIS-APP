import { useState, useEffect } from 'react';
import { userService } from '../../services/user.service';
import { COLORS, GRADIENTS, SHADOWS, RADIUS, FONT } from '../../core/theme';
import type { UserModel } from '../../models/user.model';
import type { Screen } from '../../types';
import type { DoctorInfo } from './DoctorDetail';

interface Props { setScreen: (s: Screen) => void; onBack?: () => void; specialty?: string; onSelectDoctor?: (d: DoctorInfo) => void }

export function Clinics({ setScreen, onBack, onSelectDoctor, specialty }: Props) {
  const [allDoctors, setAll] = useState<UserModel[]>([]);
  const [search, setSearch]  = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userService.getApprovedDoctors().then(docs => { setAll(docs); setLoading(false); });
  }, []);

  const filtered = (() => {
    let list = specialty
      ? allDoctors.filter(d => (d.specialty ?? '').includes(specialty))
      : allDoctors;
    if (search.trim()) {
      list = list.filter(d => d.name.includes(search) || (d.specialty ?? '').includes(search));
    }
    return list;
  })();

  const handleSelect = (dr: UserModel) => {
    const info: DoctorInfo = { uid: dr.id, name: dr.name, specialty: dr.specialty ?? '', rating: dr.rating ?? 0, phone: dr.phone, address: dr.hospitalAddress ?? '', avatar: dr.imageUrl ?? undefined };
    onSelectDoctor?.(info);
    setScreen('doctor-detail');
  };

  return (
    <div style={{ background: COLORS.bg, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Header */}
      <header style={{ background: GRADIENTS.heroBg, padding: '20px 20px 24px', flexShrink: 0, boxShadow: SHADOWS.header, borderRadius: `0 0 ${RADIUS.xxl} ${RADIUS.xxl}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <button
            onClick={() => onBack ? onBack() : setScreen('patient-home')}
            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: RADIUS.sm, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
          <div dir="rtl">
            <p style={{ fontFamily: FONT.cairo, fontSize: 13, color: 'rgba(255,255,255,0.75)', margin: 0 }}>
              {specialty ? `تخصص ${specialty}` : 'جميع الأطباء'}
            </p>
            <h2 style={{ fontFamily: FONT.cairo, fontSize: 22, fontWeight: 800, color: 'white', margin: 0 }}>
              {specialty ? `أطباء ${specialty}` : 'الأطباء'}
            </h2>
          </div>
        </div>

        {/* Search box */}
        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.18)', borderRadius: RADIUS.lg, padding: '4px 8px 4px 4px', border: '1.5px solid rgba(255,255,255,0.28)', backdropFilter: 'blur(8px)' }} dir="rtl">
          <input
            type="text"
            placeholder="ابحث باسم الطبيب..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: FONT.cairo, fontSize: 15, color: 'white', padding: '10px 12px' }}
          />
          <div style={{ width: 40, height: 40, borderRadius: RADIUS.sm, background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
        </div>
      </header>

      {/* Results */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 8px' }}>
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 60 }}>
            <div style={{ width: 40, height: 40, border: `3px solid ${COLORS.primaryLight}`, borderTopColor: COLORS.primary, borderRadius: RADIUS.full, animation: 'spin 0.8s linear infinite' }} />
            <p style={{ fontFamily: FONT.cairo, color: COLORS.textMuted, marginTop: 16 }}>جاري التحميل...</p>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 60, gap: 12 }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={COLORS.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <p style={{ fontFamily: FONT.cairo, color: COLORS.textMuted, fontSize: 16, fontWeight: 600 }}>لا توجد نتائج</p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} dir="rtl">
            <p style={{ fontFamily: FONT.cairo, fontSize: 13, color: COLORS.textMuted, margin: '0 4px 4px' }}>{filtered.length} طبيب متاح</p>
            {filtered.map(dr => (
              <button
                key={dr.id}
                onClick={() => handleSelect(dr)}
                style={{
                  background: COLORS.card, border: `1.5px solid ${COLORS.cardBorder}`,
                  borderRadius: RADIUS.xl, padding: '14px 16px',
                  display: 'flex', alignItems: 'center', gap: 14,
                  cursor: 'pointer', boxShadow: SHADOWS.card,
                  transition: 'transform 0.18s, box-shadow 0.18s', width: '100%', textAlign: 'right',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = SHADOWS.cardHov; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = SHADOWS.card; }}
              >
                <img
                  src={dr.imageUrl ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(dr.name)}&background=0D9BAB&color=fff&size=100`}
                  alt={dr.name}
                  style={{ width: 60, height: 60, borderRadius: RADIUS.full, objectFit: 'cover', flexShrink: 0, border: `2px solid ${COLORS.primaryLight}` }}
                />
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: FONT.cairo, fontSize: 17, fontWeight: 800, color: COLORS.textPrimary, margin: '0 0 3px' }}>{dr.name}</p>
                  <p style={{ fontFamily: FONT.cairo, fontSize: 13, fontWeight: 600, color: COLORS.primary, margin: '0 0 6px' }}>{dr.specialty}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill={COLORS.star}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      <span style={{ fontFamily: FONT.inter, fontSize: 13, fontWeight: 700, color: COLORS.textSec }}>{dr.rating ?? '—'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill={COLORS.textMuted}><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                      <span style={{ fontFamily: FONT.inter, fontSize: 12, color: COLORS.textMuted }} dir="ltr">{dr.phone}</span>
                    </div>
                  </div>
                </div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '12px 8px 16px', background: COLORS.navBg, borderTop: `1.5px solid ${COLORS.navBorder}`, boxShadow: SHADOWS.nav, flexShrink: 0 }}>
        {[
          { key: 'patient-profile',      label: 'حسابي',    icon: (c: string) => <svg width="22" height="22" viewBox="0 0 24 24" fill={c}><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg> },
          { key: 'patient-appointments', label: 'المواعيد',  icon: (c: string) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
          { key: 'patient-search',       label: 'بحث',       icon: (c: string) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> },
          { key: 'patient-home',         label: 'الرئيسية',  icon: (c: string) => <svg width="22" height="22" viewBox="0 0 24 24" fill={c}><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg> },
        ].map(item => {
          const color = COLORS.navInactive;
          return (
            <button key={item.key} onClick={() => setScreen(item.key as Screen)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 44, height: 44, borderRadius: RADIUS.sm, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {item.icon(color)}
              </div>
              <span style={{ fontFamily: FONT.cairo, fontSize: 11, fontWeight: 600, color }}>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
