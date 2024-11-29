import SignInModel from "../Models/signInModel.js";
import bcrypt from "bcrypt";

const changePassword = async (req, res) => {
    // Destructure email and password from the request body
    const { email, password } = req.body;

    // Log the request body for debugging
    console.log("Request Body:", req.body);

    try {
        // Validate that email and password are provided
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        // Find the account by email
        const account = await SignInModel.findOne({
            where: { email },
        });

        console.log("Email provided:", email);

        // If no account is found, return an error
        if (!account) {
            return res.status(404).json({ message: "No account found with this email." });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Update the account with the new password
        await account.update({ password: hashedPassword });

        // Return success message
        return res.status(200).json({ message: "Password updated successfully!" });
    } catch (error) {
        console.error("Error during password change:", error);

        // Return server error response
        return res.status(500).json({ message: "Internal server error.", error: error.message });
    }
};

export default changePassword;
