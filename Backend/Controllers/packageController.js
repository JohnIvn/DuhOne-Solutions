import PackageModel from "../Models/packageModel.js";

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

    try {
        const { id } = req.params;
        const { plan, price, speed, description } = req.body;

        // Fetch the package by ID
        const packageToUpdate = await PackageModel.findByPk(id);

        if (!packageToUpdate) {
            return res.status(404).json({ message: "Package not found" });
        }

        // Update fields only if provided
        if (plan) packageToUpdate.plan = plan;
        if (price) packageToUpdate.price = price;
        if (speed) packageToUpdate.speed = speed;
        if (description) packageToUpdate.description = description;

        // Save the updated package to the database
        await packageToUpdate.save();

        res.status(200).json(packageToUpdate);
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

        await packageToDelete.destroy();

        res.status(200).json({ message: 'Package deleted successfully' });
    } catch (error) {
        console.error('Error deleting package:', error);
        res.status(500).json({ message: 'Failed to delete package' });
    }
};
