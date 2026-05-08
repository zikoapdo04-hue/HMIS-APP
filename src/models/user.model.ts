import type { Timestamp } from 'firebase/firestore'
import type { UserRole, DoctorStatus, Gender } from '../core/enums'

/**
 * Firestore collection: `users`
 * Single document per registered user. Role-specific fields are optional
 * and only populated for the relevant role.
 */
export interface UserModel {
  id:              string
  name:            string
  email:           string
  phone:           string
  role:            UserRole
  city:            string
  imageUrl:        string | null
  isActive:        boolean
  age:             number | null
  gender:          Gender | null
  createdAt:       Timestamp

  // Doctor-only fields
  specialty:       string | null
  hospital:        string | null
  hospitalAddress: string | null
  bio:             string | null
  rating:          number | null
  workDays:        string[]
  workHoursStart:  string | null   // "09:00"
  workHoursEnd:    string | null   // "17:00"
  doctorStatus:    DoctorStatus | null
  approvedBy:      string | null   // admin uid
  approvedAt:      Timestamp | null
}

/** Shape after Timestamp fields are serialized for UI consumption */
export type UserDTO = Omit<UserModel, 'createdAt' | 'approvedAt'> & {
  createdAt:  string
  approvedAt: string | null
}
