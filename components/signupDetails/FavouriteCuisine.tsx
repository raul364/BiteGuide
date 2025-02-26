import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import SelectableCard from "../SelectableCard";

interface FavouriteCuisineProps {
  onSelectionChange: (selectedCuisines: string[]) => void;
  minimumSelect?: number;
}

const FavouriteCuisine: React.FC<FavouriteCuisineProps> = ({ onSelectionChange, minimumSelect = 1 }) => {
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const cuisinesList = [
    "Italian",
    "Chinese",
    "Japanese",
    "Mexican",
    "Indian",
    "Thai",
    "French",
    "Spanish",
    "Greek",
    "Lebanese",
    "Turkish",
    "Vietnamese",
    "Korean",
    "Caribbean",
    "Brazilian",
    "Argentinian",
    "Moroccan",
    "Ethiopian",
    "Russian",
    "German",
    "British",
    "American",
    "Cuban",
    "Peruvian",
    "Filipino",
    "Malaysian",
    "Indonesian",
    "Pakistani",
    "Bangladeshi",
    "Sri Lankan",
    "Nepalese",
    "Afghan",
    "Persian",
    "Portuguese",
    "Hungarian",
    "Polish",
    "Austrian",
    "Swedish",
    "Australian",
    "South African",
    "Kenyan",
    "Georgian",
  ];

  useEffect(() => {
    onSelectionChange(selectedCuisines);
  }, [selectedCuisines]);

  const handleSelectCuisine = (cuisine: string) => {
    if (selectedCuisines.includes(cuisine)) {
      if (selectedCuisines.length > minimumSelect) {
        setSelectedCuisines(selectedCuisines.filter((item) => item !== cuisine));
      } else {
        Alert.alert(`You must select at least ${minimumSelect} cuisine(s).`);
      }
    } else {
      setSelectedCuisines([...selectedCuisines, cuisine]);
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.cuisineCards}>
        {cuisinesList.map((cuisine) => (
          <SelectableCard
            key={cuisine}
            text={cuisine}
            isSelected={selectedCuisines.includes(cuisine)}
            onPress={() => handleSelectCuisine(cuisine)}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  cuisineCards: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
  },
});

export default FavouriteCuisine;
