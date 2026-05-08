import { useAuth } from '../../context/AuthContext';
import type { Screen } from '../../types';

interface Props { setScreen: (s: Screen) => void }

interface Notification {
  id: string;
  type: 'reminder' | 'prescription' | 'cancellation';
  title: string;
  body: string;
  date: string;
  isRead: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'reminder',
    title: 'تذكير بموعد',
    body: 'لديك موعد غداً مع د. خالد عبدالله في عيادة العظام الساعة 4:30 مساءً. يرجى الحضور قبل الموعد بـ 15 دقيقة.',
    date: 'منذ ساعتين',
    isRead: false,
  },
  {
    id: '2',
    type: 'prescription',
    title: 'وصفة طبية جديدة',
    body: 'قام د. منى حسن بكتابة وصفة طبية جديدة لك. يمكنك عرضها في قسم السجلات الخاصة بك.',
    date: 'منذ 5 ساعات',
    isRead: true,
  },
  {
    id: '3',
    type: 'cancellation',
    title: 'إلغاء موعد',
    body: 'نعتذر، تم إلغاء موعدك القادم نظراً لعدم تواجد الطبيب بالعيادة في هذا اليوم. يرجى حجز موعد آخر.',
    date: 'أمس',
    isRead: true,
  }
];

export function Notifications({ setScreen }: Props) {
  const { user } = useAuth();
  const patientName = user?.name ?? 'مريض';

  const getIconForType = (type: string) => {
    switch (type) {
      case 'reminder':
        return (
          <div style={{ width: '44px', height: '44px', background: '#EBF8FA', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#168A9E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              <circle cx="12" cy="15" r="3"/>
            </svg>
          </div>
        );
      case 'prescription':
        return (
          <div style={{ width: '44px', height: '44px', background: '#F0FFF4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#38A169" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.5 20.5l-6-6a4.5 4.5 0 1 1 6.4-6.4l6 6a4.5 4.5 0 1 1-6.4 6.4z"/><line x1="8" y1="8" x2="16" y2="16"/>
            </svg>
          </div>
        );
      case 'cancellation':
        return (
          <div style={{ width: '44px', height: '44px', background: '#FFF5F5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E53E3E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ width: '100%', height: '100vh', backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '24px', textAlign: 'center', position: 'relative', background: '#168A9E', flexShrink: 0 }}>
        <button aria-label="back" onClick={() => setScreen('patient-home')} style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
        <span style={{ color: 'white', fontSize: '26px', fontFamily: 'Cairo, sans-serif', fontWeight: 800 }}>الاشعارات</span>
      </header>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        
        {/* Welcome Notification */}
        {user && (
          <div style={{ background: '#fff', borderRadius: '16px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', direction: 'rtl', marginBottom: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #E2E8F0' }}>
            <div style={{ width: '44px', height: '44px', background: '#168A9E', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: 'Cairo', fontSize: 16, fontWeight: 800, color: '#1A202C', margin: 0 }}>مرحباً {patientName}!</p>
              <p style={{ fontFamily: 'Cairo', fontSize: 14, fontWeight: 600, color: '#4A5568', margin: '4px 0 0' }}>تم تسجيل دخولك بنجاح إلى نظام HMIS.</p>
            </div>
          </div>
        )}

        {/* Dynamic Notifications */}
        {MOCK_NOTIFICATIONS.map(notif => (
          <div key={notif.id} style={{ background: notif.isRead ? '#fff' : '#F0F9FB', borderRadius: '16px', padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: '16px', direction: 'rtl', marginBottom: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: notif.isRead ? '1px solid #E2E8F0' : '1px solid #BEE3F8' }}>
            {getIconForType(notif.type)}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <h3 style={{ fontFamily: 'Cairo', fontSize: 16, fontWeight: 800, color: '#1A202C', margin: 0 }}>{notif.title}</h3>
                <span style={{ fontFamily: 'Cairo', fontSize: 12, fontWeight: 600, color: '#A0AEC0' }}>{notif.date}</span>
              </div>
              <p style={{ fontFamily: 'Cairo', fontSize: 14, fontWeight: 600, color: '#4A5568', margin: 0, lineHeight: 1.6 }}>{notif.body}</p>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
