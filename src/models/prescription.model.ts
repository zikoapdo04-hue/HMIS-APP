/**
 * Sub-document embedded inside a medical record or stored in `prescriptions` collection.
 * No Timestamps — lifetime is tied to the parent appointment/record.
 */
export interface PrescriptionModel {
  id:            string
  medicationName: string
  dosage:        string    // "500mg"
  frequency:     string    // "Twice daily"
  duration:      string    // "7 days"
  instructions:  string    // "Take after meals"
}
