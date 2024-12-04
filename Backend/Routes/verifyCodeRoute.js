import express from 'express';
import verifyCode from '../Controllers/verifyCodeController.js';

const router = express.Router();

router.post('/', verifyCode);

export default router;
