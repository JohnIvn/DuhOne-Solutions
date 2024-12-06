import express from "express";
import { getPackageById, getPackages } from "../Controllers/packageController.js";

const router = express.Router();

router.get('/plans', getPackages);
router.get('/:id', getPackageById);

export default router;
