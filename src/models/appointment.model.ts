import type { Timestamp } from 'firebase/firestore'
import type { AppointmentStatus, UserRole } from '../core/enums'

/**
 * Firestore collection: `appointments`
 */
export interface AppointmentModel {
  id:               string
  patientId:        string       // UserModel.id
  patientUserId:    string       // Firebase Auth UID
  patientName:      string
  patientPhone:     string
  patientImageUrl:  string | null
  doctorId:         string       // UserModel.id
  doctorName:       string
  doctorSpecialty:  string
  doctorImageUrl:   string | null
  date:             Timestamp
  time:             string        // "10:00 AM"
  number:           number        // queue number
  symptoms:         string
  status:           AppointmentStatus
  address:          string
  timeSlotId:       string | null
  actorRole:        UserRole
  createdBy:        string        // uid of creator
  updatedAt:        Timestamp
  attachments:      string[]      // Storage download URLs
}

export type AppointmentDTO = Omit<AppointmentModel, 'date' | 'updatedAt'> & {
  date:      string   // ISO 8601
  updatedAt: string
}
