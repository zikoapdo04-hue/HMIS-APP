import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../services/firebase-manager'
import { DEFAULT_SPECIALTIES } from '../core/constants'
import type { SpecialtyModel } from '../models/specialty.model'

/**
 * Fetches specialties from Firestore `specialties` collection.
 * Falls back to the static DEFAULT_SPECIALTIES list if the collection
 * is empty or the fetch fails — so the UI always has data.
 */
export function useSpecialties() {
  const [specialties, setSpecialties] = useState<SpecialtyModel[]>([])
  const [loading, setLoading]         = useState(true)

  useEffect(() => {
    getDocs(collection(db, 'specialties'))
      .then(snap => {
        if (snap.empty) {
          setSpecialties([...DEFAULT_SPECIALTIES])
        } else {
          setSpecialties(snap.docs.map(d => d.data() as SpecialtyModel))
        }
      })
      .catch(() => {
        // Firestore unavailable — use static list
        setSpecialties([...DEFAULT_SPECIALTIES])
      })
      .finally(() => setLoading(false))
  }, [])

  return { specialties, loading }
}
