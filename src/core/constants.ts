import type { SpecialtyModel } from '../models/specialty.model'

// ─────────────────────────────────────────────────────────────────────────────
// SpecialtyModel.defaults — mirrors the Dart static default list (18 entries)
// Colors converted from Flutter Color(0xFFRRGGBB) → CSS hex string
// ─────────────────────────────────────────────────────────────────────────────

export const DEFAULT_SPECIALTIES: readonly SpecialtyModel[] = [
  { id: 'cardiology',    nameAr: 'القلب',           nameEn: 'Cardiology',       imageUrl: '/images/specialties/cardiology.png',    color: '#E53935' },
  { id: 'neurology',     nameAr: 'المخ والأعصاب',   nameEn: 'Neurology',        imageUrl: '/images/specialties/neurology.png',      color: '#8E24AA' },
  { id: 'orthopedics',   nameAr: 'العظام',           nameEn: 'Orthopedics',      imageUrl: '/images/specialties/orthopedics.png',    color: '#1E88E5' },
  { id: 'pediatrics',    nameAr: 'الأطفال',          nameEn: 'Pediatrics',       imageUrl: '/images/specialties/pediatrics.png',     color: '#43A047' },
  { id: 'dermatology',   nameAr: 'الجلدية',          nameEn: 'Dermatology',      imageUrl: '/images/specialties/dermatology.png',    color: '#FB8C00' },
  { id: 'gynecology',    nameAr: 'النساء والتوليد',  nameEn: 'Gynecology',       imageUrl: '/images/specialties/gynecology.png',     color: '#D81B60' },
  { id: 'ophthalmology', nameAr: 'العيون',           nameEn: 'Ophthalmology',    imageUrl: '/images/specialties/ophthalmology.png',  color: '#00ACC1' },
  { id: 'ent',           nameAr: 'الأنف والأذن',     nameEn: 'ENT',              imageUrl: '/images/specialties/ent.png',            color: '#6D4C41' },
  { id: 'urology',       nameAr: 'المسالك البولية',  nameEn: 'Urology',          imageUrl: '/images/specialties/urology.png',        color: '#3949AB' },
  { id: 'gastro',        nameAr: 'الجهاز الهضمي',   nameEn: 'Gastroenterology', imageUrl: '/images/specialties/gastro.png',         color: '#00897B' },
  { id: 'psychiatry',    nameAr: 'الطب النفسي',      nameEn: 'Psychiatry',       imageUrl: '/images/specialties/psychiatry.png',     color: '#5E35B1' },
  { id: 'endocrinology', nameAr: 'الغدد الصماء',     nameEn: 'Endocrinology',    imageUrl: '/images/specialties/endocrinology.png',  color: '#F4511E' },
  { id: 'pulmonology',   nameAr: 'الصدر والرئة',     nameEn: 'Pulmonology',      imageUrl: '/images/specialties/pulmonology.png',    color: '#039BE5' },
  { id: 'rheumatology',  nameAr: 'الروماتيزم',       nameEn: 'Rheumatology',     imageUrl: '/images/specialties/rheumatology.png',   color: '#7CB342' },
  { id: 'nephrology',    nameAr: 'الكلى',            nameEn: 'Nephrology',       imageUrl: '/images/specialties/nephrology.png',     color: '#C0CA33' },
  { id: 'oncology',      nameAr: 'الأورام',          nameEn: 'Oncology',         imageUrl: '/images/specialties/oncology.png',       color: '#546E7A' },
  { id: 'general',       nameAr: 'الطب العام',       nameEn: 'General Practice', imageUrl: '/images/specialties/general.png',        color: '#2096A4' },
  { id: 'emergency',     nameAr: 'الطوارئ',          nameEn: 'Emergency',        imageUrl: '/images/specialties/emergency.png',      color: '#E53935' },
] as const

// Firestore collection names — prevents magic strings across services
export const COLLECTIONS = {
  USERS:           'users',
  PATIENTS:        'patients',
  DOCTORS:         'doctors',
  APPOINTMENTS:    'appointments',
  MEDICAL_RECORDS: 'medicalRecords',
  NOTIFICATIONS:   'notifications',
  BILLS:           'bills',
  TIME_SLOTS:      'timeSlots',
  CLINICS:         'clinics',
  PRESCRIPTIONS:   'prescriptions',
} as const

export type CollectionName = typeof COLLECTIONS[keyof typeof COLLECTIONS]

// Screen transition delay — single source of truth
export const SCREEN_TRANSITION_MS = 180
