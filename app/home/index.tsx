import { Text, View, Button } from "react-native";
import { auth, db } from '@/config/firebaseConfig';
export default function Index() {
  const handleLogout = async() => {
    try {
      // Sign out the user
      await auth.signOut();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}
