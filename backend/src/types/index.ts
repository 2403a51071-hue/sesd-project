export type BedStatus = 'Available' | 'Occupied' | 'Maintenance' | 'Reserved';
export type PatientPriority = 'Low' | 'Medium' | 'High' | 'Emergency';
export type PatientStatus = 'Waiting' | 'Admitted' | 'Under Treatment' | 'Ready for Discharge' | 'Discharged';
export type Department = 'General Ward' | 'ICU' | 'Emergency' | 'Private Ward' | 'Pediatric Ward';

export interface Bed {
  id: string;
  bedNumber: string;
  department: Department;
  status: BedStatus;
  patientId: string | null;
  patientName: string | null;
  lastCleaned?: string;
  occupiedSince?: string | null;
  floor?: string;
  room?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  address: string;
  medicalCondition: string;
  department: Department;
  admissionDate: string;
  priority: PatientPriority;
  status: PatientStatus;
  bedNumber: string | null;
  assignedDoctor?: string;
  notes?: string;
  dischargeDate?: string | null;
}

export interface Activity {
  id: string;
  timestamp: string;
  type: 'Registration' | 'Allocation' | 'Transfer' | 'Discharge' | 'Maintenance' | 'StatusUpdate';
  title: string;
  description: string;
  patientId?: string;
  bedNumber?: string;
  department?: string;
  badgeType?: 'info' | 'success' | 'warning' | 'danger';
}

export interface DashboardStats {
  totalBeds: number;
  availableBeds: number;
  occupiedBeds: number;
  maintenanceBeds: number;
  reservedBeds: number;
  patientsWaiting: number;
  occupancyPercentage: number;
  dailyAdmissions: number;
  dailyDischarges: number;
  bedTurnoverRate: string;
  departmentStats: {
    department: Department;
    total: number;
    available: number;
    occupied: number;
    maintenance: number;
    reserved: number;
  }[];
}
