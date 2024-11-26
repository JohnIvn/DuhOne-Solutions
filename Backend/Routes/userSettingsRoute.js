import express from 'express'
import authenticateToken from '../authentication.js'
const router = express.Router()

router.get('/', authenticateToken, (req, res) => {
    const {userId, firstName, lastName, email} = req.user;

    return res.status(200).json({
        message: "you are authenticated", 
        userId: userId,
        firstName: firstName,
        lastName: lastName,
        email: email 
    })
    
});

export default router;