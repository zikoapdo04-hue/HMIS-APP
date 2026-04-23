import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Screen } from '../types';
import { ShieldIcon, CalendarIcon, StethoIcon, ArrowLeft } from '../components/Icons';
import { LanguageSwitcher } from '../components/LanguageSwitcher';

interface Props { setScreen: (s: Screen) => void }

export function Onboarding({ setScreen }: Props) {
  const [slide, setSlide] = useState(0);
  const [imgKey, setImgKey] = useState(0);
  const { t } = useTranslation();

  const slides = [
    {
      img: '/security_illustration.png',
      title: t('onboarding.slide1.title'),
      sub: t('onboarding.slide1.sub'),
      icon: <ShieldIcon />,
      tags: [t('onboarding.slide1.tag1'), t('onboarding.slide1.tag2')],
    },
    {
      img: '/booking_illustration.png',
      title: t('onboarding.slide2.title'),
      sub: t('onboarding.slide2.sub'),
      icon: <CalendarIcon />,
      tags: [t('onboarding.slide2.tag1'), t('onboarding.slide2.tag2')],
    },
    {
      img: '/doctors_illustration.png',
      title: t('onboarding.slide3.title'),
      sub: t('onboarding.slide3.sub'),
      icon: <StethoIcon />,
      tags: [t('onboarding.slide3.tag1'), t('onboarding.slide3.tag2')],
    },
  ];

  const goNext = () => {
    if (slide < slides.length - 1) { setImgKey(k => k + 1); setSlide(s => s + 1); }
    else setScreen('role');
  };
  const goSlide = (i: number) => { setImgKey(k => k + 1); setSlide(i); };

  return (
    <div className="onboard">
      <LanguageSwitcher />
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
        <button className="skip-btn" onClick={() => setScreen('role')}>{t('onboarding.skip')}</button>
        <div className="onboard-body">
          <div className="icon-badge" key={slide + 'icon'}>{slides[slide].icon}</div>
          <h1 className="onboard-title" key={slide + 't'}>{slides[slide].title}</h1>
          <p className="onboard-sub" key={slide + 's'}>{slides[slide].sub}</p>
          <div className="tag-row">
            {slides[slide].tags.map((tag, i) => <span key={i} className="feature-tag">{tag}</span>)}
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
            {slide === slides.length - 1 ? t('onboarding.start') : t('onboarding.next')}
          </button>
        </div>
      </div>
    </div>
  );
}
