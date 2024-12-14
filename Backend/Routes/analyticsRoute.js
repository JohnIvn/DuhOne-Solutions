import express from 'express';
import getAllAnalytics from '../controllers/analyticsController.js';
import getPlanDistribution from '../Controllers/analyticsDistribution.js';
import getStatusDistribution from '../Controllers/analyticsDistributionToo.js';
import getDataUsage  from '../Controllers/analyticsData.js';

const router = express.Router();

router.get('/', getAllAnalytics);
router.get('/', getPlanDistribution);
router.get('/', getStatusDistribution);
router.get('/', getDataUsage);

export default router;
