import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase-manager';
import { DEFAULT_SPECIALTIES } from '../core/constants';
import type { SpecialtyModel } from '../models/specialty.model';
import { useSettings } from './SettingsContext';

interface SpecialtyContextValue {
  specialties:       SpecialtyModel[];
  loading:           boolean;
  /** Resolve a specialty ID (e.g. "cardiology") to its localized display name. */
  getSpecialtyName:  (id?: string | null) => string;
  /** Resolve a specialty ID to its SpecialtyModel (for color, image etc.) */
  getSpecialty:      (id?: string | null) => SpecialtyModel | undefined;
}

const SpecialtyContext = createContext<SpecialtyContextValue | null>(null);

export function SpecialtyProvider({ children }: { children: ReactNode }) {
  const [specialties, setSpecialties] = useState<SpecialtyModel[]>([]);
  const [loading, setLoading]         = useState(true);
  const { lang } = useSettings();

  useEffect(() => {
    getDocs(collection(db, 'specialties'))
      .then(snap => {
        setSpecialties(snap.empty ? [...DEFAULT_SPECIALTIES] : snap.docs.map(d => d.data() as SpecialtyModel));
      })
      .catch(() => setSpecialties([...DEFAULT_SPECIALTIES]))
      .finally(() => setLoading(false));
  }, []);

  const getSpecialty = (id?: string | null) =>
    specialties.find(s => s.id === id);

  const getSpecialtyName = (id?: string | null): string => {
    const spec = getSpecialty(id);
    if (spec) return lang === 'ar' ? spec.nameAr : spec.nameEn;
    return id ?? '';
  };

  return (
    <SpecialtyContext.Provider value={{ specialties, loading, getSpecialtyName, getSpecialty }}>
      {children}
    </SpecialtyContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSpecialtyContext(): SpecialtyContextValue {
  const ctx = useContext(SpecialtyContext);
  if (!ctx) throw new Error('useSpecialtyContext must be inside <SpecialtyProvider>');
  return ctx;
}
