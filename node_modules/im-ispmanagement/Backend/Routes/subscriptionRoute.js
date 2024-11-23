import express from 'express'
import { subscriptionController } from "../Controllers/subscriptionController.js";
import authenticateToken from '../authentication.js';

const router = express.Router()

router.post('/', authenticateToken, subscriptionController);

export default router;