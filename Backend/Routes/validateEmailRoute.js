import validateEmail from "../Controllers/validateEmail.js";
import express from 'express'

const router = express.Router();

router.get('/', validateEmail);

export default router;