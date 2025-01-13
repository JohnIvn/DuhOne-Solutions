import { verificationCodes } from "../Services/verificationCodes.js";

const verifyCode = (req, res) => {
  const { email, code } = req.body;

  console.log("Received email:", email);
  console.log("Received code:", code);
  console.log("Stored verification codes:", verificationCodes);

  if (verificationCodes[email]) {
    const { code: storedCode, expires } = verificationCodes[email];

    console.log("Stored code:", storedCode);
    console.log("Code expiration time:", new Date(expires));

    if (Date.now() > expires) {
      delete verificationCodes[email];
      console.log("Verification code expired, deleting");
      return res.status(400).json({ message: "Verification code has expired" });
    }

    if (storedCode == code) {
      delete verificationCodes[email];
      console.log("Verification code matched");
      return res.status(200).json({ message: "Email verified successfully" });
    } else {
      console.log("Verification code mismatch");
    }
  }
  res.status(400).json({ message: "Invalid or expired verification code" });
};

export default verifyCode;
