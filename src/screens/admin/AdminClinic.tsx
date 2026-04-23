import { useState, useEffect } from 'react';
import type { Screen } from '../../types';

interface Props {
  setScreen?: (s: Screen) => void;
  specialty?: string;
  color?: string;
}

interface Doctor {
  uid:       string;
  name:      string;
  specialty: string;
  rating:    number;
  address:   string;
}

export function AdminClinic({ setScreen, specialty = 'عظام', color = '#148C9E' }: Props) {
  const [doctors, setDoctors]       = useState<Doctor[]>([]);
  const [apptCount, setApptCount]   = useState(0);
  const [patCount, setPatCount]     = useState(0);
  const [search, setSearch]         = useState('');

  useEffect(() => {
    // Load mock data based on specialty
    const MOCK_DEPT: Doctor[] = [
      { uid: '1', name: 'د. خالد عبدالله', specialty: specialty, rating: 4.8, address: 'عيادة دجلة' },
      { uid: '2', name: 'د. منى حسن', specialty: specialty, rating: 4.9, address: 'مستشفى السلام' },
      { uid: '3', name: 'د. ياسر إبراهيم', specialty: specialty, rating: 4.5, address: 'العيادات التخصصية' },
    ];
    setDoctors(MOCK_DEPT);
    setApptCount(15);
    setPatCount(10);
  }, [specialty]);

  const filtered = search.trim()
    ? doctors.filter(d => d.name.includes(search))
    : doctors;

  const handlePrint = () => window.print();

  return (
    <div className="admin-screen" style={{ background: '#ffffff', height: '100%', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <header style={{ background: color, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', flexShrink: 0 }}>
        <button
          onClick={() => setScreen?.('admin-home')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', outline: 'none', padding: 0 }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1A202C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <h2 style={{ fontFamily: 'Cairo', fontSize: 22, fontWeight: 800, color: 'white', margin: 0, flex: 1, textAlign: 'center' }}>
          عيادات {specialty}
        </h2>
        <button
          onClick={handlePrint}
          style={{ background: 'transparent', border: '2px solid #1A202C', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A202C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 6 2 18 2 18 9"/>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
            <rect x="6" y="14" width="12" height="8"/>
          </svg>
        </button>
      </header>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '24px' }}>

        {/* Stats */}
        <div style={{ background: '#E0E0E0', borderRadius: '24px', margin: '24px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '240px', margin: '0 auto', direction: 'rtl' }}>
            <span style={{ fontFamily: 'Cairo', fontSize: 20, fontWeight: 700, color }}>عدد الاطباء :</span>
            <span style={{ fontFamily: 'Inter', fontSize: 20, fontWeight: 700, color: '#4A5568' }}>{doctors.length}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '240px', margin: '0 auto', direction: 'rtl' }}>
            <span style={{ fontFamily: 'Cairo', fontSize: 20, fontWeight: 700, color }}>عدد المرضي :</span>
            <span style={{ fontFamily: 'Inter', fontSize: 20, fontWeight: 700, color: '#4A5568' }}>{patCount}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '240px', margin: '0 auto', direction: 'rtl' }}>
            <span style={{ fontFamily: 'Cairo', fontSize: 20, fontWeight: 700, color }}>عدد الكشفات :</span>
            <span style={{ fontFamily: 'Inter', fontSize: 20, fontWeight: 700, color: '#4A5568' }}>{apptCount}</span>
          </div>
        </div>

        {/* Search */}
        <div dir="rtl" style={{ margin: '0 24px 24px', background: '#E6EEF5', borderRadius: '20px', display: 'flex', alignItems: 'center', height: '56px', padding: '4px' }}>
          <input
            type="text"
            placeholder="البحث"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, border: 'none', background: 'transparent', padding: '0 16px', fontSize: 18, fontFamily: 'Cairo', fontWeight: 600, outline: 'none', color: '#1A202C' }}
          />
          <button style={{ width: '48px', height: '48px', background: color, border: 'none', borderRadius: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1A202C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>
        </div>

        {/* Doctor list */}
        {filtered.length === 0 && (
          <p style={{ textAlign: 'center', fontFamily: 'Cairo', color: '#8898AA', padding: '16px' }}>لا يوجد أطباء في هذا القسم</p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.map((dr) => (
            <div key={dr.uid} style={{ background: '#E8F1F6', borderRadius: '50px', margin: '0 24px', padding: '8px 24px 8px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', direction: 'rtl' }}>
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(dr.name)}&background=random&size=120`}
                alt={dr.name}
                style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
              />
              <div style={{ flex: 1, marginRight: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <span style={{ fontFamily: 'Cairo', fontSize: 18, fontWeight: 800, color }}>{dr.name}</span>
                <span style={{ fontFamily: 'Cairo', fontSize: 14, fontWeight: 600, color: '#718096' }}>{dr.specialty}</span>
              </div>
              <div dir="ltr" style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingLeft: '8px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#ECC94B" stroke="#ECC94B"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <span style={{ fontFamily: 'Inter', fontSize: 16, fontWeight: 600, color: '#4A5568' }}>{dr.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
