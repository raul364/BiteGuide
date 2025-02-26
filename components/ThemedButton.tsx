import { useTheme } from "@react-navigation/native";
import { TouchableOpacity, Text } from "react-native";
import { ExtendedTheme, LightTheme } from "../theme/theme"; // Import the extended theme type

interface ThemedButtonProps {
  title: string;
  type?: "primary" | "success" | "warning" | "danger" | "info";
  onPress: () => void;
}

export default function ThemedButton({ title, type = "primary", onPress }: ThemedButtonProps) {
  const { colors, fonts } = useTheme() as ExtendedTheme; // Tell TypeScript it's an ExtendedTheme

  const backgroundColor = colors[type] || colors.primary;
  const textColor = type === "warning" ? LightTheme.colors.text : colors.text;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor,
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
      }}
    >
      <Text style={{ color: textColor, ...fonts.bold, }}>{title}</Text>
    </TouchableOpacity>
  );
}
