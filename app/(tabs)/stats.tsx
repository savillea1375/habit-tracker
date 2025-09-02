import CompletionPieChart from "@/components/graphs/CompletionPieChart";
import MonthlyLineGraph from "@/components/graphs/MonthlyLineGraph";
import { useThemeColor } from "@/hooks/useThemeColor";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Stats() {
    const backgroundThemeColor = useThemeColor({}, "background");
    const themeTextColor = useThemeColor({}, "text");

    return (
        <SafeAreaView style={[styles.mainContainer, { backgroundColor: backgroundThemeColor }]}>
            <Text style={[styles.header, { color: themeTextColor }]}>Stats</Text>
            <MonthlyLineGraph />
            <CompletionPieChart />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        paddingHorizontal: 12,
    },
    header: {
        fontSize: 38,
        fontWeight: "600",
        marginBottom: 12,
    },
});
