import { Router } from 'express';
import { analyzeCompany, getReport, researchCompany } from '../controllers/researchController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// All research routes require a valid JWT
router.post('/research', authMiddleware, researchCompany);
router.post('/analyze', authMiddleware, analyzeCompany);
router.get('/report/:company', authMiddleware, getReport);

export default router;
