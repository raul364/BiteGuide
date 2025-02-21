import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  StyleSheet,
  SafeAreaView,
  Button,
} from "react-native";
import { useRouter } from "expo-router";






export default function LandingScreen() {
  const router = useRouter();

 

  return (
    <SafeAreaView style={styles.container}>
      <Button title="Sign In" onPress={() => router.replace("./login")} />
      <Button title="Sign Up" onPress={() => router.replace("./emailVerify")} />
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
});
