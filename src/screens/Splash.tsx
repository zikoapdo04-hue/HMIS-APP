import { useEffect } from 'react';
import type { Screen } from '../types';

interface Props { setScreen: (s: Screen) => void }

export function Splash({ setScreen }: Props) {
  useEffect(() => {
    const t = setTimeout(() => setScreen('onboarding'), 2600);
    return () => clearTimeout(t);
  }, [setScreen]);

  return (
    <div style={{ width: '100%', height: '100vh', backgroundColor: '#7BC8DE', overflow: 'hidden' }}>
      <img
        src="/splash.jpg"
        alt="HMIS Splash"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        onError={(e) => { e.currentTarget.src = '/splash.png'; e.currentTarget.onerror = null; }}
      />
    </div>
  );
}
