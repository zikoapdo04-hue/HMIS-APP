import { useEffect, useState } from 'react';

interface Props {
  patientName: string;
  onBack: () => void;
}

export interface RadiologyRecord {
  id:       number;
  type:     string;       // e.g. "أشعة سينية" / "تحليل دم"
  date:     string;
  doctor:   string;
  imageUrl: string;
  tag:      'xray' | 'scan' | 'lab';
}

const DEFAULT_RECORDS: RadiologyRecord[] = [
  {
    id: 1,
    type: 'أشعة سينية - صدر',
    date: '1-3-2026',
    doctor: 'دكتور مصطفي محمد',
    imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&q=80&w=400',
    tag: 'xray',
  },
  {
    id: 2,
    type: 'أشعة مقطعية - بطن',
    date: '8-3-2026',
    doctor: 'دكتور مصطفي محمد',
    imageUrl: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=400',
    tag: 'scan',
  },
  {
    id: 3,
    type: 'تحليل دم شامل',
    date: '15-3-2026',
    doctor: 'دكتور يوسف يحي',
    imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=400',
    tag: 'lab',
  },
  {
    id: 4,
    type: 'أشعة رنين مغناطيسي - رأس',
    date: '20-3-2026',
    doctor: 'دكتور يوسف يحي',
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=400',
    tag: 'scan',
  },
];

const TAG_LABELS: Record<RadiologyRecord['tag'], string> = {
  xray: 'أشعة سينية',
  scan: 'أشعة مقطعية / رنين',
  lab:  'تحاليل مختبرية',
};

const TAG_COLORS: Record<RadiologyRecord['tag'], string> = {
  xray: '#0E8A96',
  scan: '#7B5EA7',
  lab:  '#2E855A',
};

export function RadiologyRecordViewer({ patientName, onBack }: Props) {
  const [records, setRecords] = useState<RadiologyRecord[]>(DEFAULT_RECORDS);

  useEffect(() => {
    // Load sent records from localStorage
    const savedRecordsStr = localStorage.getItem('patient_radiology_records');
    if (savedRecordsStr) {
      try {
        const savedRecords = JSON.parse(savedRecordsStr);
        if (Array.isArray(savedRecords) && savedRecords.length > 0) {
          // Add the newly uploaded records at the top, along with default ones
          setRecords([...savedRecords, ...DEFAULT_RECORDS]);
        }
      } catch (e) {
        console.error("Failed to parse saved records", e);
      }
    }
  }, []);

  const handleDelete = (id: number) => {
    setRecords(prev => prev.filter(r => r.id !== id));
    const savedRecordsStr = localStorage.getItem('patient_radiology_records');
    if (savedRecordsStr) {
      try {
        const savedRecords = JSON.parse(savedRecordsStr);
        const newSaved = savedRecords.filter((r: RadiologyRecord) => r.id !== id);
        localStorage.setItem('patient_radiology_records', JSON.stringify(newSaved));
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="admin-dash-screen" style={{ overflowY: 'auto' }}>

      {/* ── Header ── */}
      <div className="admin-detail-header" dir="rtl">
        <button className="admin-detail-back" onClick={onBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ transform: 'rotate(180deg)' }}>
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <span className="admin-detail-title">سجل الأشعة والتحاليل</span>
        <div style={{ width: 40 }} />
      </div>

      {/* ── Patient badge ── */}
      <div className="ard-patient-badge" dir="rtl">
        <img
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(patientName)}&background=random&size=80`}
          alt={patientName}
          className="ard-patient-avatar"
        />
        <div className="ard-patient-info">
          <span className="ard-patient-name">{patientName}</span>
          <span className="ard-patient-sub">سجلات الأشعة والتحاليل المُرسلة</span>
        </div>
      </div>

      {/* ── Count chip ── */}
      <div dir="rtl" style={{ padding: '0 20px 4px' }}>
        <span className="ard-count-chip">{records.length} سجل</span>
      </div>

      {/* ── Records list ── */}
      <div className="ard-list" dir="rtl">
        {records.map(rec => (
          <div key={rec.id} className="ard-card">

            {/* Image */}
            <div className="ard-img-wrap">
              <img
                src={rec.imageUrl}
                alt={rec.type}
                className="ard-img"
                style={rec.tag !== 'lab' ? { filter: 'grayscale(80%) contrast(1.15)' } : {}}
              />
              <span className="ard-tag-badge" style={{ background: TAG_COLORS[rec.tag] || TAG_COLORS.xray }}>
                {TAG_LABELS[rec.tag] || TAG_LABELS.xray}
              </span>
            </div>

            {/* Info */}
            <div className="ard-info">
              <span className="ard-type">{rec.type}</span>
              <div className="ard-meta-row">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span className="ard-meta-text">{rec.date}</span>
              </div>
              <div className="ard-meta-row">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span className="ard-meta-text">{rec.doctor}</span>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <button className="ard-print-btn" style={{ flex: 1 }} onClick={() => window.print()}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 6 2 18 2 18 9" />
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                    <rect x="6" y="14" width="12" height="8" />
                  </svg>
                  طباعة
                </button>
                <button className="ard-print-btn" style={{ flex: 1, background: '#FFF5F5', color: '#E53E3E' }} onClick={() => handleDelete(rec.id)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                  حذف
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
