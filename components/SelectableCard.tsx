import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import ThemedText from "./ThemedText";
import { ExtendedTheme } from '@/theme/theme';
import { useColorScheme } from "react-native";

interface SelectableCardProps {
    text: string;
    isSelected: boolean;
    onPress: () => void;
}

const SelectableCard: React.FC<SelectableCardProps> = ({ text, isSelected, onPress }) => {
    const colorScheme = useColorScheme();
      const { colors, fonts } = useTheme() as ExtendedTheme;
    return (
        <TouchableOpacity
            style={[styles.card,{borderColor: colors.background_300}, isSelected && {borderColor: colorScheme === "dark" ? colors.primary_700 : colors.primary_100, backgroundColor: colors.primary_600}]}
            onPress={onPress}
        >
            <ThemedText type='medium' size={14} >{text}</ThemedText>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        margin: 10,
        padding: 10,
        paddingVertical: 8,
        borderWidth: 1,
        borderRadius: 15,
    },
});

export default SelectableCard;
