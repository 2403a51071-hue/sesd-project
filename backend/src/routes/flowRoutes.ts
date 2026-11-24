import { Router } from 'express';
import {
  getFlow,
  updateStatus,
  dischargePatient
} from '../controllers/flowController.js';

const router = Router();

router.get('/', getFlow);
router.put('/:patientId/status', updateStatus);
router.post('/:patientId/discharge', dischargePatient);

export default router;
