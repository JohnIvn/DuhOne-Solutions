import express from 'express';
import authenticateToken from '../authentication.js';
import { subscriptionController } from '../controllers/subscriptionController.js';

const router = express.Router();

router.post('/', authenticateToken, async (req, res) => {
    const { userId } = req.user; 
    const { email, plan } = req.body;

    if (userId !== req.body.userId) {
        return res.status(403).json({ message: 'Forbidden: User mismatch' });
    }
    try {
        const result = await subscriptionController({ userId, email, plan });
        return res.status(201).json(result);
    } catch (error) {
        return res.status(500).json({ message: 'Error processing subscription.', error: error.message });
    }
});

export default router;
