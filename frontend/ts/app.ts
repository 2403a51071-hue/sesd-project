/**
 * TypeScript definitions & API helper interfaces for frontend
 */

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  address: string;
  medicalCondition: string;
  department: string;
  admissionDate: string;
  priority: 'Low' | 'Medium' | 'High' | 'Emergency';
  status: 'Waiting' | 'Admitted' | 'Under Treatment' | 'Ready for Discharge' | 'Discharged';
  bedNumber: string | null;
  assignedDoctor?: string;
  notes?: string;
}

export interface Bed {
  id: string;
  bedNumber: string;
  department: string;
  status: 'Available' | 'Occupied' | 'Maintenance' | 'Reserved';
  patientId: string | null;
  patientName: string | null;
  lastCleaned?: string;
  occupiedSince?: string | null;
  floor?: string;
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
}
