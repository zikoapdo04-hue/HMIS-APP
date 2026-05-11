import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  type User as FirebaseUser,
  type Unsubscribe,
} from 'firebase/auth'
import { serverTimestamp } from 'firebase/firestore'
import { auth } from './firebase-manager'
import { DatabaseService } from './database.service'
import { COLLECTIONS } from '../core/constants'
import { UserRole, DoctorStatus } from '../core/enums'
import type { UserModel } from '../models/user.model'

const userService = new DatabaseService<UserModel>(COLLECTIONS.USERS)

export class AuthService {
  // ── Auth state ────────────────────────────────────────────────────────────

  /** Subscribe to Firebase auth state changes. Returns unsubscribe fn. */
  static onAuthStateChanged(callback: (user: FirebaseUser | null) => void): Unsubscribe {
    return onAuthStateChanged(auth, callback)
  }

  /** Fetch the Firestore UserModel for the currently signed-in user. */
  static async getCurrentUserProfile(uid: string): Promise<UserModel | null> {
    return userService.getById(uid)
  }

  // ── Registration ──────────────────────────────────────────────────────────

  static async registerPatient(params: {
    name:     string
    email:    string
    password: string
    phone:    string
    city:     string
    age:      number
  }): Promise<UserModel> {
    const credential = await createUserWithEmailAndPassword(auth, params.email, params.password)
    await updateProfile(credential.user, { displayName: params.name })

    const profile: UserModel = {
      id:              credential.user.uid,
      name:            params.name,
      email:           params.email,
      phone:           params.phone,
      role:            UserRole.Patient,
      city:            params.city,
      imageUrl:        null,
      isActive:        true,
      age:             params.age,
      gender:          null,
      createdAt:       serverTimestamp() as unknown as import('firebase/firestore').Timestamp,
      specialty:       null,
      hospital:        null,
      hospitalAddress: null,
      bio:             null,
      rating:          null,
      workDays:        [],
      workHoursStart:  null,
      workHoursEnd:    null,
      doctorStatus:    null,
      approvedBy:      null,
      approvedAt:      null,
    }

    await userService.set(credential.user.uid, profile)
    return profile
  }

  static async registerDoctor(params: {
    name:      string
    email:     string
    password:  string
    phone:     string
    specialty: string
    hospital:  string
    address:   string
  }): Promise<UserModel> {
    const credential = await createUserWithEmailAndPassword(auth, params.email, params.password)
    await updateProfile(credential.user, { displayName: params.name })

    const profile: UserModel = {
      id:              credential.user.uid,
      name:            params.name,
      email:           params.email,
      phone:           params.phone,
      role:            UserRole.Doctor,
      city:            '',
      imageUrl:        null,
      isActive:        true,
      age:             null,
      gender:          null,
      createdAt:       serverTimestamp() as unknown as import('firebase/firestore').Timestamp,
      specialty:       params.specialty,
      hospital:        params.hospital,
      hospitalAddress: params.address,
      bio:             null,
      rating:          0,
      workDays:        [],
      workHoursStart:  null,
      workHoursEnd:    null,
      doctorStatus:    DoctorStatus.Pending,
      approvedBy:      null,
      approvedAt:      null,
    }

    await userService.set(credential.user.uid, profile)
    return profile
  }

  // ── Session ───────────────────────────────────────────────────────────────

  static async login(email: string, password: string): Promise<UserModel | null> {
    const credential = await signInWithEmailAndPassword(auth, email, password)
    return AuthService.getCurrentUserProfile(credential.user.uid)
  }

  static async logout(): Promise<void> {
    await signOut(auth)
  }
}
