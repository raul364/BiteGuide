import { getAuth } from "firebase/auth";
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Keyboard,
  Platform
} from "react-native";
import { parsePhoneNumber } from "awesome-phonenumber";
import { useRouter } from "expo-router";
import CountryFlag from "react-native-country-flag";
import { countries, getDefaultCountry } from "../../utils/countries";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import Icon from "react-native-vector-icons/Ionicons";

export default function RegisterScreen() {
  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter();
    const [phoneNumber, setPhoneNumber] = useState("");
    const [selectedCountry, setSelectedCountry] = useState(getDefaultCountry());
    const [formattedNumber, setFormattedNumber] = useState("");
      const [searchQuery, setSearchQuery] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [form, setForm] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    phone: user?.phoneNumber || "",
    address: "",
    age: "",
    gender: "",
    foodPreferences: [],
  });

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = ["50%", "80%"];

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
      bottomSheetRef.current?.expand(); // Expand bottom sheet when keyboard appears
    });

    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
      bottomSheetRef.current?.snapToIndex(0); // Reset position after keyboard closes
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    setSelectedCountry(getDefaultCountry()); // Set country on first render
  }, []);

  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.dialCode.includes(searchQuery) // Allows searching by country code too
  );

  const openCountryPicker = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  // Validate and format phone number using awesome-phonenumber
  const validatePhoneNumber = () => {
    const fullNumber = `${selectedCountry.dialCode}${phoneNumber}`;
    const pn = parsePhoneNumber(fullNumber);

    if (!pn.valid) {
      Alert.alert("Invalid Phone Number", "Please enter a valid phone number.");
      return false;
    }

    setFormattedNumber(pn.number.e164);
    return true;
  };

  const registerUser = async () => {
    try {
      if (user) {
        const token = await user.getIdToken();
        await fetch("http://localhost:3000/users/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken: token, ...form }),
        });

        router.replace("../home");
      } else {
        Alert.alert("Error", "User is not authenticated.");
      }
    } catch (error) {
      Alert.alert("Error", "Could not register user.");
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Complete Your Profile</Text>
      <TextInput placeholder="Full Name" value={form.name} onChangeText={(text) => setForm({ ...form, name: text })} style={{ borderWidth: 1, padding: 10, marginBottom: 10 }} />
      <TextInput placeholder="Phone" keyboardType="phone-pad" value={form.phone} onChangeText={(text) => setForm({ ...form, phone: text })} style={{ borderWidth: 1, padding: 10, marginBottom: 10 }} />
      <TextInput placeholder="Address" value={form.address} onChangeText={(text) => setForm({ ...form, address: text })} style={{ borderWidth: 1, padding: 10, marginBottom: 10 }} />
      <TouchableOpacity onPress={registerUser} style={{ backgroundColor: "#34A853", padding: 10 }}>
        <Text style={{ color: "#FFF", textAlign: "center" }}>Complete Registration</Text>
      </TouchableOpacity>
      <View style={styles.numberContainer}>
        {/* Country Picker */}
        <TouchableOpacity
          style={styles.countrySelector}
          onPress={openCountryPicker}
        >
          <CountryFlag isoCode={selectedCountry.code} size={24} />
          <Text style={styles.dialCode}>{selectedCountry.dialCode}</Text>
          <Icon name="chevron-down-outline" size={20} color={"black"} />
        </TouchableOpacity>

        {/* Phone Number Input */}
        <TextInput
          placeholder="Phone Number"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          style={styles.input}
          maxLength={14}
        />
      </View>

      <TouchableOpacity
        style={{ backgroundColor: "#007AFF", padding: 10, marginBottom: 10 }}
      >
        <Text style={{ color: "#FFF", fontSize: 16 }}>Send OTP</Text>
      </TouchableOpacity>

      {/* BottomSheetModal for Country Picker */}
      <BottomSheetModal ref={bottomSheetRef} snapPoints={snapPoints} index={0}>
        <BottomSheetView style={styles.modalContent}>
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
          {/* Search Bar */}
          <TextInput
            style={styles.searchBar}
            placeholderTextColor={"black"}
            placeholder="Search for a country..."
            defaultValue={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => bottomSheetRef.current?.expand()}
          />
          <FlatList
            data={filteredCountries}
            ListFooterComponent={<View style={{ height: 70 }} />}
            keyboardShouldPersistTaps="handled"
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.countryItem}
                onPress={() => {
                  setSelectedCountry(item);
                  bottomSheetRef.current?.dismiss();
                }}
              >
                <CountryFlag isoCode={item.code} size={24} />
                <Text style={styles.countryText}>
                  {item.name} ({item.dialCode})
                </Text>
              </TouchableOpacity>
            )}
          />
        </KeyboardAvoidingView>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  countrySelector: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    paddingVertical: 6.5,
    borderBottomWidth: 1,
  },
  numberContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  dialCode: { fontSize: 16, marginLeft: 10 },
  input: { borderBottomWidth: 1, padding: 10, width: "70%", borderRadius: 5 },
  button: { backgroundColor: "#007AFF", padding: 10, borderRadius: 5 },
  buttonText: { color: "#FFF", fontSize: 16 },
  modalContent: { flex: 1, padding: 20 },
  countryItem: { flexDirection: "row", alignItems: "center", padding: 10 },
  countryText: { marginLeft: 10, fontSize: 16 },
  searchBar: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
});
