import { Colors } from "@/constants/Colors";
import { supabase } from "@/lib/supabase";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Button } from "@react-navigation/elements";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    async function signUpWithEmail() {
        setLoading(true);

        const {
            data: { session },
            error,
        } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        // Alert if error else go to dashboard
        if (error) Alert.alert(error.message);
        else router.replace("/dashboard");

        setLoading(false);
    }

    const colorScheme = useColorScheme();

    return (
        <SafeAreaView
            style={[
                styles.container,
                {
                    backgroundColor:
                        colorScheme === "dark" ? Colors.dark.background : Colors.light.background,
                },
            ]}
        >
            <View style={styles.headerContainer}>
                <Text
                    style={[
                        styles.header,
                        { color: colorScheme === "dark" ? Colors.dark.text : Colors.light.text },
                    ]}
                >
                    Sign Up
                </Text>
                <Text style={styles.subheader}>
                    Create an account to start tracking your habits
                </Text>
            </View>
            <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                style={styles.emailInput}
                value={email}
                onChangeText={setEmail}
                placeholderTextColor="#6b7280"
                placeholder="Email"
            />
            <View style={styles.passwordContainer}>
                <TextInput
                    secureTextEntry={!showPassword}
                    style={styles.passwordInput}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Password"
                    placeholderTextColor="#6b7280"
                />
                <Pressable onPress={toggleShowPassword} style={styles.eyeIcon}>
                    <Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color="#aaa" />
                </Pressable>
            </View>
            <Pressable onPress={() => router.replace("/login")}>
                <Text
                    style={[
                        styles.loginLink,
                        { color: colorScheme === "dark" ? Colors.dark.text : Colors.light.text },
                    ]}
                >
                    Already have an account? Click here to log in.
                </Text>
            </Pressable>
            <Button color="#fff" style={styles.signupButton} onPressOut={signUpWithEmail}>
                Login
            </Button>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 200,
    },
    headerContainer: {
        alignItems: "center",
    },
    header: {
        fontWeight: "700",
        fontSize: 32,
    },
    subheader: {
        color: "grey",
        marginVertical: 10,
    },
    emailInput: {
        height: 44,
        width: "80%",
        backgroundColor: "#f5f5f5",
        paddingHorizontal: 16,
        borderRadius: 12,
        fontSize: 15,
        fontWeight: "500",
        color: "#222",
        marginVertical: 5,
    },
    passwordInput: {
        height: 44,
        width: "100%",
        backgroundColor: "#f5f5f5",
        paddingHorizontal: 16,
        borderRadius: 12,
        fontSize: 15,
        fontWeight: "500",
        color: "#222",
        marginVertical: 5,
    },
    passwordContainer: {
        width: "80%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    eyeIcon: {
        position: "absolute",
        right: 12,
        top: "50%",
        transform: [{ translateY: -11 }],
    },
    signupButton: {
        backgroundColor: Colors.primary,
        width: 150,
        borderRadius: 12,
    },
    loginLink: {
        marginVertical: 10,
    },
});

export default Signup;
