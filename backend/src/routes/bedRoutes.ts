import { Router } from 'express';
import {
  getBeds,
  getAvailableBeds,
  allocateBed,
  smartAllocate,
  transferBed,
  updateBed
} from '../controllers/bedController.js';

const router = Router();

router.get('/', getBeds);
router.get('/available', getAvailableBeds);
router.post('/allocate', allocateBed);
router.post('/smart-allocate', smartAllocate);
router.post('/transfer', transferBed);
router.put('/:id', updateBed);

export default router;
