import express from 'express'
import authenticateToken from '../authentication.js';
import e from 'express';
const router = express.Router()

router.get('/', authenticateToken, (req, res) => {
    const {firstName, lastName, email} = req.user;

    return res.status(200).json({
        user: {
            firstName,
            lastName,
            email
        },
        message: "you are authenticated too access the dashboard"
    });

})

export default router;