import express from 'express';
import authenticateToken from '../authentication.js';
import { subscriptionTransactionGetCredentials, subscriptionTransactionUpdateCredentials } from '../Controllers/transactionController.js';
import { subscriptionController } from '../Controllers/subscriptionController.js';

const router = express.Router();

router.get('/transaction', authenticateToken, subscriptionTransactionGetCredentials);
router.post('/transaction', authenticateToken, subscriptionTransactionUpdateCredentials);

router.post('/', authenticateToken, subscriptionController);

export default router;
