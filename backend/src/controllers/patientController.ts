import { Request, Response } from 'express';
import { allocationService } from '../services/allocationService.js';

export const getPatients = (req: Request, res: Response): void => {
  try {
    const { department, status, priority, search } = req.query;
    const patients = allocationService.getAllPatients(
      department as string,
      status as string,
      priority as string,
      search as string
    );
    res.json({ success: true, count: patients.length, data: patients });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPatientById = (req: Request, res: Response): void => {
  try {
    const id = req.params.id as string;
    const patient = allocationService.getPatientById(id);
    if (!patient) {
      res.status(404).json({ success: false, message: `Patient with ID ${id} not found.` });
      return;
    }
    res.json({ success: true, data: patient });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createPatient = (req: Request, res: Response): void => {
  try {
    const { name, age, gender, phone, address, medicalCondition, department, admissionDate, priority, status, bedNumber, assignedDoctor } = req.body;

    if (!name || !age || !gender || !phone || !department || !medicalCondition) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: name, age, gender, phone, department, medicalCondition are required.'
      });
      return;
    }

    const patient = allocationService.createPatient({
      name,
      age: Number(age),
      gender,
      phone,
      address: address || 'Not Provided',
      medicalCondition,
      department,
      admissionDate,
      priority: priority || 'Medium',
      status: status || 'Waiting',
      bedNumber: bedNumber || null,
      assignedDoctor
    });

    res.status(201).json({
      success: true,
      message: `Patient ${patient.name} (${patient.id}) registered successfully.`,
      data: patient
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updatePatient = (req: Request, res: Response): void => {
  try {
    const id = req.params.id as string;
    const updated = allocationService.updatePatient(id, req.body);
    res.json({
      success: true,
      message: `Patient ${updated.name} updated successfully.`,
      data: updated
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deletePatient = (req: Request, res: Response): void => {
  try {
    const id = req.params.id as string;
    const success = allocationService.deletePatient(id);
    if (!success) {
      res.status(404).json({ success: false, message: `Patient with ID ${id} not found.` });
      return;
    }
    res.json({ success: true, message: `Patient ${id} deleted successfully.` });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
