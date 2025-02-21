import { auth } from "../../../config/firebaseConfig";
import { signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";

export const sendOTP = async (phoneNumber: string) => {
  try {
    const verifier = new RecaptchaVerifier(auth, "recaptcha-container", { size: "invisible" });
    const confirmation = await signInWithPhoneNumber(auth, phoneNumber, verifier);
    return confirmation; // Store for verification
  } catch (error) {
    console.error("Error sending OTP:", error);
  }
};

export const verifyOTP = async (confirmation: any, otp: string) => {
  try {
    const userCredential = await confirmation.confirm(otp);
    return userCredential.user;
  } catch (error) {
    console.error("Invalid OTP:", error);
  }
};
