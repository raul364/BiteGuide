import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, useColorScheme } from "react-native";
import { MultiSelect, Dropdown } from "react-native-element-dropdown";
import ThemedText from "../ThemedText";
import { ExtendedTheme } from "@/theme/theme";
import { useTheme } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";

interface DietDataProps {
  userData: {
    dietaryRestrictions: string[];
    allergies: string[];
    spiceTolerance: string;
  };
  setUserData: (data: {
    dietaryRestrictions: string[];
    allergies: string[];
    spiceTolerance: string;
  }) => void;
  handlePrevious: () => void;
  handleNext: () => void;
}

const dietaryOptions = [
  { value: "none", label: "None" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "pescatarian", label: "Pescatarian" },
  { value: "gluten-free", label: "Gluten-Free" },
  { value: "keto", label: "Keto" },
  // ...other options...
];

const allergyOptions = [
  { value: "none", label: "None" },
  { value: "peanuts", label: "Peanuts" },
  { value: "tree nuts", label: "nuts" },
  { value: "shellfish", label: "Shellfish" },
  { value: "dairy", label: "Dairy" },
  { value: "soy", label: "Soy" },
  { value: "wheat", label: "Wheat" },
  // ...other options...
];

const spiceToleranceOptions = [
  { value: "none", label: "None" },
  { value: "mild", label: "Mild" },
  { value: "medium", label: "Medium" },
  { value: "hot", label: "Hot" },
  { value: "very hot", label: "Very Hot" },
];

const DietData: React.FC<DietDataProps> = ({
  userData,
  setUserData,
  handlePrevious,
}) => {
  const colorScheme = useColorScheme();
  const { colors, fonts } = useTheme() as ExtendedTheme;

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity onPress={handlePrevious} style={styles.secondaryButton}>
        <Icon name="arrow-back-outline" size={24} color={ colorScheme === "dark" ? colors.primary_700 : colors.primary_400 } />
      </TouchableOpacity>
      <View style={styles.multiSelectContainer}>
        <MultiSelect
          style={[
            styles.dropdown,
            {
              borderColor: colors.background_400,
            },
          ]}
          placeholderStyle={{ color: colors.text, ...fonts.regular }}
          activeColor={colorScheme === "dark" ? colors.background_200: colors.background_700}
          containerStyle={{
            backgroundColor: colors.background,
            borderColor: colors.border,
          }}
          itemTextStyle={{ color: colors.text, ...fonts.regular }}
          selectedStyle={{ borderRadius: 15 }}
          selectedTextStyle={{ color: colors.text }}
          data={dietaryOptions}
          labelField="label"
          valueField="value"
          placeholder="Select Dietary Restrictions"
          value={userData.dietaryRestrictions}
          onChange={(item) =>
            setUserData({ ...userData, dietaryRestrictions: item })
          }
        />
        <MultiSelect
          style={[
            styles.dropdown,
            {
              borderColor: colors.background_400,
            },
          ]}
          placeholderStyle={{ color: colors.text, ...fonts.regular }}
          activeColor={colorScheme === "dark" ? colors.background_200: colors.background_700}
          containerStyle={{
            backgroundColor: colors.background,
            borderColor: colors.border,
          }}
          itemTextStyle={{ color: colors.text, ...fonts.regular }}
          selectedStyle={{ borderRadius: 15 }}
          selectedTextStyle={{ color: colors.text }}
          data={allergyOptions}
          labelField="label"
          valueField="value"
          placeholder="Select Allergies"
          value={userData.allergies}
          onChange={(item) => setUserData({ ...userData, allergies: item })}
        />
        <Dropdown
          style={[styles.dropdown,             {
            borderColor: colors.background_400,
            borderRadius: 15,
          },]}
          containerStyle={{
            backgroundColor: colors.background,
            borderColor: colors.border,
          }}
          itemTextStyle={{ color: colors.text, ...fonts.regular }}
          placeholderStyle={{ color: colors.text, ...fonts.regular }}
          selectedTextStyle={{ color: colors.text, ...fonts.regular }}
          activeColor={colorScheme === "dark" ? colors.background_200: colors.background_700}
          data={spiceToleranceOptions}
          labelField="label"
          valueField="value"
          placeholder="Select Spice preference"
          value={userData.spiceTolerance}
          onChange={(item) =>
            setUserData({ ...userData, spiceTolerance: item.value })
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  multiSelectContainer: {
    marginHorizontal: 10,
    gap: 10,
    marginBottom: 20,
  },
  dropdown: {
    padding: 10,
    borderBottomWidth: 1,
    borderRadius: 5,
  },
  secondaryButton: {
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#0070f3",
    padding: 10,
  },
  buttonText: {
    textAlign: "center",
  },
});

export default DietData;
