import { useEffect, useState } from 'react';
import type { Screen } from '../../types';
import { HMISGlobe, HMISShieldLogo } from '../../components/Icons';

interface Props {
  setScreen: (s: Screen) => void;
  navClinic: (specialty: string, color: string) => void;
}

const DEPT_META: { name: string; color: string; x: number }[] = [
  { name: 'القلب',         color: '#E57373', x: 14 },
  { name: 'جراحة عامة',  color: '#E99F8E', x: 30 },
  { name: 'مخ واعصاب',   color: '#2E7D52', x: 28 },
  { name: 'عظام',         color: '#4DB6AC', x: 55 },
  { name: 'اطفال',        color: '#D94F3A', x: 68 },
  { name: 'نساء وتوليد', color: '#1B6B6B', x: 62 },
];

const yLabels = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10];

export function AdminHome({ setScreen, navClinic }: Props) {
  const [doctorCount, setDoctorCount]   = useState(0);
  const [patientCount, setPatientCount] = useState(0);
  const [apptCount, setApptCount]       = useState(0);
  const [deptPct, setDeptPct]           = useState<Record<string, number>>({});

  useEffect(() => {
    // Mock Data
    setDoctorCount(45);
    setPatientCount(320);
    setApptCount(150);

    const mockupPcts: Record<string, number> = {
      'القلب': 20,
      'جراحة عامة': 15,
      'مخ واعصاب': 10,
      'عظام': 25,
      'اطفال': 15,
      'نساء وتوليد': 15,
    };
    setDeptPct(mockupPcts);
  }, []);

  const departments = DEPT_META.map(m => ({
    ...m,
    pct: deptPct[m.name] ?? 10,
  }));

  return (
    <div className="admin-screen">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-logo-row">
          <HMISGlobe size={64} />
          <span className="admin-hmis-text">HMIS</span>
          <HMISShieldLogo size={40} />
        </div>
      </div>

      {/* Scrollable content */}
      <div className="admin-content">
        <h2 className="admin-section-heading" dir="rtl">ادارة الحسابات</h2>

        {/* Stats card */}
        <div className="admin-stats-card" dir="rtl">
          <div className="admin-stat-row">
            <span className="admin-stat-value">{doctorCount}</span>
            <span className="admin-stat-label">عدد الاطباء :</span>
          </div>
          <div className="admin-stat-row">
            <span className="admin-stat-value">{patientCount}</span>
            <span className="admin-stat-label">عدد المرضي :</span>
          </div>
          <div className="admin-stat-row">
            <span className="admin-stat-value">{apptCount}</span>
            <span className="admin-stat-label">عدد الكشفات :</span>
          </div>
        </div>

        {/* Departments header */}
        <div className="admin-dept-header" dir="rtl">
          <span className="admin-stat-sublabel">الاحصائيات</span>
          <h3 className="admin-section-heading" style={{ margin: 0 }}>الاقسام</h3>
        </div>

        {/* Bubble chart */}
        <div className="admin-chart-wrap">
          <div className="admin-chart-ylabels">
            {yLabels.map(v => (
              <span key={v} className="admin-chart-ylabel">{v}%</span>
            ))}
          </div>
          <div className="admin-chart-area">
            {yLabels.map(v => (
              <div key={v} className="admin-chart-gridline" style={{ bottom: `${v}%` }} />
            ))}
            {departments.map((d, i) => (
              <div
                key={i}
                className="admin-dept-bubble"
                style={{
                  backgroundColor: d.color,
                  bottom: `${d.pct}%`,
                  left:   `${d.x}%`,
                  animationDelay: `${i * 0.1}s`,
                }}
                dir="rtl"
                onClick={() => navClinic(d.name, d.color)}
                title={`عيادات ${d.name}`}
              >
                <span className="admin-bubble-name">{d.name}</span>
                <span className="admin-bubble-pct">{d.pct}%</span>
              </div>
            ))}
            <div className="admin-chart-xaxis" />
          </div>
        </div>
      </div>

      {/* Bottom navigation */}
      <nav className="admin-nav">
        <button className="admin-nav-icon" onClick={() => setScreen('admin-doctors')} dir="rtl">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            <line x1="15" y1="10" x2="15" y2="16" stroke="currentColor" strokeWidth="2"/>
            <line x1="12" y1="13" x2="18" y2="13" stroke="currentColor" strokeWidth="2"/>
          </svg>
          ادارة الاطباء
        </button>
        <button className="admin-nav-icon" onClick={() => setScreen('admin-patients')} dir="rtl">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
          ادارة المرضي
        </button>
        <button className="admin-nav-active" dir="rtl">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
          </svg>
          ادارة الحسابات
        </button>
      </nav>
    </div>
  );
}
