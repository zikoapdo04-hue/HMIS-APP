import { useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storage.service';
import { userService } from '../../services/user.service';
import type { Screen } from '../../types';

interface Props { setScreen: (s: Screen) => void }
type Modal = 'none' | 'menu' | 'viewer';

export function DoctorProfile({ setScreen }: Props) {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [modal, setModal]         = useState<Modal>('none');

  const name      = user?.name      ?? '—';
  const specialty = user?.specialty ?? '—';
  const hospital  = user?.hospital  ?? '—';
  const address   = user?.hospitalAddress ?? '—';
  const phone     = user?.phone     ?? '—';
  const email     = user?.email     ?? '—';
  const rating    = user?.rating    ?? 0;
  const days      = user?.workDays?.join(' / ') ?? '—';
  const avatarSrc = user?.imageUrl
    ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1DB8C8&color=fff&size=260`;

  const handleChangePhoto = () => {
    setModal('none');
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    try {
      // Upload to Supabase Storage → get public URL
      const url = await storageService.uploadAvatar(user.id, file);
      // Save URL to Firestore
      await userService.update(user.id, { imageUrl: url });
      // Update local context so UI refreshes immediately
      updateUser({ imageUrl: url });
    } catch {
      // silent — avatar just stays the same
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div style={{ width: '100%', height: '100vh', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column' }}>

      {/* ── Fullscreen Image Viewer ── */}
      {modal === 'viewer' && (
        <div onClick={() => setModal('none')} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <button onClick={() => setModal('none')} style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 44, height: 44, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <img src={avatarSrc} alt={name} onClick={e => e.stopPropagation()} style={{ maxWidth: '90vw', maxHeight: '85vh', borderRadius: '16px', objectFit: 'contain', boxShadow: '0 8px 48px rgba(0,0,0,0.6)' }} />
        </div>
      )}

      {/* ── Action Menu Modal ── */}
      {modal === 'menu' && (
        <div onClick={() => setModal('none')} style={{ position: 'fixed', inset: 0, zIndex: 900, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 480, background: '#fff', borderRadius: '24px 24px 0 0', padding: '28px 24px 40px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ width: 44, height: 5, borderRadius: 99, background: '#D1D5DB', margin: '0 auto 8px' }} />
            <span style={{ fontFamily: 'Cairo, sans-serif', fontSize: '20px', fontWeight: 800, color: '#1A202C', textAlign: 'center', marginBottom: '4px' }}>الصورة الشخصية</span>
            <button onClick={() => setModal('viewer')} style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#F0F9FB', border: '1.5px solid #168A9E', borderRadius: '14px', padding: '16px 20px', cursor: 'pointer', width: '100%' }}>
              <div style={{ background: '#168A9E', borderRadius: '50%', width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </div>
              <span style={{ fontFamily: 'Cairo, sans-serif', fontSize: '18px', fontWeight: 700, color: '#168A9E' }}>عرض الصورة</span>
            </button>
            <button onClick={handleChangePhoto} style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#F8F9FA', border: '1.5px solid #D1D5DB', borderRadius: '14px', padding: '16px 20px', cursor: 'pointer', width: '100%' }}>
              <div style={{ background: '#4B5563', borderRadius: '50%', width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4z"/><path d="M9 3L7.17 5H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3.17L15 3H9z"/></svg>
              </div>
              <span style={{ fontFamily: 'Cairo, sans-serif', fontSize: '18px', fontWeight: 700, color: '#374151' }}>تغيير الصورة</span>
            </button>
            <button onClick={() => setModal('none')} style={{ background: 'transparent', border: 'none', fontFamily: 'Cairo, sans-serif', fontSize: '17px', fontWeight: 600, color: '#9CA3AF', cursor: 'pointer', padding: '8px' }}>إلغاء</button>
          </div>
        </div>
      )}

      {/* Header */}
      <header style={{ padding: '24px', textAlign: 'center', position: 'relative', background: '#168A9E', flexShrink: 0 }}>
        <button aria-label="settings" onClick={() => setScreen('doctor-settings')} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33h.09a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
        <span style={{ color: 'white', fontSize: '26px', fontFamily: 'Cairo, sans-serif', fontWeight: 800 }}>بيانات الطبيب</span>
      </header>

      <div style={{ flex: 1, overflowY: 'auto', padding: '32px 24px' }}>
        {/* Avatar + Name */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px', marginBottom: '32px' }} dir="rtl">
          <div onClick={() => setModal('menu')} style={{ position: 'relative', width: 130, height: 130, borderRadius: '50%', cursor: 'pointer', flexShrink: 0 }}>
            <img src={avatarSrc} alt={name} style={{ width: 130, height: 130, borderRadius: '50%', objectFit: 'cover', border: '3px solid #168A9E' }} />
            {uploading && (
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 32, height: 32, border: '3px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
              </div>
            )}
            {!uploading && (
              <div style={{ position: 'absolute', bottom: 4, right: 4, background: '#168A9E', borderRadius: '50%', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4z"/><path d="M9 3L7.17 5H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3.17L15 3H9z"/></svg>
              </div>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontFamily: 'Cairo, sans-serif', fontSize: '26px', fontWeight: 800, color: '#3197A7', marginBottom: '8px', textAlign: 'center' }}>د.{name}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontFamily: 'Cairo, sans-serif', fontSize: '18px', fontWeight: 600, color: '#A0ABC0' }}>{specialty}</span>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '18px', fontWeight: 600, color: '#A0ABC0', marginRight: '6px' }}>{rating}</span>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#ECC94B" stroke="#ECC94B"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div dir="rtl" style={{ marginBottom: '32px' }}>
          <div style={{ backgroundColor: '#E6EEF5', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span style={{ fontFamily: 'Cairo, sans-serif', fontSize: '18px', fontWeight: 600, color: '#8898AA' }}>{days}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span style={{ fontFamily: 'Cairo, sans-serif', fontSize: '18px', fontWeight: 600, color: '#8898AA' }}>{hospital} — {address}</span>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div dir="rtl" style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#3197A7', marginBottom: '16px', fontFamily: 'Cairo, sans-serif', paddingRight: '8px' }}>معلومات التواصل</h3>
          <div style={{ backgroundColor: '#E6EEF5', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <svg width="30" height="22" viewBox="0 0 32 24"><rect width="32" height="24" rx="4" fill="#000"/><path d="M 2 4 L 16 14 L 30 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', fontWeight: 700, color: '#8898AA' }}>{email}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ backgroundColor: '#000', borderRadius: '6px', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
              </div>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', fontWeight: 700, color: '#8898AA' }}>{phone}</span>
            </div>
          </div>
        </div>
      </div>

      <nav dir="rtl" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', flexShrink: 0 }}>
        <button onClick={() => setScreen('doctor-home')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="black"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
        </button>
        <button style={{ padding: '14px 28px', border: 'none', borderRadius: '24px', background: '#168A9E', color: 'white', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
          <span style={{ fontFamily: 'Cairo', fontSize: '20px', fontWeight: 800 }}>الحساب</span>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
        </button>
      </nav>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
