import express from 'express';
import sendVerificationCode from '../Controllers/sendCodeController.js';

const router = express.Router();

router.post('/', sendVerificationCode);

export default router;
