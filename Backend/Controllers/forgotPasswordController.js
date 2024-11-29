import SignInModel from "../Models/signInModel.js";
import bcrypt from 'bcrypt';

const changePassword = async (req, res) => {
    const { email, password } = req.body;

    try {
        const account = await SignInModel.findOne({
            where: { email }
        });

        if (!account) return res.status(400).json({ message: "No account found!" });

        const hashedPassword = await bcrypt.hash(password, 12);
        await account.update({ password: hashedPassword });

        return res.status(200).json({ message: "Password updated successfully!" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error during password change." });
    }
};

export default changePassword;
