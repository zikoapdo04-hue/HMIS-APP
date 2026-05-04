import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import './App.css';
import type { Screen, Role, PatientInfo } from './types';
import { AuthProvider, useAuth } from './context/AuthContext';

import { Splash } from './screens/Splash';
import { Onboarding } from './screens/Onboarding';
import { RoleSelection } from './screens/RoleSelection';
import { Login } from './screens/auth/Login';
import { AdminLogin } from './screens/auth/AdminLogin';
import { Register } from './screens/auth/Register';
import { RegisterDoctor } from './screens/auth/RegisterDoctor';
import { DoctorHome } from './screens/doctor/DoctorHome';
import { DoctorRecords } from './screens/doctor/DoctorRecords';
import { DoctorProfile } from './screens/doctor/DoctorProfile';
import { DoctorSettings } from './screens/doctor/DoctorSettings';
import { PatientHome } from './screens/patient/PatientHome';
import { PatientProfile } from './screens/patient/PatientProfile';
import { PatientSearch } from './screens/patient/PatientSearch';
import { Clinics } from './screens/patient/Clinics';
import { Notifications } from './screens/patient/Notifications';
import { BookAppointment } from './screens/patient/BookAppointment';
import { DoctorDetail } from './screens/patient/DoctorDetail';
import type { DoctorInfo } from './screens/patient/DoctorDetail';
import { BookingSuccess } from './screens/patient/BookingSuccess';
import { PatientAppointments } from './screens/patient/PatientAppointments';
import { PatientSettings } from './screens/patient/PatientSettings';
import { PatientAccountSettings } from './screens/patient/PatientAccountSettings';
import { AdminHome } from './screens/admin/AdminHome';
import { AdminDoctors } from './screens/admin/AdminDoctors';
import { AdminPatients } from './screens/admin/AdminPatients';
import { AdminPatientDetail } from './screens/admin/AdminPatientDetail';
import { AdminDoctorDetail } from './screens/admin/AdminDoctorDetail';
import { AdminClinic } from './screens/admin/AdminClinic';

const NO_BACK: Screen[] = [
  'splash', 'onboarding', 'role'
];
const NO_HISTORY: Screen[] = ['splash', 'onboarding'];

/* ─── Inner app (has access to AuthContext) ─────────────── */
function AppInner() {
  const { user, loading } = useAuth();
  const { t, i18n } = useTranslation();
  const [screen, setScreen] = useState<Screen>('splash');
  const [role, setRole] = useState<Role>('patient');
  const [transitioning, setTransitioning] = useState(false);
  const [clinicSpecialty, setClinicSpecialty] = useState('');
  const [clinicColor] = useState('#1DB8C8');
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorInfo | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<PatientInfo | null>(null);
  const historyStack = useRef<Screen[]>(['splash']);
  const sessionRouted = useRef(false);

  /* Set document direction based on language */
  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  /* Auto-route when Firebase session is restored */
  useEffect(() => {
    if (loading || sessionRouted.current) return;
    sessionRouted.current = true;
    if (user) {
      const home: Screen =
        user.role === 'doctor' ? 'doctor-home' :
        user.role === 'admin'  ? 'admin-home'  : 'patient-home';
      setRole(user.role);
      setScreen(home);
    }
  }, [user, loading]);

  const goBack = useCallback(() => {
    const stack = historyStack.current;
    if (stack.length > 1) {
      stack.pop();
      const prev = stack[stack.length - 1];
      setTransitioning(true);
      setTimeout(() => { setScreen(prev); setTransitioning(false); }, 180);
    }
  }, []);

  const nav = useCallback((s: Screen) => {
    setTransitioning(true);
    setTimeout(() => {
      setScreen(s);
      setTransitioning(false);
      if (!NO_HISTORY.includes(s)) {
        historyStack.current.push(s);
        window.history.pushState({ screen: s }, '', `#${s}`);
      }
    }, 180);
  }, []);

  
  useEffect(() => {
    const onPop = () => goBack();
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [goBack]);

  useEffect(() => {
    window.history.replaceState({ screen: 'splash' }, '', '#splash');
  }, []);

  const showBack = !NO_BACK.includes(screen) && historyStack.current.length > 1;

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
      case 'login':                    return role === 'admin' ? <AdminLogin setScreen={nav} /> : <Login setScreen={nav} role={role} />;
      case 'register':                 return <Register setScreen={nav} role={role} />;
      case 'register-doctor':          return <RegisterDoctor setScreen={nav} role={role} />;
      case 'clinics':                  return <Clinics setScreen={nav} specialty={clinicSpecialty} onSelectDoctor={(d) => { setSelectedDoctor(d); nav('doctor-detail'); }} />;
      case 'doctor-home':              return <DoctorHome setScreen={nav} onSelectPatient={(p) => { setSelectedPatient(p); nav('admin-patient-detail'); }} />;
      case 'doctor-records':           return <DoctorRecords setScreen={nav} onSelectPatient={(p) => { setSelectedPatient(p); nav('admin-patient-detail'); }} />;
      case 'doctor-profile':           return <DoctorProfile setScreen={nav} />;
      case 'doctor-settings':          return <DoctorSettings setScreen={nav} />;
      case 'patient-home':             return <PatientHome setScreen={nav} setSpecialty={setClinicSpecialty} />;
      case 'patient-profile':          return <PatientProfile setScreen={nav} />;
      case 'patient-search':           return <PatientSearch setScreen={nav} onSelectDoctor={(d) => { setSelectedDoctor(d); nav('doctor-detail'); }} />;
      case 'notifications':            return <Notifications setScreen={nav} />;
      case 'doctor-detail':            return <DoctorDetail setScreen={nav} doctor={selectedDoctor} />;
      case 'book-appointment':         return <BookAppointment setScreen={nav} doctor={selectedDoctor} />;
      case 'booking-success':          return <BookingSuccess setScreen={nav} />;
      case 'patient-appointments':     return <PatientAppointments setScreen={nav} />;
      case 'patient-settings':         return <PatientSettings setScreen={nav} />;
      case 'patient-account-settings': return <PatientAccountSettings setScreen={nav} />;
      case 'admin-home':               return <AdminHome setScreen={nav} />;
      case 'admin-doctors':            return <AdminDoctors setScreen={nav} />;
      case 'admin-patients':           return <AdminPatients setScreen={nav} />;
      case 'admin-patient-detail':     return <AdminPatientDetail setScreen={nav} patient={selectedPatient} />;
      case 'admin-doctor-detail':      return <AdminDoctorDetail setScreen={nav} />;
      case 'admin-clinic':             return <AdminClinic setScreen={nav} specialty={clinicSpecialty} color={clinicColor} />;
      default:                         return null;
    }
  };

  return (
    <div className="app-root">
      <div className={`screen-wrap ${transitioning ? 'screen-fade-out' : 'screen-fade-in'}`}>
        {renderScreen()}
      </div>
      {showBack && (
        <button className="global-back-btn" onClick={goBack} aria-label="back" title={t('common.back')}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"
            style={{ transform: i18n.language === 'en' ? 'rotate(180deg)' : 'none' }}>
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}
    </div>
  );
}

/* ─── Root export ──────────────────────────────────────── */
export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
