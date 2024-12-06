import PackageModel from "../Models/packageModel.js";

export const insertPackagesIfNotExist = async () => {  
    try {
      const existingPackages = await PackageModel.findAll();
  
      if (existingPackages.length === 0) {
        const packages = [
          { plan: 'Basic', price: 1699 },
          { plan: 'Standard', price: 1999 },
          { plan: 'Premium', price: 2499 },
          { plan: 'Ultimate', price: 2999 },
        ];
  
        await PackageModel.bulkCreate(packages);
        console.log('Packages inserted successfully');
      } else {
        console.log('Packages already exist, skipping insertion.');
      }
    } catch (error) {
      console.error('Error inserting packages:', error);
    }
};
