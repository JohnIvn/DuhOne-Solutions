import { UserAccount } from "../Models/userAccountModel.js";

const validateEmail = async (req, res) => {
    const { email } = req.body;

    const exist = await UserAccount.findOne({
        where: {
            email
        },
    });
    if (!exist) {
        return res.json({ exist: false });
    } else {
        return res.json({ exist: true });  
    }
};

export default validateEmail;
