import { useState } from 'react';
import type { Screen } from '../types';
import { ShieldIcon, CalendarIcon, StethoIcon, ArrowLeft } from '../components/Icons';

interface Props { setScreen: (s: Screen) => void }

const slides = [
  {
    img: '/security_illustration.png',
    title: 'آمن وسري',
    sub: 'كن مطمئناً لأن خصوصيتك وأمانك همّا أولوياتنا',
    icon: <ShieldIcon />,
    tags: ['🔒 تشفير البيانات', '🛡️ حماية متكاملة'],
  },
  {
    img: '/booking_illustration.png',
    title: 'سهولة الحجز',
    sub: 'احجز المواعيد بكل سهولة في أي وقت وأي مكان',
    icon: <CalendarIcon />,
    tags: ['📅 حجز فوري', '⏰ متاح 24/7'],
  },
  {
    img: '/doctors_illustration.png',
    title: 'ابحث عن طبيب متخصص',
    sub: 'اكتشف مجموعة واسعة من الأطباء الخبراء في مختلف المجالات الطبية',
    icon: <StethoIcon />,
    tags: ['👨‍⚕️ أطباء معتمدون', '🏥 تخصصات متعددة'],
  },
];

export function Onboarding({ setScreen }: Props) {
  const [slide, setSlide] = useState(0);
  const [imgKey, setImgKey] = useState(0);

  const goNext = () => {
    if (slide < slides.length - 1) { setImgKey(k => k + 1); setSlide(s => s + 1); }
    else setScreen('role');
  };
  const goSlide = (i: number) => { setImgKey(k => k + 1); setSlide(i); };

  return (
    <div className="onboard">
      <div className="onboard-left">
        <div className="onboard-blob" />
        <img key={imgKey} src={slides[slide].img} alt="" className="onboard-img" />
        <div className="dot-row">
          {slides.map((_, i) => (
            <button key={i} className={`dot ${i === slide ? 'active' : ''}`} onClick={() => goSlide(i)} />
          ))}
        </div>
      </div>
      <div className="onboard-right">
        <button className="skip-btn" onClick={() => setScreen('role')}>تخطي →</button>
        <div className="onboard-body">
          <div className="icon-badge" key={slide + 'icon'}>{slides[slide].icon}</div>
          <h1 className="onboard-title" key={slide + 't'}>{slides[slide].title}</h1>
          <p className="onboard-sub" key={slide + 's'}>{slides[slide].sub}</p>
          <div className="tag-row">
            {slides[slide].tags.map((t, i) => <span key={i} className="feature-tag">{t}</span>)}
          </div>
        </div>
        <div className="onboard-footer">
          <div className="dot-row">
            {slides.map((_, i) => (
              <button key={i} className={`dot ${i === slide ? 'active' : ''}`} onClick={() => goSlide(i)} />
            ))}
          </div>
          <button id="next-btn" className="next-btn" onClick={goNext}>
            <ArrowLeft />
            {slide === slides.length - 1 ? 'ابدأ الآن' : 'التالي'}
          </button>
        </div>
      </div>
    </div>
  );
}
