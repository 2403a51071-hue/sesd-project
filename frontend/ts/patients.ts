import { Patient } from './app.js';

export interface PatientFormInputs {
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  address: string;
  medicalCondition: string;
  department: string;
  priority: string;
  admissionDate: string;
}
