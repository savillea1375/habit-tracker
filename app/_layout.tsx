import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const RootLayout = () => {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="signup/index" />
                <Stack.Screen name="dashboard/index" />
            </Stack>
        </GestureHandlerRootView>
    );
};

export default RootLayout;
