import express from 'express';
import authenticateToken from '../authentication.js';
import { subscriptionController } from '../Controllers/subscriptionController.js';

const router = express.Router();

router.post('/', authenticateToken, subscriptionController);

export default router;
