import { View, Text, Button, StyleSheet } from 'react-native';
import { auth, db } from '@/config/firebaseConfig';
import ThemedButton from '@/components/ThemedButton';
export default function Tab() {
  const handleLogout = async() => {
    try {
      // Sign out the user
      await auth.signOut();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  return (
    <View style={styles.container}>
      <ThemedButton type="danger" title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
