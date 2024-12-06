import express from 'express';
import authenticateToken from '../Middleware/authentication.js';
import { subscriptionTransactionGetCredentials, subscriptionTransactionUpdateCredentials } from '../Controllers/transactionController.js';
import { subscriptionController } from '../Controllers/subscriptionController.js';
import { updatePayment } from '../Controllers/transactionController.js';

const router = express.Router();

router.get('/transaction', authenticateToken, subscriptionTransactionGetCredentials);
router.post('/transaction', authenticateToken, subscriptionTransactionUpdateCredentials);
router.post('/', authenticateToken, subscriptionController);
router.post('/updatePayment', authenticateToken, updatePayment);

export default router;
