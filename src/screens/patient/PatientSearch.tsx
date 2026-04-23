import { useState, useEffect } from 'react';
import type { Screen } from '../../types';

interface Props { setScreen: (s: Screen) => void }

interface Doctor {
  uid:       string;
  name:      string;
  specialty: string;
  rating:    number;
  phone?:    string;
}

const ALL_DOCTORS: Doctor[] = [
  { uid: '1', name: 'د. خالد عبدالله', specialty: 'عظام', rating: 4.8, phone: '01012345678' },
  { uid: '2', name: 'د. منى حسن', specialty: 'اطفال', rating: 4.9, phone: '01123456789' },
  { uid: '3', name: 'د. ياسر إبراهيم', specialty: 'مخ واعصاب', rating: 4.5, phone: '01234567890' },
  { uid: '4', name: 'د. سمير محمود', specialty: 'القلب', rating: 4.7, phone: '01512345678' },
  { uid: '5', name: 'د. هند علي', specialty: 'نساء وتوليد', rating: 4.9, phone: '01098765432' },
];

export function PatientSearch({ setScreen }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [allDoctors, setAllDoctors]   = useState<Doctor[]>([]);
  const [searched, setSearched]       = useState(false);

  useEffect(() => {
    setAllDoctors(ALL_DOCTORS);
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
        {searched && results.length === 0 && searchQuery.trim().length > 0 && (
          <p style={{ textAlign: 'center', fontFamily: 'Cairo', color: '#8898AA', padding: '16px' }}>لا توجد نتائج</p>
        )}

        {results.length > 0 && (
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', color: '#168A9E', fontSize: '14px', fontFamily: 'Cairo' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    <span dir="ltr">{dr.phone}</span>
                  </div>
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
