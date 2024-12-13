import express from "express";
import { getPackageById, getPackages, createPackage, updatePackage, deletePackage } from "../Controllers/packageController.js";

const router = express.Router();

router.get('/plans', getPackages);
router.get('/:id', getPackageById);
router.post('/', createPackage);
router.put('/:id', updatePackage);
router.delete('/:id', deletePackage);

export default router;
