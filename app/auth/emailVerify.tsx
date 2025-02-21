import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  SafeAreaView,
  Button,
} from "react-native";

import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebaseConfig";
import { useRouter } from "expo-router";



const generateOTP = (): string => Math.floor(100000 + Math.random() * 900000).toString();


export default function EmailVerify() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");

  const sendOTP = async () => {
    try {
      const otpCode = generateOTP();
      setGeneratedOtp(otpCode);

      // Store OTP in Firestore (expires in 5 minutes)
      const otpRef = doc(db, "otps", email);
      await setDoc(otpRef, { otp: otpCode, timestamp: Date.now() });

      // Send OTP via Firebase Email
      await fetch("https://us-central1-bite-guide-1d626.cloudfunctions.net/sendEmailOTP", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpCode }),
      });

      setOtpSent(true);
      console.log("OTP Sent", "Check your email for the 6-digit code.");
    } catch (error) {
      console.error( "Failed to send OTP.");
    }
  };

  const verifyOTP = async () => {
    try {
      const otpRef = doc(db, "otps", email);
      const otpSnapshot = await getDoc(otpRef);

      if (!otpSnapshot.exists()) {
        Alert.alert("Error", "OTP expired or incorrect.");
        return;
      }
 

      const storedOtp = otpSnapshot.data().otp;
      if (otp === storedOtp) {
        await deleteDoc(otpRef); // Delete OTP after verification
        Alert.alert("Success", "OTP verified! Signing in...");
        router.replace("./register");
      } else {
        Alert.alert("Error", "Invalid OTP.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to verify OTP.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {!otpSent ? (
        <>
          <Text>Enter your email:</Text>
          <TextInput
            placeholder="your.email@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            style={styles.input}
          />
          <Button title="Send OTP" onPress={sendOTP} />
        </>
      ) : (
        <>
          <Text>Enter the OTP sent to your email:</Text>
          <TextInput
            placeholder="123456"
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            style={styles.input}
          />
          <Button title="Verify OTP" onPress={verifyOTP} />
        </>
      )}
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: { borderWidth: 1, borderColor:'black', padding: 10, width: "70%", borderRadius: 5 },

});
