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
