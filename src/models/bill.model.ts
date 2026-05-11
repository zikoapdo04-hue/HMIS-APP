import type { Timestamp } from 'firebase/firestore'
import type { PaymentStatus } from '../core/enums'

/**
 * Firestore collection: `bills`
 */
export interface BillModel {
  id:            string
  patientId:     string
  patientName:   string
  appointmentId: string
  totalAmount:   number          // in local currency units
  paymentStatus: PaymentStatus
  createdBy:     string          // uid of creator (receptionist / admin)
  createdAt:     Timestamp
  updatedAt:     Timestamp
}

export type BillDTO = Omit<BillModel, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt: string
}
