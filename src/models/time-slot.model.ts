import type { Timestamp } from 'firebase/firestore'

/**
 * Firestore collection: `timeSlots`
 * Represents a bookable slot in a doctor's schedule.
 */
export interface TimeSlotModel {
  id:            string
  doctorId:      string
  startTime:     Timestamp
  endTime:       Timestamp
  isBooked:      boolean
  appointmentId: string | null   // set when isBooked = true
  createdAt:     Timestamp
}

export type TimeSlotDTO = Omit<TimeSlotModel, 'startTime' | 'endTime' | 'createdAt'> & {
  startTime: string
  endTime:   string
  createdAt: string
}
