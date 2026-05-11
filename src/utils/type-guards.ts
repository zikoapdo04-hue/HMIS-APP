import { UserRole, DoctorStatus, AppointmentStatus, NotificationPriority, NotificationType } from '../core/enums'
import type { UserModel } from '../models/user.model'

export function isDoctor(user: UserModel): boolean {
  return user.role === UserRole.Doctor
}

export function isPatient(user: UserModel): boolean {
  return user.role === UserRole.Patient
}

export function isAdmin(user: UserModel): boolean {
  return user.role === UserRole.Admin
}

export function isApprovedDoctor(user: UserModel): boolean {
  return user.role === UserRole.Doctor && user.doctorStatus === DoctorStatus.Approved
}

export function isPendingDoctor(user: UserModel): boolean {
  return user.role === UserRole.Doctor && user.doctorStatus === DoctorStatus.Pending
}

export function isValidUserRole(value: unknown): value is UserRole {
  return Object.values(UserRole).includes(value as UserRole)
}

export function isValidAppointmentStatus(value: unknown): value is AppointmentStatus {
  return Object.values(AppointmentStatus).includes(value as AppointmentStatus)
}

export function isValidNotificationPriority(value: unknown): value is NotificationPriority {
  return Object.values(NotificationPriority).includes(value as NotificationPriority)
}

export function isValidNotificationType(value: unknown): value is NotificationType {
  return Object.values(NotificationType).includes(value as NotificationType)
}
