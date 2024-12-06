import PackageModel from "../Models/packageModel.js";

export const insertPackagesIfNotExist = async () => {  
    try {
      const existingPackages = await PackageModel.findAll();
  
      if (existingPackages.length === 0) {
        const packages = [
          { plan: 'Basic', price: 1699, speed: '35 Mbps' , description: 'Unlimited data'},
          { plan: 'Standard', price: 1999, speed: '50 Mbps' , description: 'Unlimited data' },
          { plan: 'Premium', price: 2499, speed: '75 Mbps' , description: 'Unlimited data + Free Router' },
          { plan: 'Ultimate', price: 2999, speed: '100 Mbps' , description: 'Unlimited data + Free Installation' },
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
