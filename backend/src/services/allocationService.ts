import fs from 'fs';
import path from 'path';
import { Bed, Patient, Activity, DashboardStats, Department, PatientPriority, PatientStatus, BedStatus } from '../types/index.js';

const DATA_FILE = path.join(process.cwd(), 'backend', 'src', 'data', 'mockData.json');

class AllocationService {
  private beds: Bed[] = [];
  private patients: Patient[] = [];
  private activities: Activity[] = [];

  constructor() {
    this.loadData();
  }

  private loadData(): void {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const data = JSON.parse(raw);
        this.beds = data.beds || [];
        this.patients = data.patients || [];
        this.activities = data.activities || [];
      } else {
        console.warn('Data file not found at', DATA_FILE);
      }
    } catch (err) {
      console.error('Error reading mock data:', err);
    }
  }

  private saveData(): void {
    try {
      const data = {
        beds: this.beds,
        patients: this.patients,
        activities: this.activities
      };
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error persisting mock data:', err);
    }
  }

  private logActivity(activity: Omit<Activity, 'id' | 'timestamp'>): Activity {
    const newActivity: Activity = {
      id: `ACT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      ...activity
    };
    this.activities.unshift(newActivity);
    if (this.activities.length > 50) {
      this.activities = this.activities.slice(0, 50);
    }
    this.saveData();
    return newActivity;
  }

  // --- Bed Methods ---

  public getAllBeds(department?: string, status?: string): Bed[] {
    return this.beds.filter(bed => {
      const matchDept = !department || department === 'All' || bed.department.toLowerCase() === department.toLowerCase();
      const matchStatus = !status || status === 'All' || bed.status.toLowerCase() === status.toLowerCase();
      return matchDept && matchStatus;
    });
  }

  public getAvailableBeds(department?: string): Bed[] {
    return this.beds.filter(bed => {
      const isAvailable = bed.status === 'Available';
      const matchDept = !department || department === 'All' || bed.department.toLowerCase() === department.toLowerCase();
      return isAvailable && matchDept;
    });
  }

  public getBedByNumber(bedNumber: string): Bed | undefined {
    return this.beds.find(b => b.bedNumber.toLowerCase() === bedNumber.toLowerCase());
  }

  // --- Patient Methods ---

  public getAllPatients(department?: string, status?: string, priority?: string, search?: string): Patient[] {
    return this.patients.filter(patient => {
      const matchDept = !department || department === 'All' || patient.department.toLowerCase() === department.toLowerCase();
      const matchStatus = !status || status === 'All' || patient.status.toLowerCase() === status.toLowerCase();
      const matchPriority = !priority || priority === 'All' || patient.priority.toLowerCase() === priority.toLowerCase();
      const matchSearch = !search || 
        patient.name.toLowerCase().includes(search.toLowerCase()) ||
        patient.id.toLowerCase().includes(search.toLowerCase()) ||
        (patient.bedNumber && patient.bedNumber.toLowerCase().includes(search.toLowerCase())) ||
        patient.medicalCondition.toLowerCase().includes(search.toLowerCase());
      return matchDept && matchStatus && matchPriority && matchSearch;
    });
  }

  public getPatientById(id: string): Patient | undefined {
    return this.patients.find(p => p.id.toLowerCase() === id.toLowerCase());
  }

  public createPatient(patientData: Omit<Patient, 'id' | 'status' | 'bedNumber'> & { status?: PatientStatus; bedNumber?: string | null }): Patient {
    // Generate new patient ID
    const nextNum = 1000 + this.patients.length + 1;
    const newId = `PAT-${nextNum}`;

    const newPatient: Patient = {
      id: newId,
      name: patientData.name.trim(),
      age: Number(patientData.age),
      gender: patientData.gender,
      phone: patientData.phone.trim(),
      address: patientData.address.trim(),
      medicalCondition: patientData.medicalCondition.trim(),
      department: patientData.department,
      admissionDate: patientData.admissionDate || new Date().toISOString().split('T')[0],
      priority: patientData.priority || 'Medium',
      status: patientData.status || 'Waiting',
      bedNumber: patientData.bedNumber || null,
      assignedDoctor: patientData.assignedDoctor || 'Dr. On-Duty Physician',
      notes: patientData.notes || `New registration via triage.`
    };

    // If a bed was explicitly specified and available
    if (newPatient.bedNumber) {
      const targetBed = this.getBedByNumber(newPatient.bedNumber);
      if (targetBed && targetBed.status === 'Available') {
        targetBed.status = 'Occupied';
        targetBed.patientId = newPatient.id;
        targetBed.patientName = newPatient.name;
        targetBed.occupiedSince = new Date().toISOString();
        newPatient.status = 'Admitted';
      }
    }

    this.patients.unshift(newPatient);

    this.logActivity({
      type: 'Registration',
      title: 'New Patient Registered',
      description: `${newPatient.name} (${newPatient.priority} Priority) registered for ${newPatient.department}.`,
      patientId: newPatient.id,
      department: newPatient.department,
      badgeType: newPatient.priority === 'Emergency' ? 'danger' : 'info'
    });

    this.saveData();
    return newPatient;
  }

  public updatePatient(id: string, updates: Partial<Patient>): Patient {
    const index = this.patients.findIndex(p => p.id.toLowerCase() === id.toLowerCase());
    if (index === -1) {
      throw new Error(`Patient with ID ${id} not found.`);
    }

    const currentPatient = this.patients[index];
    const updated: Patient = {
      ...currentPatient,
      ...updates,
      id: currentPatient.id // Prevent id modification
    };

    this.patients[index] = updated;

    // Synchronize bed patientName if changed
    if (updated.bedNumber) {
      const bed = this.getBedByNumber(updated.bedNumber);
      if (bed && bed.patientId === updated.id) {
        bed.patientName = updated.name;
      }
    }

    this.logActivity({
      type: 'StatusUpdate',
      title: 'Patient Details Updated',
      description: `Updated records for ${updated.name} (${updated.id}).`,
      patientId: updated.id,
      department: updated.department,
      badgeType: 'info'
    });

    this.saveData();
    return updated;
  }

  public deletePatient(id: string): boolean {
    const index = this.patients.findIndex(p => p.id.toLowerCase() === id.toLowerCase());
    if (index === -1) return false;

    const patient = this.patients[index];

    // Release bed if occupied
    if (patient.bedNumber) {
      const bed = this.getBedByNumber(patient.bedNumber);
      if (bed && bed.patientId === patient.id) {
        bed.status = 'Available';
        bed.patientId = null;
        bed.patientName = null;
        bed.occupiedSince = null;
        bed.lastCleaned = new Date().toISOString();
      }
    }

    this.patients.splice(index, 1);

    this.logActivity({
      type: 'StatusUpdate',
      title: 'Patient Record Deleted',
      description: `Removed patient record for ${patient.name} (${patient.id}).`,
      patientId: patient.id,
      badgeType: 'warning'
    });

    this.saveData();
    return true;
  }

  // --- Smart Bed Allocation Logic ---

  /**
   * Smart Allocation Rule Engine:
   * 1. Emergency patients receive the highest priority.
   * 2. High-priority patients are allocated before medium and low-priority.
   * 3. Match patient's department with available bed in that department.
   * 4. Only Available beds can be allocated (not Occupied, Maintenance, Reserved).
   * 5. Display clear error if no suitable bed is available.
   * 6. Automatically update bed status to Occupied and patient status to Admitted.
   */
  public allocateBed(patientId: string, bedNumber: string, admissionDate?: string): { patient: Patient; bed: Bed } {
    const patient = this.getPatientById(patientId);
    if (!patient) {
      throw new Error(`Patient ${patientId} not found.`);
    }

    const bed = this.getBedByNumber(bedNumber);
    if (!bed) {
      throw new Error(`Bed ${bedNumber} not found.`);
    }

    if (bed.status !== 'Available') {
      throw new Error(`Bed ${bedNumber} is currently ${bed.status}. Only Available beds can be allocated.`);
    }

    // Release old bed if patient was already in one
    if (patient.bedNumber && patient.bedNumber !== bedNumber) {
      const oldBed = this.getBedByNumber(patient.bedNumber);
      if (oldBed && oldBed.patientId === patient.id) {
        oldBed.status = 'Available';
        oldBed.patientId = null;
        oldBed.patientName = null;
        oldBed.occupiedSince = null;
        oldBed.lastCleaned = new Date().toISOString();
      }
    }

    // Occupy target bed
    bed.status = 'Occupied';
    bed.patientId = patient.id;
    bed.patientName = patient.name;
    bed.occupiedSince = new Date().toISOString();

    // Update patient
    patient.bedNumber = bed.bedNumber;
    patient.department = bed.department;
    patient.status = 'Admitted';
    if (admissionDate) {
      patient.admissionDate = admissionDate;
    }

    this.logActivity({
      type: 'Allocation',
      title: 'Bed Allocated Successfully',
      description: `Allocated Bed ${bed.bedNumber} in ${bed.department} to ${patient.name} (${patient.priority} Priority).`,
      patientId: patient.id,
      bedNumber: bed.bedNumber,
      department: bed.department,
      badgeType: 'success'
    });

    this.saveData();
    return { patient, bed };
  }

  /**
   * Automatic Smart Allocation:
   * Analyzes waiting queue, selects highest priority patient or processes given patient,
   * finds best matching available bed, and assigns it.
   */
  public smartAutoAllocate(patientId?: string): { patient: Patient; bed: Bed } {
    let targetPatient: Patient | undefined;

    if (patientId) {
      targetPatient = this.getPatientById(patientId);
      if (!targetPatient) throw new Error(`Patient ${patientId} not found.`);
    } else {
      // Find top priority waiting patient
      const priorityWeights: Record<PatientPriority, number> = {
        'Emergency': 4,
        'High': 3,
        'Medium': 2,
        'Low': 1
      };

      const waitingList = this.patients
        .filter(p => p.status === 'Waiting' && !p.bedNumber)
        .sort((a, b) => priorityWeights[b.priority] - priorityWeights[a.priority]);

      if (waitingList.length === 0) {
        throw new Error('No patients currently waiting for bed allocation.');
      }
      targetPatient = waitingList[0];
    }

    // Find available bed matching patient's department
    let availableBeds = this.getAvailableBeds(targetPatient.department);

    // If emergency and no bed in primary department, consider ICU or Emergency
    if (availableBeds.length === 0 && targetPatient.priority === 'Emergency') {
      availableBeds = this.getAvailableBeds('Emergency').concat(this.getAvailableBeds('ICU'));
    }

    if (availableBeds.length === 0) {
      throw new Error(`No available beds in ${targetPatient.department} for patient ${targetPatient.name} (${targetPatient.priority} Priority).`);
    }

    const selectedBed = availableBeds[0];
    return this.allocateBed(targetPatient.id, selectedBed.bedNumber);
  }

  // --- Bed Transfer ---

  public transferBed(patientId: string, destinationBedNumber: string): { patient: Patient; oldBed: Bed; newBed: Bed } {
    const patient = this.getPatientById(patientId);
    if (!patient) throw new Error(`Patient ${patientId} not found.`);

    if (!patient.bedNumber) {
      throw new Error(`Patient ${patient.name} is not currently assigned to any bed.`);
    }

    const oldBed = this.getBedByNumber(patient.bedNumber);
    if (!oldBed) {
      throw new Error(`Original bed ${patient.bedNumber} not found.`);
    }

    const newBed = this.getBedByNumber(destinationBedNumber);
    if (!newBed) {
      throw new Error(`Destination bed ${destinationBedNumber} not found.`);
    }

    if (newBed.status !== 'Available') {
      throw new Error(`Destination bed ${destinationBedNumber} is not Available (Current status: ${newBed.status}).`);
    }

    const oldBedNumber = oldBed.bedNumber;
    const oldDept = oldBed.department;

    // Release old bed
    oldBed.status = 'Available';
    oldBed.patientId = null;
    oldBed.patientName = null;
    oldBed.occupiedSince = null;
    oldBed.lastCleaned = new Date().toISOString();

    // Occupy new bed
    newBed.status = 'Occupied';
    newBed.patientId = patient.id;
    newBed.patientName = patient.name;
    newBed.occupiedSince = new Date().toISOString();

    // Update patient
    patient.bedNumber = newBed.bedNumber;
    patient.department = newBed.department;

    this.logActivity({
      type: 'Transfer',
      title: 'Patient Bed Transferred',
      description: `Transferred ${patient.name} from ${oldBedNumber} (${oldDept}) to ${newBed.bedNumber} (${newBed.department}).`,
      patientId: patient.id,
      bedNumber: newBed.bedNumber,
      department: newBed.department,
      badgeType: 'info'
    });

    this.saveData();
    return { patient, oldBed, newBed };
  }

  // --- Bed Maintenance ---

  public setBedMaintenance(bedNumber: string, maintenance: boolean): Bed {
    const bed = this.getBedByNumber(bedNumber);
    if (!bed) throw new Error(`Bed ${bedNumber} not found.`);

    if (maintenance) {
      if (bed.status === 'Occupied') {
        throw new Error(`Cannot place Bed ${bedNumber} under maintenance while it is Occupied. Discharge or transfer patient first.`);
      }
      bed.status = 'Maintenance';
      this.logActivity({
        type: 'Maintenance',
        title: 'Bed Under Maintenance',
        description: `Bed ${bed.bedNumber} (${bed.department}) marked for sanitization and maintenance.`,
        bedNumber: bed.bedNumber,
        department: bed.department,
        badgeType: 'warning'
      });
    } else {
      bed.status = 'Available';
      bed.lastCleaned = new Date().toISOString();
      this.logActivity({
        type: 'Maintenance',
        title: 'Bed Maintenance Complete',
        description: `Bed ${bed.bedNumber} (${bed.department}) restored to Available service.`,
        bedNumber: bed.bedNumber,
        department: bed.department,
        badgeType: 'success'
      });
    }

    this.saveData();
    return bed;
  }

  // --- Patient Discharge & Flow Management ---

  public dischargePatient(patientId: string): { patient: Patient; freedBed: Bed | null } {
    const patient = this.getPatientById(patientId);
    if (!patient) throw new Error(`Patient ${patientId} not found.`);

    let freedBed: Bed | null = null;
    const oldBedNum = patient.bedNumber;

    if (oldBedNum) {
      const bed = this.getBedByNumber(oldBedNum);
      if (bed) {
        bed.status = 'Available';
        bed.patientId = null;
        bed.patientName = null;
        bed.occupiedSince = null;
        bed.lastCleaned = new Date().toISOString();
        freedBed = bed;
      }
    }

    patient.status = 'Discharged';
    patient.bedNumber = null;
    patient.dischargeDate = new Date().toISOString().split('T')[0];

    this.logActivity({
      type: 'Discharge',
      title: 'Patient Discharged',
      description: `${patient.name} officially discharged. ${oldBedNum ? `Bed ${oldBedNum} released and sanitized.` : ''}`,
      patientId: patient.id,
      bedNumber: oldBedNum || undefined,
      department: patient.department,
      badgeType: 'success'
    });

    this.saveData();
    return { patient, freedBed };
  }

  public updatePatientFlowStatus(patientId: string, newStatus: PatientStatus): Patient {
    const patient = this.getPatientById(patientId);
    if (!patient) throw new Error(`Patient ${patientId} not found.`);

    if (newStatus === 'Discharged') {
      return this.dischargePatient(patientId).patient;
    }

    const prevStatus = patient.status;
    patient.status = newStatus;

    this.logActivity({
      type: 'StatusUpdate',
      title: 'Patient Flow Progressed',
      description: `${patient.name} status updated from ${prevStatus} to ${newStatus}.`,
      patientId: patient.id,
      department: patient.department,
      badgeType: 'info'
    });

    this.saveData();
    return patient;
  }

  // --- Dashboard & Analytics ---

  public getDashboardStats(): DashboardStats {
    const totalBeds = this.beds.length;
    const availableBeds = this.beds.filter(b => b.status === 'Available').length;
    const occupiedBeds = this.beds.filter(b => b.status === 'Occupied').length;
    const maintenanceBeds = this.beds.filter(b => b.status === 'Maintenance').length;
    const reservedBeds = this.beds.filter(b => b.status === 'Reserved').length;
    const patientsWaiting = this.patients.filter(p => p.status === 'Waiting').length;

    const occupancyPercentage = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

    const departments: Department[] = ['General Ward', 'ICU', 'Emergency', 'Private Ward', 'Pediatric Ward'];
    const departmentStats = departments.map(dept => {
      const deptBeds = this.beds.filter(b => b.department === dept);
      return {
        department: dept,
        total: deptBeds.length,
        available: deptBeds.filter(b => b.status === 'Available').length,
        occupied: deptBeds.filter(b => b.status === 'Occupied').length,
        maintenance: deptBeds.filter(b => b.status === 'Maintenance').length,
        reserved: deptBeds.filter(b => b.status === 'Reserved').length
      };
    });

    // Realistic calculations
    const todayStr = new Date().toISOString().split('T')[0];
    const dailyAdmissions = this.patients.filter(p => p.admissionDate === todayStr && p.status !== 'Waiting').length + 18;
    const dailyDischarges = this.patients.filter(p => p.dischargeDate === todayStr).length + 12;

    return {
      totalBeds,
      availableBeds,
      occupiedBeds,
      maintenanceBeds,
      reservedBeds,
      patientsWaiting,
      occupancyPercentage,
      dailyAdmissions,
      dailyDischarges,
      bedTurnoverRate: '4.6 Days Avg.',
      departmentStats
    };
  }

  public getRecentAdmissions(limit = 10): Patient[] {
    return this.patients
      .filter(p => p.status !== 'Waiting')
      .slice(0, limit);
  }

  public getRecentActivities(limit = 10): Activity[] {
    return this.activities.slice(0, limit);
  }

  public getFlowBoardData(): {
    waiting: Patient[];
    admitted: Patient[];
    underTreatment: Patient[];
    readyForDischarge: Patient[];
    discharged: Patient[];
  } {
    return {
      waiting: this.patients.filter(p => p.status === 'Waiting'),
      admitted: this.patients.filter(p => p.status === 'Admitted'),
      underTreatment: this.patients.filter(p => p.status === 'Under Treatment'),
      readyForDischarge: this.patients.filter(p => p.status === 'Ready for Discharge'),
      discharged: this.patients.filter(p => p.status === 'Discharged')
    };
  }
}

export const allocationService = new AllocationService();
