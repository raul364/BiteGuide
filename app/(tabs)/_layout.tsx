import Icon from "react-native-vector-icons/Ionicons";
import { Tabs } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { ExtendedTheme } from '@/theme/theme';

export default function TabLayout() {
    const { colors, fonts } = useTheme() as ExtendedTheme;
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: colors.primary_600, tabBarInactiveTintColor: colors.background_400, tabBarLabelStyle: { fontFamily: fonts["regular"].fontFamily } }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color }) => <Icon size={28} name="home-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          headerShown: false,
          title: 'Settings',
          tabBarIcon: ({ color }) => <Icon size={28} name="cog-outline" color={color} />,
        }}
      />
    </Tabs>
  );
}
