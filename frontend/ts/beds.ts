import { Bed, Patient } from './app.js';

export interface BedAllocationRequest {
  patientId: string;
  bedNumber: string;
  admissionDate?: string;
}

export interface BedTransferRequest {
  patientId: string;
  destinationBedNumber: string;
}
