import express from 'express';
import authenticateToken from '../Middleware/authentication.js';
import { subscriptionTransactionGetCredentials, updateSubscriptionAndPayment } from '../Controllers/transactionController.js';
import { checkBalance, checkUserSubscription } from '../Controllers/subscriptionController.js';

const router = express.Router();

router.post('/check-balance', authenticateToken, checkBalance);
router.get('/transaction', authenticateToken, subscriptionTransactionGetCredentials);
router.post('/transaction', authenticateToken, updateSubscriptionAndPayment);
router.get('/check-subscription', authenticateToken, checkUserSubscription);

export default router;
