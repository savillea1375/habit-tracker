import { Stack } from "expo-router";

const RootLayout = () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="signup/index" />
            <Stack.Screen name="dashboard/index" />
        </Stack>
    );
};

export default RootLayout;
