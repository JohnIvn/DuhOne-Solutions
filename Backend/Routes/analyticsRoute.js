import express from 'express';
import getAllAnalytics from '../controllers/analyticsController.js';
import getPlanDistribution from '../Controllers/analyticsDistribution.js';
import { getSubscriptionStatusDistribution } from '../Controllers/analyticsDistributionToo.js';

const router = express.Router();

router.get('/', getAllAnalytics);
router.get('/', getPlanDistribution);
router.get('/', getSubscriptionStatusDistribution);

export default router;
