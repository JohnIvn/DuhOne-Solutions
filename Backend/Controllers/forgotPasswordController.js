import { SignInModel } from '../Models/userAccountModel.js';
import bcryptjs from 'bcryptjs'

const changePassword = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    try {

        const account = await SignInModel.findOne({ where: { email } });

        if (!account) {
            return res.status(404).json({ message: "Account not found.", exists: false });
        }

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
