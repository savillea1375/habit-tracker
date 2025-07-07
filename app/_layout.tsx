import { Stack } from "expo-router";

const RootLayout = () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="/" />
            <Stack.Screen name="signup" />
            <Stack.Screen name="dashboard" />
        </Stack>
    );
};

export default RootLayout;
