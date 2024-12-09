// clientRoute.js
import express from 'express';
import authenticateToken from '../Middleware/authentication.js';
import {getAllSuspended ,getClients, updateClientStatus } from '../Controllers/adminDashboardController.js';

const router = express.Router();

router.get('/', authenticateToken,getClients);  
router.put('/:id/status', authenticateToken,updateClientStatus);  
router.get('/suspended', authenticateToken, getAllSuspended);

export default router;
