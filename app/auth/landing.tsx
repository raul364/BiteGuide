import React from "react";
import { StyleSheet, SafeAreaView, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@react-navigation/native";
import ThemedButton from "../../components/ThemedButton";
import ThemedText from "../../components/ThemedText";
import { ExtendedTheme } from "@/theme/theme";

export default function LandingScreen() {
  const router = useRouter();
  const { colors, fonts } = useTheme() as ExtendedTheme;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ThemedText type="bold" size={48}>
        BiteGuide
      </ThemedText>
      <View style={styles.buttonContainer}>
        <ThemedButton
          title="Create an account"
          type="primary"
          onPress={() => router.replace("./emailVerify")}
        />
        <TouchableOpacity style={styles.signIn} onPress={() => router.replace("./login")}>
          <ThemedText type="regular" size={18} style={{ color: colors.text }}>
            Sign in
          </ThemedText>
        </TouchableOpacity>
      </View>
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
  buttonContainer: {
    flex: 1,
    justifyContent: "flex-end",
    gap: 20,
    marginBottom: 40,
  },
  text: {
    fontSize: 18,
  },
  signIn: {
    alignItems: "center",
    borderRadius: 15,
    padding: 5,
  },
});
