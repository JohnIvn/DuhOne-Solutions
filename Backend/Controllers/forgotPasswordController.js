import { SignInModel } from '../Models/userAccountModel.js';
import bcrypt from "bcrypt";

const changePassword = async (req, res) => {

    const { email, password } = req.body;

    console.log("Request Body:", req.body);

    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const account = await SignInModel.findOne({
            where: { email },
        });

        console.log("Email provided:", email);

        if (!account) {
            return res.status(404).json({ message: "No account found with this email." });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        await account.update({ password: hashedPassword });

        return res.status(200).json({ message: "Password updated successfully!" });
    } catch (error) {
        console.error("Error during password change:", error);
        return res.status(500).json({ message: "Internal server error.", error: error.message });
    }
};

export default changePassword;
