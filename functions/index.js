const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const logger = require("firebase-functions/logger");
const {onSchedule} = require("firebase-functions/v2/scheduler");

admin.initializeApp();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EXPO_PUBLIC_EMAIL,
    pass: process.env.EXPO_PUBLIC_PASSWORD,
  },
});

exports.sendEmailOTP = functions.https.onRequest(async (req, res) => {
  try {
    const { email, otp } = req.body;

    const mailOptions = {
      from: process.env.EXPO_PUBLIC_EMAIL,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is: ${otp}. It expires in 5 minutes.`,
    };

    const info = await transporter.sendMail(mailOptions);
    res.status(200).send({ success: true, message: "OTP sent!" });
  } catch (error) {
    res.status(500).send({ success: false, message: "Failed to send OTP." });
    logger.error("Error sending OTP:", error);
  }
});

exports.deleteExpiredOtps = onSchedule("every 5 minutes", async (event) => {
  try {
    const db = admin.firestore();
    const now = Date.now();
    const expirationTime = 5 * 60 * 1000; // 5 minutes in milliseconds
    const otpCollectionRef = db.collection("otps");

    // Query OTPs that are older than 5 minutes
    const expiredOtpsSnapshot = await otpCollectionRef
      .where("timestamp", "<", now - expirationTime)
      .get();

    // Prepare batch deletion for expired OTPs
    const batch = db.batch();
    expiredOtpsSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Commit the batch deletion
    await batch.commit();
  } catch (error) {
    logger.error("Error deleting expired OTPs:", error);
  }
});