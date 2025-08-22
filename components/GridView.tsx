import { Colors } from "@/constants/Colors";
import { supabase } from "@/lib/supabase";
import {
    eachDayOfInterval,
    format,
    parseISO,
    startOfToday,
    startOfWeek,
    subMonths,
} from "date-fns";
import { useEffect, useState } from "react";
import { StyleSheet, Text, useColorScheme, View } from "react-native";
import Svg, { Rect } from "react-native-svg";

const numRows = 7;
const cellSize = 12;
const cellPadding = 2;
const cornerRadius = 2;

const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

const getPastSixMonthsDates = () => {
    const endDate = startOfToday();
    const startDate = startOfWeek(subMonths(endDate, 5), { weekStartsOn: 0 });
    return eachDayOfInterval({ start: startDate, end: endDate });
};

interface GridViewProps {
    habitId: string;
    createdAt: string;
    refreshTrigger: number;
    today: string;
    todayCompleted: boolean;
}

export default function GridView({ habitId, createdAt, refreshTrigger }: GridViewProps) {
    const colorScheme = useColorScheme();
    const [completions, setCompletions] = useState<Set<string>>(new Set());

    const dates = getPastSixMonthsDates();
    const weeks: Date[][] = [];

    // Fill in weeks array
    let currentWeek: Date[] = [];
    for (let i = 0; i < dates.length; i++) {
        currentWeek.push(dates[i]);
        const isEndOfWeek = dates[i].getDay() === 6 || i === dates.length - 1;

        if (isEndOfWeek) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    }

    const monthLabels: { name: string; x: number }[] = [];
    let lastMonth = -1;

    weeks.forEach((week, col) => {
        const firstDay = week[0];
        const currentMonth = firstDay.getMonth();

        if (currentMonth !== lastMonth) {
            const monthName = firstDay.toLocaleString("default", { month: "short" });
            const x = col * (cellSize + cellPadding);
            monthLabels.push({ name: monthName, x });
            lastMonth = currentMonth;
        }
    });

    const svgWidth = weeks.length * (cellSize + cellPadding);
    const svgHeight = numRows * (cellSize + cellPadding);

    // Fetch all task completions for box filling
    useEffect(() => {
        fetchCompletions();
    }, [habitId, refreshTrigger]);

    const fetchCompletions = async () => {
        const startDate = format(dates[0], "yyyy-MM-dd");
        const endDate = format(dates[dates.length - 1], "yyyy-MM-dd");

        const { data, error } = await supabase
            .from("habit_completions")
            .select("completed_date")
            .eq("habit_id", habitId)
            .gte("completed_date", startDate)
            .lte("completed_date", endDate);

        if (!error && data) {
            const completions = new Set(data.map((item) => item.completed_date));
            setCompletions(completions);
        }
    };

    const getCellColor = (date: Date): string => {
        const dateString = format(date, "yyyy-MM-dd");
        const taskCreatedDate = parseISO(createdAt);

        // Show blank if day before created date
        if (date < taskCreatedDate) {
            return colorScheme === "dark" ? "#2a2a2a" : "#f0f0f0";
        }

        // If date is after creation, show either primary or red for completion or failure
        if (completions.has(dateString)) {
            return Colors.primary;
        } else {
            return Colors.shared.gridFailed;
        }
    };

    const labelColor = colorScheme === "dark" ? "#888" : "#666";

    return (
        <View style={styles.mainContainer}>
            <View style={styles.monthLabelsContainer}>
                {monthLabels.map((label, index) => (
                    <Text
                        key={index}
                        style={[
                            styles.monthLabel,
                            {
                                left: label.x,
                                position: "absolute",
                                color: labelColor,
                            },
                        ]}
                    >
                        {label.name}
                    </Text>
                ))}
            </View>
            <View style={{ flexDirection: "row" }}>
                <View style={styles.dayLabelsContainer}>
                    {daysOfWeek.map((day, index) => (
                        <Text key={index} style={[styles.dayLabel, { color: labelColor }]}>
                            {day}
                        </Text>
                    ))}
                </View>
                <View style={{ width: svgWidth, height: svgHeight }}>
                    <Svg>
                        {weeks.map((week, col) =>
                            week.map((date, row) => {
                                const x = col * (cellSize + cellPadding);
                                const y = row * (cellSize + cellPadding);
                                return (
                                    <Rect
                                        key={date.toISOString()}
                                        x={x}
                                        y={y}
                                        width={cellSize}
                                        height={cellSize}
                                        rx={cornerRadius}
                                        ry={cornerRadius}
                                        fill={getCellColor(date)}
                                    />
                                );
                            })
                        )}
                    </Svg>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        borderRadius: 12,
    },
    dayLabelsContainer: {
        justifyContent: "space-between",
    },
    dayLabel: {
        fontSize: 12,
        color: "#666",
        textAlign: "center",
        marginRight: 4,
        lineHeight: cellSize + cellPadding,
    },
    monthLabelsContainer: {
        height: 20,
        marginLeft: 24,
        position: "relative",
    },
    monthLabel: {
        fontSize: 10,
        color: "#666",
    },
});
