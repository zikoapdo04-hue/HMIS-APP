import { where } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { DatabaseService } from './database.service'
import { storage } from './firebase-manager'
import { COLLECTIONS } from '../core/constants'
import { UserRole, DoctorStatus } from '../core/enums'
import type { UserModel } from '../models/user.model'

export class UserService extends DatabaseService<UserModel> {
  constructor() {
    super(COLLECTIONS.USERS)
  }

  getAllDoctors(): Promise<UserModel[]> {
    return this.getWhere('role', '==', UserRole.Doctor)
  }

  getApprovedDoctors(): Promise<UserModel[]> {
    return this.getAll([
      where('role', '==', UserRole.Doctor),
      where('doctorStatus', '==', DoctorStatus.Approved),
    ])
  }

  getPendingDoctors(): Promise<UserModel[]> {
    return this.getAll([
      where('role', '==', UserRole.Doctor),
      where('doctorStatus', '==', DoctorStatus.Pending),
    ])
  }

  getDoctorsBySpecialty(specialty: string): Promise<UserModel[]> {
    return this.getAll([
      where('role', '==', UserRole.Doctor),
      where('doctorStatus', '==', DoctorStatus.Approved),
      where('specialty', '==', specialty),
    ])
  }

  getAllPatients(): Promise<UserModel[]> {
    return this.getWhere('role', '==', UserRole.Patient)
  }

  approveDoctor(doctorId: string, adminId: string): Promise<void> {
    return this.update(doctorId, {
      doctorStatus: DoctorStatus.Approved,
      approvedBy:   adminId,
    })
  }

  rejectDoctor(doctorId: string): Promise<void> {
    return this.update(doctorId, { doctorStatus: DoctorStatus.Rejected })
  }

  async uploadProfilePhoto(uid: string, file: File): Promise<string> {
    const storageRef = ref(storage, `profiles/${uid}/avatar`)
    await uploadBytes(storageRef, file)
    const url = await getDownloadURL(storageRef)
    await this.update(uid, { imageUrl: url })
    return url
  }
}

export const userService = new UserService()
