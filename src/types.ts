export type Screen =
  | 'splash'
  | 'onboarding'
  | 'role'
  | 'login'
  | 'register'
  | 'register-doctor'
  | 'doctor-home'
  | 'doctor-records'
  | 'doctor-profile'
  | 'doctor-settings'
  | 'patient-home'
  | 'patient-profile'
  | 'patient-search'
  | 'clinics'
  | 'notifications'
  | 'doctor-detail'
  | 'book-appointment'
  | 'booking-success'
  | 'patient-appointments'
  | 'patient-settings'
  | 'patient-account-settings'
  | 'admin-home'
  | 'admin-doctors'
  | 'admin-patients'
  | 'admin-patient-detail'
  | 'admin-doctor-detail'
  | 'admin-clinic';

export type Role = 'doctor' | 'patient' | 'admin';

export interface PatientInfo {
  id:    string;
  name:  string;
  phone: string;
  email: string;
  num:   number;
}
