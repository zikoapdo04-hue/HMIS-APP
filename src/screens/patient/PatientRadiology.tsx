import type { Screen } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { RadiologyRecordViewer } from '../../components/RadiologyRecordViewer';

interface Props {
  setScreen: (s: Screen) => void;
}

export function PatientRadiology({ setScreen }: Props) {
  const { user } = useAuth();
  const patientName = user?.name ?? 'احمد محمد';

  return (
    <RadiologyRecordViewer
      patientName={patientName}
      onBack={() => setScreen('patient-profile')}
    />
  );
}
 
