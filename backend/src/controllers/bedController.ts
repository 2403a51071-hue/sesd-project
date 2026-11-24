import { Request, Response } from 'express';
import { allocationService } from '../services/allocationService.js';

export const getBeds = (req: Request, res: Response): void => {
  try {
    const { department, status } = req.query;
    const beds = allocationService.getAllBeds(department as string, status as string);
    res.json({ success: true, count: beds.length, data: beds });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAvailableBeds = (req: Request, res: Response): void => {
  try {
    const { department } = req.query;
    const available = allocationService.getAvailableBeds(department as string);
    res.json({ success: true, count: available.length, data: available });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const allocateBed = (req: Request, res: Response): void => {
  try {
    const { patientId, bedNumber, admissionDate } = req.body;

    if (!patientId || !bedNumber) {
      res.status(400).json({ success: false, message: 'patientId and bedNumber are required.' });
      return;
    }

    const result = allocationService.allocateBed(patientId, bedNumber, admissionDate);
    res.json({
      success: true,
      message: `Bed ${bedNumber} successfully allocated to ${result.patient.name}.`,
      data: result
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const smartAllocate = (req: Request, res: Response): void => {
  try {
    const { patientId } = req.body;
    const result = allocationService.smartAutoAllocate(patientId);
    res.json({
      success: true,
      message: `Smart Allocation: Bed ${result.bed.bedNumber} (${result.bed.department}) assigned to ${result.patient.name} (${result.patient.priority} Priority).`,
      data: result
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const transferBed = (req: Request, res: Response): void => {
  try {
    const { patientId, destinationBedNumber } = req.body;

    if (!patientId || !destinationBedNumber) {
      res.status(400).json({ success: false, message: 'patientId and destinationBedNumber are required.' });
      return;
    }

    const result = allocationService.transferBed(patientId, destinationBedNumber);
    res.json({
      success: true,
      message: `Patient ${result.patient.name} transferred to ${destinationBedNumber} (${result.newBed.department}).`,
      data: result
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateBed = (req: Request, res: Response): void => {
  try {
    const id = req.params.id as string; // bedNumber or ID
    const { maintenance } = req.body;

    if (maintenance !== undefined) {
      const updated = allocationService.setBedMaintenance(id, Boolean(maintenance));
      res.json({
        success: true,
        message: `Bed ${id} ${maintenance ? 'placed under maintenance' : 'restored to available'}.`,
        data: updated
      });
      return;
    }

    res.status(400).json({ success: false, message: 'No valid update properties provided.' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
