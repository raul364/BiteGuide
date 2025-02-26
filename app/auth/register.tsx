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
  Platform,
  useColorScheme,
} from "react-native";
import { parsePhoneNumber } from "awesome-phonenumber";
import { useRouter } from "expo-router";
import CountryFlag from "react-native-country-flag";
import { countries, getDefaultCountry } from "../../utils/countries";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import Icon from "react-native-vector-icons/Ionicons";
import ThemedButton from "@/components/ThemedButton";
import ThemedText from "@/components/ThemedText";
import { ExtendedTheme } from "@/theme/theme";
import { useTheme } from "@react-navigation/native";
import axios from "axios";

export default function RegisterScreen() {
  const { colors, fonts } = useTheme() as ExtendedTheme;
  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(getDefaultCountry());
  const [searchQuery, setSearchQuery] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    postcode: "",
  });
  const [error, setError] = useState("");

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


  const validateInputs = (): string[] => {
    const errors: string[] = [];
    // Trim all inputs to avoid whitespace issues
    const name = form.name.trim();
    const address = form.address.trim();
    const postCode = form.postcode.trim();
    const phone = phoneNumber;

    // Check required fields
    if (!name || !address || !postCode || !phone) {
      errors.push("All fields are required.");
    }

    // Validate name: Allow letters, spaces, hyphens, and apostrophes
    if (name && !/^[a-zA-Z\s'-]+$/.test(name)) {
      errors.push("Name can only contain letters, spaces, hyphens, and apostrophes.");
    }

    // Validate address: Allow letters, numbers, spaces, commas, periods, hyphens, and slashes
    if (address && !/^[a-zA-Z0-9\s,./-]+$/.test(address)) {
      errors.push("Address contains invalid characters.");
    }
    // Ensure address contains at least one digit (e.g. street number)
    if (address && !/\d/.test(address)) {
      errors.push("Address must contain at least one number.");
    }

    // Validate postcode: Allow alphanumeric, spaces, and hyphens
    if (postCode && !/^[a-zA-Z0-9\s-]+$/.test(postCode)) {
      errors.push("Postcode contains invalid characters.");
    }
    if (postCode && !/\d/.test(postCode)) {
      errors.push("Postcode must contain at least one number.");
    }

    // Validate phone number using awesome-phonenumber
    const fullNumber = `${selectedCountry.dialCode}${phone}`;
    const pn = parsePhoneNumber(fullNumber);
    if (!pn.valid) {
      errors.push("Invalid phone number.");
    } else {
      form.phone = pn.number.e164;
    }

    
    return errors;
  };

  const registerUser = async () => {
    const validationErrors = validateInputs();
    if (validationErrors.length > 0) {
      setError(validationErrors.join("\n"));
      return;
    }
 
    
    try {
      if (user) {
        const token = await user.getIdToken();       
        await axios.post(`${process.env.EXPO_PUBLIC_BACKEND_URL}/users/addUserInfo`, form, {
          headers: {
              Authorization: `Bearer ${token}`, // Ensure you have the token available
          },
      });
        router.replace("../userPalate/foodPreference");
      } else {
        setError("User is not authenticated.");
      }
    } catch (error) {
      setError("Could not register user.");
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TextInput
        placeholder="Full name"
        autoComplete="name"
        placeholderTextColor={colors.gray}
        defaultValue={form.name}
        onChangeText={(text) => setForm({ ...form, name: text })}
        style={[
          styles.input,
          { borderColor: colors.border, color: colors.text, ...fonts.regular },
        ]}
      />

      <TextInput
        placeholder="Address"
        autoComplete="address-line1"
        defaultValue={form.address}
        placeholderTextColor={colors.gray}
        onChangeText={(text) => setForm({ ...form, address: text })}
        style={[
          styles.input,
          { borderColor: colors.border, color: colors.text, ...fonts.regular },
        ]}
      />
      <TextInput
        placeholder="Postcode"
        autoComplete="postal-code"
        defaultValue={form.postcode}
        placeholderTextColor={colors.gray}
        onChangeText={(text) => setForm({ ...form, postcode: text })}
        maxLength={7}
        style={[
          styles.input,
          { borderColor: colors.border, color: colors.text, ...fonts.regular },
        ]}
      />
      <View style={styles.numberContainer}>
        {/* Country Picker */}
        <TouchableOpacity
          style={[styles.countrySelector, { borderColor: colors.border }]}
          onPress={openCountryPicker}
        >
          <CountryFlag isoCode={selectedCountry.code} size={20} />
          <ThemedText size={16} type="regular" style={[styles.dialCode,{color: colors.text}]}>{selectedCountry.dialCode}</ThemedText>
          <Icon name="chevron-down-outline" size={14} color={colors.text} />
        </TouchableOpacity>

        {/* Phone Number Input */}
        <TextInput
          placeholder="Phone number"
          keyboardType="phone-pad"
          autoComplete="tel"
          value={phoneNumber}
          placeholderTextColor={colors.gray}
          onChangeText={setPhoneNumber}
          style={[styles.phoneNumberInput, { borderColor: colors.border, color: colors.text, ...fonts.regular }]}
          maxLength={14}
        />
      </View>
      <ThemedButton onPress={registerUser} title="Register" type="primary" />

      {/* BottomSheetModal for Country Picker */}
      <BottomSheetModal ref={bottomSheetRef} snapPoints={snapPoints} index={0}>
        <BottomSheetView style={[styles.modalContent, { backgroundColor: colors.background_300 }]}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            {/* Search Bar */}
            <TextInput
              style={[styles.searchBar, { color: colors.text, ...fonts.regular }]}
              placeholderTextColor={colors.gray}
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
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.countryItem}
                  onPress={() => {
                    setSelectedCountry(item);
                    bottomSheetRef.current?.dismiss();
                  }}
                >
                  <CountryFlag isoCode={item.code} size={24} />
                  <ThemedText size={16} type="medium" style={[styles.countryText, { color: colors.text }]}>
                    {item.name} ({item.dialCode})
                  </ThemedText>
                </TouchableOpacity>
              )}
            />
          </KeyboardAvoidingView>
        </BottomSheetView>
      </BottomSheetModal>
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
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  countrySelector: {
    flexDirection: "row",
    alignItems: "center",
    padding: 6.8,
    paddingRight: 0,
    marginBottom: 10,
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRadius: 5,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,

  },
  numberContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  dialCode: {marginLeft: 10 },
  input: {  borderWidth: 1, padding: 10, width: "70%", borderRadius: 5, marginBottom: 10  },
  button: { backgroundColor: "#007AFF", padding: 10, borderRadius: 5 },
  buttonText: { color: "#FFF", fontSize: 16 },
  modalContent: { flex: 1, padding: 20 },
  countryItem: { flexDirection: "row", alignItems: "center", padding: 10 },
  countryText: { marginLeft: 10,},
  searchBar: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  phoneNumberInput: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    padding: 8,
    paddingLeft: 0,
    width: "46%",
    borderRadius: 5,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    marginBottom: 10,
    
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});
