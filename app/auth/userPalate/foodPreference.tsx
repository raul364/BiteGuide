import React, { useState } from "react";
import { View, Button, StyleSheet, SafeAreaView, ActivityIndicator } from "react-native";
import FavouriteCuisine from "../../../components/signupDetails/FavouriteCuisine";
import DietData from "../../../components/signupDetails/DietData";
import ThemedText from "@/components/ThemedText";
import ThemedButton from "@/components/ThemedButton";
import { router } from "expo-router";
import axios from "axios";
import { getAuth } from "firebase/auth";

function FoodPreference() {
  const auth = getAuth();
  const user = auth.currentUser;
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [preferredCuisines, setPreferredCuisines] = useState<string[]>([]);
  const [userData, setUserData] = useState<{
    dietaryRestrictions: string[];
    allergies: string[];
    spiceTolerance: string;
  }>({ dietaryRestrictions: [], allergies: [], spiceTolerance: "" });

  const handleNextStep = async () => {
    if (step === 1 && preferredCuisines.length < 3) {
      alert("Please select at least 3 cuisines.");
      return;
    }
    if (
      step === 2 &&
      (!userData.dietaryRestrictions.length ||
        !userData.allergies.length ||
        !userData.spiceTolerance)
    ) {
      alert("Please complete all dietary information.");
      return;
    }
    if (step < 2) {
      setStep(step + 1);
    } else {
      await addPreferences();
    }
  };

  const addPreferences = async () => {
    if (!user) {
      alert("User not authenticated");
      return;
    }
    const token = await user.getIdToken();
    const userPreferences = {
      preferredCuisines,
      dietaryRestrictions: userData.dietaryRestrictions,
      allergies: userData.allergies,
      spiceTolerance: userData.spiceTolerance,
    };
    setLoading(true);
    try {
      await axios.post(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/users/preferences`,
        userPreferences,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Ensure you have the token available
          },
        }
      );
      router.replace("/(tabs)"); // Redirect to home page
    } catch (error: any) {
      console.error(
        "Error saving preferences:",
        error.response?.data || error.message
      );
      alert(
        error.response?.data?.message ||
          "Failed to save preferences. Please try again."
      );
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      {step === 1 && (
        <>
          <ThemedText
            size={24}
            type="bold"
            style={{ textAlign: "center", paddingVertical: 10 }}
          >
            Select preferred cuisines
          </ThemedText>
          <FavouriteCuisine
            onSelectionChange={setPreferredCuisines}
            minimumSelect={3}
          />
        </>
      )}
      {step === 2 && (
        <DietData
          userData={userData}
          setUserData={setUserData}
          handlePrevious={handlePreviousStep}
          handleNext={handleNextStep}
        />
      )}
      {step < 3 && (
        <View style={{ paddingHorizontal: 20 }}>
          <ThemedButton title="Next" type="primary" onPress={handleNextStep} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});

export default FoodPreference;
