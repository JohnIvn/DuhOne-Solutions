import { UserAccount } from "../Models/userAccountModel.js";
import UserProfileModel from "../Models/userProfileModel.js";
import BankAccount from "../Models/bankAccountModel.js";
import { Op } from "sequelize";
import { ClientModel } from "../Models/clientModel.js";



export const getAllUsers = async (req, res) => {
    try {
        
        const usersAccount = await UserAccount.findAll({
            where: {
                userId: {
                    [Op.ne]: 1,  
                },
            },
            attributes: ["userId", "email", "createdAt"],
        });

        
        const userProfiles = await UserProfileModel.findAll({
            where: {
                userId: {
                    [Op.ne]: 1,  
                },
                status: {  
                    [Op.ne]: "Suspended",
                },
            },
            attributes: ["userId", "firstName", "lastName", "status"],
        });

        
        const users = usersAccount
            .map((account) => {
                
                const profile = userProfiles.find((profile) => profile.userId === account.userId);
                
                
                if (!profile || profile.status === "Suspended") {
                    return null;
                }
                
                
                return {
                    userId: account.userId,
                    fullName: `${profile.firstName} ${profile.lastName}`,
                    email: account.email,
                    createdAt: account.createdAt,
                };
            })
            .filter((user) => user !== null);  

        return res.status(200).json(users);
    } catch (error) {
        console.error("Error in getAllUsers:", error);
        return res.status(500).json({ message: "Error fetching users." });
    }
};


export const deleteAccount = async (req, res) => {
    const { userIdToDelete } = req.params;

    try {
        const userAccount = await UserAccount.findOne({
            where: { userId: userIdToDelete },
        });

        if (!userAccount) {
            return res.status(404).json({ message: "No account found with the provided userId" });
        }

        await UserProfileModel.destroy({
            where: { userId: userIdToDelete },
        });

        await BankAccount.destroy({
            where: { bankAccountId: userIdToDelete },
        });

        await userAccount.destroy();

        return res.status(200).json({ message: `Successfully deleted userId: ${userIdToDelete}` });
    } catch (error) {
        console.error('Error in deleting account: ', error);
        return res.status(500).json({ message: "An error occurred while deleting the account" });
    }
};

export const getUserProfileModal = async (req, res) => {
    const{id} =  req.params
    console.log("receieved id: ",id);
    try{
        const profile = await UserProfileModel.findOne({
            where: {userId: id},
            attributes: ['firstName', 'lastName', 'phoneNumber', 'street', 'city', 'barangay', 'zipCode']
        });

        if(!profile){
            return res.status(400).json({message: "An error occured while geting the profile modal"});
        }

        return res.status(200).json(profile);

    }catch(error){
        console.log('error in getting the modal', error);
    }
};

export const editUserProfileModal = async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, phoneNumber, street, city, barangay, zipCode } = req.body;
    
    console.log('id received: ', id);  
    console.log('Request Body:', req.body);  

    try {
        
        const result = await UserProfileModel.update(
            {
                firstName,
                lastName,
                phoneNumber,
                street,
                city,
                barangay,
                zipCode
            },
            {
                where: { userId: id }  
            }
        );
        
        
        if (result[0] === 0) {
            return res.status(404).json({ message: "User profile not found or no changes made" });
        }
        
        return res.status(200).json({ message: "User profile successfully updated" });
    } catch (error) {
        console.log("Error in editing profile of the user: ", error);
        return res.status(500).json({ message: "Error updating profile", error: error.message });
    }
};

export const sortByDate = async (req, res) => {
    const { order } = req.query;
    console.log('sort by date is being called, order: ', order);
    try {
        const orderDirection = order === "ASC" ? "ASC" : "DESC"; 

        const usersAccount = await UserAccount.findAll({
            where: {
                userId: {
                    [Op.ne]: 1, 
                },
            },
            attributes: ["userId", "email", "createdAt"],
            order: [["createdAt", orderDirection]]  
        });

        const userProfiles = await UserProfileModel.findAll({
            where: {
                userId: {
                    [Op.ne]: 1, 
                },
            },
            attributes: ["userId", "firstName", "lastName"], 
        });

        const users = usersAccount.map((account) => {
            const profile = userProfiles.find((profile) => profile.userId === account.userId);
            return {
                userId: account.userId,
                fullName: profile ? `${profile.firstName} ${profile.lastName}` : "N/A",
                email: account.email,
                createdAt: account.createdAt,
            };
        });

        return res.status(200).json(users); 
    } catch (error) {
        console.log("Error in sorting by date:", error);
        return res.status(500).json({ message: "Error sorting users by date." });
    }
};


export const sortByUserId = async (req, res) => {
    
    const { order } = req.query;
    console.log('sort by userId is being called, order: ', order);
    try {
        const orderDirection = order === "ASC" ? "ASC" : "DESC"; 
        const usersAccount = await UserAccount.findAll({
            where: {
                userId: {
                    [Op.ne]: 1, 
                },
            },
            attributes: ["userId", "email", "createdAt"],
            order: [["userId", orderDirection]],  
        });

        
        const userProfiles = await UserProfileModel.findAll({
            where: {
                userId: {
                    [Op.ne]: 1, 
                },
            },
            attributes: ["userId", "firstName", "lastName"], 
        });

        
        const users = usersAccount.map((account) => {
            const profile = userProfiles.find((profile) => profile.userId === account.userId);
            return {
                userId: account.userId,
                fullName: profile ? `${profile.firstName} ${profile.lastName}` : "N/A",
                email: account.email,
                
                createdAt: account.createdAt
            };
        });

        
        return res.status(200).json(users);

    } catch (error) {
        console.log("Error in sorting by userId:", error);
        return res.status(500).json({ message: "Error sorting users by userId." }); 
    }
};


export const searchByEmailorUserid = async (req, res) => {
    const { email, userId } = req.query; 

    try {
        if (!email && !userId) {
            return res.status(400).json({ message: "Please provide either an email or userId to search." });
        }

        const whereCondition = {};
        if (email) {
            whereCondition.email = email;
        }
        if (userId) {
            whereCondition.userId = userId;
        }

        const usersAccount = await UserAccount.findAll({
            where: {
                ...whereCondition,
                userId: {
                    [Op.ne]: 1, 
                }
            },
            attributes: ["userId", "email", "createdAt"]
        });

        const userProfiles = await UserProfileModel.findAll({
            where: {
                userId: {
                    [Op.in]: usersAccount.map((account) => account.userId)
                }
            },
            attributes: ["userId", "firstName", "lastName"]
        });

        const users = usersAccount.map((account) => {
            const profile = userProfiles.find((profile) => profile.userId === account.userId);
            return {
                userId: account.userId,
                fullName: profile ? `${profile.firstName} ${profile.lastName}` : "N/A",
                email: account.email,
                createdAt: account.createdAt
            };
        });

        return res.status(200).json(users);

    } catch (error) {
        console.error("Error in search by email or userId:", error);
        return res.status(500).json({ message: "Error searching users." });
    }
};


export const createAccount = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    console.log('Request body:', req.body); 

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const bankNames = ["Philippine National Bank", "BDO Unibank", "Metrobank"];
    const randomBankName = bankNames[Math.floor(Math.random() * bankNames.length)];

    try {
        const existingAccount = await UserAccount.findOne({ where: { email } });

        if (existingAccount) {
            return res.status(400).json({ message: 'Account already exists!', exists: true });
        }

        const newUserAccount = await UserAccount.create({
            email,
            password: hashedPassword,
        });

        await AdminAccount.create({
            userId: newUserAccount.userId,
            email: newUserAccount.email,
            password,     
        });

        await UserImgModel.create({
            userId: newUserAccount.userId,
        });

        await UserProfileModel.create({
            userId: newUserAccount.userId,
            firstName,
            lastName,
            email: newUserAccount.email
        });

        await OffenseModel.create({
            userId: newUserAccount.userId,
            offenseCount: '0'
        })

        const AccountNumber = `ACC${Math.floor(1000000000 + Math.random() * 9000000000)}`;
        const RoutingNumber = `RTN${Math.floor(100000 + Math.random() * 900000)}`;
        const Balance = parseFloat((5000 + Math.random() * 10000).toFixed(2));

        await BankAccount.create({
            bankAccountId: newUserAccount.userId,
            bankName: randomBankName,
            accountNumber: AccountNumber, 
            routingNumber: RoutingNumber,
            balance: Balance
        });

        const fullName = `${firstName || 'Unknown'} ${lastName || 'User'}`; 

        console.log('Full Name:', fullName); 

        await ClientModel.create({
            userId: newUserAccount.userId,
            name: fullName,
            plan: 'N/A',  
            status: 'pending',
            paid: 'False',
            subscribeAt: new Date(),
            endAt: new Date(new Date().getTime() + 3 * 60 * 1000) 
        });

        return res.status(201).json({ message: 'Account created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const setSuspend = async (req, res) => {
    const { id } = req.params;
    try {
      
      const subscription = await ClientModel.findOne({
        where: { userId: id },
      });
  
      if (subscription) {
        await subscription.update({ status: "Suspended" });
      }
      const account = await UserProfileModel.findOne({
        where: { userId: id },
      });
  
      if (!account) {
        return res.status(404).json({ message: "No account found." });
      }      
      await account.update({ status: "Suspended" });
  
      return res.status(200).json({ message: "The client is now suspended." });
    } catch (error) {
      console.error("Error in trying to set suspension:", error);
      return res.status(500).json({ message: "Server error. Please try again later." });
    }
  };
  
  

