import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import './App.css';
import type { Screen, Role, PatientInfo } from './types';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { SpecialtyProvider } from './context/SpecialtyContext';

import { Splash } from './screens/Splash';
import { Onboarding } from './screens/Onboarding';
import { RoleSelection } from './screens/RoleSelection';
import { Login } from './screens/auth/Login';
import { Register } from './screens/auth/Register';
import { RegisterDoctor } from './screens/auth/RegisterDoctor';
import { DoctorShell } from './screens/doctor/DoctorShell';
import { PatientShell } from './screens/patient/PatientShell';
import { Clinics } from './screens/patient/Clinics';
import { Notifications } from './screens/patient/Notifications';
import { BookAppointment } from './screens/patient/BookAppointment';
import { DoctorDetail } from './screens/patient/DoctorDetail';
import type { DoctorInfo } from './screens/patient/DoctorDetail';
import { BookingSuccess } from './screens/patient/BookingSuccess';
import { PatientSettings } from './screens/patient/PatientSettings';
import { PatientAccountSettings } from './screens/patient/PatientAccountSettings';
import { AdminShell } from './screens/admin/AdminShell';
import { AdminPatientDetail } from './screens/admin/AdminPatientDetail';
import { AdminDoctorDetail } from './screens/admin/AdminDoctorDetail';
import type { UserModel } from './models/user.model';

const NO_HISTORY: Screen[] = ['splash', 'onboarding'];

/* ─── Inner app (has access to AuthContext) ─────────────── */
function AppInner() {
  const { user, loading } = useAuth();
  const { i18n } = useTranslation();
  const [screen, setScreen] = useState<Screen>('splash');
  const [role, setRole] = useState<Role>('patient');
  const [clinicSpecialty, setClinicSpecialty] = useState('');

  const [selectedDoctor, setSelectedDoctor] = useState<DoctorInfo | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<PatientInfo | null>(null);
  const [selectedAdminDoctor, setSelectedAdminDoctor] = useState<UserModel | null>(null);
  const [, setHistoryStack] = useState<Screen[]>(['splash']);

  const sessionRouted = useRef(false);

  /* Set document direction based on language */
  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const goBack = useCallback(() => {
    setHistoryStack(stack => {
      if (stack.length > 1) {
        const newStack = [...stack];
        newStack.pop();
        setScreen(newStack[newStack.length - 1]);
        return newStack;
      }
      return stack;
    });
  }, []);

  const nav = useCallback((s: Screen) => {
    setHistoryStack(stack => {
      const newStack = [...stack];
      if (!NO_HISTORY.includes(s)) {
        const top = newStack[newStack.length - 1];
        const PATIENT_TABS: Screen[] = ['patient-home','patient-search','patient-appointments','patient-profile'];
        const DOCTOR_TABS:  Screen[] = ['doctor-home','doctor-records','doctor-profile'];
        const ADMIN_TABS:   Screen[] = ['admin-home','admin-doctors','admin-patients'];
        if (PATIENT_TABS.includes(top) && !PATIENT_TABS.includes(s)) {
          newStack[newStack.length - 1] = 'patient-home';
        } else if (DOCTOR_TABS.includes(top) && !DOCTOR_TABS.includes(s)) {
          newStack[newStack.length - 1] = 'doctor-home';
        } else if (ADMIN_TABS.includes(top) && !ADMIN_TABS.includes(s)) {
          newStack[newStack.length - 1] = 'admin-home';
        }
        newStack.push(s);
      }
      return newStack;
    });
    setScreen(s);
  }, []);

  /* Auto-route when Firebase session is restored */
  useEffect(() => {
    if (loading || sessionRouted.current) return;
    sessionRouted.current = true;
    if (user) {
      const home: Screen =
        user.role === 'doctor' ? 'doctor-home' :
        user.role === 'admin'  ? 'admin-home'  : 'patient-home';
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRole(user.role as Role);
      nav(home);
    }
  }, [user, loading, nav]);


  /* Show nothing while Firebase resolves the session */
  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0e7490' }}>
        <div style={{ width: 48, height: 48, border: '4px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  const renderScreen = () => {
    switch (screen) {
      case 'splash':                   return <Splash setScreen={nav} />;
      case 'onboarding':               return <Onboarding setScreen={nav} />;
      case 'role':                     return <RoleSelection setScreen={nav} setRole={setRole} />;
      case 'login':                    return <Login setScreen={nav} role={role} />;
      case 'register':                 return <Register setScreen={nav} role={role} />;
      case 'register-doctor':          return <RegisterDoctor setScreen={nav} role={role} />;
      case 'clinics':                  return <Clinics setScreen={nav} onBack={goBack} specialty={clinicSpecialty} onSelectDoctor={(d) => { setSelectedDoctor(d); nav('doctor-detail'); }} />;
      case 'doctor-home':              return <DoctorShell setScreen={nav} initialTab="home"    onSelectPatient={(p) => { setSelectedPatient(p); nav('admin-patient-detail'); }} />;
      case 'doctor-records':           return <DoctorShell setScreen={nav} initialTab="records" onSelectPatient={(p) => { setSelectedPatient(p); nav('admin-patient-detail'); }} />;
      case 'doctor-profile':           return <DoctorShell setScreen={nav} initialTab="profile" onSelectPatient={(p) => { setSelectedPatient(p); nav('admin-patient-detail'); }} />;
      case 'patient-home':             return <PatientShell setScreen={nav} initialTab="home"         setSpecialty={setClinicSpecialty} onSelectDoctor={(d) => { setSelectedDoctor(d); nav('doctor-detail'); }} />;
      case 'patient-search':           return <PatientShell setScreen={nav} initialTab="search"       setSpecialty={setClinicSpecialty} onSelectDoctor={(d) => { setSelectedDoctor(d); nav('doctor-detail'); }} />;
      case 'patient-appointments':     return <PatientShell setScreen={nav} initialTab="appointments" setSpecialty={setClinicSpecialty} onSelectDoctor={(d) => { setSelectedDoctor(d); nav('doctor-detail'); }} />;
      case 'patient-profile':          return <PatientShell setScreen={nav} initialTab="profile"      setSpecialty={setClinicSpecialty} onSelectDoctor={(d) => { setSelectedDoctor(d); nav('doctor-detail'); }} />;
      case 'notifications':            return <Notifications setScreen={nav} onBack={goBack} />;
      case 'doctor-detail':            return <DoctorDetail setScreen={nav} onBack={goBack} doctor={selectedDoctor} />;
      case 'book-appointment':         return <BookAppointment setScreen={nav} onBack={goBack} doctor={selectedDoctor} />;
      case 'booking-success':          return <BookingSuccess setScreen={nav} onBack={goBack} />;
      case 'patient-settings':         return <PatientSettings setScreen={nav} onBack={goBack} />;
      case 'patient-account-settings': return <PatientAccountSettings setScreen={nav} onBack={goBack} />;
      case 'admin-home':           return <AdminShell setScreen={nav} initialTab="home"     onSelectPatient={(p) => { setSelectedPatient(p); nav('admin-patient-detail'); }} onSelectDoctor={(d) => { setSelectedAdminDoctor(d); nav('admin-doctor-detail'); }} />;
      case 'admin-doctors':        return <AdminShell setScreen={nav} initialTab="doctors"  onSelectPatient={(p) => { setSelectedPatient(p); nav('admin-patient-detail'); }} onSelectDoctor={(d) => { setSelectedAdminDoctor(d); nav('admin-doctor-detail'); }} />;
      case 'admin-patients':       return <AdminShell setScreen={nav} initialTab="patients" onSelectPatient={(p) => { setSelectedPatient(p); nav('admin-patient-detail'); }} onSelectDoctor={(d) => { setSelectedAdminDoctor(d); nav('admin-doctor-detail'); }} />;
      case 'admin-patient-detail': return <AdminPatientDetail setScreen={nav} patient={selectedPatient} onBack={goBack} />;
      case 'admin-doctor-detail':  return <AdminDoctorDetail  setScreen={nav} doctor={selectedAdminDoctor} onBack={goBack} />;
      default:                         return null;
    }
  };

  return (
    <div className="app-root">
      <div className="screen-wrap screen-fade-in">
        {renderScreen()}
      </div>
    </div>
  );
}

/* ─── Root export ──────────────────────────────────────── */
export default function App() {
  return (
    <SettingsProvider>
      <SpecialtyProvider>
        <AuthProvider>
          <AppInner />
        </AuthProvider>
      </SpecialtyProvider>
    </SettingsProvider>
  );
}
