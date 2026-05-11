import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar');
  };

  return (
    <button 
      onClick={toggleLang}
      style={{
        position: 'absolute',
        top: 16,
        insetInlineEnd: 16,
        zIndex: 9999,
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.6)',
        borderRadius: '20px',
        padding: '6px 12px',
        fontFamily: 'Inter, Cairo, sans-serif',
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#1DB8C8',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}
    >
      {i18n.language === 'ar' ? 'English' : 'عربي'}
    </button>
  );
}
