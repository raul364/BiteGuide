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
  ActivityIndicator,
} from "react-native";

import {
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  where,
  collection,
  query,
  getDocs,
} from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { useRouter } from "expo-router";
import { useTheme } from "@react-navigation/native";
import ThemedButton from "@/components/ThemedButton";
import { ExtendedTheme } from "@/theme/theme";
import ThemedText from "@/components/ThemedText";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const generateOTP = (): string =>
  Math.floor(100000 + Math.random() * 900000).toString();

const checkEmailExists = async (email: string): Promise<boolean> => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("email", "==", email));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

export default function EmailVerify() {
  const router = useRouter();
  const { colors, fonts } = useTheme() as ExtendedTheme;
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = getAuth();

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(password);
  };

  const sendOTP = async () => {
    try {
      if (!validateEmail(email)) {
        setError("Please enter a valid email address.");
        return;
      }
      if (!validatePassword(password)) {
        setError(
          "Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character."
        );
        return;
      }
      // Clear any previous error
      setError("");

      const emailExists = await checkEmailExists(email);
      if (emailExists) {
        setError("Email already exists.");
        console.error("Email already exists.");
        return;
      }

      const otpCode = generateOTP();
      setGeneratedOtp(otpCode);

      setOtpSent(true);
      // Store OTP in Firestore (expires in 5 minutes)
      const otpRef = doc(db, "otps", email);
      await setDoc(otpRef, { otp: otpCode, timestamp: Date.now() });

      // Send OTP via Firebase Email
      await fetch(
        "https://us-central1-bite-guide-1d626.cloudfunctions.net/sendEmailOTP",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp: otpCode }),
        }
      );
    } catch (error) {
      console.error("Failed to send OTP.");
    }
  };

  const verifyOTP = async () => {
    setLoading(true);
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
        const registrationSuccess = await registerUser();
        if (!registrationSuccess) {
          setError("Registration failed.");
        }
      } else {
        console.error("Invalid OTP.");
      }
    } catch (error) {
      console.error("Failed to verify OTP.");
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/users/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      if (response.status === 201) {
        await signInWithEmailAndPassword(auth, email, password);
        return true;
      } else {
        throw new Error("Registration failed");
      }
    } catch (error) {
      setError("Could not register user.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading && <ActivityIndicator size="large" color={colors.gray} />}
      {!loading && (
        <>
          {error !== "" && (
            <Text style={{ color: "red", marginBottom: 10, ...fonts.regular }}>
              {error}
            </Text>
          )}
          {!otpSent ? (
            <>
              <ThemedText size={20} type="bold" style={{ marginVertical: 5 }}>
                Email
              </ThemedText>
              <TextInput
                placeholder="email@example.com"
                placeholderTextColor={colors.gray}
                defaultValue={email}
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
                onChangeText={setEmail}
                keyboardType="email-address"
                style={[
                  styles.input,
                  {
                    borderColor: colors.border,
                    color: colors.text,
                    ...fonts.regular,
                  },
                ]}
              />
              <ThemedText size={20} type="bold" style={{ marginVertical: 5 }}>
                Password
              </ThemedText>
              <TextInput
                placeholder="Password"
                placeholderTextColor={colors.gray}
                defaultValue={password}
                onChangeText={setPassword}
                secureTextEntry
                style={[
                  styles.input,
                  {
                    borderColor: colors.border,
                    color: colors.text,
                    ...fonts.regular,
                  },
                ]}
              />

              <TouchableOpacity onPress={() => router.replace("./login")}>
                <ThemedText
                  size={14}
                  type="regular"
                  style={{
                    color: colors.gray,
                    textAlign: "center",
                    marginTop: 10,
                    marginBottom: 20,
                  }}
                >
                  have an account? Login
                </ThemedText>
              </TouchableOpacity>
              <ThemedButton type="primary" title="Send OTP" onPress={sendOTP} />
            </>
          ) : (
            <>
              <ThemedText size={20} type="bold" style={{ marginBottom: 10 }}>
                Check your email for the OTP
              </ThemedText>
              <TextInput
                placeholder="123456"
                placeholderTextColor={colors.gray}
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                autoComplete="one-time-code"
                style={[
                  styles.input,
                  {
                    borderColor: colors.border,
                    color: colors.text,
                    ...fonts.regular,
                  },
                ]}
              />
              <View style={{ marginTop: 20 }}>
                <ThemedButton
                  type="primary"
                  title="Verify OTP"
                  onPress={verifyOTP}
                />
              </View>
            </>
          )}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    width: "70%",
    borderRadius: 5,
  },
});
