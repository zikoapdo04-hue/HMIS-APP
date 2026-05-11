import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  type DocumentData,
  type QueryConstraint,
  type Unsubscribe,
  type WithFieldValue,
  type PartialWithFieldValue,
} from 'firebase/firestore'
import { db } from './firebase-manager'
import type { CollectionName } from '../core/constants'

// ─────────────────────────────────────────────────────────────────────────────
// DatabaseService<T>
//
// Generic CRUD service. Accepts a Firestore collection name and a TypeScript
// interface T. All methods return typed results — zero `any` usage.
//
// Usage:
//   const apptService = new DatabaseService<AppointmentModel>('appointments')
//   const all = await apptService.getAll()
// ─────────────────────────────────────────────────────────────────────────────

export class DatabaseService<T extends DocumentData> {
  private readonly collectionName: CollectionName

  constructor(collectionName: CollectionName) {
    this.collectionName = collectionName
  }

  // ── Read ──────────────────────────────────────────────────────────────────

  async getById(id: string): Promise<T | null> {
    const ref  = doc(db, this.collectionName, id)
    const snap = await getDoc(ref)
    return snap.exists() ? ({ id: snap.id, ...snap.data() } as unknown as T) : null
  }

  async getAll(constraints: QueryConstraint[] = []): Promise<T[]> {
    const ref   = collection(db, this.collectionName)
    const q     = constraints.length ? query(ref, ...constraints) : query(ref)
    const snaps = await getDocs(q)
    return snaps.docs.map(d => ({ id: d.id, ...d.data() } as unknown as T))
  }

  async getWhere(
    field:     string,
    operator:  Parameters<typeof where>[1],
    value:     unknown,
    extra:     QueryConstraint[] = [],
  ): Promise<T[]> {
    return this.getAll([where(field, operator, value), ...extra])
  }

  async getFirst(constraints: QueryConstraint[]): Promise<T | null> {
    const results = await this.getAll([...constraints, limit(1)])
    return results[0] ?? null
  }

  // ── Write ─────────────────────────────────────────────────────────────────

  /**
   * Create a document with an auto-generated ID.
   * Returns the new document ID.
   */
  async create(data: Omit<WithFieldValue<T>, 'id'>): Promise<string> {
    const ref = collection(db, this.collectionName)
    const docRef = await addDoc(ref, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return docRef.id
  }

  /**
   * Create or overwrite a document with a known ID (e.g., user uid).
   */
  async set(id: string, data: WithFieldValue<T>): Promise<void> {
    const ref = doc(db, this.collectionName, id)
    await setDoc(ref, {
      ...data,
      updatedAt: serverTimestamp(),
    })
  }

  /**
   * Partially update fields without overwriting the entire document.
   */
  async update(id: string, data: PartialWithFieldValue<T>): Promise<void> {
    const ref = doc(db, this.collectionName, id)
    await updateDoc(ref, {
      ...data,
      updatedAt: serverTimestamp(),
    })
  }

  /** Hard delete. Prefer soft-deletes (isDeleted flag) for audit trails. */
  async delete(id: string): Promise<void> {
    const ref = doc(db, this.collectionName, id)
    await deleteDoc(ref)
  }

  // ── Real-time ─────────────────────────────────────────────────────────────

  /**
   * Subscribe to a single document.
   * Returns an unsubscribe function — call it in useEffect cleanup.
   */
  subscribeToDoc(id: string, onData: (data: T | null) => void): Unsubscribe {
    const ref = doc(db, this.collectionName, id)
    return onSnapshot(ref, snap => {
      onData(snap.exists() ? ({ id: snap.id, ...snap.data() } as unknown as T) : null)
    })
  }

  /**
   * Subscribe to a query.
   * Returns an unsubscribe function — call it in useEffect cleanup.
   */
  subscribeToQuery(
    constraints: QueryConstraint[],
    onData: (data: T[]) => void,
  ): Unsubscribe {
    const ref = collection(db, this.collectionName)
    const q   = query(ref, ...constraints)
    return onSnapshot(q, snap => {
      onData(snap.docs.map(d => ({ id: d.id, ...d.data() } as unknown as T)))
    })
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Re-export query helpers so callers never import from 'firebase/firestore'
// ─────────────────────────────────────────────────────────────────────────────
export { where, orderBy, limit }
