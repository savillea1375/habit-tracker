import TabBar from "@/components/TabBar";
import { Tabs } from "expo-router";

export default function TabLayout() {
    return (
        <Tabs tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
            <Tabs.Screen name="dashboard" options={{ title: "Dashboard" }} />
            <Tabs.Screen name="stats" options={{ title: "Stats" }} />
        </Tabs>
    );
}
