import { where } from 'firebase/firestore'
import { DatabaseService } from './database.service'
import { COLLECTIONS } from '../core/constants'
import type { MedicalRecordDoc } from '../firebase/types/models'

const byDateDesc = (a: MedicalRecordDoc, b: MedicalRecordDoc) => {
  const ta = a.date?.toMillis?.() ?? 0
  const tb = b.date?.toMillis?.() ?? 0
  return tb - ta
}

export class MedicalRecordService extends DatabaseService<MedicalRecordDoc> {
  constructor() {
    super(COLLECTIONS.MEDICAL_RECORDS)
  }

  async getByPatient(patientId: string): Promise<MedicalRecordDoc[]> {
    const recs = await this.getAll([where('patientId', '==', patientId)])
    return recs.sort(byDateDesc)
  }

  async getByDoctor(doctorId: string): Promise<MedicalRecordDoc[]> {
    const recs = await this.getAll([where('doctorId', '==', doctorId)])
    return recs.sort(byDateDesc)
  }

  subscribeByPatient(patientId: string, onData: (r: MedicalRecordDoc[]) => void) {
    return this.subscribeToQuery(
      [where('patientId', '==', patientId)],
      (recs) => onData(recs.sort(byDateDesc)),
    )
  }
}

export const medicalRecordService = new MedicalRecordService()
