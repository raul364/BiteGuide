import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useColorScheme } from "react-native";
import { useFonts } from "expo-font";
import { LightTheme, DarkTheme } from "../theme/theme";
import { ThemeProvider } from "@react-navigation/native";
import { db } from "@/config/firebaseConfig";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    "RobotoMono-Regular": require("../assets/fonts/RobotoMono-Regular.ttf"),
    "RobotoMono-Medium": require("../assets/fonts/RobotoMono-Medium.ttf"),
    "RobotoMono-Bold": require("../assets/fonts/RobotoMono-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return null; // Prevent rendering until fonts are loaded
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <ThemeProvider value={colorScheme === "dark" ? DarkTheme : LightTheme}>
            <AuthProvider>
              <AppContent />
            </AuthProvider>
          </ThemeProvider>
        </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

function AppContent() {
  const auth = getAuth();
  const { user, setUser } = useAuth();
  const router = useRouter();
  
  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authenticatedUser) => {
      setUser(authenticatedUser);
      if (authenticatedUser) {
        const userDocRef = doc(db, "users", authenticatedUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        const userData = userDocSnap.data();
    
        
        // Check if the user has fully completed registration
        if (userData && userData.registrationComplete && userData.preferencesComplete) {
          router.replace("/(tabs)"); // Redirect to home page
        } else if (userData && userData.registrationComplete) {
          // Navigate to the registration completion page
          router.push("/auth/userPalate/foodPreference");
        }else {
          // Navigate to the registration completion page
          router.push("/auth/register");
        }
      } else {
        router.replace("/auth/landing"); // Redirect to login page
      }
    });

    return () => unsubscribe();
  }, [auth, router, setUser]);

  return <Stack screenOptions={{ headerShown: false }} />;
}
