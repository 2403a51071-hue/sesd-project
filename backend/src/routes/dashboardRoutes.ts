import { Router } from 'express';
import {
  getStats,
  getOccupancy,
  getActivities
} from '../controllers/dashboardController.js';

const router = Router();

router.get('/stats', getStats);
router.get('/occupancy', getOccupancy);
router.get('/activities', getActivities);

export default router;
