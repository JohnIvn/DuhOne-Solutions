import express from 'express'
import authenticateToken from '../Middleware/authentication.js';

const router = express.Router()

router.get('/', authenticateToken, (req, res) => {
    const {firstName, lastName, email} = req.user;

    return res.status(200).json({
        user: {
            firstName,
            lastName,
            email
        },
        message: "you are authenticated to access the dashboard"
    });

})

export default router;