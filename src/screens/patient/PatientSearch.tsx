import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import type { Screen } from '../../types';

interface Props { setScreen: (s: Screen) => void }

interface Doctor {
  uid:       string;
  name:      string;
  specialty: string;
  rating:    number;
}

export function PatientSearch({ setScreen }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [allDoctors, setAllDoctors]   = useState<Doctor[]>([]);
  const [loading, setLoading]         = useState(false);
  const [searched, setSearched]       = useState(false);

  // Pre-load all doctors once
  useEffect(() => {
    async function load() {
      setLoading(true);
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
            specialty: data.specialty ?? '—',
            rating:    data.rating    ?? 0,
          });
        });
        setAllDoctors(list);
      } catch { /* silent */ }
      setLoading(false);
    }
    load();
  }, []);

  const results = searchQuery.trim().length > 0
    ? allDoctors.filter(d =>
        d.name.includes(searchQuery) ||
        d.specialty.includes(searchQuery)
      )
    : [];

  const handleSearch = () => setSearched(true);

  return (
    <div className="search-screen">
      <header className="search-top-bar"><h2>ابحث عن طبيب</h2></header>
      <div className="search-main-content">
        <div className="p-search-container" dir="rtl">
          <div className="p-search-box">
            <button className="p-search-btn" aria-label="search action" onClick={handleSearch}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A202C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>
            <input
              type="text"
              placeholder="البحث بالاسم أو التخصص"
              className="p-search-input"
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setSearched(true); }}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
          </div>
        </div>

        {/* Results */}
        {loading && (
          <p style={{ textAlign: 'center', fontFamily: 'Cairo', color: '#8898AA', padding: '16px' }}>جاري التحميل...</p>
        )}

        {!loading && searched && results.length === 0 && searchQuery.trim().length > 0 && (
          <p style={{ textAlign: 'center', fontFamily: 'Cairo', color: '#8898AA', padding: '16px' }}>لا توجد نتائج</p>
        )}

        {!loading && results.length > 0 && (
          <div className="clinic-list" dir="rtl" style={{ marginTop: '16px' }}>
            {results.map((dr) => (
              <div key={dr.uid} className="clinic-card" onClick={() => setScreen('book-appointment')}>
                <div className="clinic-dr-rating" dir="ltr">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#ECC94B" stroke="#ECC94B"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  <span className="rate-num">{dr.rating}</span>
                </div>
                <div className="clinic-dr-info">
                  <h3 className="clinic-dr-name">{dr.name}</h3>
                  <p className="clinic-dr-spec">{dr.specialty}</p>
                </div>
                <div className="clinic-dr-img">
                  <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(dr.name)}&background=random`} alt={dr.name} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Illustration when idle */}
        {!searched && (
          <div className="search-illustration-wrapper">
            <img src="/security_illustration.png" alt="" className="search-ill-img" />
          </div>
        )}
      </div>

      <nav className="dash-nav">
        <button className="dash-nav-icon" aria-label="profile" onClick={() => setScreen('patient-profile')}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
        </button>
        <button className="dash-nav-icon" aria-label="appointments" onClick={() => setScreen('patient-appointments')}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        </button>
        <button className="dash-nav-active" aria-label="search" dir="rtl">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          البحث
        </button>
        <button className="dash-nav-icon" aria-label="home" onClick={() => setScreen('patient-home')}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
        </button>
      </nav>
    </div>
  );
}
