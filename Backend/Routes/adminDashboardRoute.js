import express from 'express';
import authenticateToken from '../Middleware/authentication.js';

import { 
  deleteSubscription, 
  getClients, 
  updateClientStatus, 
  updateDataUsage 
} from '../Controllers/adminDashboardController.js';

const router = express.Router();

router.get('/', authenticateToken, getClients);  
router.put('/:id/status', authenticateToken, updateClientStatus);
router.delete('/:id/delete', authenticateToken, deleteSubscription);
router.put('/update-data-usage', authenticateToken, updateDataUsage);

export default router;
