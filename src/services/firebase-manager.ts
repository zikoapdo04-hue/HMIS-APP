import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getStorage, type FirebaseStorage } from 'firebase/storage'

// ─────────────────────────────────────────────────────────────────────────────
// FirebaseManager — Singleton
//
// All Firebase SDK instances are created once and re-used across the app.
// React StrictMode double-invokes effects; getApps() guard prevents
// "duplicate-app" errors during HMR and StrictMode re-renders.
// ─────────────────────────────────────────────────────────────────────────────

class FirebaseManager {
  private static instance: FirebaseManager | null = null

  readonly app:     FirebaseApp
  readonly auth:    Auth
  readonly db:      Firestore
  readonly storage: FirebaseStorage

  private constructor() {
    const config = {
      apiKey:            import.meta.env.VITE_FIREBASE_API_KEY             as string,
      authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN         as string,
      databaseURL:       import.meta.env.VITE_FIREBASE_DATABASE_URL        as string,
      projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID          as string,
      storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET      as string,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
      appId:             import.meta.env.VITE_FIREBASE_APP_ID              as string,
      measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID      as string,
    }

    this.app     = getApps().length === 0 ? initializeApp(config) : getApp()
    this.auth    = getAuth(this.app)
    this.db      = getFirestore(this.app)
    this.storage = getStorage(this.app)
  }

  static getInstance(): FirebaseManager {
    if (!FirebaseManager.instance) {
      FirebaseManager.instance = new FirebaseManager()
    }
    return FirebaseManager.instance
  }
}

// Named exports for convenience — services import from here, never from firebase/app directly
export const firebase = FirebaseManager.getInstance()
export const { auth, db, storage } = firebase
