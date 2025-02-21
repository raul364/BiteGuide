const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "officialraul364@gmail.com",
    pass: "abvd apof iylc wczs",
  },
});

exports.sendEmailOTP = functions.https.onRequest(async (req, res) => {
  try {
    const { email, otp } = req.body;

    const mailOptions = {
      from: "officialraul364@gmail.com",
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is: ${otp}. It expires in 5 minutes.`,
    };

    const info = await transporter.sendMail(mailOptions);
    res.status(200).send({ success: true, message: "OTP sent!" });
  } catch (error) {
    res.status(500).send({ success: false, message: "Failed to send OTP." });
  }
});
