import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import type { Screen } from '../../types';
import { HMISGlobe, HMISShieldLogo } from '../../components/Icons';

interface Props { setScreen: (s: Screen) => void }

interface Doctor {
  uid:       string;
  name:      string;
  specialty: string;
  days:      string;
  address:   string;
  rating:    number;
}

export function AdminDoctors({ setScreen }: Props) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [query, setQuery]     = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const userSnap = await getDocs(collection(db, 'users'));
        const docSnap  = await getDocs(collection(db, 'doctors'));
        const nameMap: Record<string, string> = {};
        userSnap.forEach(d => { nameMap[d.id] = d.data().name ?? ''; });

        const list: Doctor[] = [];
        docSnap.forEach(d => {
          const data = d.data();
          list.push({
            uid:       d.id,
            name:      nameMap[d.id] ?? data.name ?? 'طبيب',
            specialty: data.specialty ?? '',
            days:      data.days      ?? '',
            address:   data.address   ?? '',
            rating:    data.rating    ?? 0,
          });
        });
        setDoctors(list);
      } catch { /* shows empty list gracefully */ }
      setLoading(false);
    }
    load();
  }, []);

  const filtered = doctors.filter(d =>
    d.name.includes(query) || d.specialty.includes(query) || d.address.includes(query)
  );

  return (
    <div className="admin-screen" style={{ background: '#ffffff', height: '100%', display: 'flex', flexDirection: 'column' }}>

      {/* Top Header Section */}
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
          <HMISGlobe size={90} />
          <span style={{ fontFamily: 'Inter', fontSize: 52, fontWeight: 300, color: '#168A9E', letterSpacing: '2px' }}>HMIS</span>
          <HMISShieldLogo size={60} />
        </div>

        <div style={{ width: '100%', textAlign: 'right', marginTop: '16px' }}>
          <h2 style={{ fontFamily: 'Cairo', fontSize: 32, fontWeight: 800, color: '#168A9E', margin: 0 }}>ادارة الاطباء</h2>
        </div>

        {/* Search */}
        <div dir="rtl" style={{ marginTop: '20px', background: '#E6EEF5', borderRadius: '24px', display: 'flex', alignItems: 'center', height: '64px', padding: '6px', width: '100%' }}>
          <input
            type="text"
            placeholder="ابحث عن الطبيب"
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ flex: 1, border: 'none', background: 'transparent', padding: '0 20px', fontSize: 18, fontFamily: 'Cairo', fontWeight: 600, outline: 'none', color: '#1A202C' }}
          />
          <button style={{ width: '56px', height: '56px', background: '#168A9E', border: 'none', borderRadius: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
              stroke="#1A202C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Header */}
        <div dir="rtl" style={{ display: 'flex', background: '#E6EEF5', borderRadius: '20px', padding: '16px', alignItems: 'center', fontFamily: 'Cairo', fontWeight: 700, fontSize: 18, color: '#1A202C' }}>
          <div style={{ flex: 1.5, textAlign: 'right', paddingRight: '8px' }}>الاسم</div>
          <div style={{ flex: 1.2, textAlign: 'center' }}>التخصص</div>
          <div style={{ flex: 1.2, textAlign: 'center' }}>المواعيد</div>
          <div style={{ flex: 1.5, textAlign: 'center' }}>موقع العيادة</div>
          <div style={{ flex: 1,   textAlign: 'center' }}>التقييم</div>
        </div>

        {loading && (
          <p style={{ textAlign: 'center', fontFamily: 'Cairo', color: '#8898AA', padding: '24px' }}>جاري التحميل...</p>
        )}
        {!loading && filtered.length === 0 && (
          <p style={{ textAlign: 'center', fontFamily: 'Cairo', color: '#8898AA', padding: '24px' }}>لا يوجد أطباء</p>
        )}

        {filtered.map((dr) => (
          <div key={dr.uid} dir="rtl" style={{ display: 'flex', background: '#DFE2E6', borderRadius: '20px', padding: '16px', alignItems: 'center', fontFamily: 'Cairo', fontWeight: 600, fontSize: 16, color: '#4A5568' }}>
            <div style={{ flex: 1.5, textAlign: 'right', color: '#168A9E', fontWeight: 700, paddingRight: '8px', whiteSpace: 'nowrap' }}>{dr.name}</div>
            <div style={{ flex: 1.2, textAlign: 'center' }}>{dr.specialty}</div>
            <div style={{ flex: 1.2, textAlign: 'center', fontFamily: 'Cairo' }}>{dr.days || '—'}</div>
            <div style={{ flex: 1.5, textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{dr.address || '—'}</div>
            <div style={{ flex: 1, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#ECC94B" stroke="#ECC94B">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              <span style={{ fontFamily: 'Inter', color: '#1A202C', paddingTop: '2px' }}>{dr.rating}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom nav */}
      <nav dir="rtl" style={{ padding: '24px 16px', display: 'flex', justifyContent: 'space-around', alignItems: 'center', gap: '12px', background: '#fff' }}>
        <button style={{ flex: 1, padding: '16px 0', border: 'none', borderRadius: '24px', background: '#168A9E', color: 'white', fontFamily: 'Cairo', fontWeight: 700, fontSize: 18, cursor: 'pointer' }}>
          ادارة الاطباء
        </button>
        <button onClick={() => setScreen('admin-patients')} style={{ flex: 1, padding: '16px 0', border: 'none', borderRadius: '24px', background: '#DFE2E6', color: '#1A202C', fontFamily: 'Cairo', fontWeight: 700, fontSize: 18, cursor: 'pointer' }}>
          ادارة المرضي
        </button>
        <button onClick={() => setScreen('admin-home')} style={{ flex: 1, padding: '16px 0', border: 'none', borderRadius: '24px', background: '#DFE2E6', color: '#1A202C', fontFamily: 'Cairo', fontWeight: 700, fontSize: 18, cursor: 'pointer' }}>
          ادارة الحسابات
        </button>
      </nav>
    </div>
  );
}
