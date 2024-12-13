import { UserAccount } from '../Models/userAccountModel.js';
import bcryptjs from 'bcryptjs'

const changePassword = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    try {

        const account = await UserAccount.findOne({
            where: { email },
          });

        const hashedPassword = await bcryptjs.hash(password, 12);

        await account.update({ password: hashedPassword });

        return res.status(200).json({ message: "Password updated successfully!" });
    } catch (error) {
        console.error("Error during password change:", error);

        return res.status(500).json({
            message: "Internal server error.",
            error: error.message
        });
    }
};

export default changePassword;