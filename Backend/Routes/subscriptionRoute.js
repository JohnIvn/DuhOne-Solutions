import express from 'express';
import authenticateToken from '../Middleware/authentication.js';
import { subscriptionTransactionGetCredentials, updateSubscriptionAndPayment } from '../Controllers/transactionController.js';
import { checkBalance } from '../Controllers/subscriptionController.js';

const router = express.Router();

router.post('/check-balance', authenticateToken, checkBalance);
router.get('/transaction', authenticateToken, subscriptionTransactionGetCredentials);
router.post('/transaction', authenticateToken, updateSubscriptionAndPayment);

export default router;
