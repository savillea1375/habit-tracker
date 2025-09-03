import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import { getCompletionsForRange } from "@/lib/habits";
import { groupCompletionsByDay } from "@/utils/dateUtils";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, useColorScheme, View } from "react-native";
import { GraphPoint, LineGraph } from "react-native-graph";
import { CustomSelectionDot } from "../CustomSelectionDot";

export default function MonthlyLineGraph() {
    const [lineGraphData, setLineGraphData] = useState<GraphPoint[]>([]);
    const [label, setLabel] = useState<number>();
    const [date, setDate] = useState<Date>();

    useEffect(() => {
        async function fetchData() {
            const completions = await getCompletionsForRange(30);
            const grouped = groupCompletionsByDay(completions ?? []);
            setLineGraphData(grouped);
        }

        fetchData();
    }, [lineGraphData]);

    const themeBackgroundColor = useColorScheme() === "dark" ? "#000" : "#fff";
    const themeBorderColor = useColorScheme() === "dark" ? "#333" : "#ddd";
    const themeTextColor = useThemeColor({}, "text");

    return (
        <View
            style={[
                styles.card,
                { backgroundColor: themeBackgroundColor, borderColor: themeBorderColor },
            ]}
        >
            <Text style={[styles.header, { color: themeTextColor }]}>Completions by day:</Text>
            <Text style={[styles.label, { color: themeTextColor }]}>
                {date ? `${date.toLocaleDateString()}: ${label ?? ""}` : ""}
            </Text>
            <LineGraph
                points={lineGraphData}
                color={Colors.primary}
                animated={true}
                enablePanGesture={true}
                panGestureDelay={0}
                onPointSelected={(p) => {
                    setDate(p.date);
                    setLabel(p.value);
                }}
                SelectionDot={CustomSelectionDot}
                style={{ height: 350 }}
            />
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
    label: {},
});
