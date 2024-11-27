// clientRoute.js
import express from 'express';
import { getClients, updateClientStatus } from '../Controllers/clientController.js';

const router = express.Router();

router.get('/', getClients);  
router.put('/:id/status', updateClientStatus);  

export default router;
