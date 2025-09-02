import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { StyleSheet, Text, useColorScheme, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";

export default function CompletionPieChart() {
    const themeBackgroundColor = useColorScheme() === "dark" ? "#000" : "#fff";
    const themeBorderColor = useColorScheme() === "dark" ? "#333" : "#ddd";
    const themeTextColor = useThemeColor({}, "text");

    const data = [
        { value: 25, color: Colors.primary, text: "25" },
        { value: 30, color: Colors.shared.gridFailed, text: "30" },
    ];

    return (
        <View
            style={[
                styles.card,
                { backgroundColor: themeBackgroundColor, borderColor: themeBorderColor },
            ]}
        >
            <Text style={[styles.header, { color: themeTextColor }]}>
                Completion to failure ratio:
            </Text>
            <View style={styles.pieWrapper}>
                <PieChart showText textColor="black" data={data} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        borderWidth: 1,
        padding: 8,
        margin: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        fontSize: 18,
        fontWeight: 500,
    },
    pieWrapper: {
        alignItems: "center",
        paddingVertical: 12,
    },
});
