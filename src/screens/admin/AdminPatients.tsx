import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import type { Screen } from '../../types';
import { HMISGlobe, HMISShieldLogo } from '../../components/Icons';

interface Props { setScreen: (s: Screen) => void }

interface Booking {
  id:          string;
  patientName: string;
  date:        string;
  time:        string;
  doctorName:  string;
}

export function AdminPatients({ setScreen }: Props) {
  const [bookings, setBookings]   = useState<Booking[]>([]);
  const [search, setSearch]       = useState('');
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const q    = query(collection(db, 'appointments'), where('status', '==', 'active'));
        const snap = await getDocs(q);
        const list: Booking[] = [];
        snap.forEach(d => {
          const data = d.data();
          list.push({
            id:          d.id,
            patientName: data.patientName ?? '—',
            date:        data.date        ?? '',
            time:        data.time        ?? '',
            doctorName:  data.doctorName  ?? '—',
          });
        });
        setBookings(list);
      } catch { /* shows empty list */ }
      setLoading(false);
    }
    load();
  }, []);

  const filtered = bookings.filter(b =>
    b.patientName.includes(search) || b.doctorName.includes(search)
  );

  const cancelBooking = async (id: string) => {
    try {
      await updateDoc(doc(db, 'appointments', id), { status: 'cancelled' });
      setBookings(prev => prev.filter(b => b.id !== id));
    } catch { /* silent */ }
  };

  // Get today's date in Arabic day name + numeric
  const today = new Date();
  const arabicDays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const dayName  = arabicDays[today.getDay()];
  const dateStr  = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;

  return (
    <div className="admin-screen" style={{ background: '#ffffff', height: '100%', display: 'flex', flexDirection: 'column' }}>

      {/* Top Header */}
      <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <HMISGlobe size={64} />
          <span style={{ fontFamily: 'Inter', fontSize: 44, fontWeight: 800, color: '#168A9E', letterSpacing: '2px' }}>HMIS</span>
          <HMISShieldLogo size={40} />
        </div>

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginTop: '16px', gap: '4px' }}>
          <div style={{ fontFamily: 'Cairo', fontSize: 28, fontWeight: 800, color: '#168A9E' }}>{dayName}</div>
          <div style={{ fontFamily: 'Inter', fontSize: 18, fontWeight: 700, color: '#8898AA' }}>{dateStr}</div>
        </div>

        {/* Search */}
        <div dir="rtl" style={{ marginTop: '16px', background: '#E6EEF5', borderRadius: '20px', display: 'flex', alignItems: 'center', height: '56px', padding: '4px', width: '100%' }}>
          <input
            type="text"
            placeholder="ابحث عن مريض"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, border: 'none', background: 'transparent', padding: '0 16px', fontSize: 16, fontFamily: 'Cairo', fontWeight: 600, outline: 'none', color: '#1A202C' }}
          />
          <button style={{ width: '48px', height: '48px', background: '#168A9E', border: 'none', borderRadius: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="#1A202C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>
        </div>

        <div style={{ width: '100%', textAlign: 'right', marginTop: '24px' }}>
          <h2 style={{ fontFamily: 'Cairo', fontSize: 28, fontWeight: 800, color: '#168A9E', margin: 0 }}>الكشفات</h2>
        </div>
      </div>

      {/* Data */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Table Header */}
        <div dir="rtl" style={{ display: 'flex', background: '#E6EEF5', borderRadius: '16px', padding: '12px', alignItems: 'center', fontFamily: 'Cairo', fontWeight: 700, fontSize: 16, color: '#1A202C' }}>
          <div style={{ flex: 1.5, textAlign: 'right' }}>الاسم</div>
          <div style={{ flex: 1.2, textAlign: 'center' }}>المواعيد</div>
          <div style={{ flex: 1.5, textAlign: 'center' }}>الطبيب</div>
          <div style={{ flex: 1.5, textAlign: 'left', paddingLeft: '8px' }}>الحجوزات</div>
        </div>

        {loading && (
          <p style={{ textAlign: 'center', fontFamily: 'Cairo', color: '#8898AA', padding: '24px' }}>جاري التحميل...</p>
        )}
        {!loading && filtered.length === 0 && (
          <p style={{ textAlign: 'center', fontFamily: 'Cairo', color: '#8898AA', padding: '24px' }}>لا يوجد حجوزات نشطة</p>
        )}

        {filtered.map((b) => (
          <div key={b.id} dir="rtl" style={{ display: 'flex', background: '#DFE2E6', borderRadius: '16px', padding: '12px', alignItems: 'center', fontFamily: 'Cairo', fontWeight: 600, fontSize: 14, color: '#4A5568' }}>
            <div style={{ flex: 1.5, textAlign: 'right', color: '#168A9E', fontWeight: 700 }}>{b.patientName}</div>
            <div style={{ flex: 1.2, textAlign: 'center', fontFamily: 'Inter', fontSize: 12 }}>
              <div>{b.date}</div>
              <div>{b.time}</div>
            </div>
            <div style={{ flex: 1.5, textAlign: 'center' }}>{b.doctorName}</div>
            <div style={{ flex: 1.5, textAlign: 'left' }}>
              <button
                onClick={() => cancelBooking(b.id)}
                style={{ background: '#C53030', color: 'white', border: 'none', borderRadius: '8px', padding: '6px 12px', fontFamily: 'Cairo', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                حذف الحجز
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pill nav */}
      <nav dir="rtl" style={{ padding: '24px 16px', display: 'flex', justifyContent: 'space-around', alignItems: 'center', gap: '12px', background: '#fff' }}>
        <button onClick={() => setScreen('admin-doctors')} style={{ flex: 1, padding: '16px 0', border: 'none', borderRadius: '24px', background: '#DFE2E6', color: '#1A202C', fontFamily: 'Cairo', fontWeight: 700, fontSize: 18, cursor: 'pointer' }}>
          ادارة الاطباء
        </button>
        <button style={{ flex: 1, padding: '16px 0', border: 'none', borderRadius: '24px', background: '#168A9E', color: 'white', fontFamily: 'Cairo', fontWeight: 700, fontSize: 18, cursor: 'pointer' }}>
          ادارة المرضي
        </button>
        <button onClick={() => setScreen('admin-home')} style={{ flex: 1, padding: '16px 0', border: 'none', borderRadius: '24px', background: '#DFE2E6', color: '#1A202C', fontFamily: 'Cairo', fontWeight: 700, fontSize: 18, cursor: 'pointer' }}>
          ادارة الحسابات
        </button>
      </nav>
    </div>
  );
}
