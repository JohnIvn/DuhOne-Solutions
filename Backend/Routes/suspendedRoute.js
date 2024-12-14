import { getAllSuspended, unsuspend} from "../Controllers/suspendedController.js";
import express from "express";
import authenticateToken from "../Middleware/authentication.js";

const router = express.Router()

router.get('/', authenticateToken, getAllSuspended);
router.put('/unsuspend/:id', authenticateToken, unsuspend);
export default router