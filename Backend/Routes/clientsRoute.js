// clientRoute.js
import express from 'express';
import {getAllSuspended ,getClients, updateClientStatus } from '../Controllers/clientController.js';

const router = express.Router();

router.get('/', getClients);  
router.put('/:id/status', updateClientStatus);  
router.get('/suspended', getAllSuspended);

export default router;
