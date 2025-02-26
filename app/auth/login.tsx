import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { useTheme } from "@react-navigation/native";
import ThemedButton from "../../components/ThemedButton";
import ThemedText from "../../components/ThemedText";
import { ExtendedTheme } from "@/theme/theme";
import { useRouter } from "expo-router";
import {getAuth, signInWithEmailAndPassword} from "firebase/auth";

const Login = () => {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const { colors, fonts } = useTheme() as ExtendedTheme;
    const auth = getAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");


    const handleSubmit = async () => {
        setError("");

        if (!email || !password) {
            setError("Please enter email and password");
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.replace("/home"); // Redirect to home after login
        } catch (err: any) {
            setError(err.message || "Failed to login");
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ThemedText size={16} type="bold" style={[styles.title, { color: colors.text }]}>Login</ThemedText>
            
            {error && (
                <ThemedText
                    size={16}
                    type="medium"
                    style={[styles.error, { color: colorScheme === "dark" ? colors.danger_700 : colors.danger_300 }]}
                >
                    {error}
                </ThemedText>
            )}

            <TextInput
                style={[styles.input, { borderColor: colors.border, color: colors.text, ...fonts.regular }]}
                placeholder="Email"
                placeholderTextColor={colors.gray}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                textContentType="emailAddress"
            />

            <TextInput
                style={[styles.input, { borderColor: colors.border, color: colors.text, ...fonts.regular }]}
                placeholder="Password"
                placeholderTextColor={colors.gray}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                textContentType="password"
            />
            <TouchableOpacity onPress={() => router.replace("./emailVerify")}>
                <ThemedText size={14} type="regular" style={{ color: colors.gray, textAlign: "center", marginBottom: 20, marginTop: 10 }}>
                    Don't have an account? Sign up
                </ThemedText>
            </TouchableOpacity>

            <ThemedButton title="Login" type="primary" onPress={handleSubmit} />

            
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
    error: { marginBottom: 10, textAlign: "center" },
    input: { borderWidth: 1, padding: 10, width: "80%", borderRadius: 5, marginTop: 10 },
});

export default Login;
