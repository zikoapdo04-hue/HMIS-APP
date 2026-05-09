import type { Timestamp } from 'firebase/firestore'

// ─────────────────────────────────────────────
// Shared primitives
// ─────────────────────────────────────────────

export type Role = 'patient' | 'doctor' | 'admin'

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export type Gender = 'male' | 'female'

// ─────────────────────────────────────────────
// Firestore document interfaces
// Each interface maps 1-to-1 to a Firestore collection.
// Timestamps are Firestore Timestamp objects when read from the DB
// and `Date | Timestamp` when writing (Firestore accepts both).
// ─────────────────────────────────────────────

/**
 * Collection: `users`
 * Stores auth profile + role metadata for every registered user.
 */
export interface UserDoc {
  uid:       string
  email:     string
  name:      string
  role:      Role
  photoURL:  string | null
  createdAt: Timestamp
  updatedAt: Timestamp
}

/**
 * Collection: `patients`
 * Extended profile for users with role = 'patient'.
 * Document ID == Firebase Auth UID.
 */
export interface PatientDoc {
  uid:      string
  name:     string
  email:    string
  phone:    string
  city:     string
  age:      number
  gender:   Gender
  photoURL: string | null
}

/**
 * Collection: `doctors`
 * Extended profile for users with role = 'doctor'.
 * Document ID == Firebase Auth UID.
 */
export interface DoctorDoc {
  uid:       string
  name:      string
  email:     string
  phone:     string
  specialty: string
  hospital:  string
  address:   string
  rating:    number
  days:      string[]
  photoURL:  string | null
  verified:  boolean
}

/**
 * Collection: `appointments`
 * Booking created by a patient with a doctor.
 */
export interface AppointmentDoc {
  id:          string
  patientId:   string
  patientName: string
  doctorId:    string
  doctorName:  string
  specialty:   string
  location:    string
  date:        Timestamp
  time:        string
  queueNumber: number
  status:      AppointmentStatus
  createdAt:   Timestamp
}

/**
 * Collection: `medicalRecords`
 * A record written by a doctor after a consultation.
 */
export interface MedicalRecordDoc {
  id:          string
  patientId:   string
  doctorId:    string
  doctorName:  string
  specialty:   string
  date:        Timestamp
  diagnosis:   string
  medications: string[]
  tests:       string[]
  xrayUrl:     string | null
  notes:       string
  status:      'open' | 'closed'
}

/**
 * Collection: `clinics`
 * Clinic/hospital entities managed by admins.
 */
export interface ClinicDoc {
  id:       string
  name:     string
  address:  string
  phone:    string
  city:     string
  photoURL: string | null
}

// ─────────────────────────────────────────────
// DTO types — shapes used in UI, stripped of Timestamps
// ─────────────────────────────────────────────

export type AppointmentDTO = Omit<AppointmentDoc, 'date' | 'createdAt'> & {
  date:      string
  createdAt: string
}

export type MedicalRecordDTO = Omit<MedicalRecordDoc, 'date'> & {
  date: string
}
