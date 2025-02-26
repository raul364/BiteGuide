import { useTheme } from "@react-navigation/native";
import { Text, TextProps } from "react-native";
import { ExtendedTheme } from "../theme/theme";

interface ThemedTextProps extends TextProps {
  type?: "regular" | "medium" | "bold" | "heavy";
  size?: number; // Allow dynamic font size
}

export default function ThemedText({ children, type = "regular", size = 16, style, ...props }: ThemedTextProps) {
  const { fonts, colors } = useTheme() as ExtendedTheme;

  return (
    <Text
      style={[
        {
          fontFamily: fonts[type]?.fontFamily || "RobotoMono-Regular",
          fontWeight: fonts[type]?.fontWeight || "400",
          color: colors.text,
          fontSize: size, // Dynamically set font size
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}
