// ─────────────────────────────────────────────────────────────────────────────
// Core constants — mirrored 1-to-1 from Dart source models
// ─────────────────────────────────────────────────────────────────────────────

export const UserRole = {
  Doctor:       'doctor',
  Patient:      'patient',
  Admin:        'admin',
  Receptionist: 'receptionist',
} as const
export type UserRole = typeof UserRole[keyof typeof UserRole]

export const DoctorStatus = {
  Pending:  'pending',
  Approved: 'approved',
  Rejected: 'rejected',
} as const
export type DoctorStatus = typeof DoctorStatus[keyof typeof DoctorStatus]

export const AppointmentStatus = {
  Pending:   'pending',
  Confirmed: 'confirmed',
  Completed: 'completed',
  Cancelled: 'cancelled',
  NoShow:    'no_show',
} as const
export type AppointmentStatus = typeof AppointmentStatus[keyof typeof AppointmentStatus]

export const PaymentStatus = {
  Unpaid:    'unpaid',
  Paid:      'paid',
  Refunded:  'refunded',
  Cancelled: 'cancelled',
} as const
export type PaymentStatus = typeof PaymentStatus[keyof typeof PaymentStatus]

export const NotificationType = {
  Appointment: 'appointment',
  System:      'system',
  Reminder:    'reminder',
  Approval:    'approval',
  Billing:     'billing',
} as const
export type NotificationType = typeof NotificationType[keyof typeof NotificationType]

export const NotificationPriority = {
  Low:      'low',
  Normal:   'normal',
  High:     'high',
  Critical: 'critical',
} as const
export type NotificationPriority = typeof NotificationPriority[keyof typeof NotificationPriority]

export const Gender = {
  Male:   'male',
  Female: 'female',
} as const
export type Gender = typeof Gender[keyof typeof Gender]
