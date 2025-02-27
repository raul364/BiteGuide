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
  Modal,
  ActivityIndicator,
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
import * as Location from 'expo-location';

export default function RegisterScreen() {
  const { colors, fonts } = useTheme() as ExtendedTheme;
  const colorScheme = useColorScheme();
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
    city: "",
    country: "",
  });
  
  // Location state variables
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success' | 'denied' | 'error'>('idle');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [error, setError] = useState("");

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = ["50%", "80%"];

  // Get location when component mounts
  useEffect(() => {
    getHomeLocation();
  }, []);

  const getHomeLocation = async () => {
    setLocationStatus('loading');
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== "granted") {
        setLocationStatus('denied');
        setShowLocationModal(true);
        return;
      }
  
      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      
      const address = await Location.reverseGeocodeAsync(location.coords);
      
      if (address.length > 0) {
        const city = address[0].city || address[0].subregion || "";
        const country = address[0].country || "";
        
        setForm(prevForm => ({
          ...prevForm,
          city,
          country
        }));
        setLocationStatus('success');
      } else {
        throw new Error("Could not determine location details");
      }
    } catch (error) {
      console.error("Error getting home location:", error);
      setLocationStatus('error');
      setShowLocationModal(true);
    }
  };

  // Function to handle manual location entry
  const handleManualLocationEntry = () => {
    if (form.city && form.country) {
      setShowLocationModal(false);
    } else {
      setError("Both city and country are required");
    }
  };

  // Keyboard handling
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
    const phone = phoneNumber;
    const city = form.city.trim();
    const country = form.country.trim();

    // Check required fields
    if (!name || !phone || !city || !country) {
      errors.push("All fields are required.");
    }

    // Validate name: Allow letters, spaces, hyphens, and apostrophes
    if (name && !/^[a-zA-Z\s'-]+$/.test(name)) {
      errors.push("Name can only contain letters, spaces, hyphens, and apostrophes.");
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
        router.replace("./userPalate/foodPreference");
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
      {/* City and Country fields */}
      <View style={styles.locationContainer}>
        <TextInput
          placeholder="City"
          value={form.city}
          placeholderTextColor={colors.gray}
          onChangeText={(text) => setForm({ ...form, city: text })}
          style={[
            styles.locationInput,
            { borderColor: colors.border, color: colors.text, ...fonts.regular },
          ]}
        />
        <TextInput
          placeholder="Country"
          value={form.country}
          placeholderTextColor={colors.gray}
          onChangeText={(text) => setForm({ ...form, country: text })}
          style={[
            styles.locationInput,
            { borderColor: colors.border, color: colors.text, ...fonts.regular },
          ]}
        />
      </View>

      <TouchableOpacity onPress={getHomeLocation} style={styles.locationButton}>
        <Icon name="location-outline" size={16} color={colors.primary} />
        <ThemedText size={14} type="regular" style={{color: colors.primary, marginLeft: 5}}>
          {locationStatus === 'loading' ? 'Getting location...' : 'Use my current location'}
        </ThemedText>
      </TouchableOpacity>

      <View style={styles.numberContainer}>
        {/* Country Picker */}
        <TouchableOpacity
          style={[styles.countrySelector, { borderColor: colors.border }]}
          onPress={openCountryPicker}
        >
          <CountryFlag isoCode={selectedCountry.code} size={18} />
          <ThemedText size={14} type="regular" style={[styles.dialCode,{color: colors.text}]}>{selectedCountry.dialCode}</ThemedText>
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

      {/* Location Entry Modal */}
      <Modal
        visible={showLocationModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, {backgroundColor: colors.background_300}]}>
            <ThemedText size={18} type="bold" style={{marginBottom: 15}}>
              Enter Your Location
            </ThemedText>
            
            {locationStatus === 'denied' && (
              <ThemedText size={14} type="regular" style={{marginBottom: 15, color: colors.gray}}>
                Location permission was denied. Please enter your city and country manually.
              </ThemedText>
            )}
            
            {locationStatus === 'error' && (
              <ThemedText size={14} type="regular" style={{marginBottom: 15, color: colors.gray}}>
                There was an error getting your location. Please enter your city and country manually.
              </ThemedText>
            )}
            
            <TextInput
              placeholder="City"
              value={form.city}
              placeholderTextColor={colors.gray}
              onChangeText={(text) => setForm({ ...form, city: text })}
              style={[
                styles.modalInput,
                { borderColor: colors.border, color: colors.text, ...fonts.regular },
              ]}
            />
            
            <TextInput
              placeholder="Country"
              value={form.country}
              placeholderTextColor={colors.gray}
              onChangeText={(text) => setForm({ ...form, country: text })}
              style={[
                styles.modalInput,
                { borderColor: colors.border, color: colors.text, ...fonts.regular },
              ]}
            />
            
            <View style={styles.modalButtons}>
              <ThemedButton 
                onPress={handleManualLocationEntry} 
                title="Confirm" 
                type="primary"
            
              />
              
              <ThemedButton 
                onPress={() => {
                  setShowLocationModal(false);
                  getHomeLocation();
                }} 
                title="Try Again" 
                type="danger"
            
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* BottomSheetModal for Country Picker */}
      <BottomSheetModal ref={bottomSheetRef} snapPoints={snapPoints} index={0}
        //handleIndicatorStyle={{ backgroundColor: colors.border }}
        handleStyle={{ backgroundColor: colorScheme === "dark" ? colors.background_200 : colors.background_800, borderTopEndRadius: 10, borderTopStartRadius: 10 }}
      >
        <BottomSheetView style={[styles.modalContent, { backgroundColor: colorScheme === "dark" ? colors.background_200 : colors.background_800 }]}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            {/* Search Bar */}
            <TextInput
              style={[styles.searchBar, { color: colors.text, borderColor: colors.card,  ...fonts.regular, }]}
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
    padding: 10,
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
  modalContent: { flex: 1, padding: 20, paddingTop: 0 },
  countryItem: { flexDirection: "row", alignItems: "center", padding: 10 },
  countryText: { marginLeft: 10,},
  searchBar: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  phoneNumberInput: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    padding: 10,
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
  locationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "70%",
    marginBottom: 5,
  },
  locationInput: {
    borderWidth: 1,
    padding: 10,
    width: "48%",
    borderRadius: 5,
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalInput: {
    borderWidth: 1,
    padding: 10,
    width: "100%",
    borderRadius: 5,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginTop: 10,
  },
});
