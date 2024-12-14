import PackageModel from "../Models/packageModel.js";
import { subscription } from "../Models/subscriptionModel.js";

export const getPackageById = async (req, res) => {
    try {
        const { id } = req.params;
        const packageData = await PackageModel.findByPk(id);

        if (!packageData) {
            return res.status(404).json({ message: "Package not found" });
        }

        res.status(200).json(packageData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching package" });
    }
};

export const getPackages = async (req, res) => {
    try {
        const packages = await PackageModel.findAll();
        res.status(200).json(packages);
    } catch (error) {
        console.error('Error fetching packages:', error);
        res.status(500).json({ message: 'Failed to fetch packages' });
    }
};

export const createPackage = async (req, res) => {
    try {
        const { plan, price, speed, description } = req.body;

        if (!plan || !price || !speed || !description) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newPackage = await PackageModel.create({
            plan,
            price,
            speed,
            description
        });

        res.status(201).json(newPackage);
    } catch (error) {
        console.error('Error creating package:', error);
        res.status(500).json({ message: 'Failed to create package' });
    }
};

export const updatePackage = async (req, res) => {
    console.log('Incoming request body:', req.body);
    console.log('Package ID from URL:', req.params.id);

    try {
        const { id } = req.params;
        const { plan, price, speed, description } = req.body;

        if (price && isNaN(price)) {
            return res.status(400).json({ message: "Price must be a valid number" });
        }

        const packageToUpdate = await PackageModel.findByPk(id);

        if (!packageToUpdate) {
            return res.status(404).json({ message: "Package not found" });
        }

        if (plan) packageToUpdate.plan = plan;
        if (price) packageToUpdate.price = parseFloat(price);  
        if (speed) packageToUpdate.speed = speed;
        if (description) packageToUpdate.description = description;

        await packageToUpdate.save();

        console.log('Updated package:', packageToUpdate);

        res.status(200).json({ message: "Package updated successfully", package: packageToUpdate });
    } catch (error) {
        console.error('Error updating package:', error);
        res.status(500).json({ message: 'Failed to update package' });
    }
};




export const deletePackage = async (req, res) => {
    try {
        const { id } = req.params;

        const packageToDelete = await PackageModel.findByPk(id);

        if (!packageToDelete) {
            return res.status(404).json({ message: "Package not found" });
        }

        await subscription.update(
            { plan: "n/a" },
            { where: { plan: packageToDelete.plan } }
        );

        await packageToDelete.destroy();

        res.status(200).json({ message: "Package deleted successfully" });
    } catch (error) {
        console.error("Error deleting package:", error);
        res.status(500).json({ message: "Failed to delete package" });
    }
};