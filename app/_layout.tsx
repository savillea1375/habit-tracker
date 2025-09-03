import { UserProvider } from "@/lib/UserContext";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
    return (
        <UserProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="signup/index" />
                    <Stack.Screen name="(tabs)" />
                </Stack>
            </GestureHandlerRootView>
        </UserProvider>
    );
}
