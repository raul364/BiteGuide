// theme.ts
import { Theme } from "@react-navigation/native";

export interface ExtendedTheme extends Theme {
  colors: Theme["colors"] & {
    gray: string;
    success: string;
    warning: string;
    danger: string;
    info: string;
    primary_100: string;
    primary_200: string;
    primary_300: string;
    primary_400: string;
    primary_500: string;
    primary_600: string;
    primary_700: string;
    primary_800: string;
    primary_900: string;
    background_100: string;
    background_200: string;
    background_300: string;
    background_400: string;
    background_500: string;
    background_600: string;
    background_700: string;
    background_800: string;
    background_900: string;
    success_100: string;
    success_200: string;
    success_300: string;
    success_400: string;
    success_500: string;
    success_600: string;
    success_700: string;
    success_800: string;
    success_900: string;
    warning_100: string;
    warning_200: string;
    warning_300: string;
    warning_400: string;
    warning_500: string;
    warning_600: string;
    warning_700: string;
    warning_800: string;
    warning_900: string;
    danger_100: string;
    danger_200: string;
    danger_300: string;
    danger_400: string;
    danger_500: string;
    danger_600: string;
    danger_700: string;
    danger_800: string;
    danger_900: string;
    info_100: string;
    info_200: string;
    info_300: string;
    info_400: string;
    info_500: string;
    info_600: string;
    info_700: string;
    info_800: string;
    info_900: string;
  };
}

export const LightTheme: ExtendedTheme  = {
  dark: false,
  colors: {
    primary: "#db95fe",
    background: "#f6f4f4",
    card: "#F8F9FA",
    text: "#242424",
    border: "#303030",
    notification: "#FF4081",
    primary_100:"#2f0645",
    primary_200:"#500576",
    primary_300:"#7203a9",
    primary_400:"#9606dc",
    primary_500:"#b531fd",
    primary_600:"#c865fe",
    primary_700:"#db95fe",
    primary_800:"#e6b5fc",
    primary_900:"#f1dbfb",
    background_100:"#271718",
    background_200:"#362f2f",
    background_300:"#4e4444",
    background_400:"#6a5a5b",
    background_500:"#887272",
    background_600:"#9f8c8c",
    background_700:"#b3a9a9",
    background_800:"#ccc5c5",
    background_900:"#f6f4f4",
    gray: "#999DA0",
    success: "#97de1e",
    success_100:"#171e05",
    success_200:"#233602",
    success_300:"#314f00",
    success_400:"#436800",
    success_500:"#558301",
    success_600:"#699f01",
    success_700:"#7cbc01",
    success_800:"#97de1e",
    success_900:"#b1f642",
    warning: "#E0A906",
    warning_100:"#231a05",
    warning_200:"#3e2d03",
    warning_300:"#5a4201",
    warning_400:"#775902",
    warning_500:"#967003",
    warning_600:"#b68804",
    warning_700:"#d6a205",
    warning_800:"#f7bc1a",
    warning_900:"#fcdea8",
    danger: "#EA6143",
    danger_100:"#2d140c",
    danger_200:"#571c10",
    danger_300:"#822313",
    danger_400:"#ab301b",
    danger_500:"#d53e25",
    danger_600:"#ea6143",
    danger_700:"#ef9178",
    danger_800:"#f2b8a8",
    danger_900:"#f6ddd6",
    info: "#92B9F6", // Blue
    info_100:"#0b1d32",
    info_200:"#113255",
    info_300:"#1a497b",
    info_400:"#2562a1",
    info_500:"#2f7bc9",
    info_600:"#3d96f1",
    info_700:"#7eaff5",
    info_800:"#aec9f7",
    info_900:"#d9e3f8",
  },
  fonts: {
    regular: {
      fontFamily: "RobotoMono-Regular",
      fontWeight: "400",
    },
    medium: {
      fontFamily: "RobotoMono-Medium",
      fontWeight: "500",
    },
    bold: {
      fontFamily: "RobotoMono-Bold",
      fontWeight: "600",
    },
    heavy: {
      fontFamily: "RobotoMono-Bold",
      fontWeight: "800",
    },
  },
};

export const DarkTheme: ExtendedTheme  = {
  dark: true,
  colors: {
    primary: "#8401C6",
    background: "#141414",
    card: "#1E1E1E",
    text: "#f9f8f8",
    border: "#303030",
    notification: "#CF6679",
    primary_100:"#2f0646",
    primary_200:"#500576",
    primary_300:"#7201ac",
    primary_400:"#a802fa",
    primary_500:"#b431ff",
    primary_600:"#c765ff",
    primary_700:"#d88eff",
    primary_800:"#e5b5fd",
    primary_900:"#f1dbfb",
    gray: "#999DA0",
    background_100:"#141414",
    background_200:"#303030",
    background_300:"#474747",
    background_400:"#5e5e5e",
    background_500:"#777777",
    background_600:"#919191",
    background_700:"#ababab",
    background_800:"#c6c6c6",
    background_900:"#e2e2e2",
    success: "#8401C6",
    success_100:"#181e07",
    success_200:"#243507",
    success_300:"#344e08",
    success_400:"#47670e",
    success_500:"#5a8214",
    success_600:"#6f9e1b",
    success_700:"#83bb21",
    success_800:"#9bd831",
    success_900:"#b8f452",
    warning: "#E0A906", // Yellow
    warning_100:"#231a05",
    warning_200:"#3e2d03",
    warning_300:"#5a4201",
    warning_400:"#775902",
    warning_500:"#967003",
    warning_600:"#b68804",
    warning_700:"#d6a205",
    warning_800:"#f7bc1a",
    warning_900:"#fcdea8",
    danger: "#9B2B12", // Red
    danger_100:"#2d140a",
    danger_200:"#571d0d",
    danger_300:"#81240f",
    danger_400:"#ab3015",
    danger_500:"#d53e1d",
    danger_600:"#f0613b",
    danger_700:"#f39071",
    danger_800:"#f5b7a4",
    danger_900:"#f7ddd4", 
    info: "#0D4DB5", // Blue
    info_100:"#0a1a41",
    info_200:"#0a2e70",
    info_300:"#0b43a0",
    info_400:"#105ad0",
    info_500:"#2d72fb",
    info_600:"#6f8cfc",
    info_700:"#99a7fd",
    info_800:"#bec4fc",
    info_900:"#dfe1fb",
  },
  fonts: {
    regular: {
      fontFamily: "RobotoMono-Regular",
      fontWeight: "400",
    },
    medium: {
      fontFamily: "RobotoMono-Medium",
      fontWeight: "500",
    },
    bold: {
      fontFamily: "RobotoMono-Bold",
      fontWeight: "700",
    },
    heavy: {
      fontFamily: "RobotoMono-Bold",
      fontWeight: "800",
    },
  },
};
