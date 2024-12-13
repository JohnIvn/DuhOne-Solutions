import express from 'express';
import authenticateToken from '../Middleware/authentication.js';  
import { 
  getAllUsers, 
  getUserProfileModal, 
  deleteAccount, 
  editUserProfileModal,
  sortByUserId,
  sortByDate,
  searchByEmailorUserid
} from '../Controllers/adminUsersDashboard.js';

const router = express.Router();


router.get('/', authenticateToken, getAllUsers);  
router.delete('/:userIdToDelete/delete', authenticateToken, deleteAccount);  
router.get('/get-user-profiles/:id', authenticateToken, getUserProfileModal);  
router.post('/edit-user-profile-modal/:id', authenticateToken, editUserProfileModal);  
router.get('/sort-by-userId', authenticateToken, sortByUserId);
router.get('/sort-by-date', authenticateToken, sortByDate);
router.get('/search-by-email-or-userId', authenticateToken, searchByEmailorUserid);



export default router;
