import express from "express";
import changePassword from "../Controllers/forgotPasswordController.js"; 

const router = express.Router();

router.post("/forgot-password", changePassword);

export default router;
