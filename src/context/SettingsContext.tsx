import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface SettingsContextValue {
  fontSize: number;
  setFontSize: (size: number) => void;
  darkMode: boolean;
  setDarkMode: (mode: boolean) => void;
}

const SettingsContext = createContext<SettingsContextValue>({
  fontSize: 14,
  setFontSize: () => {},
  darkMode: false,
  setDarkMode: () => {}
});

export function useSettings() {
  return useContext(SettingsContext);
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  // Try to load initial values from localStorage or default
  const [fontSize, setFontSizeState] = useState<number>(() => {
    const saved = localStorage.getItem('global_font_size');
    return saved ? parseInt(saved, 10) : 14;
  });

  const [darkMode, setDarkModeState] = useState<boolean>(() => {
    return localStorage.getItem('global_dark_mode') === 'true';
  });

  // Keep localStorage in sync
  const setFontSize = (size: number) => {
    setFontSizeState(size);
    localStorage.setItem('global_font_size', size.toString());
  };

  const setDarkMode = (mode: boolean) => {
    setDarkModeState(mode);
    localStorage.setItem('global_dark_mode', mode.toString());
  };

  // Add the admin-dark-mode class to body or provide it to App.tsx
  // Since App.tsx wraps the app in `.screen-wrap`, we can just pass the state
  // But we can also set the default body background for better coverage
  useEffect(() => {
    if (darkMode) {
      document.body.style.backgroundColor = '#1a202c';
    } else {
      document.body.style.backgroundColor = '#f7fafc';
    }
  }, [darkMode]);

  return (
    <SettingsContext.Provider value={{ fontSize, setFontSize, darkMode, setDarkMode }}>
      {children}
    </SettingsContext.Provider>
  );
}
