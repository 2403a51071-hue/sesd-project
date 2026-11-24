import { Request, Response } from 'express';
import { allocationService } from '../services/allocationService.js';
import { PatientStatus } from '../types/index.js';

export const getFlow = (req: Request, res: Response): void => {
  try {
    const board = allocationService.getFlowBoardData();
    res.json({ success: true, data: board });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStatus = (req: Request, res: Response): void => {
  try {
    const patientId = req.params.patientId as string;
    const { status } = req.body;

    const validStatuses: PatientStatus[] = ['Waiting', 'Admitted', 'Under Treatment', 'Ready for Discharge', 'Discharged'];
    if (!status || !validStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
      return;
    }

    const updated = allocationService.updatePatientFlowStatus(patientId, status);
    res.json({
      success: true,
      message: `Status updated to "${status}" for ${updated.name}.`,
      data: updated
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const dischargePatient = (req: Request, res: Response): void => {
  try {
    const patientId = req.params.patientId as string;
    const result = allocationService.dischargePatient(patientId);
    res.json({
      success: true,
      message: `Patient ${result.patient.name} discharged successfully. ${result.freedBed ? `Bed ${result.freedBed.bedNumber} is now available.` : ''}`,
      data: result
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
