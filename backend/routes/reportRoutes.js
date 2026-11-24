
import express from 'express';

import authMiddleware from '../middleware/authMiddleware.js';

import {
  birthChart,
  kundliMatching,
  panchang,
  getReports,
  getReportById,
  deleteReport,
} from '../controllers/reportController.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/birth-chart', birthChart);
router.post('/kundli-matching', kundliMatching);
router.post('/panchang', panchang);

router.get('/', getReports);
router.get('/:id', getReportById);
router.delete('/:id', deleteReport);

export default router;
