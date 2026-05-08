import type { Screen, PatientInfo } from '../../types';
import { RadiologyRecordViewer } from '../../components/RadiologyRecordViewer';

interface Props {
  setScreen: (s: Screen) => void;
  patient?: PatientInfo | null;
}

export function AdminRadiologyRecord({ setScreen, patient }: Props) {
  const patientName = patient?.name ?? 'احمد محمد';

  return (
    <RadiologyRecordViewer
      patientName={patientName}
      onBack={() => setScreen('admin-patient-detail')}
    />
  );
}
