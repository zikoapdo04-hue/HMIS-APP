import { where } from 'firebase/firestore'
import { DatabaseService } from './database.service'
import { COLLECTIONS } from '../core/constants'
import { AppointmentStatus } from '../core/enums'
import type { AppointmentModel } from '../models/appointment.model'

const isToday = (a: AppointmentModel): boolean => {
  if (!a.date?.toDate) return false
  const d = a.date.toDate()
  const now = new Date()
  return d.getFullYear() === now.getFullYear()
    && d.getMonth()      === now.getMonth()
    && d.getDate()       === now.getDate()
}

const byDateAsc  = (a: AppointmentModel, b: AppointmentModel) =>
  (a.date?.toMillis?.() ?? 0) - (b.date?.toMillis?.() ?? 0)

const byDateDesc = (a: AppointmentModel, b: AppointmentModel) =>
  (b.date?.toMillis?.() ?? 0) - (a.date?.toMillis?.() ?? 0)

export class AppointmentService extends DatabaseService<AppointmentModel> {
  constructor() {
    super(COLLECTIONS.APPOINTMENTS)
  }

  async getByPatient(patientId: string): Promise<AppointmentModel[]> {
    const list = await this.getAll([where('patientId', '==', patientId)])
    return list.sort(byDateDesc)
  }

  async getByDoctor(doctorId: string): Promise<AppointmentModel[]> {
    const list = await this.getAll([where('doctorId', '==', doctorId)])
    return list.sort(byDateAsc)
  }

  async getTodayForDoctor(doctorId: string): Promise<AppointmentModel[]> {
    const list = await this.getAll([where('doctorId', '==', doctorId)])
    return list.filter(isToday).sort(byDateAsc)
  }

  async getAll_admin(): Promise<AppointmentModel[]> {
    const list = await this.getAll([])
    return list.sort(byDateDesc)
  }

  updateStatus(id: string, status: AppointmentStatus): Promise<void> {
    return this.update(id, { status } as Partial<AppointmentModel>)
  }

  cancelAppointment(id: string): Promise<void> {
    return this.updateStatus(id, AppointmentStatus.Cancelled)
  }

  subscribeToTodayForDoctor(
    doctorId: string,
    onData: (appointments: AppointmentModel[]) => void,
  ) {
    return this.subscribeToQuery(
      [where('doctorId', '==', doctorId)],
      appts => onData(appts.filter(isToday).sort(byDateAsc)),
    )
  }

  subscribeByPatient(patientId: string, onData: (a: AppointmentModel[]) => void) {
    return this.subscribeToQuery(
      [where('patientId', '==', patientId)],
      appts => onData(appts.sort(byDateDesc)),
    )
  }
}

export const appointmentService = new AppointmentService()
