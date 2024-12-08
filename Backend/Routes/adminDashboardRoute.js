// clientRoute.js
import express from 'express';
import {getAllSuspended ,getClients, updateClientStatus } from '../Controllers/adminDashboardController.js';

const router = express.Router();

router.get('/', getClients);  
router.put('/:id/status', updateClientStatus);  
router.get('/suspended', getAllSuspended);

export default router;
